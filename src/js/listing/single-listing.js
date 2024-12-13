export async function fetchSingleListing() {
    // Get the listing ID from the URL
    const params = new URLSearchParams(window.location.search);
    const listingId = params.get('id');

    if (!listingId) {
        console.error('No listing ID found in URL');
        return;
    }

    const apiUrl = `https://v2.api.noroff.dev/auction/listings/${listingId}?_seller=true&_bids=true`;

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found. User may not be logged in.');
            return;
        }

        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch listing');
        }

        const { data } = await response.json();

        // Update the listing details in the HTML
        document.querySelector('.view-single-listing-title').textContent = data.title || 'No title available';
        document.querySelector('.view-single-listing-description').textContent = data.description || 'No description available';
        document.querySelector('.view-single-listing-image').src = data.media?.[0]?.url || '../../assets/placeholders/placeholder-pen.png';
        document.querySelector('.view-single-listing-image').alt = data.media?.[0]?.alt || 'No image available';
        document.querySelector('.view-single-listing-image-alt-text').textContent = data.media?.[0]?.alt || 'No image alt text available';
        document.querySelector('.single-listing-tags').textContent = data.tags?.join(', ') || 'No tags available';

        // Calculate remaining time
        const endsAt = new Date(data.endsAt);
        const timeLeft = calculateTimeLeft(endsAt);
        document.querySelector('.single-listing-endat').textContent = timeLeft;

        // Update seller details
        const sellerAvatar = data.seller?.avatar?.url || '../../assets/placeholders/avatar-placeholder.png';
        const sellerName = data.seller?.name || 'Unknown Seller';
        document.querySelector('.view-single-listing-seller-avatar').src = sellerAvatar;
        document.querySelector('.view-single-listing-seller-name').textContent = sellerName;

        // Update bid details
        const highestBid = data.bids?.length ? Math.max(...data.bids.map(bid => bid.amount)) : '0';
        document.querySelector('.highest-bid-on-single-listing').textContent = `${highestBid} 🌕`;

        const highestBidder = data.bids?.length ? data.bids[data.bids.length - 1]?.bidder?.name : 'No bids yet';
        document.querySelector('.higest-bidder-dame').textContent = highestBidder;

        // Render bid history
        const bidHistoryContainer = document.querySelector('.bid-history-table');
        // Render bid history with the latest bids on top
        if (bidHistoryContainer && data.bids?.length) {
            bidHistoryContainer.innerHTML = ''; // Clear existing history

            // Reverse the bids array to show the latest first
            const sortedBids = [...data.bids].sort((a, b) => new Date(b.created) - new Date(a.created));

            sortedBids.forEach(bid => {
                const bidderName = bid.bidder?.name || 'Anonymous';
                const bidAmount = bid.amount;
                const bidDate = new Date(bid.created).toLocaleDateString();

                const bidRow = document.createElement('div');
                bidRow.classList.add('bid-history-table', 'bg-white', 'flex', 'justify-between', 'p-4', 'm-4', 'items-center', 'text-blue-950', 'w-full');

                bidRow.innerHTML = `
                    <div>
                        <img src="${bid.bidder?.avatar?.url || '../../assets/placeholders/avatar-placeholder.png'}" alt="avatar" class="bid-history-avatar w-[50px] h-[50px] object-cover mx-auto rounded-full overflow-hidden">
                    </div>
                    <div class="bid-history-username font-bold">${bidderName}</div>
                    <div class="bid-history-date">${bidDate}</div>
                    <div class="bid-history-amount-of-bid font-bold">${bidAmount} 🌕</div>
                `;

                bidHistoryContainer.appendChild(bidRow);
            });
        }


    } catch (error) {
        console.error('Error fetching single listing:', error);
    }
}

// Utility function to calculate time left
function calculateTimeLeft(endsAt) {
    const now = new Date();
    const difference = endsAt - now;

    if (difference <= 0) return 'Ended';

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
}

