export function renderProfileData(profileData) {
    if (!profileData) return;

    // Update the DOM with the profile data
    const nameElement = document.querySelector('.profile-name');
    if (nameElement) {
        nameElement.textContent = profileData.name; // Update the name
    }

    const emailElement = document.querySelector('.profile-email');
    if (emailElement) {
        emailElement.textContent = profileData.email; // Update the email
    }

    const avatarElement = document.querySelector('.avatar-profile');
    if (profileData.avatar && avatarElement) {
        avatarElement.src = profileData.avatar; // Update the src attribute for the avatar image
    }

    const bannerElement = document.querySelector('.banner-profile');
    if (profileData.banner && bannerElement) {
        bannerElement.src = profileData.banner; // Update the src attribute for the banner image
    }

    const creditsElement = document.querySelector('.profile-credits');
    if (creditsElement) {
        creditsElement.textContent = `Credits: ${profileData.credits}`; // Update credits display
    }

    const listingsCountElement = document.querySelector('.profile-listings-count');
    if (listingsCountElement) {
        listingsCountElement.textContent = `Listings: ${profileData.listingsCount}`; // Update listings count display
    }

    const winsCountElement = document.querySelector('.profile-wins-count');
    if (winsCountElement) {
        winsCountElement.textContent = `Wins: ${profileData.winsCount}`; // Update wins count display
    }
}