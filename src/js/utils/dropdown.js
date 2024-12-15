export function initializeDropdown() {
    const dropdownButtons = document.querySelectorAll('.dropdownButton'); // Use querySelectorAll for multiple elements
    const dropdownMenus = document.querySelectorAll('.dropdownMenuBottom'); // Use querySelectorAll for multiple menus

    if (!dropdownButtons.length || !dropdownMenus.length) {
        console.error('Dropdown buttons or menus not found.');
        return;
    }

    // Attach event listeners to each dropdown button
    dropdownButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const dropdownMenu = dropdownMenus[index]; // Match the menu to the button by index
            if (dropdownMenu) {
                dropdownMenu.classList.toggle('hidden');
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (event) => {
        dropdownMenus.forEach((menu, index) => {
            const button = dropdownButtons[index];
            if (!menu.contains(event.target) && !button.contains(event.target)) {
                menu.classList.add('hidden');
            }
        });
    });
}
