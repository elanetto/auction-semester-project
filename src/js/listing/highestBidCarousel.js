export function initializeHighestBidCarousel() {

    if (!document.body.classList.contains("homepage")) {
        return;
    }

    const carousel = document.getElementById('carousel');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const dotsContainer = document.getElementById('dots-container');

    async function fetchHighestBidListings() {
        try {
            const response = await fetch('https://v2.api.noroff.dev/auction/listings?_bids=true', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch listings');
            }

            const data = await response.json();
            return data.data
                .filter(listing => listing.bids && listing.bids.length > 0 && new Date(listing.endsAt) > new Date())
                .sort((a, b) => Math.max(...b.bids.map(bid => bid.amount)) - Math.max(...a.bids.map(bid => bid.amount)))
                .slice(0, 3);
        } catch (error) {
            console.error('Error fetching highest bid listings:', error);
            return [];
        }
    }

    async function initializeCarousel() {
        const listings = await fetchHighestBidListings();

        if (listings.length === 0) {
            console.error('No active listings with bids available.');
            return;
        }

        carousel.classList.add('flex', 'transition-transform', 'duration-500', 'ease-in-out');

        const truncateText = (text, maxLength) => {
            if (!text) return '';
            return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
        };

        listings.forEach(listing => {
            const highestBid = Math.max(...listing.bids.map(bid => bid.amount));
            const mediaUrl = listing.media && listing.media[0] && listing.media[0].url
                ? listing.media[0].url
                : 'default-image.jpg';

            const carouselItem = document.createElement('div');
            carouselItem.classList.add('carousel-slide', 'relative', 'w-full', 'h-[500px]', 'shrink-0', 'flex', 'items-center', 'justify-center');

            carouselItem.innerHTML = `
                <div class="absolute inset-0">
                    <img src="${mediaUrl}" alt="${listing.title}" class="w-full h-full object-cover break-words truncate">
                </div>
                <div class="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white p-4">
                    <h3 class="text-3xl font-bold mb-4 break-words truncate">${truncateText(listing.title, 20)}</h3>
                    <p class="text-xl mb-2"><strong>Highest Bid:</strong> ${highestBid} 🌕</p>
                    <p class="text-xl mb-4"><strong>Ends in:</strong> ${calculateTimeLeft(listing.endsAt)}</p>
                    <a href="/listing/view/index.html?id=${listing.id}" class="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded">View Listing</a>
                </div>
            `;

            carousel.appendChild(carouselItem);
        });

        listings.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot', 'w-3', 'h-3', 'bg-gray-400', 'rounded-full', 'cursor-pointer', 'mx-1');
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });

        let currentIndex = 0;
        const totalItems = listings.length;

        function updateCarousel() {
            const offset = -currentIndex * 100;
            carousel.style.transform = `translateX(${offset}%)`;

            const dots = document.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('bg-white', 'scale-125');
                    dot.classList.remove('bg-gray-400', 'scale-100');
                } else {
                    dot.classList.add('bg-gray-400', 'scale-100');
                    dot.classList.remove('bg-white', 'scale-125');
                }
            });
        }

        function showNext() {
            currentIndex = (currentIndex + 1) % totalItems;
            updateCarousel();
        }

        function showPrev() {
            currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            updateCarousel();
        }

        nextButton.addEventListener('click', showNext);
        prevButton.addEventListener('click', showPrev);

        updateCarousel();
    }

    initializeCarousel();
}

function calculateTimeLeft(endsAt) {
    const targetDate = new Date(endsAt);
    const currentDate = new Date();
    const differenceInMs = targetDate - currentDate;

    if (differenceInMs > 0) {
        const daysLeft = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
        const hoursLeft = Math.floor((differenceInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutesLeft = Math.floor((differenceInMs % (1000 * 60 * 60)) / (1000 * 60));

        if (daysLeft > 0) {
            return `${daysLeft} day${daysLeft > 1 ? 's' : ''}`;
        } else if (hoursLeft > 0) {
            return `${hoursLeft} hour${hoursLeft > 1 ? 's' : ''}`;
        } else {
            return `${minutesLeft} minute${minutesLeft > 1 ? 's' : ''}`;
        }
    } else {
        return 'Ended';
    }
}
