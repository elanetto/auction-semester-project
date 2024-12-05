import { showPassword } from '../utils/showPassword.js';
import { API_AUTH_LOGIN } from '../constants.js';
import { getLoginFormElements } from '../auth/formElements.js';

export function login() {
    const { email, password, showPasswordBtn, errorMessage, loginBtn } = getLoginFormElements();

    if (!email || !loginBtn || !errorMessage || !password || !showPasswordBtn) {
        return;
    }

    const eyeSlashIcon = showPasswordBtn.querySelector('.fa-eye-slash');
    const eyeIcon = showPasswordBtn.querySelector('.fa-eye');

    if (!eyeSlashIcon || !eyeIcon) {
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
            return;
        }

        if (passwordTrim.length === 0) {
            errorMessage.textContent = 'Please enter a password';
            errorMessage.style.display = 'block';
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

            if (response.ok) {

                localStorage.setItem('username', data.data.name);
                localStorage.setItem('email', data.data.email);
                localStorage.setItem('avatar', data.data.avatar.url);
                localStorage.setItem('banner', data.data.banner.url);
                localStorage.setItem('token', data.data.accessToken);
                
                window.location.href = '../../account/myaccount/';

            } else {
                const errorMessageText = data.errors?.[0]?.message || 'An error occurred during login.';
                errorMessage.textContent = errorMessageText;
                errorMessage.style.display = 'block';
            }
        } catch (error) {
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