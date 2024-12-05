import { logoutButtonFunction } from './auth/logout.js';
import { createNewListing } from '../../src/js/listing/create-new-listing.js';
import { displayListing } from '../js/listing/displayListing.js';

document.addEventListener('DOMContentLoaded', function () {
    logoutButtonFunction();
    createNewListing();
    displayListing();

    // fetch username from local storage when logged in
    const username = localStorage.getItem('username');

    if (username) {
        const tidyName = username.replace(/['"]+/g, '');
        
        // Safely update the username display
        const usernameElement = document.querySelector('.logged-in-username');
        if (usernameElement) {
            usernameElement.textContent = 'Hello, ' + tidyName + '! You are currently logged in.';
        }
    
        // Safely show elements for logged-in users
        const visibleElement = document.querySelector('.visible-if-logged-in');
        if (visibleElement) {
            visibleElement.style.display = 'block';
        }
    }
    
});
