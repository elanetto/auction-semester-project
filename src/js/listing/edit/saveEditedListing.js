export async function saveEditedListing(event) {

     if (!document.body.classList.contains("edit-listing-page")) {
        return;
    }

    event.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No token found. User may not be logged in.");
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const listingId = params.get("id");
    if (!listingId) {
        console.error("No listing ID found in the URL.");
        return;
    }

    const apiEndpoint = `https://v2.api.noroff.dev/auction/listings/${listingId}`;

    const updatedTitle = document.getElementById("edit-listing-title").value;
    const updatedDescription = document.getElementById("edit-listing-description").value;
    const updatedTags = document.getElementById("edit-listing-category").value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag); 

    const updatedMedia = [];
    for (let i = 1; i <= 3; i++) {
        const imageUrl = document.getElementById(`edit-listing-image-${i}`).value;
        const imageAlt = document.getElementById(`edit-listing-image-alt-${i}`).value;
        if (imageUrl) {
            updatedMedia.push({ url: imageUrl, alt: imageAlt || "No description available" });
        }
    }

    const updatedListing = {
        title: updatedTitle,
        description: updatedDescription,
        tags: updatedTags,
        media: updatedMedia,
    };

    const apiKey = localStorage.getItem("api_key");

    try {
        const response = await fetch(apiEndpoint, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                "X-Noroff-API-Key": apiKey,
            },
            body: JSON.stringify(updatedListing),
        });

        if (!response.ok) {
            throw new Error(`Failed to save listing. Status: ${response.status}`);
        }

        alert("Listing successfully updated!");
        window.location.href = `../../listing/view/index.html?id=${listingId}`;
    } catch (error) {
        console.error("Error saving listing:", error);
        alert("Failed to save the listing. Please try again.");
    }
}

export function initializeSaveButton() {
    const saveButton = document.getElementById("edit-listing-button");
    if (saveButton) {
        saveButton.addEventListener("click", saveEditedListing);
    } else {

    }
}
