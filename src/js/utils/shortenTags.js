export function truncateTags() {
    const tagsElement = document.querySelector('.single-listing-tags-shorten');

    if (!tagsElement) {
        console.error("Tags element not found.");
        return;
    }

    // Get the text content of the tags
    const tagsText = tagsElement.textContent;

    // Split tags by ', ' and truncate any tag longer than 12 characters
    const truncatedTags = tagsText.split(', ').map(tag => {
        return tag.length > 12 ? `${tag.slice(0, 12)}...` : tag;
    });

    // Rejoin the tags and update the DOM
    tagsElement.textContent = truncatedTags.join(', ');
}