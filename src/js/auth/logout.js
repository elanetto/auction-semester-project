export const logoutButtonFunction = () => {
    
    const logoutBtn = document.getElementById('logout-button');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            console.log('Logout button clicked');
            localStorage.clear();
            sessionStorage.clear();

            // Check if the user is on the index page
            if (window.location.pathname.endsWith('/index.html') || window.location.pathname === '/') {
                // Simply reload the page if already on the index page
                window.location.reload();
            } else {
                // Redirect to the index page
                window.location.href = '../../index.html';
            }
        });
    }
};
