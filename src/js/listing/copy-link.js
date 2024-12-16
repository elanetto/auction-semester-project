export function copyLink() {

    if (!document.body.classList.contains("view-single-listing-page")) {
        return;
    }

    const copyLinkElement = document.querySelector('.copy-link-to-listing');

    if (!copyLinkElement) {
        console.error('Copy link element not found in the DOM.');
        return;
    }

    copyLinkElement.addEventListener('click', () => {
        const currentUrl = window.location.href;

        navigator.clipboard.writeText(currentUrl)
            .then(() => {
                alert('Successfully copied the link to this listing');
            })
            .catch(err => {
                console.error('Failed to copy the link:', err);
                alert('Failed to copy the link. Please try again.');
            });
    });
}
