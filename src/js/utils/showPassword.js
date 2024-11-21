export function showPassword(event) {
    const showPasswordBtn = event.currentTarget; // Get the button that was clicked
    const passwordInput = showPasswordBtn.previousElementSibling; // Get the password input

    console.log('Show Password Button Clicked:', showPasswordBtn);
    console.log('Password Input Element:', passwordInput);

    // Toggle the input type between 'password' and 'text'
    if (passwordInput) { // Ensure the passwordInput exists
        if (passwordInput.type === "password") {
            passwordInput.type = "text"; // Show password
            showPasswordBtn.querySelector('.fa-eye-slash').classList.remove('hide'); // Show eye-slash icon
            showPasswordBtn.querySelector('.fa-eye').classList.add('hide'); // Hide eye icon
        } else {
            passwordInput.type = "password"; // Hide password
            showPasswordBtn.querySelector('.fa-eye-slash').classList.add('hide'); // Hide eye-slash icon
            showPasswordBtn.querySelector('.fa-eye').classList.remove('hide'); // Show eye icon
        }
    } else {
        console.error('Password input not found.');
    }
}