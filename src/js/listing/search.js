import placeholderPen from "../../../assets/placeholders/placeholder-pen.png";

export function initializeSearchBar(apiUrl) {
    const searchInputs = document.querySelectorAll(".search-input");
    const mainElement = document.querySelector("main");

    if (!searchInputs.length || !mainElement) {
        console.error("Search inputs or main element not found.");
        return;
    }

    async function renderSearchResults(query) {
        if (!query) {
            mainElement.innerHTML = "";
            return;
        }

        try {
            const response = await fetch(
                `${apiUrl}/search?q=${encodeURIComponent(query)}&_seller=true&_bids=true`
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch search results: ${response.status}`);
            }

            const result = await response.json();
            const listings = (result.data || []).filter((listing) => {
                const endsAt = listing.endsAt ? new Date(listing.endsAt) : null;
                return endsAt && endsAt > new Date();
            });

            mainElement.innerHTML = "";

            if (listings.length === 0) {
                mainElement.innerHTML = `
                    <div class="text-center py-8">
                        <h2 class="text-xl font-bold">No results found</h2>
                        <p>Try adjusting your search query.</p>
                    </div>
                `;
                return;
            }

            const listingsContainer = document.createElement("div");
            listingsContainer.classList.add(
                "flex",
                "flex-wrap",
                "gap-4",
                "justify-center",
                "p-4",
                "items-center",
                "mx-auto",
                "bg-gray-100"
            );

            listings.forEach((listing) => {
                const listingCard = document.createElement("div");
                listingCard.classList.add(
                    "flex",
                    "flex-col",
                    "p-4",
                    "bg-white",
                    "w-[320px]",
                    "rounded",
                    "shadow-md",
                    "h-auto"
                );

                const mediaUrl = listing.media?.[0]?.url || placeholderPen;
                const highestBid = listing.bids?.length
                    ? Math.max(...listing.bids.map((bid) => bid.amount))
                    : "0";

                const endsAt = listing.endsAt;
                let timeLeft = "N/A";

                if (endsAt) {
                    const targetDate = new Date(endsAt);
                    const now = new Date();
                    const diff = targetDate - now;

                    if (diff > 0) {
                        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                        const hours = Math.floor(
                            (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                        );
                        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

                        if (days > 0) {
                            timeLeft = `${days} day${days !== 1 ? "s" : ""}`;
                        } else if (hours > 0) {
                            timeLeft = `${hours} hour${hours !== 1 ? "s" : ""}`;
                        } else {
                            timeLeft = `${mins} minute${mins !== 1 ? "s" : ""}`;
                        }
                    } else {
                        timeLeft = "Ended";
                    }
                }

                const truncateText = (text, maxLength) => {
                    if (!text) return "";
                    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
                };

                listingCard.innerHTML = `
                    <img src="${mediaUrl}" alt="${listing.title}" class="mb-4 rounded h-[250px] object-cover" onerror="this.onerror=null;this.src='${placeholderPen}'">
                    <h3 class="text-blue-950 font-bold text-lg break-words truncate">${listing.title}</h3>
                    <div>
                        <span class="text-blue-950 font-bold">Current Bid:</span>
                        <span>${highestBid} 🌕</span>
                    </div>
                    <div>
                        <span class="text-blue-950 font-bold">Description:</span>
                        <span class="italic break-words">${truncateText(
                            listing.description,
                            30
                        )}</span>
                    </div>
                    <div>
                        <span class="text-blue-950 font-bold">Ends in:</span>
                        <span>${timeLeft}</span>
                    </div>
                    <div>
                        <span class="text-blue-950 font-bold">Seller:</span>
                        <span>${listing.seller?.name || "Unknown"}</span>
                    </div>
                    <a href="/listing/view/index.html?id=${listing.id}" class="mt-4 bg-blue-950 text-white py-2 px-4 rounded text-center">View Listing</a>
                `;

                listingsContainer.appendChild(listingCard);
            });

            mainElement.appendChild(listingsContainer);
        } catch (error) {
            console.error("Search failed:", error);
            mainElement.innerHTML = `
                <div class="text-center py-8">
                    <h2 class="text-xl font-bold text-red-600">Oops! Search failed.</h2>
                    <p>${error.message}</p>
                </div>
            `;
        }
    }

    searchInputs.forEach((input) => {
        input.addEventListener("input", () => {
            const query = input.value.trim().toLowerCase();
            renderSearchResults(query);
        });
    });
}
