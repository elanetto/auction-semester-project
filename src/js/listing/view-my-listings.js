export function myListings() {
    // Check if the current page is the My Account page
    if (!document.body.classList.contains("my-account-page")) {
        return;
    }

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
        // Ensure data.data exists and is an array
        const listings = (data && Array.isArray(data.data)) ? data.data : [];

        // Check if listings is an array and has items
        if (!Array.isArray(listings) || listings.length === 0) {
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
            listingCard.classList.add('flex', 'flex-col', 'p-4', 'bg-white', 'w-[350px]', 'rounded', 'shadow-md');

            // Attempt to fetch the media URL
            const mediaUrl = listing.media && listing.media[0] && listing.media[0].url
                ? listing.media[0].url
                : 'default-image.jpg'; // Fallback image if none exists

            const tags = listing.tags || [];
            const lastBidAmount = listing.bids?.length
                ? listing.bids[listing.bids.length - 1].amount
                : "0";

            // Calculate remaining time
            const endsAt = listing.endsAt;
            let timeLeft = "N/A";

            if (endsAt) {
                const targetDate = new Date(endsAt);
                const currentDate = new Date();
                const differenceInMs = targetDate - currentDate;

                if (differenceInMs > 0) {
                    const daysLeft = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
                    const hoursLeft = Math.floor((differenceInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutesLeft = Math.floor((differenceInMs % (1000 * 60 * 60)) / (1000 * 60));

                    if (daysLeft > 0) {
                        timeLeft = `${daysLeft} day${daysLeft > 1 ? 's' : ''}`;
                    } else if (hoursLeft > 0) {
                        timeLeft = `${hoursLeft} hour${hoursLeft > 1 ? 's' : ''}`;
                    } else {
                        timeLeft = `${minutesLeft} minute${minutesLeft > 1 ? 's' : ''}`;
                    }
                } else {
                    timeLeft = "Ended";
                }
            }

            // Create the HTML for the listing card
            listingCard.innerHTML = `
                <img src="${mediaUrl}" alt="${listing.title}" class="mb-4 rounded">
                <h3 class="text-blue-950 font-bold text-lg">${listing.title}</h3>
                <div>
                    <span class="text-blue-950 font-bold">Current Bid:</span>
                    <span>${lastBidAmount} 🌕</span>
                </div>
                <div>
                    <span class="text-blue-950 font-bold">Description:</span>
                    <span class="italic">${listing.description}</span>
                </div>
                <div>
                    <span class="text-blue-950 font-bold">Category:</span>
                    <span>${tags || 'N/A'}</span>
                </div>
                <div>
                    <span class="text-blue-950 font-bold">Ends in:</span>
                    <span>${timeLeft}</span>
                </div>
                <div class="mt-3">
                    <button class="bg-blue-950 hover:bg-blue-800 text-white rounded px-6 py-2">Edit</button>
                    <button class="bg-blue-950 hover:bg-blue-800 text-white rounded px-6 py-2 mt-2">Delete</button>
                </div>
            `;

            // Append the created listing card to the container
            listingsContainer.appendChild(listingCard);
        });
    })
    .catch(error => {
        console.error('Error fetching listings:', error);
    });
}
