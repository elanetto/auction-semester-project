import { logoutButtonFunction } from './auth/logout.js';
import { createNewListing } from '../../src/js/listing/create-new-listing.js';
import { initializeDropdown } from '../js/utils/dropdown.js';
import { viewProfile } from '../js/profile/viewProfile.js';
import { renderProfileData } from '../js/profile/renderProfileData.js';
import { initializeHighestBidCarousel } from '../js/listing/highestBidCarousel.js';
import { pagination } from '../js/listing/pagination.js';
import { initializeSearchBar } from '../js/listing/search.js';
import { fetchSingleListing } from '../js/listing/single-listing.js';
import { copyLink } from '../js/listing/copy-link.js';
import { placeBid } from '../js/listing/placeBid.js';
import { fetchUserWins } from '../js/profile/fetchUserWins.js';
import { createListingPreview } from '../js/listing/newListingPreview.js';
import { fetchAndEditListing } from '../js/listing/edit/fetchAndEditListing.js';
import { fetchAndPopulateEditListing } from '../js/listing/edit/fetchAndPopulateEdit.js';
import { saveEditedListing, initializeSaveButton } from '../js/listing/edit/saveEditedListing.js';
import { deleteListing } from '../js/listing/delete/deleteListing.js';
import { refresh } from '../js/utils/refresh.js';

document.addEventListener('DOMContentLoaded', async function () { 

    refresh();

    logoutButtonFunction();
    createNewListing();
    initializeHighestBidCarousel();

    fetchSingleListing();
    copyLink();
    placeBid();

    initializeDropdown();

    fetchUserWins();

    createListingPreview(); 

    // editListing()
    // previewEditListing()
    // editAndPreviewListing()
    fetchAndEditListing();
    fetchAndPopulateEditListing();
    saveEditedListing();
    initializeSaveButton();


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
        pagination("https://v2.api.noroff.dev/auction/listings");

        initializeSearchBar(listings);
        initializeSearchBar("https://v2.api.noroff.dev/auction/listings"); // Pass fetched listings to the search bar function
    } catch (error) {
        console.error('Error fetching listings:', error);
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

    // Attach the saveEditedListing function to the "Save Changes" button
    const saveButton = document.getElementById("edit-listing-button");
    if (saveButton) {
        saveButton.addEventListener("click", saveEditedListing);
    }


    // Find all delete buttons on the My Account page
    const deleteButtons = document.querySelectorAll(".delete-listing-button");

    if (deleteButtons.length === 0) {
    }

    deleteButtons.forEach((button) => {
        const listingId = button.getAttribute("data-listing-id");
        const listingCard = button.closest(".listing-card"); // Update the class if necessary

        if (!listingId || !listingCard) {
            console.error("Missing listing ID or listing card for delete button.");
            return;
        }

        console.log(`Attaching delete listener to listing ID: ${listingId}`);

        button.addEventListener("click", () => {
            deleteListing(listingId, listingCard);
        });
    });



});
