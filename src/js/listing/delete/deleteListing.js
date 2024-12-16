export async function deleteListing(listingId, listingCard) {
    if (!listingId) {
        console.error("Listing ID is required to delete the listing.");
        return;
    }

    const token = localStorage.getItem("token");
    const apiKey = localStorage.getItem("api_key");

    if (!token || !apiKey) {
        console.error("API Key or Token is missing.");
        return;
    }

    const apiEndpoint = `https://v2.api.noroff.dev/auction/listings/${listingId}`;
    console.log(`Attempting to delete listing at: ${apiEndpoint}`);

    if (!confirm("Are you sure you want to delete this listing?")) {
        return; 
    }

    try {
        const response = await fetch(apiEndpoint, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                "X-Noroff-API-Key": apiKey,
            },
        });

        if (response.status === 204) {
            console.log("Listing deleted successfully.");
            alert("Listing deleted successfully.");
            listingCard.remove();
        } else {
            throw new Error(`Failed to delete the listing. Status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error deleting listing:", error);
        alert("Failed to delete the listing. Please try again.");
    }
}
