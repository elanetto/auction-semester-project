// Function to create an API key using a bearer token
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
            return response.json(); // Assuming the response is JSON
        })
        .then((result) => {
            console.log('API Key Response:', result); // Log the full response for debugging

            // Assuming the API key is at `result.data.key`
            const apiKey = result?.data?.key;
            if (!apiKey) {
                throw new Error('API key not found in response');
            }

            // Save the API key to localStorage
            localStorage.setItem('api_key', apiKey);
            console.log('API Key saved to localStorage:', apiKey);
            return apiKey;
        })
        .catch((error) => {
            console.error('Error fetching API key:', error);
            return null;
        });
}
