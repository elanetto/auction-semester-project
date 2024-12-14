export function copyLink() {

    // Check if the current page is the view single listing page
    if (!document.body.classList.contains("view-single-listing-page")) {
        return;
    }

    const copyLinkElement = document.querySelector('.copy-link-to-listing');

    if (!copyLinkElement) {
        console.error('Copy link element not found in the DOM.');
        return;
    }

    copyLinkElement.addEventListener('click', () => {
        // Get the current URL
        const currentUrl = window.location.href;

        // Copy the URL to the clipboard
        navigator.clipboard.writeText(currentUrl)
            .then(() => {
                // Show success alert
                alert('Successfully copied the link to this listing');
            })
            .catch(err => {
                console.error('Failed to copy the link:', err);
                alert('Failed to copy the link. Please try again.');
            });
    });
}
