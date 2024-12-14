export function initializeDropdown() {
    const dropdownButton = document.getElementById('dropdownButton');
    const dropdownMenu = document.getElementById('dropdownMenuBottom');

    if (!dropdownButton || !dropdownMenu) {
        console.error('Dropdown button or menu not found.');
        return;
    }

    dropdownButton.addEventListener('click', () => {
        dropdownMenu.classList.toggle('hidden');
    });

    // Optional: Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
        if (!dropdownMenu.contains(event.target) && !dropdownButton.contains(event.target)) {
            dropdownMenu.classList.add('hidden');
        }
    });
}
