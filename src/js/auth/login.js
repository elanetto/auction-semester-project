import { showPassword } from '../utils/showPassword.js';
import { API_AUTH_LOGIN } from '../constants.js';
import { getLoginFormElements } from '../auth/formElements.js';

export function login() {
    const { email, password, showPasswordBtn, errorMessage, loginBtn } = getLoginFormElements();

    if (!email || !loginBtn || !errorMessage || !password || !showPasswordBtn) {
        console.error('Disregard this if you are not on the login-page: One or more required elements are missing.');
        return;
    }

    const eyeSlashIcon = showPasswordBtn.querySelector('.fa-eye-slash');
    const eyeIcon = showPasswordBtn.querySelector('.fa-eye');

    if (!eyeSlashIcon || !eyeIcon) {
        console.error('Eye icons are not found.');
        return;
    }

    function setInitialIconState() {
        if (password.type === "password") {
            eyeSlashIcon.classList.add('hide');
            eyeIcon.classList.remove('hide');
        } else {
            eyeSlashIcon.classList.remove('hide');
            eyeIcon.classList.add('hide');
        }
    }
    setInitialIconState();

    showPasswordBtn.removeEventListener("click", showPassword);
    showPasswordBtn.addEventListener("click", showPassword);

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

            console.log('Response Status:', response.status);
            const data = await response.json();
            console.log('Response Data:', data);

            if (response.ok) {
                localStorage.setItem('username', data.data.name);
                localStorage.setItem('email', data.data.email);
                localStorage.setItem('avatar', data.data.avatar.url);
                localStorage.setItem('banner', data.data.banner.url);
                
                window.location.href = 'myaccount.html';

            } else {
                const errorMessageText = data.errors?.[0]?.message || 'An error occurred during login.';
                console.error('Login error:', errorMessageText);
                errorMessage.textContent = errorMessageText;
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