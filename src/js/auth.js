import { register } from './auth/register.js';
import { login } from './auth/login.js';
import { getLoginFormElements, getRegisterFormElements } from './auth/formElements.js'; 
import { logoutButtonFunction } from './auth/logout.js';
import { fetchLocalData } from './utils/fetchLocalData.js';
import { myAccountPage } from './auth/myaccount.js';
import { fetchToken } from './auth/fetchToken.js';

document.addEventListener('DOMContentLoaded', function () {
    // Fetch form elements for login
    const loginElements = getLoginFormElements();
    login(loginElements);
    logoutButtonFunction();
    fetchLocalData();
    fetchToken();

    // My account page
    myAccountPage();

    // Fetch form elements for registration if the register form exists
    const registerElements = document.getElementById('register-form') ? getRegisterFormElements() : null;
    if (registerElements) {
        register(registerElements);
    }

    // fetch username from local storage when logged in
    const username = localStorage.getItem('username');

    if (username) {
        const tidyName = username.replace(/['"]+/g, '');
        document.querySelector('.logged-in-username').textContent = 'Hello, ' + tidyName + '! ' + 'You are currently logged in.';
        
        // Show elements that should be visible when logged in
        const visibleElements = document.querySelectorAll('.visible-if-logged-in');
        visibleElements.forEach(element => {
            element.style.display = 'block';
        });
    }
});
