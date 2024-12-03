import { fetchApiKey } from "../../js/auth/fetchApiKey.js";
import { fetchToken } from "../../js/auth/fetchToken.js";

export function changeProfilePicture() {
    const tokenDetails = fetchToken();

    // Check if tokenDetails is valid before destructuring
    if (!tokenDetails) {
        console.warn("Token details are not available. Skipping profile picture setup.");
        return;
    }

    const { cleanedToken, cleanedUsername } = tokenDetails;

    // Get input and button elements
    const profilePictureInput = document.getElementById('avatar-input');
    const profilePictureButton = document.getElementById('change-avatar-button');

    // Check if the required DOM elements are present
    if (!profilePictureInput || !profilePictureButton) {
        console.warn("Profile picture input or button not found. Skipping setup.");
        return;
    }

    profilePictureButton.addEventListener('click', async (event) => {
        event.preventDefault();

        const newAvatarUrl = profilePictureInput.value.trim();

        if (!newAvatarUrl || !isValidUrl(newAvatarUrl)) {
            alert('Please enter a valid URL.');
            return;
        }

        try {
            const apiKey = await fetchApiKey();

            if (!apiKey) {
                alert('Unable to fetch API key.');
                return;
            }

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("X-Noroff-API-Key", apiKey);
            myHeaders.append("Authorization", `Bearer ${cleanedToken}`);

            const raw = JSON.stringify({
                "avatar": {
                    "url": newAvatarUrl,
                    "alt": "Avatar"
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

            // Save the new avatar URL to localStorage
            localStorage.setItem('avatar', newAvatarUrl);
            alert('Your profile picture has been updated!');
            location.reload(); // Reload the page
        } catch (error) {
            console.error('An error occurred while updating the profile picture:', error);
            alert('An error occurred while updating your profile picture.');
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
