export function fetchApiKey() {

    const token = localStorage.getItem('token');

    if (!token) {
        console.error('No token found');
        return;
    }

    const cleanedToken = token.replace(/['"]+/g, '');

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${cleanedToken}`);

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
    };

    // Make the fetch call
    return fetch("https://v2.api.noroff.dev/auth/create-api-key", requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`API key request failed: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then((result) => {

            const apiKey = result?.data?.key;
            if (!apiKey) {
                throw new Error('API key not found in response');
            }

            localStorage.setItem('api_key', apiKey);
            return apiKey;
        })
        .catch((error) => {
            console.error('Error fetching API key:', error);
            return null;
        });
}