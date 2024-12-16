import { showPassword } from "../utils/showPassword.js";
import { fetchProfileData } from "../auth/myProfile.js";

export function initializeLogin() {

    if (!document.body.classList.contains("login-page")) {
        return;
    }

    const loginForm = document.querySelector("#login-form");
    const loginError = document.querySelector("#login-error");
    const showPasswordButton = document.querySelector(".eye-container.show-password");

    if (showPasswordButton) {
        showPasswordButton.addEventListener("click", showPassword);
    } else {
        console.error("Show password button not found.");
    }

    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            await handleLogin(loginError);
        });
    } else {
        console.error("Login form not found.");
    }
}

async function handleLogin(loginError) {
    const emailInput = document.querySelector("#login-email");
    const passwordInput = document.querySelector("#login-password");

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!validateEmail(email)) {
        loginError.textContent = "Invalid email format.";
        loginError.style.display = "block";
        return;
    }

    if (!password) {
        loginError.textContent = "Password cannot be empty.";
        loginError.style.display = "block";
        return;
    }

    loginError.textContent = "Logging in...";
    loginError.style.color = "blue";
    loginError.style.display = "block";

    try {
        const response = await fetch("https://v2.api.noroff.dev/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            const { name, email, avatar, banner, accessToken } = data.data;

            localStorage.setItem("username", name);
            localStorage.setItem("email", email);
            localStorage.setItem("token", accessToken);
            localStorage.setItem("avatar", avatar?.url || "");
            localStorage.setItem("banner", banner?.url || "");
            localStorage.setItem("bio", data.data.bio || "");

            const profileData = await fetchProfileData();
            if (profileData) {
                console.log("Profile data fetched successfully.");
            } else {
                console.error("Failed to fetch profile data.");
            }

            sessionStorage.setItem("refreshCounter", "0");

            loginError.textContent = "Login successful!";
            loginError.style.color = "green";

            window.location.href = '../../account/myaccount/';
        } else {
            const error = data.errors?.[0]?.message || "Login failed. Please try again.";
            loginError.textContent = error;
            loginError.style.color = "red";
        }
    } catch (error) {
        console.error("Login error:", error);
        loginError.textContent = "An error occurred. Please try again.";
        loginError.style.color = "red";
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
