export function updateProfileDataInDOM(profileData) {
    const creditsElement = document.querySelector('.my-credits');
    const listingsElement = document.querySelector('.my-listings');
    const winsElement = document.querySelector('.my-wins');

    if (creditsElement) creditsElement.textContent = profileData.credits;
    if (listingsElement) listingsElement.textContent = profileData._count.listings;
    if (winsElement) winsElement.textContent = profileData._count.wins;
}
