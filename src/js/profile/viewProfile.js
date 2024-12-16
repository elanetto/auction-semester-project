export async function viewProfile() {

    if (!document.body.classList.contains("view-profile-page")) {
        return;
    }

    const username = getUsernameFromURL();
    const token = localStorage.getItem('token');
    const apiKey = localStorage.getItem('api_key');

    console.log('username: ', username);
    console.log('token: ', token);
    console.log('apiKey: ', apiKey);

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

        const profileData = {
            name: result.data.name,
            email: result.data.email,
            avatar: result.data.avatar.url,
            banner: result.data.banner.url,
            credits: result.data.credits,
            listingsCount: result.data._count.listings,
            winsCount: result.data._count.wins
        };

        localStorage.setItem('credits', result.data.credits);
        localStorage.setItem('listingsCount', result.data._count.listings);
        localStorage.setItem('winsCount', result.data._count.wins);
        localStorage.setItem('avatar', result.data.avatar.url);
        localStorage.setItem('banner', result.data.banner.url);

        return profileData;
    } catch (error) {
        console.error('Error fetching profile data:', error);
        return null;
    }
}