export function showPassword(event) {
    const showPasswordBtn = event.currentTarget;
    const passwordInput = showPasswordBtn.previousElementSibling;

    console.log("Show Password Button Clicked:", showPasswordBtn);
    console.log("Password Input Element:", passwordInput);

    if (passwordInput) {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            showPasswordBtn.querySelector(".fa-eye-slash").classList.add("hide");
            showPasswordBtn.querySelector(".fa-eye").classList.remove("hide");
        } else {
            passwordInput.type = "password";
            showPasswordBtn.querySelector(".fa-eye-slash").classList.remove("hide");
            showPasswordBtn.querySelector(".fa-eye").classList.add("hide");
        }
    } else {
        console.error("Password input not found.");
    }
}
