export const getLoginFormElements = () => {
  const email = document.getElementById('login-email');
  const password = document.getElementById('login-password');
  const showPasswordBtn = document.querySelector('.eye-container.show-password'); // Ensure the correct selector
  const errorMessage = document.getElementById('login-error');
  const loginBtn = document.getElementById('login-btn');

  // Log the elements for debugging
  console.log("Email:", email);
  console.log("Password:", password);
  console.log("Show Password Button:", showPasswordBtn);
  console.log("Error Message:", errorMessage);
  console.log("Login Button:", loginBtn);

  // Check if any required elements are missing
  if (!email || !password || !showPasswordBtn || !errorMessage || !loginBtn) {
    console.error("One or more required elements are missing in the login form.");
  }

  return {
    email,
    password,
    showPasswordBtn,
    errorMessage,
    loginBtn,
  };
};

export const getRegisterFormElements = () => {
  const username = document.getElementById('username');
  const email = document.getElementById('register-email');
  const password = document.getElementById('register-password');
  const showPasswordBtn = document.querySelector('.eye-container.show-password'); // Ensure the correct selector
  const errorMessage = document.getElementById('error-message');
  const successMessage = document.getElementById('success-message');
  const registerBtn = document.getElementById('register-btn');

  // Log the elements for debugging
  console.log("Username:", username);
  console.log("Email:", email);
  console.log("Password:", password);
  console.log("Show Password Button:", showPasswordBtn);
  console.log("Error Message:", errorMessage);
  console.log("Success Message:", successMessage);
  console.log("Register Button:", registerBtn);

  // Check if any required elements are missing
  if (!username || !email || !password || !showPasswordBtn || !errorMessage || !registerBtn) {
    console.error("One or more required elements are missing in the registration form.");
  }

  return {
    username,
    email,
    password,
    showPasswordBtn,
    errorMessage,
    successMessage,
    registerBtn,
  };
};