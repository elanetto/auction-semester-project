import { fetchApiKey } from "../../js/auth/fetchApiKey.js";
import { fetchToken } from "../../js/auth/fetchToken.js";

export function changeProfilePicture() {
    console.log("Initializing changeProfilePicture function...");

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
    const profilePictureInput = document.getElementById('avatar-input');
    const profilePictureButton = document.getElementById('change-avatar-button');

    if (!profilePictureInput || !profilePictureButton) {
        console.error("Required input or button elements are missing.");
        return;
    }

    console.log("Avatar input element found:", profilePictureInput);
    console.log("Change avatar button found:", profilePictureButton);

    profilePictureButton.addEventListener('click', async (event) => {
        console.log("Change avatar button clicked.");
        event.preventDefault();

        const newAvatarUrl = profilePictureInput.value.trim();
        console.log("New avatar URL entered:", newAvatarUrl);

        if (!newAvatarUrl || !isValidUrl(newAvatarUrl)) {
            alert('Please enter a valid URL.');
            console.error("Invalid or empty URL:", newAvatarUrl);
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
                    "url": newAvatarUrl,
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
            localStorage.setItem('avatar', newAvatarUrl);
            alert('Your profile picture has been updated!');
            console.log("Avatar updated in localStorage. Reloading page...");
            location.reload(); // Reload the page
        } catch (error) {
            console.error('Error updating profile picture:', error);
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
