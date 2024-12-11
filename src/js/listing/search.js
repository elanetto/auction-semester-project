export function initializeSearchBar(data) {
    const searchInput = document.getElementById('search-input');
    const mainElement = document.querySelector('main');

    if (!searchInput || !mainElement) {
        console.error('Search input or main element not found.');
        return;
    }

    function renderSearchResults(results) {
        mainElement.innerHTML = ''; // Clear existing content

        if (results.length === 0) {
            mainElement.innerHTML = `
                <div class="text-center py-8">
                    <h2 class="text-xl font-bold">No results found</h2>
                    <p>Try adjusting your search query.</p>
                </div>
            `;
            return;
        }

        const listingsContainer = document.createElement('div');
        listingsContainer.classList.add('flex', 'flex-wrap', 'gap-4');

        results.forEach(listing => {
            const listingCard = document.createElement('div');
            listingCard.classList.add('flex', 'flex-col', 'p-4', 'bg-white', 'w-[320px]', 'rounded', 'shadow-md', 'h-auto');

            const mediaUrl = listing.media?.[0]?.url || 'default-image.jpg';
            const highestBid = listing.bids?.length ? Math.max(...listing.bids.map(bid => bid.amount)) : '0';
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
                    <span class="text-blue-950 font-bold">Ends in:</span>
                    <span>${timeLeft}</span>
                </div>
                <a href="/listing.html?id=${listing.id}" class="mt-4 bg-blue-950 text-white py-2 px-4 rounded text-center">View Listing</a>
            `;

            listingsContainer.appendChild(listingCard);
        });

        mainElement.appendChild(listingsContainer);
    }

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const filteredResults = data.filter(listing => {
            const matchesTitle = listing.title?.toLowerCase().includes(query);
            const matchesDescription = listing.description?.toLowerCase().includes(query);
            const matchesAltText = listing.media?.[0]?.alt?.toLowerCase().includes(query);
            const matchesTags = listing.tags?.some(tag => tag.toLowerCase().includes(query));

            const endsAt = listing.endsAt ? new Date(listing.endsAt) : null;
            const isActive = endsAt && endsAt > new Date();

            return (matchesTitle || matchesDescription || matchesAltText || matchesTags) && isActive;
        });

        renderSearchResults(filteredResults);
    });
}
