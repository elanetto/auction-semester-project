export async function fetchProfileData() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const apiKey = localStorage.getItem('api_key');

    if (!token || !username || !apiKey) {
        console.error("Missing authentication data.");
        return null;
    }

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("X-Noroff-API-Key", apiKey);

    try {
        const response = await fetch(`https://v2.api.noroff.dev/auction/profiles/${username}`, {
            method: "GET",
            headers: myHeaders,
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch profile data: ${response.status}`);
        }

        const result = await response.json();

        // Update localStorage with fetched data
        localStorage.setItem('credits', result.data.credits);
        localStorage.setItem('listingsCount', result.data._count.listings);
        localStorage.setItem('winsCount', result.data._count.wins);

        // Update the DOM with fetched data
        const creditsElement = document.querySelector('.my-credits');
        if (creditsElement) {
            creditsElement.textContent = result.data.credits;
        }

        return result.data; // Return full profile data for further use
    } catch (error) {
        console.error("Error fetching profile data:", error);
        return null;
    }
}
