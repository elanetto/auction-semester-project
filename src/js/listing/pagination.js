import placeholderPen from "../../../assets/placeholders/placeholder-pen.png";

export async function pagination(apiUrl, itemsPerPage = 9) {
  if (!document.body.classList.contains("homepage")) {
    return;
  }

  let currentPage = 1;
  let fullData = [];
  let filteredData = [];

  const listingsContainer = document.getElementById("listings-container");
  const paginationContainer = document.getElementById("pagination-container");
  const tagFilter = document.getElementById("tag-filter");
  const searchInputs = document.querySelectorAll(".search-input");
  const sortDropdown = document.getElementById("sort-filter");

  async function fetchAllListings(apiUrl, pageSize = 100) {
    let allListings = [];
    let page = 1;
    let isLastPage = false;

    while (!isLastPage) {
      try {
        const response = await fetch(
          `${apiUrl}?_seller=true&_bids=true&limit=${pageSize}&page=${page}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch listings: ${response.status}`);
        }
        const data = await response.json();
        allListings = allListings.concat(data.data || []);
        isLastPage = data.meta?.isLastPage || false;
        page++;
      } catch (error) {
        console.error("Error fetching listings:", error);
        break;
      }
    }

    return allListings;
  }

  fullData = await fetchAllListings(apiUrl);
  filteredData = fullData.filter((listing) => {
    const endsAt = listing.endsAt ? new Date(listing.endsAt) : null;
    return endsAt && endsAt > new Date();
  });

  async function applyFilters() {
    const query = Array.from(searchInputs)
      .map((input) => input.value.toLowerCase())
      .join(" ")
      .trim();
    const selectedTag = tagFilter?.value || "";
    const selectedSort = sortDropdown?.value || "";

    if (query) {
      try {
        const response = await fetch(
          `${apiUrl}/search?q=${encodeURIComponent(query)}&_seller=true&_bids=true`
        );
        const result = await response.json();
        filteredData = (result.data || []).filter((listing) => {
          const endsAt = listing.endsAt ? new Date(listing.endsAt) : null;
          return endsAt && endsAt > new Date();
        });
      } catch (error) {
        console.error("Error fetching search results:", error);
        filteredData = [];
      }
    } else {
      filteredData = fullData.filter((listing) => {
        const endsAt = listing.endsAt ? new Date(listing.endsAt) : null;
        return endsAt && endsAt > new Date();
      });
    }

    if (selectedTag) {
      filteredData = filteredData.filter((listing) =>
        listing.tags?.includes(selectedTag)
      );
    }

    // Sorting
    if (selectedSort === "time-running-out") {
      filteredData.sort((a, b) => new Date(a.endsAt) - new Date(b.endsAt));
    } else if (selectedSort === "newest-listings") {
      filteredData.sort((a, b) => new Date(b.created) - new Date(a.created));
    } else if (selectedSort === "lowest-bids") {
      filteredData.sort((a, b) => {
        const minA = a.bids?.length
          ? Math.min(...a.bids.map((b) => b.amount))
          : 0;
        const minB = b.bids?.length
          ? Math.min(...b.bids.map((b) => b.amount))
          : 0;
        return minA - minB;
      });
    } else if (selectedSort === "highest-bids") {
      filteredData.sort((a, b) => {
        const maxA = a.bids?.length
          ? Math.max(...a.bids.map((b) => b.amount))
          : 0;
        const maxB = b.bids?.length
          ? Math.max(...b.bids.map((b) => b.amount))
          : 0;
        return maxB - maxA;
      });
    }

    currentPage = 1;
    renderPage(currentPage);
    setupPaginationControls();
  }

  function renderPage(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const listingsToShow = filteredData.slice(startIndex, endIndex);

    listingsContainer.innerHTML = "";

    listingsToShow.forEach((listing) => {
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

      const tags = listing.tags?.join(", ");
      const truncateText = (text, len) =>
        text.length > len ? text.slice(0, len) + "..." : text;

      listingCard.innerHTML = `
                <img src="${mediaUrl}" alt="${listing.title}" class="mb-4 rounded h-[250px] object-cover" onerror="this.onerror=null;this.src='${placeholderPen}'">

                <h3 class="text-blue-950 font-bold text-lg break-words truncate">${listing.title}</h3>
                <div><span class="font-bold text-blue-950">Current Bid:</span> ${highestBid} 🌕</div>
                <div><span class="font-bold text-blue-950">Description:</span> <span class="italic break-words">${listing.description ? truncateText(listing.description, 30) : "No description available"}</span></div>
                <div><span class="font-bold text-blue-950">Ends in:</span> ${timeLeft}</div>
                <div><span class="font-bold text-blue-950">Seller:</span> ${listing.seller?.name || "Unknown"}</div>
                ${tags ? `<div><span class="font-bold text-blue-950">Category:</span> ${tags}</div>` : ""}
                <div class="flex grow"></div>
                <a href="/listing/view/index.html?id=${listing.id}" class="mt-4 bg-blue-950 hover:bg-orange-600 text-white py-2 px-4 rounded text-center">View Listing</a>
            `;

      listingsContainer.appendChild(listingCard);
    });
  }

  function setupPaginationControls() {
    paginationContainer.innerHTML = "";

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const maxVisible = 5;

    const createButton = (text, page, active = false) => {
      const btn = document.createElement("button");
      btn.textContent = text;
      btn.classList.add(
        "px-3",
        "py-1",
        "border",
        "rounded",
        "mx-1",
        "bg-orange-500",
        "hover:bg-orange-700",
        "text-white"
      );
      if (active) btn.classList.add("bg-orange-600");
      btn.addEventListener("click", () => {
        currentPage = page;
        renderPage(currentPage);
        setupPaginationControls();
      });
      return btn;
    };

    if (currentPage > 1) {
      paginationContainer.appendChild(createButton("1", 1));
      paginationContainer.appendChild(
        createButton("Previous", currentPage - 1)
      );
    }

    const startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);

    for (let i = startPage; i <= endPage; i++) {
      paginationContainer.appendChild(createButton(i, i, i === currentPage));
    }

    if (currentPage < totalPages) {
      paginationContainer.appendChild(createButton("Next", currentPage + 1));
      paginationContainer.appendChild(createButton(totalPages, totalPages));
    }
  }

  function populateTagFilter() {
    if (!tagFilter) return;

    const uniqueTags = new Set();
    fullData.forEach((listing) => {
      const endsAt = listing.endsAt ? new Date(listing.endsAt) : null;
      if (endsAt && endsAt > new Date() && listing.tags) {
        listing.tags.forEach((tag) => uniqueTags.add(tag));
      }
    });

    tagFilter.innerHTML = "<option value=''>All Tags</option>";
    uniqueTags.forEach((tag) => {
      const opt = document.createElement("option");
      opt.value = tag;
      opt.textContent = tag;
      tagFilter.appendChild(opt);
    });
  }

  // Event Listeners
  if (tagFilter) tagFilter.addEventListener("change", applyFilters);
  if (searchInputs.length > 0) {
    searchInputs.forEach((input) =>
      input.addEventListener("input", applyFilters)
    );
  }
  if (sortDropdown) sortDropdown.addEventListener("change", applyFilters);

  // Initial setup
  populateTagFilter();
  renderPage(currentPage);
  setupPaginationControls();
}
