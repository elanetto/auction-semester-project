export function fetchToken() {

    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (!token) {
        return null;
    }
    const cleanedToken = token.replace(/['"]+/g, '');

    if (!username) {
        return null;
    }
    const cleanedUsername = username.replace(/['"]+/g, '');

    return { cleanedToken, cleanedUsername };
}
