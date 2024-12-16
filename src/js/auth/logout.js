export const logoutButtonFunction = () => {
    
    const logoutBtn = document.getElementById('logout-button');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            console.log('Logout button clicked');
            localStorage.clear();
            sessionStorage.clear();

            if (window.location.pathname.endsWith('/index.html') || window.location.pathname === '/') {
                window.location.reload();
            } else {
                window.location.href = '../../index.html';
            }
        });
    }
};
