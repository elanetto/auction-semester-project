export function createListingPreview() {
    
    if (!document.body.classList.contains("create-listing-page")) {
        return;
    }

    const titleInput = document.getElementById("new-listing-title");
    const descriptionInput = document.getElementById("new-listing-description");
    const categoryInput = document.getElementById("new-listing-category");

    // Hardcoded image inputs
    const imageInputs = [
        document.getElementById("new-listing-image-1"),
        document.getElementById("new-listing-image-2"),
        document.getElementById("new-listing-image-3"),
    ];
    const altTextInputs = [
        document.getElementById("new-listing-image-alt-1"),
        document.getElementById("new-listing-image-alt-2"),
        document.getElementById("new-listing-image-alt-3"),
    ];

    const previewTitle = document.querySelector(".review-new-listing-title");
    const previewDescription = document.querySelector(".review-new-listing-description");
    const previewCategory = document.querySelector(".review-new-listing-tags");
    const previewImage = document.querySelector(".review-new-listing-image");
    const previewAltText = document.querySelector(".review-new-listing-image-alt-text");

    const carouselLeftButton = document.createElement("button");
    const carouselRightButton = document.createElement("button");
    carouselLeftButton.textContent = "◀";
    carouselRightButton.textContent = "▶";

    let currentImageIndex = 0;

    const updateCarousel = () => {
        const validImages = imageInputs.filter(input => input.value);
        const totalImages = validImages.length;

        if (totalImages > 0) {
            currentImageIndex = Math.min(currentImageIndex, totalImages - 1); // Ensure index is valid
            previewImage.src = validImages[currentImageIndex]?.value || "../../assets/placeholders/placeholder-pen.png";
            previewAltText.textContent = altTextInputs[currentImageIndex]?.value || "Image alt text goes here";
        } else {
            previewImage.src = "../../assets/placeholders/placeholder-pen.png";
            previewAltText.textContent = "Image alt text goes here";
        }

        carouselLeftButton.disabled = currentImageIndex <= 0;
        carouselRightButton.disabled = currentImageIndex >= totalImages - 1;
    };

    const updatePreview = () => {
        previewTitle.textContent = titleInput.value || "Listing title";
        previewDescription.textContent = descriptionInput.value || "Lorem ipsum description goes here...";
        previewCategory.textContent = categoryInput.value || "Category";
        updateCarousel();
    };

    carouselLeftButton.addEventListener("click", () => {
        if (currentImageIndex > 0) {
            currentImageIndex--;
            updateCarousel();
        }
    });

    carouselRightButton.addEventListener("click", () => {
        const validImages = imageInputs.filter(input => input.value).length;
        if (currentImageIndex < validImages - 1) {
            currentImageIndex++;
            updateCarousel();
        }
    });

    // Attach input listeners to update the preview dynamically
    titleInput.addEventListener("input", updatePreview);
    descriptionInput.addEventListener("input", updatePreview);
    categoryInput.addEventListener("input", updatePreview);

    imageInputs.forEach(input => input.addEventListener("input", updateCarousel));
    altTextInputs.forEach(input => input.addEventListener("input", updateCarousel));

    const carouselContainer = document.querySelector(".review-new-listing-carousel");
    carouselContainer.appendChild(carouselLeftButton);
    carouselContainer.appendChild(carouselRightButton);

    updatePreview();
}
