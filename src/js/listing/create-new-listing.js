export async function createNewListing() {
    
    if (!document.body.classList.contains("create-listing-page")) {
        return;
    }

    const token = localStorage.getItem("token");
    const apiKey = localStorage.getItem("api_key");

    const newListingForm = document.getElementById("new-listing-form");
    const newListingTitle = document.getElementById("new-listing-title");
    const newListingDescription = document.getElementById("new-listing-description");
    const newListingCategory = document.getElementById("new-listing-category");
    const newListingEndsAt = document.getElementById("new-listing-ends-at");
    const newListingButton = document.getElementById("new-listing-button");

    if (!newListingForm || !newListingTitle || !newListingDescription || !newListingCategory || !newListingEndsAt || !newListingButton) {
        console.error("Required elements are missing.");
        return;
    }

    newListingButton.addEventListener("click", async (event) => {
        event.preventDefault();

        const title = newListingTitle.value.trim();
        const description = newListingDescription.value.trim();
        const tags = newListingCategory.value.trim();
        const endsAt = newListingEndsAt.value.trim();

        if (!title || !description || !tags || !endsAt) {
            alert("Please fill in all required fields.");
            return;
        }

        const media = [];
        for (let i = 1; i <= 3; i++) {
            const imageUrl = document.getElementById(`new-listing-image-${i}`).value.trim();
            const imageAlt = document.getElementById(`new-listing-image-alt-${i}`).value.trim();

            if (imageUrl && imageAlt) {
                media.push({ url: imageUrl, alt: imageAlt });
            }
        }

        if (media.length === 0) {
            alert("Please provide at least one image with alt text.");
            return;
        }

        try {
            const myHeaders = new Headers({
                "Content-Type": "application/json",
                "X-Noroff-API-Key": apiKey,
                "Authorization": `Bearer ${token}`,
            });

            const payload = JSON.stringify({
                title,
                description,
                tags: tags.split(",").map(tag => tag.trim()),
                media,
                endsAt,
            });

            console.log("Payload:", payload);

            const response = await fetch("https://v2.api.noroff.dev/auction/listings", {
                method: "POST",
                headers: myHeaders,
                body: payload,
            });

            if (!response.ok) {
                throw new Error(`Request failed: ${response.status} ${response.statusText}`);
            }

            const responseData = await response.json();
            console.log("API Response:", responseData);

            const newListingId = responseData.id || responseData.data?.id;
            if (newListingId) {
                alert("New listing created successfully!");
                window.location.href = `/listing/view/index.html?id=${newListingId}`;
            } else {
                console.error("Listing ID not found in the response.");
                alert("Failed to retrieve the listing ID. Please check your response.");
            }
        } catch (error) {
            console.error("Error creating new listing:", error);
            alert("Failed to create new listing.");
        }
    });
}
