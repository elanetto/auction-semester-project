import { register } from './auth/register.js';
import { login } from './auth/login.js';
import { getLoginFormElements, getRegisterFormElements } from './auth/formElements.js'; 
import { fetchLocalData } from './utils/fetchLocalData.js';
import { myAccountPage } from './auth/myaccount.js';
import { fetchToken } from './auth/fetchToken.js';
import { fetchApiKey } from './auth/fetchApiKey.js';
import { myListings } from './listing/view-my-listings.js';

document.addEventListener('DOMContentLoaded', function () {
    // Fetch form elements for login
    const loginElements = getLoginFormElements();
    login(loginElements);
    fetchLocalData();
    fetchToken();

    // My account page
    myAccountPage();
    fetchApiKey();
    myListings();

    // Fetch form elements for registration if the register form exists
    const registerElements = document.getElementById('register-form') ? getRegisterFormElements() : null;
    if (registerElements) {
        register(registerElements);
    }

    // fetch username from local storage when logged in
    const username = localStorage.getItem('username');

    // Exit early if the user is not logged in
    if (!username) {
        return;
    }

    // Clean up the username and ensure the DOM element exists
    const tidyName = username.replace(/['"]+/g, '');
    const loggedInUsernameElement = document.querySelector('.logged-in-username');

    if (loggedInUsernameElement) {
        loggedInUsernameElement.textContent = `Hello, ${tidyName}! You are currently logged in.`;
    }

    // Show elements that should be visible when the user is logged in
    const visibleElements = document.querySelectorAll('.visible-if-logged-in');
    visibleElements.forEach(element => {
        if (element) {
            element.style.display = 'block';
        }
    });
});
