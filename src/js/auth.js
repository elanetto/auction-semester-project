import { register } from './auth/register.js';
import { initializeLogin } from './auth/login.js';
import { getLoginFormElements, getRegisterFormElements } from './auth/formElements.js'; 
import { fetchLocalData } from './utils/fetchLocalData.js';
import { myAccountPage } from './auth/myaccount.js';
import { fetchToken } from './auth/fetchToken.js';
import { fetchApiKey } from './auth/fetchApiKey.js';
import { myListings } from './listing/view-my-listings.js';
import { fetchProfileData } from './auth/myProfile.js';
import { initializeMyAccount } from './auth/initMyAccount.js';

document.addEventListener('DOMContentLoaded', async function () {

    const loginElements = getLoginFormElements();

    initializeLogin();

    initializeMyAccount();

    fetchLocalData();

    fetchProfileData();

    // Fetch form elements for registration if the register form exists
    const registerElements = document.getElementById('register-form') ? getRegisterFormElements() : null;
    if (registerElements) {
        register(registerElements);
    }

    // Fetch username from local storage when logged in
    const username = localStorage.getItem('username');

    // Exit early if the user is not logged in
    if (!username) {
        return;
    }

    // Ensure the DOM element exists and clean up the username
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

    // Initialize the "My Account" page
    myAccountPage();

    // Use Promises to ensure fetchToken and fetchApiKey complete before calling myListings
    try {
        await Promise.all([fetchToken(), fetchApiKey()]);
        myListings(); // Call myListings only after the promises resolve
    } catch (error) {
        console.error('Error fetching required data:', error);
    }
});
