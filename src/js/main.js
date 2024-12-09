import { logoutButtonFunction } from './auth/logout.js';
import { createNewListing } from '../../src/js/listing/create-new-listing.js';
import { toggleDropdown } from '../js/utils/dropdown.js';
import { viewProfile } from '../js/profile/viewProfile.js';
import { renderProfileData } from '../js/profile/renderProfileData.js';
import { allListings } from '../js/listing/displayListing.js';
import { initializeHighestBidCarousel } from '../js/listing/highestBidCarousel.js';
import { pagination } from '../js/listing/pagination.js';
import { initializeSearchBar } from '../js/listing/search.js';

document.addEventListener('DOMContentLoaded', async function () { 
    logoutButtonFunction();
    createNewListing();
    initializeHighestBidCarousel();

    try {
        // Fetch listings
        const response = await fetch(`https://v2.api.noroff.dev/auction/listings?_bids=true`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch listings');
        }

        const data = await response.json();
        const listings = data.data || [];

        // Initialize pagination and search bar with listings
        pagination(listings);
        initializeSearchBar(listings); // Pass fetched listings to the search bar function
    } catch (error) {
        console.error('Error fetching listings:', error);
    }

    const dropdownButton = document.getElementById('dropdownButton');
    if (dropdownButton) {
        dropdownButton.addEventListener('click', function () {
            toggleDropdown('dropdownMenuBottom');
        });
    }

    const profileData = await viewProfile(); 
    if (profileData) {
        renderProfileData(profileData); 
    }

    const username = localStorage.getItem('username');
    if (username) {
        const tidyName = username.replace(/['"]+/g, '');
        
        const usernameElement = document.querySelector('.logged-in-username');
        if (usernameElement) {
            usernameElement.textContent = 'Hello, ' + tidyName + '! You are currently logged in.';
        }

        const visibleElement = document.querySelector('.visible-if-logged-in');
        if (visibleElement) {
            visibleElement.style.display = 'block';
        }
    }
});
