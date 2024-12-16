function getUsernameFromURL() {
    const urlParts = window.location.pathname.split('/');
    return urlParts[urlParts.length - 1];
}