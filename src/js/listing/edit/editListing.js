export async function editListing() {
    if (!document.body.classList.contains("edit-listing-page")) return;

    const token = localStorage.getItem("token");
    const apiKey = localStorage.getItem("api_key");

    // Extract the listing ID from the URL
    const params = new URLSearchParams(window.location.search);
    const listingId = params.get('id');
    if (!listingId) {
        console.error("No listing ID provided in the URL.");
        return;
    }

    const apiUrl = `https://v2.api.noroff.dev/auction/listings/${listingId}`;

    // Fetch listing details to pre-populate the form
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

        const { data } = await response.json();

        // Pre-fill the form
        document.getElementById("edit-listing-title").value = data.title || "";
        document.getElementById("edit-listing-description").value = data.description || "";
        document.getElementById("edit-listing-category").value = data.tags?.join(", ") || "";

        // Populate image fields
        const media = data.media || [];
        for (let i = 1; i <= 3; i++) {
            const imageUrlField = document.getElementById(`edit-listing-image-${i}`);
            const imageAltField = document.getElementById(`edit-listing-image-alt-${i}`);
            if (media[i - 1]) {
                imageUrlField.value = media[i - 1].url || "";
                imageAltField.value = media[i - 1].alt || "";
            } else {
                imageUrlField.value = "";
                imageAltField.value = "";
            }
        }
    } catch (error) {
        console.error("Error fetching listing details:", error);
    }

    // Handle form submission to update the listing
    const editListingForm = document.getElementById("edit-listing-form");
    const editListingButton = document.getElementById("edit-listing-button");

    editListingButton.addEventListener("click", async (event) => {
        event.preventDefault();

        const title = document.getElementById("edit-listing-title").value.trim();
        const description = document.getElementById("edit-listing-description").value.trim();
        const tags = document.getElementById("edit-listing-category").value.trim();

        const media = [];
        for (let i = 1; i <= 3; i++) {
            const imageUrl = document.getElementById(`edit-listing-image-${i}`).value.trim();
            const imageAlt = document.getElementById(`edit-listing-image-alt-${i}`).value.trim();
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
