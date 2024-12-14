export function allListings() {
    
    if (!document.body.classList.contains("load-all-listings")) {
        return;
    }

    // Fetch user's listings
    fetch(`https://v2.api.noroff.dev/auction/listings?_bids=true`, {
        method: 'GET',
        headers: {
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

        // Loop through all listings and display them
        listings.forEach(listing => {
            const listingCard = document.createElement('div');
            listingCard.classList.add('flex', 'flex-col', 'p-4', 'bg-white', 'w-[320px]', 'rounded', 'shadow-md', 'h-auto');

            // Attempt to fetch the media URL
            const mediaUrl = listing.media && listing.media[0] && listing.media[0].url
                ? listing.media[0].url
                : 'default-image.jpg'; // Fallback image if none exists

            const tags = listing.tags || [];
            const highestBid = listing.bids && listing.bids.length > 0
                ? Math.max(...listing.bids.map(bid => bid.amount))
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
                <img src="${mediaUrl}" alt="${listing.title}" class="mb-4 rounded h-[250px] object-cover">
                <h3 class="text-blue-950 font-bold text-lg">${listing.title}</h3>
                <div>
                    <span class="text-blue-950 font-bold">Current Bid:</span>
                    <span>${highestBid} 🌕</span>
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
                <div class="grow"></div>
                <a href="/listing.html?id=${listing.id}" class="mt-4 bg-blue-950 text-white py-2 px-4 rounded text-center">View Listing</a>
            `;

            // Append the created listing card to the container
            listingsContainer.appendChild(listingCard);
        });
    })
    .catch(error => {
        console.error('Error fetching listings:', error);
    });
}
