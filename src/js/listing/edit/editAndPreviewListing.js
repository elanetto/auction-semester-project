export async function editAndPreviewListing() {
    if (!document.body.classList.contains("edit-listing-page")) return;

    const token = localStorage.getItem("token");
    const apiKey = localStorage.getItem("api_key");

    // Extract listing ID from the URL
    const params = new URLSearchParams(window.location.search);
    const listingId = params.get("id");
    if (!listingId) {
        console.error("No listing ID provided in the URL.");
        return;
    }

    const apiUrl = `https://v2.api.noroff.dev/auction/listings/${listingId}`;

    // Select input and preview elements
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
    const editListingButton = document.getElementById("edit-listing-button");

    // Function to update the preview
    const updatePreview = () => {
        previewTitle.textContent = titleInput.value || "Listing title";
        previewDescription.textContent = descriptionInput.value || "Lorem ipsum description goes here...";
        previewCategory.textContent = categoryInput.value || "Category";

        const firstImageUrl = imageInputs[0]?.value || "../../assets/placeholders/placeholder-pen.png";
        const firstImageAlt = altTextInputs[0]?.value || "Image alt text goes here";

        previewImage.src = firstImageUrl;
        previewAltText.textContent = firstImageAlt;
    };

    // Fetch the existing listing details
    try {
        const response = await fetch(`${apiUrl}?_seller=true&_bids=true`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch listing details.");
        }

        const data = await response.json();

        // Populate the form fields with the existing listing data
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

        // Update the preview
        updatePreview();
    } catch (error) {
        console.error("Error fetching listing details:", error);
    }

    // Listen for input changes to update the preview dynamically
    titleInput.addEventListener("input", updatePreview);
    descriptionInput.addEventListener("input", updatePreview);
    categoryInput.addEventListener("input", updatePreview);

    imageInputs.forEach((input, index) => {
        input.addEventListener("input", updatePreview);
        altTextInputs[index]?.addEventListener("input", updatePreview);
    });

    // Handle the form submission for editing the listing
    editListingButton.addEventListener("click", async (event) => {
        event.preventDefault();

        const title = titleInput.value.trim();
        const description = descriptionInput.value.trim();
        const tags = categoryInput.value.trim();
        const media = [];

        for (let i = 0; i < imageInputs.length; i++) {
            const imageUrl = imageInputs[i].value.trim();
            const imageAlt = altTextInputs[i].value.trim();
            if (imageUrl && imageAlt) {
                media.push({ url: imageUrl, alt: imageAlt });
            }
        }

        if (!title || !description || !tags || media.length === 0) {
            alert("Please fill out all fields.");
            return;
        }

        try {
            const payload = JSON.stringify({
                title,
                description,
                tags: tags.split(",").map(tag => tag.trim()),
                media,
            });

            const response = await fetch(apiUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "X-Noroff-API-Key": apiKey,
                },
                body: payload,
            });

            if (!response.ok) {
                throw new Error(`Failed to update listing: ${response.statusText}`);
            }

            const responseData = await response.json();
            console.log("Listing updated successfully:", responseData);
            alert("Listing updated successfully!");
            window.location.href = `/listing/view/index.html?id=${listingId}`;
        } catch (error) {
            console.error("Error updating listing:", error);
            alert("Failed to update listing.");
        }
    });
}
