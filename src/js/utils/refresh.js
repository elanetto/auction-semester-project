export function refresh() {

    if (!document.body.classList.contains("my-account-page")) {
        return;
    }

    const maxRefreshAttempts = 3;
    const refreshCountKey = "pageRefreshCount";
    const freshTokenKey = "fresh";
    const refreshDelay = 1000;

    if (localStorage.getItem(freshTokenKey)) {
        return;
    }

    let refreshCount = parseInt(localStorage.getItem(refreshCountKey)) || 0;

    if (refreshCount < maxRefreshAttempts) {
        refreshCount++;
        localStorage.setItem(refreshCountKey, refreshCount);

        console.log(`Waiting ${refreshDelay / 1000} seconds before refreshing... (${refreshCount}/${maxRefreshAttempts})`);
        setTimeout(() => {
            location.reload();
        }, refreshDelay);
    } else {
        console.log('Maximum refresh attempts reached. Setting "fresh" in localStorage.');
        localStorage.setItem(freshTokenKey, "true");
        localStorage.removeItem(refreshCountKey);
    }
}