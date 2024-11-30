import { fetchApiKey } from "../../js/auth/fetchApiKey.js";
import { fetchToken } from "../../js/auth/fetchToken.js";

export function changeBanner() {
    console.log("Initializing Change Banner function...");

    const tokenDetails = fetchToken();
    if (!tokenDetails) {
        console.error("Failed to fetch token details.");
        return;
    }

    const { cleanedToken, cleanedUsername } = tokenDetails;
    console.log("Cleaned token:", cleanedToken);
    console.log("Cleaned username:", cleanedUsername);

    if (!cleanedToken || !cleanedUsername) {
        console.error("Token or username is missing.");
        return;
    }

    // Get input and button elements
    const bannerInput = document.getElementById('banner-input');
    const bannerButton = document.getElementById('change-banner-button');

    if (!bannerInput || !bannerButton) {
        console.error("Required input or button elements are missing.");
        return;
    }

    console.log("Banner input element found:", bannerInput);
    console.log("Change banner button found:", bannerButton);

    bannerButton.addEventListener('click', async (event) => {
        console.log("Change banner button clicked.");
        event.preventDefault();

        const newBannerUrl = bannerInput.value.trim();
        console.log("New banner URL entered:", newBannerUrl);

        if (!newBannerUrl || !isValidUrl(newBannerUrl)) {
            alert('Please enter a valid URL.');
            console.error("Invalid or empty URL:", newBannerUrl);
            return;
        }

        try {
            console.log("Fetching API key...");
            const apiKey = await fetchApiKey();

            if (!apiKey) {
                console.error("Failed to fetch API key.");
                alert('Unable to fetch API key.');
                return;
            }

            console.log("API key fetched:", apiKey);

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("X-Noroff-API-Key", apiKey);
            myHeaders.append("Authorization", `Bearer ${cleanedToken}`);
            console.log("Headers set:", myHeaders);

            const raw = JSON.stringify({
                "avatar": {
                    "url": newBannerUrl,
                    "alt": "Avatar"
                }
            });
            console.log("Request body prepared:", raw);

            const requestOptions = {
                method: "PUT",
                headers: myHeaders,
                body: raw,
                redirect: "follow",
            };
            console.log("Request options prepared:", requestOptions);

            console.log("Sending request to update avatar...");
            const response = await fetch(`https://v2.api.noroff.dev/social/profiles/${cleanedUsername}`, requestOptions);

            if (!response.ok) {
                console.error("Request failed:", response.status, response.statusText);
                throw new Error(`Failed to update profile picture: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            console.log("Response received:", result);

            // Save the new avatar URL to localStorage
            localStorage.setItem('banner', newBannerUrl);
            alert('Your profile banner has been updated!');
            console.log("Banner updated in localStorage. Reloading page...");
            location.reload(); // Reload the page
        } catch (error) {
            console.error('Error updating profile banner:', error);
            alert('An error occurred while updating your banner.');
        }
    });
}

// Helper function to validate URL
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}
