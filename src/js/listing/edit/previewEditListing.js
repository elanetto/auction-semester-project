export function previewEditListing() {
    if (!document.body.classList.contains("edit-listing-page")) return;

    const titleInput = document.getElementById("edit-listing-title");
    const descriptionInput = document.getElementById("edit-listing-description");
    const categoryInput = document.getElementById("edit-listing-category");

    const previewTitle = document.querySelector(".view-edit-listing-title");
    const previewDescription = document.querySelector(".view-edit-listing-description");
    const previewCategory = document.querySelector(".edit-listing-tags");

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

    titleInput.addEventListener("input", updatePreview);
    descriptionInput.addEventListener("input", updatePreview);
    categoryInput.addEventListener("input", updatePreview);

    imageInputs.forEach((input, index) => {
        input.addEventListener("input", updatePreview);
        altTextInputs[index]?.addEventListener("input", updatePreview);
    });

    updatePreview();
}
