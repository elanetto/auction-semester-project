import { deleteListing } from '../listing/delete/deleteListing.js';
import { requireAuthentication } from '../utils/requireAuthentication.js';

export function myListings() {
    if (!requireAuthentication()) return;

    if (!document.body.classList.contains("my-account-page")) {
        return;
    }

    const token = localStorage.getItem("token");
    const apiKey = localStorage.getItem("api_key");
    const username = localStorage.getItem("username");

    if (!token || !username || !apiKey) {
        console.error("Missing required authentication or user information.");
        return;
    }

    const cleanedToken = token.replace(/['"]+/g, "");
    const cleanedUsername = username.replace(/['"]+/g, "");

    fetch(`https://v2.api.noroff.dev/auction/profiles/${cleanedUsername}/listings?_bids=true`, {
        method: "GET",
        headers: {
            "X-Noroff-API-Key": apiKey,
            Authorization: `Bearer ${cleanedToken}`,
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch listings");
            }
            return response.json();
        })
        .then((data) => {
            const listings = Array.isArray(data.data) ? data.data : [];
            if (listings.length === 0) {
                console.warn("No listings found for this user.");
                return;
            }

            const listingsContainer = document.getElementById("my-listings-container");
            if (!listingsContainer) {
                console.error("Listings container not found in DOM.");
                return;
            }

            listingsContainer.innerHTML = "";

            const activeListings = listings.filter((listing) => {
                const endsAt = listing.endsAt ? new Date(listing.endsAt) : null;
                return endsAt && endsAt > new Date();
            });

            activeListings.forEach((listing) => {
                const listingCard = document.createElement("div");
                listingCard.classList.add("flex", "flex-col", "p-4", "bg-white", "w-[350px]", "rounded", "shadow-md");

                const mediaUrl = listing.media?.[0]?.url || "../../assets/placeholders/placeholder-pen.png";

                const highestBidAmount = listing.bids?.length
                    ? Math.max(...listing.bids.map((bid) => bid.amount))
                    : "0";

                const tags = listing.tags?.length ? listing.tags.join(", ") : "N/A";

                const endsAt = listing.endsAt;
                let timeLeft = "N/A";

                if (endsAt) {
                    const targetDate = new Date(endsAt);
                    const currentDate = new Date();
                    const differenceInMs = targetDate - currentDate;

                    if (differenceInMs > 0) {
                        const daysLeft = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
                        const hoursLeft = Math.floor((differenceInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        const minutesLeft = Math.floor((differenceInMs % (1000 * 60)) / (1000 * 60));

                        if (daysLeft > 0) {
                            timeLeft = `${daysLeft} day${daysLeft > 1 ? "s" : ""}`;
                        } else if (hoursLeft > 0) {
                            timeLeft = `${hoursLeft} hour${hoursLeft > 1 ? "s" : ""}`;
                        } else {
                            timeLeft = `${minutesLeft} minute${minutesLeft > 1 ? "s" : ""}`;
                        }
                    } else {
                        timeLeft = "Ended";
                    }
                }

                listingCard.innerHTML = `
                    <a href="/listing/view/index.html?id=${listing.id}">
                        <img src="${mediaUrl}" alt="${listing.title}" class="mb-4 rounded object-cover w-full h-[220px]">
                        <h3 class="text-blue-950 font-bold text-lg">${listing.title}</h3>
                        <div>
                            <span class="text-blue-950 font-bold">Current Bid:</span>
                            <span>${highestBidAmount} 🌕</span>
                        </div>
                        <div>
                            <span class="text-blue-950 font-bold">Description:</span>
                            <span class="italic">${listing.description || "No description available"}</span>
                        </div>
                        <div>
                            <span class="text-blue-950 font-bold">Category:</span>
                            <span>${tags}</span>
                        </div>
                        <div>
                            <span class="text-blue-950 font-bold">Ends in:</span>
                            <span>${timeLeft}</span>
                        </div>
                    </a>
                    <div class="mt-3 h-[50px]">
                        <a href="/listing/edit/index.html?id=${listing.id}" class="bg-blue-950 hover:bg-blue-800 text-white rounded px-6 py-2">Edit</a>
                        <button data-listing-id="${listing.id}" class="delete-listing-button bg-blue-950 hover:bg-blue-800 text-white rounded px-4 py-1.5 mt-2">Delete</button>
                    </div>
                `;

                const deleteButton = listingCard.querySelector(".delete-listing-button");
                if (deleteButton) {
                    deleteButton.addEventListener("click", () => deleteListing(listing.id, listingCard));
                }

                listingsContainer.appendChild(listingCard);
            });
        })
        .catch((error) => {
            console.error("Error fetching listings:", error);
        });
}
