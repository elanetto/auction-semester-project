export function initializeDropdown() {
    const dropdownButtons = document.querySelectorAll('.dropdownButton'); 
    const dropdownMenus = document.querySelectorAll('.dropdownMenuBottom');

    if (!dropdownButtons.length || !dropdownMenus.length) {
        console.error('Dropdown buttons or menus not found.');
        return;
    }

    dropdownButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const dropdownMenu = dropdownMenus[index];
            if (dropdownMenu) {
                dropdownMenu.classList.toggle('hidden');
            }
        });
    });

    document.addEventListener('click', (event) => {
        dropdownMenus.forEach((menu, index) => {
            const button = dropdownButtons[index];
            if (!menu.contains(event.target) && !button.contains(event.target)) {
                menu.classList.add('hidden');
            }
        });
    });
}
