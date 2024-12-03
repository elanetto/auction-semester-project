export function displayListing() {

    // Check if the current page is index.html
    if (!document.body.classList.contains("homepage")) {
        return;
    }

    const listingsContainer = document.querySelector('.listings-container');

    fetch('https://v2.api.noroff.dev/auction/listings')
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to fetch listings');
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);

            // Ensure data is an array
            if (!Array.isArray(data)) {
                console.error('Expected an array but received:', data);
                return;
            }

            data.forEach((listing) => {
                const listingCard = document.createElement('div');
                listingCard.classList.add('listing-card');

                const listingImage = document.createElement('img');
                listingImage.src = listing.image;
                listingImage.alt = listing.title;

                const listingTitle = document.createElement('h2');
                listingTitle.innerHTML = listing.title;

                const listingPrice = document.createElement('p');
                listingPrice.innerHTML = `Price: ${listing.price}`;

                const listingDescription = document.createElement('p');
                listingDescription.innerHTML = listing.description;

                listingCard.appendChild(listingImage);
                listingCard.appendChild(listingTitle);
                listingCard.appendChild(listingPrice);
                listingCard.appendChild(listingDescription);

                listingsContainer.appendChild(listingCard);
            });
        })
        .catch((error) => {
            console.error('An error occurred:', error);
        });
}
