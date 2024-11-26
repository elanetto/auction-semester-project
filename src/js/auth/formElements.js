export const getLoginFormElements = () => {
  const email = document.getElementById('login-email');
  const password = document.getElementById('login-password');
  const showPasswordBtn = document.querySelector('.show-password');
  const errorMessage = document.getElementById('login-error');
  const loginBtn = document.getElementById('login-btn');

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
  const showPasswordBtn = document.querySelector('.show-password');
  const errorMessage = document.getElementById('error-message');
  const successMessage = document.getElementById('success-message');
  const registerBtn = document.getElementById('register-btn');

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