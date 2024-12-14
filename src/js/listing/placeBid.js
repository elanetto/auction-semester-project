export function placeBid() {

    // Check if the current page is the view single listing page
    if (!document.body.classList.contains("view-single-listing-page")) {
        return;
    }

    const bidButton = document.getElementById('place-bid-button');
    const bidInput = document.getElementById('place-bid');

    if (!bidButton || !bidInput) {
        console.error('Bid button or input field not found.');
        return;
    }

    // Add click event listener to the button
    bidButton.addEventListener('click', async (event) => {
        event.preventDefault();

        const bidAmount = parseFloat(bidInput.value);
        if (isNaN(bidAmount) || bidAmount <= 0) {
            alert('Please enter a valid bid amount.');
            return;
        }

        // Extract the listing ID from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const listingId = urlParams.get('id');
        if (!listingId) {
            console.error('Listing ID not found in the URL.');
            alert('Could not determine the listing to place a bid.');
            return;
        }

        const apiKey = localStorage.getItem('api_key');
        const accessToken = localStorage.getItem('token');

        if (!apiKey || !accessToken) {
            console.error('API key or access token not found in localStorage.');
            alert('Unable to authenticate. Please log in again.');
            return;
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                'X-Noroff-API-Key': apiKey,
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ amount: bidAmount })
        };

        try {
            console.log(`Placing bid on listing ${listingId} with amount ${bidAmount}`);
            const response = await fetch(`https://v2.api.noroff.dev/auction/listings/${listingId}/bids`, requestOptions);

            if (!response.ok) {
                const error = await response.json();
                console.error('Error response from API:', error);
                alert(`Error placing bid: ${error.message || 'An unexpected error occurred.'}`);
                return;
            }

            const result = await response.json();
            console.log('Bid placed successfully:', result);

            // Show success message and refresh the bid history
            alert('Bid placed successfully!');
            location.reload(); // Reload the page to fetch updated bid history
        } catch (error) {
            console.error('Error placing bid:', error);
            alert('An error occurred while placing your bid. Please try again later.');
        }
    });
}
