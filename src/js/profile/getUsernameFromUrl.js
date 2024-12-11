function getUsernameFromURL() {
    const urlParts = window.location.pathname.split('/');
    return urlParts[urlParts.length - 1]; // Assuming the username is the last part of the URL
}