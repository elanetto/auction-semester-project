export function fetchLocalData() {
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    const avatar = localStorage.getItem('avatar');
    const banner = localStorage.getItem('banner');
    const credits = localStorage.getItem('credits');
    const listingsCount = localStorage.getItem('listingsCount');
    const winsCount = localStorage.getItem('winsCount');
    const myBio = localStorage.getItem('bio');

    const usernameElements = document.querySelectorAll('.username-from-local-storage');
    usernameElements.forEach(element => {
        if (username) {
            element.textContent = username;
        }
    });

    const emailElements = document.querySelectorAll('.email-from-local-storage');
    emailElements.forEach(element => {
        if (email) {
            element.textContent = email;
        }
    });

    const avatarElement = document.querySelector('.avatar-from-local-storage');
    if (avatar && avatarElement) {
        avatarElement.src = avatar;
    }

    const myAvatar = document.querySelectorAll('.my-avatar');
    myAvatar.forEach(element => {
        if (avatar) {
            element.src = avatar;
        }
    });

    const bannerElement = document.querySelector('.banner-from-local-storage');
    if (banner && bannerElement) {
        bannerElement.src = banner;
    }

    const creditElements = document.querySelectorAll('.my-credits');
    creditElements.forEach(element => {
        element.innerText = credits;
    });

    const listingsCountElements = document.querySelectorAll('.my-listings-count');
    listingsCountElements.forEach(element => {
        element.innerText = listingsCount;
    });

    const winsCountElements = document.querySelectorAll('.my-wins-count');
    winsCountElements.forEach(element => {
        element.innerText = winsCount;
    });

    const myBioElements = document.querySelectorAll('.my-bio');
    myBioElements.forEach(element => {
        element.innerText = myBio;
    });

}
