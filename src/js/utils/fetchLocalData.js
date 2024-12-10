export function fetchLocalData() {
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    const avatar = localStorage.getItem('avatar');
    const banner = localStorage.getItem('banner');

    // Update username
    const usernameElement = document.querySelector('.username-from-local-storage');
    if (username && usernameElement) {
        usernameElement.textContent = username;
    }

    // Update email
    const emailElement = document.querySelector('.email-from-local-storage');
    if (email && emailElement) {
        emailElement.textContent = email;
    }

    // Update avatar if there's a valid value
    const avatarElement = document.querySelector('.avatar-from-local-storage');
    if (avatar && avatarElement) {
        avatarElement.src = avatar; // Update the src attribute for the avatar image
    }

    // Update banner if there's a valid value
    const bannerElement = document.querySelector('.banner-from-local-storage');
    if (banner && bannerElement) {
        bannerElement.src = banner; // Update the src attribute for the banner image
    }
}
