document.addEventListener('DOMContentLoaded', function () {
    // Get modal elements
    const modal = document.getElementById('profileModal');
    const closeBtn = document.querySelector('.close-modal');
    const closeButton = document.querySelector('.close-button');

    // View profile button handler
    document.addEventListener('click', function (e) {
        if (e.target.closest('.view-profile-btn')) {
            const btn = e.target.closest('.view-profile-btn');
            const userId = btn.getAttribute('data-user-id');
            const userName = btn.getAttribute('data-user-name');
            const card = btn.closest('.alumni-card');

            // Get user details from the card and data attributes
            document.getElementById('userName').textContent = userName;

            document.getElementById('userBatch').textContent = card.querySelectorAll('.info-value')[0].textContent;
            document.getElementById('userSubject').textContent = card.querySelectorAll('.info-value')[1].textContent;
            document.getElementById('userCompany').textContent = card.querySelectorAll('.info-value')[2].textContent;

            // Handle avatar/initials
            const modalAvatar = document.getElementById('modalAvatar');
            const userInitials = document.getElementById('userInitials');

            // Check if card has an image or initials
            const avatarImgContainer = card.querySelector('.alumni-avatar-img');
            if (avatarImgContainer) {
                const avatarImg = avatarImgContainer.querySelector('.avatar-img');
                if (avatarImg && avatarImg.src) {
                    // Replace initials with image
                    modalAvatar.innerHTML = `<img src="${avatarImg.src}" alt="${userName}" class="modal-avatar-img">`;
                    modalAvatar.classList.add('has-image');
                } else {
                    // Use initials as fallback
                    userInitials.textContent = card.querySelector('.alumni-avatar').textContent;
                    modalAvatar.classList.remove('has-image');
                }
            } else {
                // Use initials
                userInitials.textContent = card.querySelector('.alumni-avatar').textContent;
                modalAvatar.classList.remove('has-image');
            }

            // Set placeholders initially
            document.getElementById('verificationStatus').textContent = 'Verification: Checking...';
            document.getElementById('userBio').textContent = 'Loading...';
            document.getElementById('userSocialLinks').innerHTML = 'Loading...';

            // Show the modal
            modal.style.display = 'flex';

            // Fetch additional user details
            fetchUserDetails(userId);
        }
    });

    // Close modal when clicking close button or outside the modal
    closeBtn.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    closeButton.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Function to fetch additional user details
    function fetchUserDetails(userId) {
        fetch(`/api/user/${userId}/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    const user = data.user;

                    // Update modal with additional details
                    document.getElementById('userCompany').textContent = user.c_name || 'Not provided';
                    document.getElementById('userLocation').textContent = user.location || 'Not provided';
                    document.getElementById('userBio').textContent = user.bio || 'Not provided';
                    document.getElementById('verificationStatus').textContent = user.is_verified ?
                        'Verification: Verified ✓' : 'Verification: Not Verified';
                    document.getElementById('verificationStatus').className =
                        user.is_verified ? 'verification-status verified' : 'verification-status not-verified';

                    // Handle social links
                    const socialLinksContainer = document.getElementById('userSocialLinks');
                    if (user.social_links && Object.keys(user.social_links).length > 0) {
                        // Clear previous content
                        socialLinksContainer.innerHTML = '';

                        // Add social links with icons
                        for (const [platform, url] of Object.entries(user.social_links)) {
                            if (url) {
                                let icon = 'fas fa-link'; // Default icon

                                // Assign appropriate icons based on platform
                                if (platform.toLowerCase().includes('facebook')) icon = 'fab fa-facebook';
                                if (platform.toLowerCase().includes('linkedin')) icon = 'fab fa-linkedin';
                                if (platform.toLowerCase().includes('twitter')) icon = 'fab fa-twitter';
                                if (platform.toLowerCase().includes('instagram')) icon = 'fab fa-instagram';
                                if (platform.toLowerCase().includes('github')) icon = 'fab fa-github';

                                const link = document.createElement('a');
                                link.href = url;
                                link.target = '_blank';
                                link.className = 'social-link';
                                link.innerHTML = `<i class="${icon}"></i> ${platform}`;
                                socialLinksContainer.appendChild(link);
                            }
                        }
                    } else {
                        socialLinksContainer.textContent = 'No social links provided';
                    }
                }
            })
            .catch(error => {
                console.error('Error fetching user details:', error);
                // Handle error case
                document.getElementById('userCompany').textContent = 'Not available';
                document.getElementById('userLocation').textContent = 'Not available';
                document.getElementById('userBio').textContent = 'Not available';
                document.getElementById('verificationStatus').textContent = 'Verification: Unknown';
                document.getElementById('userSocialLinks').textContent = 'Not available';
            });
    }
});