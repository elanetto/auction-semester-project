export function myListings() {
    console.log("view-my-listings.js is loaded");

    // Fetch token
    const token = localStorage.getItem('token');
    const apiKey = localStorage.getItem('api_key');
    const username = localStorage.getItem('username');
    const cleanedToken = token.replace(/['"]+/g, '');
    const cleanedUsername = username.replace(/['"]+/g, '');

    // Fetch user's listings
    fetch(`https://v2.api.noroff.dev/auction/profiles/${cleanedUsername}/listings`, {
        method: 'GET',
        headers: {
            'X-Noroff-API-Key': apiKey,
            'Authorization': `Bearer ${cleanedToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Failed to fetch listings');
    })
    .then(data => {
        console.log('API Data:', data); // Log entire response to check structure

        // Ensure data.data exists and is an array
        const listings = (data && Array.isArray(data.data)) ? data.data : [];
        console.log('Listings:', listings);

        // Check if listings is an array and has items
        if (!Array.isArray(listings) || listings.length === 0) {
            console.log('No valid listings found');
            return;
        }

        const listingsContainer = document.getElementById('listings-container');
        if (!listingsContainer) {
            console.error('Listings container not found in DOM');
            return;
        }

        // Loop through the listings and display them
        listings.forEach(listing => {
            const listingCard = document.createElement('div');
            listingCard.classList.add('listing-card');

            // Attempt to fetch the media URL
            const mediaUrl = listing.media && listing.media[0] && listing.media[0].url
            ? listing.media[0].url
            : 'default-image.jpg'; // Fallback image if none exists
            console.log('Media URL:', mediaUrl); // Log to check URL


            // Ensure the price is available
            const price = listing.price || 'N/A'; // Default price if not set

            // Create the HTML for the listing card
            listingCard.innerHTML = `
                <div class="listing-image" style="background-image: url('${mediaUrl}')"></div>
                <div class="listing-details">
                    <h3>${listing.title}</h3>
                    <p>${listing.description}</p>
                    <p>Price: $${price}</p>
                    <p>Ends at: ${listing.endsAt}</p>
                </div>
                <div class="listing-actions">
                    <button class="edit-listing" data-id="${listing.id}">Edit</button>
                    <button class="delete-listing" data-id="${listing.id}">Delete</button>
                </div>
            `;
            listingsContainer.appendChild(listingCard);
        });
    })
    .catch(error => {
        console.error('Error fetching listings:', error);
    });
}
