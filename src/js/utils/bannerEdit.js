import { fetchApiKey } from "../../js/auth/fetchApiKey.js";
import { fetchToken } from "../../js/auth/fetchToken.js";

export function changeBanner() {

    const tokenDetails = fetchToken();
    if (!tokenDetails) {
        console.error("Failed to fetch token details.");
        return;
    }

    const { cleanedToken, cleanedUsername } = tokenDetails;

    if (!cleanedToken || !cleanedUsername) {
        console.error("Token or username is missing.");
        return;
    }

    const bannerInput = document.getElementById('banner-input');
    const bannerButton = document.getElementById('change-banner-button');

    if (!bannerInput || !bannerButton) {
        console.error("Required input or button elements are missing.");
        return;
    }

    bannerButton.addEventListener('click', async (event) => {
        event.preventDefault();

        const newBannerUrl = bannerInput.value.trim();

        if (!newBannerUrl || !isValidUrl(newBannerUrl)) {
            alert('Please enter a valid URL.');
            console.error("Invalid or empty URL:", newBannerUrl);
            return;
        }

        try {
            const apiKey = await fetchApiKey();

            if (!apiKey) {
                console.error("Failed to fetch API key.");
                alert('Unable to fetch API key.');
                return;
            }

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("X-Noroff-API-Key", apiKey);
            myHeaders.append("Authorization", `Bearer ${cleanedToken}`);

            const raw = JSON.stringify({
                "banner": {
                    "url": newBannerUrl,
                    "alt": "banner"
                }
            });

            const requestOptions = {
                method: "PUT",
                headers: myHeaders,
                body: raw,
                redirect: "follow",
            };

            const response = await fetch(`https://v2.api.noroff.dev/social/profiles/${cleanedUsername}`, requestOptions);

            if (!response.ok) {
                console.error("Request failed:", response.status, response.statusText);
                throw new Error(`Failed to update profile picture: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();

            localStorage.setItem('banner', newBannerUrl);
            alert('Your profile banner has been updated!');
            location.reload();
        } catch (error) {
            console.error('Error updating profile banner:', error);
            alert('An error occurred while updating your banner.');
        }
    });
}

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}
