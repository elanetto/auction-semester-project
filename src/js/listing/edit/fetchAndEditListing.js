export async function fetchAndEditListing() {
    if (!document.body.classList.contains("edit-listing-page")) return;

    const token = localStorage.getItem("token");
    const apiKey = localStorage.getItem("api_key");

    const params = new URLSearchParams(window.location.search);
    const listingId = params.get("id");

    if (!listingId) {
        console.error("No listing ID found in URL.");
        return;
    }

    const apiUrl = `https://v2.api.noroff.dev/auction/listings/${listingId}?_seller=true&_bids=true`;

    const titleInput = document.getElementById("edit-listing-title");
    const descriptionInput = document.getElementById("edit-listing-description");
    const categoryInput = document.getElementById("edit-listing-category");
    const imageInputs = [
        document.getElementById("edit-listing-image-1"),
        document.getElementById("edit-listing-image-2"),
        document.getElementById("edit-listing-image-3"),
    ];
    const altTextInputs = [
        document.getElementById("edit-listing-image-alt-1"),
        document.getElementById("edit-listing-image-alt-2"),
        document.getElementById("edit-listing-image-alt-3"),
    ];

    const previewTitle = document.querySelector(".view-edit-listing-title");
    const previewDescription = document.querySelector(".view-edit-listing-description");
    const previewCategory = document.querySelector(".edit-listing-tags");
    const previewImage = document.querySelector(".view-edit-listing-image");
    const previewAltText = document.querySelector(".view-edit-listing-image-alt-text");

    const updatePreview = () => {
        previewTitle.textContent = titleInput.value || "Listing title";
        previewDescription.textContent = descriptionInput.value || "Lorem ipsum description goes here...";
        previewCategory.textContent = categoryInput.value || "Category";

        const firstImageUrl = imageInputs[0]?.value || "../../assets/placeholders/placeholder-pen.png";
        const firstImageAlt = altTextInputs[0]?.value || "Image alt text goes here";

        previewImage.src = firstImageUrl;
        previewAltText.textContent = firstImageAlt;
    };

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch listing details.");
        }

        const data = await response.json();

        titleInput.value = data.title || "";
        descriptionInput.value = data.description || "";
        categoryInput.value = data.tags?.join(", ") || "";

        const media = data.media || [];
        media.forEach((item, index) => {
            if (imageInputs[index]) {
                imageInputs[index].value = item.url || "";
                altTextInputs[index].value = item.alt || "";
            }
        });

        updatePreview();
    } catch (error) {
        console.error("Error fetching listing details:", error);
    }

    titleInput.addEventListener("input", updatePreview);
    descriptionInput.addEventListener("input", updatePreview);
    categoryInput.addEventListener("input", updatePreview);

    imageInputs.forEach((input, index) => {
        input.addEventListener("input", updatePreview);
        altTextInputs[index]?.addEventListener("input", updatePreview);
    });
}
