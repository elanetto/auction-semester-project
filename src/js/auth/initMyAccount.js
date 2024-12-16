import { fetchProfileData } from "./myProfile.js";
import { renderProfileData } from "../profile/renderProfileData.js";

export async function initializeMyAccount() {
    document.addEventListener("DOMContentLoaded", async () => {
    
        await ensureProfileDataIsLoaded();

        renderProfileData();
    });
}

async function ensureProfileDataIsLoaded() {
    const maxRetries = 5;
    let retries = 0;

    while (retries < maxRetries) {
        const credits = localStorage.getItem("credits");
        const listingsCount = localStorage.getItem("listingsCount");
        const winsCount = localStorage.getItem("winsCount");

        if (credits && listingsCount && winsCount) {
            return;
        }

        console.log(`Retrying to fetch profile data (${retries + 1}/${maxRetries})...`);
        await fetchProfileData();

        retries++;
        await delay(500);
    }

    console.error("Failed to load profile data after multiple attempts.");
}

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
