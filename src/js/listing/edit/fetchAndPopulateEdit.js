import { requireAuthentication } from '../../utils/requireAuthentication.js';

export async function fetchAndPopulateEditListing() {

    if (!document.body.classList.contains("edit-listing-page")) {
        return;
    }

    // Require user authentication
    if (!requireAuthentication()) return;

    const token = localStorage.getItem("token");
    if (!token) {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const listingId = params.get("id");

    if (!listingId) {
        return;
    }

    const apiEndpoint = `https://v2.api.noroff.dev/auction/listings/${listingId}?_seller=true&_bids=true`;

    try {
        const response = await fetch(apiEndpoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch listing. Status: ${response.status}`);
        }

        const { data: listing } = await response.json(); // Ensure we access `data` directly

        // Populate input fields
        populateInputFields(listing);

        // Update the highest bid
        const highestBid = listing.bids?.length > 0
            ? Math.max(...listing.bids.map((bid) => bid.amount))
            : "0";

        const highestBidElement = document.querySelector(".highest-bid-on-edit-listing");
        if (highestBidElement) {
            highestBidElement.textContent = `${highestBid} 🌕`;
        } else {
            console.warn("Highest bid element not found in the DOM.");
        }

        // Update the preview
        updateEditListingPreview(listing.media);

    } catch (error) {
        console.error("Error fetching or populating listing data:", error);
    }
}

function populateInputFields(data) {

    document.getElementById("edit-listing-title").value = data.title || "";
    document.getElementById("edit-listing-description").value = data.description || "";
    document.getElementById("edit-listing-category").value = data.tags?.join(", ") || "";

    data.media?.forEach((mediaItem, index) => {
        const imageField = document.getElementById(`edit-listing-image-${index + 1}`);
        const altField = document.getElementById(`edit-listing-image-alt-${index + 1}`);
        if (imageField) imageField.value = mediaItem.url || "";
        if (altField) altField.value = mediaItem.alt || "";
    });
}

function updateEditListingPreview(media = []) {

    const title = document.getElementById("edit-listing-title").value || "No title available";
    const description = document.getElementById("edit-listing-description").value || "No description available";
    const category = document.getElementById("edit-listing-category").value || "No category available";

    document.querySelector(".view-edit-listing-title").textContent = title;
    document.querySelector(".view-edit-listing-description").textContent = description;
    document.querySelector(".edit-listing-tags").textContent = category;

    const carouselContainer = document.querySelector(".view-edit-listing-carousel");
    if (!carouselContainer) {
        console.error("Carousel container not found.");
        return;
    }

    if (media.length > 0) {
        let currentIndex = 0;

        const updateCarousel = () => {
            const imageElement = document.querySelector(".view-edit-listing-image");
            const altTextElement = document.querySelector(".view-edit-listing-image-alt-text");
            imageElement.src = media[currentIndex]?.url || "../../assets/placeholders/placeholder-pen.png";
            altTextElement.textContent = media[currentIndex]?.alt || "No description available";

            const leftButton = document.getElementById("carousel-left-button");
            const rightButton = document.getElementById("carousel-right-button");

            if (media.length === 1) {
                leftButton.style.display = "none";
                rightButton.style.display = "none";
            } else {
                leftButton.style.display = "inline-block";
                rightButton.style.display = "inline-block";
            }

            leftButton.disabled = currentIndex <= 0;
            rightButton.disabled = currentIndex >= media.length - 1;
        };

        carouselContainer.innerHTML = `
            <div class="carousel-image-container">
                <img src="${media[0]?.url}" alt="${media[0]?.alt}" class="view-edit-listing-image w-full h-[500px] object-cover">
            </div>
            <div class="view-edit-listing-image-alt-text text-center italic text-blue-950 text-xs">${media[0]?.alt || "No description available"}</div>
            <div class="carousel-controls flex justify-center gap-4 mt-2">
                <button id="carousel-left-button" class="carousel-button px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded">◀</button>
                <button id="carousel-right-button" class="carousel-button px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded">▶</button>
            </div>
        `;

        document.getElementById("carousel-left-button").addEventListener("click", () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });

        document.getElementById("carousel-right-button").addEventListener("click", () => {
            if (currentIndex < media.length - 1) {
                currentIndex++;
                updateCarousel();
            }
        });

        updateCarousel();
    } else {
        carouselContainer.innerHTML = `
            <img src="../../assets/placeholders/placeholder-pen.png" alt="No image available" class="view-edit-listing-image w-full h-[500px] object-cover">
            <div class="view-edit-listing-image-alt-text text-center italic text-blue-950 text-xs">No image alt text available</div>
        `;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    
    fetchAndPopulateEditListing();

    ["edit-listing-title", "edit-listing-description", "edit-listing-category", "edit-listing-image-1", "edit-listing-image-alt-1"].forEach((id) => {
        const field = document.getElementById(id);
        if (field) {
            field.addEventListener("input", () => updateEditListingPreview());
        }
    });
});
