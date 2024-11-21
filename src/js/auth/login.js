import { showPassword } from '../utils/showPassword.js';
import { API_AUTH_LOGIN } from '../constants.js';
import { getLoginFormElements } from '../auth/formElements.js';

export function login() {
    // Get form elements after the DOM is loaded
    const { email, password, showPasswordBtn, errorMessage, loginBtn } = getLoginFormElements();

    // Ensure all required elements are found
    if (!email || !loginBtn || !errorMessage || !password || !showPasswordBtn) {
        console.error('One or more required elements are missing.');
        return;
    }

    // Set initial state for show password icons
    const eyeSlashIcon = showPasswordBtn.querySelector('.fa-eye-slash');
    const eyeIcon = showPasswordBtn.querySelector('.fa-eye');

    // Ensure the icons are set correctly
    if (!eyeSlashIcon || !eyeIcon) {
        console.error('Eye icons are not found.');
        return;
    }

    // Set initial state based on the password input type
    function setInitialIconState() {
        if (password.type === "password") {
            eyeSlashIcon.classList.add('hide'); // Hide eye-slash icon
            eyeIcon.classList.remove('hide'); // Show eye icon
        } else {
            eyeSlashIcon.classList.remove('hide'); // Show eye-slash icon
            eyeIcon.classList.add('hide'); // Hide eye icon
        }
    }
    setInitialIconState(); // Call the function to set the initial state

    // Remove any existing event listeners to prevent duplicates
    showPasswordBtn.removeEventListener("click", showPassword);
    showPasswordBtn.addEventListener("click", showPassword); // Call the showPassword function directly

    loginBtn.addEventListener('click', async function(event) {
        event.preventDefault();

        const emailTrim = email.value.trim();
        const passwordTrim = password.value.trim();

        if (!validateEmail(emailTrim)) {
            errorMessage.textContent = 'Email not valid';
            errorMessage.style.display = 'block';
            console.log('The email is not valid');
            return;
        }

        if (passwordTrim.length === 0) {
            errorMessage.textContent = 'Please enter a password';
            errorMessage.style.display = 'block';
            console.log('Please enter a password');
            return;
        }

        const user = {
            email: emailTrim,
            password: passwordTrim
        };

        try {
            const response = await fetch(API_AUTH_LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

            const data = await response.json();
            console.log(data); // Log response for debugging

            if (response.ok) {
                // Handle successful login
                // Redirect to myaccount.html
                window.location.href = 'myaccount.html'; // Redirect to myaccount page
            } else {
                errorMessage.textContent = data.errors[0]?.message || 'Wrong username or password';
                console.log('Wrong username or password');
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('An error occurred with your login request.', error);
            errorMessage.textContent = 'An error occurred with your login request.';
            errorMessage.style.display = 'block';
        }
    });
}

// Function to validate email format
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}