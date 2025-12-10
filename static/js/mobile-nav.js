document.addEventListener('DOMContentLoaded', function () {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Create overlay element dynamically if it doesn't exist
    let overlay = document.querySelector('.nav-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);
    }

    if (mobileToggle && navLinks) {
        // Toggle Menu Function
        function toggleMenu() {
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            overlay.classList.toggle('active');

            // Prevent body scroll when menu is open
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        }

        mobileToggle.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);

        // Close menu when a link is clicked
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                // If clicking the current page link, prevent reload
                if (link.href === window.location.href) {
                    e.preventDefault();
                    if (navLinks.classList.contains('active')) {
                        toggleMenu();
                    }
                    return;
                }

                if (navLinks.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });
    }
});
