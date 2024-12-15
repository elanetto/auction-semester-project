export function refresh() {
    const maxRefreshAttempts = 1;
    const refreshCountKey = "pageRefreshCount";

    let refreshCount = parseInt(localStorage.getItem(refreshCountKey)) || 0;

    if (refreshCount < maxRefreshAttempts) {
        
        localStorage.setItem(refreshCountKey, refreshCount + 1);

        location.reload();
    } else {
        localStorage.removeItem(refreshCountKey);
    }
}

