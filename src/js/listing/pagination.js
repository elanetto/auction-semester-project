export function pagination(data, itemsPerPage = 10) {
    let currentPage = 1;

    // Filter only active listings initially
    let filteredData = data.filter(listing => {
        const endsAt = listing.endsAt ? new Date(listing.endsAt) : null;
        return endsAt && endsAt > new Date(); // Only include listings with time left
    });

    const listingsContainer = document.getElementById('listings-container');
    const paginationContainer = document.getElementById('pagination-container');
    const tagFilter = document.getElementById('tag-filter');
    const searchInputs = document.querySelectorAll('.search-input'); // Use class for multiple inputs

    function renderPage(page) {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const listingsToShow = filteredData.slice(startIndex, endIndex);

        listingsContainer.innerHTML = '';

        listingsToShow.forEach(listing => {
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
                <div>
                    <span class="text-blue-950 font-bold">Seller:</span>
                    <span>${listing.seller?.name || 'Unknown'}</span>
                </div>
                <a href="/listing.html?id=${listing.id}" class="mt-4 bg-blue-950 text-white py-2 px-4 rounded text-center">View Listing</a>
            `;

            listingsContainer.appendChild(listingCard);
        });
    }

    function setupPaginationControls() {
        paginationContainer.innerHTML = '';

        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.classList.add('px-3', 'py-1', 'border', 'rounded', 'mx-1', 'hover:bg-gray-200');
            if (i === currentPage) {
                button.classList.add('bg-blue-500', 'text-white');
            }

            button.addEventListener('click', () => {
                currentPage = i;
                renderPage(currentPage);
                setupPaginationControls();
            });

            paginationContainer.appendChild(button);
        }
    }

    function applyFilters() {
        const query = Array.from(searchInputs).map(input => input.value.toLowerCase()).join(' ').trim();
        const selectedTag = tagFilter?.value || '';

        filteredData = data.filter(listing => {
            const endsAt = listing.endsAt ? new Date(listing.endsAt) : null;
            const isActive = endsAt && endsAt > new Date();

            const matchesTag = (!selectedTag || listing.tags?.includes(selectedTag)) && isActive;
            const matchesSearch =
                !query ||
                listing.title?.toLowerCase().includes(query) ||
                listing.description?.toLowerCase().includes(query) ||
                listing.media?.[0]?.alt?.toLowerCase().includes(query) ||
                listing.tags?.some(tag => tag.toLowerCase().includes(query)) ||
                listing.seller?.name?.toLowerCase().includes(query) ||
                listing.id?.toLowerCase().includes(query);

            return matchesTag && matchesSearch;
        });

        currentPage = 1; // Reset to the first page
        renderPage(currentPage);
        setupPaginationControls();
    }

    function populateTagFilter() {
        if (!tagFilter) return;

        const uniqueTags = new Set();
        data.forEach(listing => {
            const endsAt = listing.endsAt ? new Date(listing.endsAt) : null;
            const isActive = endsAt && endsAt > new Date();

            if (isActive && listing.tags) {
                listing.tags.forEach(tag => uniqueTags.add(tag));
            }
        });

        tagFilter.innerHTML = '<option value="">All Tags</option>'; // Default option
        uniqueTags.forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag;
            tagFilter.appendChild(option);
        });
    }

    if (tagFilter) {
        tagFilter.addEventListener('change', applyFilters);
    }

    if (searchInputs.length > 0) {
        searchInputs.forEach(input => input.addEventListener('input', applyFilters));
    }

    populateTagFilter();
    renderPage(currentPage);
    setupPaginationControls();
}
