export function fetchUserWins() {
    const token = localStorage.getItem('token');
    const apiKey = localStorage.getItem('api_key');
    const username = localStorage.getItem('username');
    const cleanedToken = token.replace(/['"]+/g, '');
    const cleanedUsername = username.replace(/['"]+/g, '');

    // Check if the current page is the My Account page
    if (!document.body.classList.contains("my-account-page")) {
    return;
    }

    // Fetch the user's won listings
    fetch(`https://v2.api.noroff.dev/auction/profiles/${cleanedUsername}?_wins=true`, {
        method: 'GET',
        headers: {
            'X-Noroff-API-Key': apiKey,
            'Authorization': `Bearer ${cleanedToken}`,
            'Content-Type': 'application/json',
        },
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Failed to fetch user wins');
        })
        .then((data) => {
            const wins = data?.data?.wins || [];

            if (wins.length === 0) {
                console.log('No won listings found.');
                return;
            }

            const winsContainer = document.getElementById('user-wins-container');
            if (!winsContainer) {
                console.error('User wins container not found in the DOM');
                return;
            }

            winsContainer.innerHTML = ''; // Clear existing content

            wins.forEach((win) => {
                const winCard = document.createElement('div');
                winCard.classList.add('flex', 'flex-col', 'p-4', 'bg-white', 'w-[320px]', 'rounded', 'shadow-md', 'h-auto');

                const mediaUrl = win.media?.[0]?.url || '../../assets/placeholders/placeholder-pen-02.png';

                winCard.innerHTML = `
                    <a href="/listing/view/index.html?id=${win.id}" class="block">
                        <img src="${mediaUrl}" alt="${win.title}" class="mb-4 rounded h-[250px] object-cover">
                        <h3 class="text-blue-950 font-bold text-lg break-words truncate">${win.title}</h3>
                        <div>
                            <span class="text-blue-950 font-bold">Description:</span>
                            <span class="italic break-words">${win.description || 'No description available'}</span>
                        </div>
                        <div>
                            <span class="text-blue-950 font-bold">Category:</span>
                            <span>${win.tags?.join(', ') || 'N/A'}</span>
                        </div>
                        <div>
                            <span class="text-blue-950 font-bold">Ended At:</span>
                            <span>${new Date(win.endsAt).toLocaleDateString() || 'Unknown'}</span>
                        </div>
                    </a>
                `;

                winsContainer.appendChild(winCard);
            });
        })
        .catch((error) => {
            console.error('Error fetching user wins:', error);
        });
}
