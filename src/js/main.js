import { logoutButtonFunction } from './auth/logout.js';
import { createNewListing } from '../../src/js/listing/create-new-listing.js';
// import { displayListing } from '../js/listing/displayListing.js';
import { toggleDropdown } from '../js/utils/dropdown.js';

document.addEventListener('DOMContentLoaded', function () {
    // Initialize other functions
    logoutButtonFunction();
    createNewListing();
    // displayListing();
    console.log('dropdown loaded');

    // Attach event listener for dropdown toggle
    const dropdownButton = document.getElementById('dropdownButton');
    if (dropdownButton) {
        dropdownButton.addEventListener('click', function () {
            toggleDropdown('dropdownMenuBottom');
        });
    }

    // Fetch username from local storage when logged in
    const username = localStorage.getItem('username');

    if (username) {
        const tidyName = username.replace(/['"]+/g, '');
        
        // Safely update the username display only if the element exists
        const usernameElement = document.querySelector('.logged-in-username');
        if (usernameElement) {
            usernameElement.textContent = 'Hello, ' + tidyName + '! You are currently logged in.';
        }

        // Safely show elements for logged-in users only if the element exists
        const visibleElement = document.querySelector('.visible-if-logged-in');
        if (visibleElement) {
            visibleElement.style.display = 'block';
        }
    }
});
