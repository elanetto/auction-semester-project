// src/main.js
const routes = {
    '/': () => {
        document.getElementById('app').innerHTML = '<h1>Home Page</h1>';
    },
    '/profile': (username) => {
        document.getElementById('app').innerHTML = `<h1>Profile Page for ${username}</h1>`;
    },
    // Add more routes as needed
};

const router = () => {
    const path = window.location.pathname;
    const username = path.split('/')[2]; // Get the username from the URL
    const route = routes[path] || routes['/']; // Default to home if route not found
    route(username);
};

window.onpopstate = router; // Handle back/forward navigation
window.onload = router; // Initial load

// Example of navigating to a profile
document.getElementById('goToProfile').addEventListener('click', () => {
    const username = 'AnetteTherese'; // Replace with dynamic username
    window.history.pushState({}, '', `/profile/${username}`);
    router();
});