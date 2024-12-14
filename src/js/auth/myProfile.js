export async function fetchProfileData() {
    
    // Check if the current page is the My Account page
    if (!document.body.classList.contains("my-account-page")) {
        return;
    }
    
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const apiKey = localStorage.getItem('api_key');

    if (!token) {
        console.error('No token found. User may not be logged in.');
        return null;
    }

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("X-Noroff-API-Key", apiKey);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    try {
        const response = await fetch(`https://v2.api.noroff.dev/auction/profiles/${username}`, requestOptions);
        if (!response.ok) {
            throw new Error(`Failed to fetch profile data: ${response.status} ${response.statusText}`);
        }
        const result = await response.json();

        // Extract the desired data
        const profileData = {
            name: result.data.name,
            email: result.data.email,
            credits: result.data.credits,
            listingsCount: result.data._count.listings,
            winsCount: result.data._count.wins
        };

        localStorage.setItem('credits', result.data.credits);
        localStorage.setItem('listingsCount', result.data._count.listings);
        localStorage.setItem('winsCount', result.data._count.wins);

        return profileData; // Return the profile data
        
    } catch (error) {
        console.error('Error fetching profile data:', error);
        return null;
    }
}