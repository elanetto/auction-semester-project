import { showPassword } from '../utils/showPassword.js';
import { API_AUTH_REGISTER } from '../constants.js';
import { getRegisterFormElements } from '../auth/formElements.js'; // Corrected import

export function register() {
    
    const { username, email, password, showPasswordBtn, errorMessage, successMessage, registerBtn } = getRegisterFormElements(); // Use the correct function

    if (!showPasswordBtn || !password) {
        console.error('Required elements for show-password functionality are missing.');
        return;
    }

    showPasswordBtn.addEventListener("click", showPassword);

    registerBtn.addEventListener('click', async function (event) {
        event.preventDefault();

        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';

        // Input validation
        if (username.value.length < 2 || email.value.length < 2 || password.value.length < 2) {
            errorMessage.style.display = 'block';
            errorMessage.innerHTML = 'All fields must be filled in.';
            console.log('All fields must be filled in.');
            return;
        }

        if (password.value.length < 9) {
            errorMessage.innerHTML = 'The password must contain more than 9 characters.';
            errorMessage.style.display = 'block';
            console.log('The password must contain more than 9 characters.');
            return;
        }

        if (password.value.length > 20) {
            errorMessage.innerHTML = 'The password must contain less than 20 characters.';
            errorMessage.style.display = 'block';
            console.log('The password must contain less than 20 characters.');
            return;
        }

        if (!email.value.includes('@stud.noroff.no')) {
            errorMessage.innerHTML = 'The email must end with @stud.noroff.no.';
            errorMessage.style.display = 'block';
            console.log('The email must end with @stud.noroff.no.');
            return;
        }

        if (!/^[a-zA-Z0-9]+$/.test(username.value)) {
            errorMessage.innerHTML = 'The username must only contain letters and numbers.';
            errorMessage.style.display = 'block';
            console.log('The username must only contain letters and numbers.');
            return;
        }

        const user = {
            name: username.value,
            email: email.value,
            bio: "Default bio",
            avatar: {
                url: 'https://github.com/elanetto/FED1-PE1-elanetto/blob/main/assets/images/user/avatar-user-default.png?raw=true',
                alt: "User  Avatar"
            },
            banner: {
                url: 'https://github.com/elanetto/FED1-PE1-elanetto/blob/main/assets/images/200kb-images/kewater_view-01.jpg?raw=true',
                alt: "User  Banner"
            },
            venueManager: true,
            password: password.value
        };

        try {
            const response = await fetch(API_AUTH_REGISTER, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

            const data = await response.json();
            console.log(data);

            if (data.errors) {
                console.log(data.errors);
                errorMessage.style.display = 'block';
                errorMessage.innerHTML = data.errors.map(error => error.message).join('<br>');
                console.log(data.errors);
                return;
            }

            if (response.ok) {
                successMessage.style.display = 'block';
                console.log('User registered successfully.');

                alert('User registered successfully. You will be redirected to the login page.');

                setTimeout(() => {
                    window.location.href = '../login/';
                }, 2000);
            }

        } catch (error) {
            console.log(error);
            errorMessage.style.display = 'block';
            errorMessage.innerHTML = 'Something went wrong. Please try again.';
        }

        document.querySelector('.register-form').reset();
    });
};