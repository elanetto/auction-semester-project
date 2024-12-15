export function requireAuthentication(redirectUrl = "/account/login/") {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("You need to be logged in to view this listing. Please login or register.");
        window.location.href = redirectUrl;
        return false;
    }
    return true;
}
