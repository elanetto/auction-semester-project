
export function changeBanner() {
   
    // Make it possible to paste link to save a new banner picture
    const bannerPictureInput = document.getElementById('banner-input');
    const bannerPictureButton = document.getElementById('change-banner-button');

    if (bannerPictureInput && bannerPictureButton) {
        bannerPictureButton.addEventListener('click', function (event) {
            event.preventDefault();
            const newBannerUrl = bannerPictureInput.value;

            // Fetch the API key
            fetchApiKey().then(apiKey => {
                if (apiKey) {
                    const myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");
                    myHeaders.append("X-Noroff-API-Key", apiKey);
                    myHeaders.append("Authorization", "Bearer " + cleanedToken);

                    const raw = JSON.stringify({
                        "banner": {
                            "url": newBannerUrl,
                            "alt": "Banner"
                        }
                    });

                    const requestOptions = {
                        method: "PUT",
                        headers: myHeaders,
                        body: raw,
                        redirect: "follow"
                    };

                    fetch(`https://v2.api.noroff.dev/social/profiles/${cleanedUsername}`, requestOptions)
                        .then((response) => response.text())
                        .then((result) => {
                            localStorage.setItem('banner_url', newBannerUrl);
                            alert('Profilbanneret ditt er endret :)');
                            location.reload(); // Reload the page after successful update
                        })
                        .catch((error) => console.error(error));
                } else {
                    alert('Unable to fetch API key.');
                }
            });
        });
    }
}