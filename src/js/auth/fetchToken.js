export function fetchToken() {

    // Retrieve the raw token and username from localStorage
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    // Validate and clean the token
    if (!token) {
        return null;
    }
    const cleanedToken = token.replace(/['"]+/g, ''); // Remove any quotes

    if (!username) {
        return null;
    }
    const cleanedUsername = username.replace(/['"]+/g, '');

    return { cleanedToken, cleanedUsername };
}
