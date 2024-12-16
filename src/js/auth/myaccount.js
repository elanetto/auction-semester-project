import { changeProfilePicture } from "../../js/utils/avatarEdit.js";
import { changeBanner } from "../../js/utils/bannerEdit.js";

export const myAccountPage = () => {

    if (!document.body.classList.contains('my-account-page')) {
        return;
    }

    if (!sessionStorage.getItem('myAccountReloaded')) {
        sessionStorage.setItem('myAccountReloaded', 'true');
        location.reload();
        return;
    }

    if (document.getElementById('avatar-input') && document.getElementById('change-avatar-button')) {
        changeProfilePicture();
    }

    if (document.getElementById('banner-input') && document.getElementById('change-banner-button')) {
        changeBanner();
    }
};
