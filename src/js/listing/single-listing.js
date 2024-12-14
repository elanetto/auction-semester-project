export async function fetchSingleListing() {
    if (!document.body.classList.contains("view-single-listing-page")) {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const listingId = params.get("id");

    if (!listingId) {
        console.error("No listing ID found in URL");
        return;
    }

    const apiUrl = `https://v2.api.noroff.dev/auction/listings/${listingId}?_seller=true&_bids=true`;

    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found. User may not be logged in.");
            return;
        }

        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch listing");
        }

        const { data } = await response.json();

        // Update title, description, and category
        document.querySelector(".view-single-listing-title").textContent = data.title || "No title available";
        document.querySelector(".view-single-listing-description").textContent = data.description || "No description available";
        document.querySelector(".single-listing-tags").textContent = data.tags?.join(", ") || "No tags available";

        // Update carousel
        const carouselContainer = document.querySelector(".view-single-listing-carousel");
        const previewAltText = document.querySelector(".view-single-listing-image-alt-text");
        const images = data.media || [];

        if (images.length > 0) {
            let currentIndex = 0;
        
            const updateCarousel = () => {
                const imageElement = document.querySelector(".view-single-listing-image");
                const altTextElement = document.querySelector(".view-single-listing-image-alt-text");
                imageElement.src = images[currentIndex]?.url || "../../assets/placeholders/placeholder-pen.png";
                altTextElement.textContent = images[currentIndex]?.alt || "No image description available";
        
                // Hide buttons if there's only one image
                const leftButton = document.getElementById("carousel-left-button");
                const rightButton = document.getElementById("carousel-right-button");
                if (images.length === 1) {
                    leftButton.style.display = "none";
                    rightButton.style.display = "none";
                } else {
                    leftButton.style.display = "inline-block";
                    rightButton.style.display = "inline-block";
                }
        
                // Disable buttons if at the boundaries
                leftButton.disabled = currentIndex <= 0;
                rightButton.disabled = currentIndex >= images.length - 1;
            };
        
            carouselContainer.innerHTML = `
                <div class="carousel-image-container">
                    <img src="${images[0].url}" alt="${images[0].alt}" class="view-single-listing-image w-full h-[500px] object-cover">
                </div>
                <div class="view-single-listing-image-alt-text text-center italic text-blue-950 text-xs">${images[0].alt}</div>
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
                if (currentIndex < images.length - 1) {
                    currentIndex++;
                    updateCarousel();
                }
            });
        
            updateCarousel();
        } else {
            // Default placeholder if no images
            carouselContainer.innerHTML = `
                <img src="../../assets/placeholders/placeholder-pen.png" alt="No image available" class="view-single-listing-image w-full h-[500px] object-cover">
                <div class="view-single-listing-image-alt-text text-center italic text-blue-950 text-xs">No image alt text available</div>
            `;
        }
        
        

        // Update seller details
        document.querySelector(".view-single-listing-seller-avatar").src =
            data.seller?.avatar?.url || "../../assets/placeholders/avatar-placeholder.png";
        document.querySelector(".view-single-listing-seller-name").textContent = data.seller?.name || "Unknown Seller";

        // Update bid details
        const highestBid = data.bids?.length ? Math.max(...data.bids.map((bid) => bid.amount)) : "0";
        document.querySelector(".highest-bid-on-single-listing").textContent = `${highestBid} 🌕`;

        const highestBidder = data.bids?.length
            ? data.bids[data.bids.length - 1]?.bidder?.name
            : "No bids yet";
        document.querySelector(".higest-bidder-dame").textContent = highestBidder;

        // Render bid history
        const bidHistoryContainer = document.querySelector(".bid-history-table");
        if (bidHistoryContainer && data.bids?.length) {
            bidHistoryContainer.innerHTML = "";
            const sortedBids = [...data.bids].sort((a, b) => new Date(b.created) - new Date(a.created));
            sortedBids.forEach((bid) => {
                const bidRow = document.createElement("div");
                bidRow.classList.add(
                    "bid-history-table",
                    "bg-white",
                    "flex",
                    "justify-between",
                    "p-4",
                    "m-4",
                    "items-center",
                    "text-blue-950",
                    "w-full"
                );
                bidRow.innerHTML = `
                    <div>
                        <img src="${bid.bidder?.avatar?.url || "../../assets/placeholders/avatar-placeholder.png"}" alt="avatar"
                        class="bid-history-avatar w-[50px] h-[50px] object-cover mx-auto rounded-full overflow-hidden">
                    </div>
                    <div class="bid-history-username font-bold">${bid.bidder?.name || "Anonymous"}</div>
                    <div class="bid-history-date">${new Date(bid.created).toLocaleDateString()}</div>
                    <div class="bid-history-amount-of-bid font-bold">${bid.amount} 🌕</div>
                `;
                bidHistoryContainer.appendChild(bidRow);
            });
        }
    } catch (error) {
        console.error("Error fetching single listing:", error);
    }
}
