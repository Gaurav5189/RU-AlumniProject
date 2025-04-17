document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations for all cards
    animateOnScroll();
    
    // Add animation to event cards when they come into view
    function animateOnScroll() {
        const cards = document.querySelectorAll('.event-card');
        
        // Check if IntersectionObserver is supported
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        // Add staggered delay based on index
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                        }, index * 100);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            cards.forEach(card => {
                observer.observe(card);
            });
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            cards.forEach(card => {
                card.classList.add('visible');
            });
        }
    }
    
    // Function to handle section toggling if needed
    function setupSectionToggles() {
        const sectionTitles = document.querySelectorAll('.subsection-title');
        
        sectionTitles.forEach(title => {
            title.addEventListener('click', function() {
                const sectionContainer = this.closest('.section-container');
                const eventsGrid = sectionContainer.querySelector('.events-grid');
                
                if (eventsGrid.classList.contains('collapsed')) {
                    // Expand the section
                    eventsGrid.classList.remove('collapsed');
                    eventsGrid.style.maxHeight = eventsGrid.scrollHeight + 'px';
                    this.querySelector('.section-icon').classList.remove('fa-plus');
                    this.querySelector('.section-icon').classList.add('fa-minus');
                } else {
                    // Collapse the section
                    eventsGrid.classList.add('collapsed');
                    eventsGrid.style.maxHeight = '0px';
                    this.querySelector('.section-icon').classList.remove('fa-minus');
                    this.querySelector('.section-icon').classList.add('fa-plus');
                }
            });
        });
    }
    
    // Add pulse animation to icons
    function pulseIcons() {
        const icons = document.querySelectorAll('.icon, .fas');
        icons.forEach(icon => {
            if (!icon.closest('.section-icon')) {  // Skip section icons which have their own animation
                setInterval(() => {
                    icon.classList.add('pulse');
                    setTimeout(() => {
                        icon.classList.remove('pulse');
                    }, 500);
                }, 3000);
            }
        });
    }
    
    // Initialize all the event card badges
    function initEventBadges() {
        // Create the "Happening Now" effect for ongoing events
        const ongoingEvents = document.querySelectorAll('.ongoing-event');
        ongoingEvents.forEach(event => {
            const badge = event.querySelector('.event-badge');
            if (badge) {
                // Add subtle animation to badges
                setInterval(() => {
                    badge.style.opacity = '0.8';
                    setTimeout(() => {
                        badge.style.opacity = '1';
                    }, 500);
                }, 2000);
            }
        });
    }
    
    // Call all initialization functions
    pulseIcons();
    initEventBadges();
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});