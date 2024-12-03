export async function createNewListing() {
    // Check if the current page is the Create Listing page
    if (!document.body.classList.contains("create-listing-page")) {
        return;
    }

    const token = localStorage.getItem("token");
    const apiKey = localStorage.getItem("api_key");

    // Fetch form and input elements
    const newListingForm = document.getElementById("new-listing-form");
    const newListingTitle = document.getElementById("new-listing-title");
    const newListingDescription = document.getElementById("new-listing-description");
    const newListingPrice = document.getElementById("new-listing-price");
    const newListingCategory = document.getElementById("new-listing-category");
    const newListingImage = document.getElementById("new-listing-image");
    const newListingEndsAt = document.getElementById("new-listing-ends-at");
    const newListingButton = document.getElementById("new-listing-button");

    // Validate that all required elements exist
    if (
        !newListingForm ||
        !newListingTitle ||
        !newListingDescription ||
        !newListingPrice ||
        !newListingCategory ||
        !newListingImage ||
        !newListingButton ||
        !newListingEndsAt
    ) {
        console.error("Required input or button elements are missing.");
        return;
    }

    // Add event listener to the button
    newListingButton.addEventListener("click", async (event) => {
        console.log("New listing button clicked.");
        event.preventDefault();

        // Get and validate input values
        const title = newListingTitle.value.trim();
        const description = newListingDescription.value.trim();
        const price = parseFloat(newListingPrice.value.trim()); // Ensure price is a number
        const tags = newListingCategory.value.trim();
        const image = newListingImage.value.trim();
        const endsAt = newListingEndsAt.value.trim();

        if (!title || !description || isNaN(price) || !tags || !image || !endsAt) {
            alert("Please fill in all fields correctly.");
            console.error("One or more fields are empty or invalid.");
            return;
        }

        try {
            const myHeaders = new Headers({
                "Content-Type": "application/json",
                "X-Noroff-API-Key": apiKey,
                "Authorization": `Bearer ${token}`,
            });

            const raw = JSON.stringify({
                title,
                description,
                price,
                tags,
                media: [{ url: image, alt: title }], 
                endsAt,
            });

            console.log("Request Payload:", raw);

            const response = await fetch("https://v2.api.noroff.dev/auction/listings", {
                method: "POST",
                headers: myHeaders,
                body: raw,
            });

            if (!response.ok) {
                throw new Error(`New listing request failed: ${response.status} ${response.statusText}`);
            }

            const responseData = await response.json();
            console.log("New listing created successfully:", responseData);
            alert("New listing created successfully!");

            // Optional: Reset form or navigate
            // newListingForm.reset();
            // window.location.href = "../../site/myaccount.html"; // Adjust path if necessary
        } catch (error) {
            console.error("Error creating new listing:", error.message);
            alert("Failed to create new listing.");
        }
    });
}
