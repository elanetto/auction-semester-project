import { logoutButtonFunction } from './auth/logout.js';

document.addEventListener('DOMContentLoaded', function () {
    logoutButtonFunction();
});

// fetch username from local storage when logged in
const username = localStorage.getItem('username');
// const tidyName = username.replace(/['"]+/g, '');

if (username) {
    const tidyName = username.replace(/['"]+/g, '');
    document.querySelector('.logged-in-username').textContent = 'Hello, ' + tidyName + '! ' + 'You are currently logged in.';
    document.querySelector('.visible-link-if-logged-in').style.display = 'block';
}

if (username) {
    document.querySelector('.visible-link-if-logged-in').style.display = 'block';
}