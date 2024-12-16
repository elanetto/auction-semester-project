export function renderProfileData(profileData) {
    if (!profileData) return;

    const nameElements = document.querySelectorAll('.profile-name');
    if (nameElements.length > 0) {
        nameElements.forEach((element) => {
            element.textContent = profileData.name;
        });
    }

    const emailElement = document.querySelector('.profile-email');
    if (emailElement) {
        emailElement.textContent = profileData.email;
    }

    const avatarElements = document.querySelectorAll('.avatar-profile');
    if (profileData.avatar && avatarElements.length > 0) {
        avatarElements.forEach((element) => {
            element.src = profileData.avatar;
        });
    }

    const bannerElement = document.querySelector('.banner-profile');
    if (profileData.banner && bannerElement) {
        bannerElement.src = profileData.banner;
    }

    const creditsElements = document.querySelectorAll('.profile-credits');
    if (creditsElements.length > 0) {
        creditsElements.forEach((element) => {
            element.textContent = `Credits: ${profileData.credits}`;
        });
    }

    const listingsCountElement = document.querySelector('.profile-listings-count');
    if (listingsCountElement) {
        listingsCountElement.textContent = `Listings: ${profileData.listingsCount}`;
    }

    const winsCountElement = document.querySelector('.profile-wins-count');
    if (winsCountElement) {
        winsCountElement.textContent = `Wins: ${profileData.winsCount}`;
    }
}
