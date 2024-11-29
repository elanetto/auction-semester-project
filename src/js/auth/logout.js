export const logoutButtonFunction = () => {
    const logoutBtn = document.querySelector('.logout-button');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '../../index.html';
        });
    }
};