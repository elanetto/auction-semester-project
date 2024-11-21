import { register } from './auth/register.js';
import { login } from './auth/login.js';
import { getLoginFormElements, getRegisterFormElements } from './auth/formElements.js'; 

document.addEventListener('DOMContentLoaded', function () {
    // Fetch form elements for login
    const loginElements = getLoginFormElements();
    login(loginElements);

    // Fetch form elements for registration if the register form exists
    const registerElements = document.getElementById('register-form') ? getRegisterFormElements() : null;
    if (registerElements) {
        register(registerElements);
    } else {
        console.warn("Registration form not found because you are not on the Register.html page.");
    }
});