export function fetchLocalData() {
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    const avatar = localStorage.getItem('avatar');
    const banner = localStorage.getItem('banner');
    const credits = localStorage.getItem('credits');
    const listingsCount = localStorage.getItem('listingsCount');
    const winsCount = localStorage.getItem('winsCount');
    const myBio = localStorage.getItem('bio');

    // Update all elements with the class 'username-from-local-storage'
    const usernameElements = document.querySelectorAll('.username-from-local-storage');
    usernameElements.forEach(element => {
        if (username) {
            element.textContent = username;
        }
    });

    // Update all elements with the class 'email-from-local-storage'
    const emailElements = document.querySelectorAll('.email-from-local-storage');
    emailElements.forEach(element => {
        if (email) {
            element.textContent = email;
        }
    });

    // Update avatar if there's a valid value
    const avatarElement = document.querySelector('.avatar-from-local-storage');
    if (avatar && avatarElement) {
        avatarElement.src = avatar; // Update the src attribute for the avatar image
    }

    const myAvatar = document.querySelectorAll('.my-avatar');
    myAvatar.forEach(element => {
        if (avatar) {
            element.src = avatar;
        }
    });

    // Update banner if there's a valid value
    const bannerElement = document.querySelector('.banner-from-local-storage');
    if (banner && bannerElement) {
        bannerElement.src = banner; // Update the src attribute for the banner image
    }

    // Update all elements with the class 'my-credits'
    const creditElements = document.querySelectorAll('.my-credits');
    creditElements.forEach(element => {
        element.innerText = credits;
    });

    // Update all elements with the class 'my-listings-count'
    const listingsCountElements = document.querySelectorAll('.my-listings-count');
    listingsCountElements.forEach(element => {
        element.innerText = listingsCount;
    });

    // Update all elements with the class 'my-wins-count'
    const winsCountElements = document.querySelectorAll('.my-wins-count');
    winsCountElements.forEach(element => {
        element.innerText = winsCount;
    });

    // Update all elements with the class 'my-wins-count'
    const myBioElements = document.querySelectorAll('.my-bio');
    myBioElements.forEach(element => {
        element.innerText = myBio;
    });

}
