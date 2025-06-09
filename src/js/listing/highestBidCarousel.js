import placeholderPen from "../../../assets/placeholders/placeholder-pen.png";

export function initializeHighestBidCarousel() {
    if (!document.body.classList.contains("homepage")) return;

    const carousel = document.getElementById("carousel");
    const prevButton = document.getElementById("prev-button");
    const nextButton = document.getElementById("next-button");
    const dotsContainer = document.getElementById("dots-container");

    async function fetchAllBiddedListings(apiUrl, limit = 100) {
        let allListings = [];
        let page = 1;
        let isLastPage = false;

        while (!isLastPage) {
            try {
                const response = await fetch(`${apiUrl}?_bids=true&limit=${limit}&page=${page}`);
                if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
                const data = await response.json();
                allListings = allListings.concat(data.data || []);
                isLastPage = data.meta?.isLastPage || false;
                page++;
            } catch (error) {
                console.error("Error fetching listings:", error);
                break;
            }
        }

        return allListings
            .filter(listing => listing.bids?.length > 0 && new Date(listing.endsAt) > new Date())
            .sort((a, b) => {
                const maxBidA = Math.max(...a.bids.map(bid => bid.amount));
                const maxBidB = Math.max(...b.bids.map(bid => bid.amount));
                return maxBidB - maxBidA;
            })
            .slice(0, 3); // Top 3
    }

    async function initializeCarousel() {
        const apiUrl = "https://v2.api.noroff.dev/auction/listings";
        const listings = await fetchAllBiddedListings(apiUrl);

        if (listings.length === 0) {
            console.error("No active listings with bids.");
            return;
        }

        carousel.classList.add("flex", "transition-transform", "duration-500", "ease-in-out");

        const truncateText = (text, maxLength) =>
            text && text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

        listings.forEach((listing) => {
            const highestBid = Math.max(...listing.bids.map(bid => bid.amount));
            const mediaUrl = listing.media?.[0]?.url || placeholderPen;

            const carouselItem = document.createElement("div");
            carouselItem.classList.add(
                "carousel-slide",
                "relative",
                "w-full",
                "h-[500px]",
                "shrink-0",
                "flex",
                "items-center",
                "justify-center"
            );

            carouselItem.innerHTML = `
                <div class="absolute inset-0">
                    <img src="${mediaUrl}" alt="${listing.title}" class="w-full h-full object-cover break-words truncate" onerror="this.onerror=null;this.src='${placeholderPen}'">
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
            const dot = document.createElement("div");
            dot.classList.add("dot", "w-3", "h-3", "bg-gray-400", "rounded-full", "cursor-pointer", "mx-1");
            dot.addEventListener("click", () => {
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

            const dots = document.querySelectorAll(".dot");
            dots.forEach((dot, index) => {
                dot.classList.toggle("bg-white", index === currentIndex);
                dot.classList.toggle("scale-125", index === currentIndex);
                dot.classList.toggle("bg-gray-400", index !== currentIndex);
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

        nextButton.addEventListener("click", showNext);
        prevButton.addEventListener("click", showPrev);

        updateCarousel();
    }

    initializeCarousel();
}

function calculateTimeLeft(endsAt) {
    const targetDate = new Date(endsAt);
    const now = new Date();
    const diff = targetDate - now;

    if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        if (days > 0) return `${days} day${days !== 1 ? "s" : ""}`;
        if (hours > 0) return `${hours} hour${hours !== 1 ? "s" : ""}`;
        return `${mins} minute${mins !== 1 ? "s" : ""}`;
    }

    return "Ended";
}
