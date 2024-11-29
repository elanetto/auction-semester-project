export function fetchToken() {
    console.log("fetchToken.js is loaded");

    // Retrieve the raw token and username from localStorage
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    // Log values for debugging
    console.log("Raw token fetched:", token);
    console.log("Raw username fetched:", username);

    // Validate and clean the token
    if (!token) {
        console.error("Token is missing from localStorage.");
        return null;
    }
    const cleanedToken = token.replace(/['"]+/g, ''); // Remove any quotes

    if (!username) {
        console.error("Username is missing from localStorage.");
        return null;
    }
    const cleanedUsername = username.replace(/['"]+/g, '');

    console.log("Cleaned token:", cleanedToken);
    console.log("Cleaned username:", cleanedUsername);

    return { cleanedToken, cleanedUsername };
}
