export async function pagination(apiUrl, itemsPerPage = 9) {

    // Check if the current page is the homepage
    if (!document.body.classList.contains("homepage")) {
        return;
    }

    let currentPage = 1;
    let filteredData = [];

    const listingsContainer = document.getElementById('listings-container');
    const paginationContainer = document.getElementById('pagination-container');
    const tagFilter = document.getElementById('tag-filter');
    const searchInputs = document.querySelectorAll('.search-input'); // Use class for multiple inputs

    async function fetchAllListings(apiUrl, limit = 100) {
        let allListings = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
            try {
                const response = await fetch(`${apiUrl}?_seller=true&_bids=true&limit=${limit}&page=${page}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch listings: ${response.status}`);
                }
                const data = await response.json();
                allListings = allListings.concat(data.data || []);
                hasMore = (data.data || []).length === limit; // Stop if fewer items are returned than the limit
                page++;
                if (allListings.length >= 1000) break; // Cap at 1000 items
            } catch (error) {
                console.error('Error fetching listings:', error);
                hasMore = false; // Exit the loop on error
            }
        }

        return allListings;
    }

    const data = await fetchAllListings(apiUrl);

    // Filter only active listings initially
    filteredData = data.filter(listing => {
        const endsAt = listing.endsAt ? new Date(listing.endsAt) : null;
        return endsAt && endsAt > new Date(); // Only include listings with time left
    });

    function renderPage(page) {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const listingsToShow = filteredData.slice(startIndex, endIndex);

        listingsContainer.innerHTML = '';

        listingsToShow.forEach(listing => {
            const listingCard = document.createElement('div');
            listingCard.classList.add('flex', 'flex-col', 'p-4', 'bg-white', 'w-[320px]', 'rounded', 'shadow-md', 'h-auto');

            const mediaUrl = listing.media?.[0]?.url || '../../assets/placeholders/placeholder-pen-02.png';
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

            // Truncate description
            const truncateText = (text, maxLength) => {
                if (!text) return '';
                return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
            };

            listingCard.innerHTML = `
                <img src="${mediaUrl}" alt="${listing.title}" class="mb-4 rounded h-[250px] object-cover">
                <h3 class="text-blue-950 font-bold text-lg break-words truncate">${listing.title}</h3>
                <div>
                    <span class="text-blue-950 font-bold">Current Bid:</span>
                    <span>${highestBid} 🌕</span>
                </div>
                <div>
                    <span class="text-blue-950 font-bold">Description:</span>
                    <span class="italic break-words">${truncateText(listing.description, 30)}</span>
                </div>
                <div>
                    <span class="text-blue-950 font-bold">Ends in:</span>
                    <span>${timeLeft}</span>
                </div>
                <div>
                    <span class="text-blue-950 font-bold">Seller:</span>
                    <span>${listing.seller?.name || 'Unknown'}</span>
                </div>
                <a href="/listing/view/index.html?id=${listing.id}" class="mt-4 bg-blue-950 hover:bg-orange-600 text-white py-2 px-4 rounded text-center">View Listing</a>
            `;

            listingsContainer.appendChild(listingCard);
        });
    }

    function setupPaginationControls() {
        paginationContainer.innerHTML = '';
    
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        const maxVisiblePages = 5;
    
        const createButton = (text, page, isActive = false) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.classList.add('px-3', 'py-1', 'border', 'rounded', 'mx-1', 'bg-orange-500', 'hover:bg-orange-700', 'text-white');
            if (isActive) button.classList.add('bg-orange-600', 'text-white');
            button.addEventListener('click', () => {
                currentPage = page;
                renderPage(currentPage);
                setupPaginationControls();
            });
            return button;
        };
    
        if (currentPage > 1) {
            paginationContainer.appendChild(createButton('1', 1));
            paginationContainer.appendChild(createButton('Previous', currentPage - 1));
        }
    
        const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
        const adjustedStartPage = Math.max(1, endPage - maxVisiblePages + 1);
    
        for (let i = adjustedStartPage; i <= endPage; i++) {
            paginationContainer.appendChild(createButton(i, i, i === currentPage));
        }
    
        if (currentPage < totalPages) {
            paginationContainer.appendChild(createButton('Next', currentPage + 1));
            paginationContainer.appendChild(createButton(totalPages, totalPages));
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

        currentPage = 1;
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

        tagFilter.innerHTML = '<option value="">All Tags</option>';
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
