export function fetchLocalData() {
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    const avatar = localStorage.getItem('avatar');
    const banner = localStorage.getItem('banner');

    // Update username if the element exists and there's a value
    const usernameElement = document.querySelector('.username-from-local-storage');
    if (username && usernameElement) {
        usernameElement.textContent = username;
    }

    // Update email if the element exists and there's a value
    const emailElement = document.querySelector('.email-from-local-storage');
    if (email && emailElement) {
        emailElement.textContent = email;
    }

    // Update avatar if the element exists and there's a value
    const avatarElement = document.querySelector('.avatar-from-local-storage');
    if (avatar && avatarElement) {
        avatarElement.style.backgroundImage = `url(${avatar})`;
        avatarElement.style.backgroundSize = 'cover'; // Optional
        avatarElement.style.backgroundPosition = 'center'; // Optional
    }

    // Update banner if the element exists and there's a value
    const bannerElement = document.querySelector('.banner-from-local-storage');
    if (banner && bannerElement) {
        bannerElement.style.backgroundImage = `url(${banner})`;
        bannerElement.style.backgroundSize = 'cover'; // Optional
        bannerElement.style.backgroundPosition = 'center'; // Optional
    }
}




// export function fetchLocalData() {
//     const username = localStorage.getItem('username');
//     const email = localStorage.getItem('email');
//     const avatar = localStorage.getItem('avatar');
//     const banner = localStorage.getItem('banner');

//     // Check if values exist before adding them to the DOM
//     if (username) {
//         document.querySelector('.username-from-local-storage').textContent = username;
//     }
    
//     if (email) {
//         document.querySelector('.email-from-local-storage').textContent = email;
//     }
    
//     if (avatar) {
//         const avatarElement = document.querySelector('.avatar-from-local-storage');
//         avatarElement.style.backgroundImage = `url(${avatar})`;
//         avatarElement.style.backgroundSize = 'cover'; // Optional: to cover the entire div
//         avatarElement.style.backgroundPosition = 'center'; // Optional: to center the image
//     }
    
//     if (banner) {
//         const bannerElement = document.querySelector('.banner-from-local-storage');
//         bannerElement.style.backgroundImage = `url(${banner})`;
//         bannerElement.style.backgroundSize = 'cover'; // Optional: to cover the entire div
//         bannerElement.style.backgroundPosition = 'center'; // Optional: to center the image
//     }
// }