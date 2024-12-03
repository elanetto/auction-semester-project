import { changeProfilePicture } from "../../js/utils/avatarEdit.js";
import { changeBanner } from "../../js/utils/bannerEdit.js";

export const myAccountPage = () => {
    // Check if we are on the My Account page using a unique identifier (e.g., body class or URL)
    if (!document.body.classList.contains('my-account-page')) {
        // Exit early if we are not on the My Account page
        return;
    }

    // Check if the page has already reloaded
    if (!sessionStorage.getItem('myAccountReloaded')) {
        sessionStorage.setItem('myAccountReloaded', 'true');
        location.reload();
        return;
    }

    // Safely run changeProfilePicture only if elements exist
    if (document.getElementById('avatar-input') && document.getElementById('change-avatar-button')) {
        changeProfilePicture();
    }

    // Safely run changeBanner only if elements exist
    if (document.getElementById('banner-input') && document.getElementById('change-banner-button')) {
        changeBanner();
    }
};
