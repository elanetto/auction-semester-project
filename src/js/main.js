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
import { truncateTags } from '../js/utils/shortenTags.js';

document.addEventListener('DOMContentLoaded', async function () { 

    refresh();

    truncateTags();

    logoutButtonFunction();
    createNewListing();
    initializeHighestBidCarousel();

    fetchSingleListing();
    copyLink();
    placeBid();

    initializeDropdown();

    fetchUserWins();

    createListingPreview(); 

    fetchAndEditListing();
    fetchAndPopulateEditListing();
    saveEditedListing();
    initializeSaveButton();


    try {
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

        pagination(listings);
        pagination("https://v2.api.noroff.dev/auction/listings");

        initializeSearchBar(listings);
        initializeSearchBar("https://v2.api.noroff.dev/auction/listings");
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

    const saveButton = document.getElementById("edit-listing-button");
    if (saveButton) {
        saveButton.addEventListener("click", saveEditedListing);
    }

    const deleteButtons = document.querySelectorAll(".delete-listing-button");

    if (deleteButtons.length === 0) {
    }

    deleteButtons.forEach((button) => {
        const listingId = button.getAttribute("data-listing-id");
        const listingCard = button.closest(".listing-card");

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
