document.addEventListener('DOMContentLoaded', function() {
    // Sample events data
    const eventsData = [
        {
            title: "Alumni Networking Mixer",
            date: "March 15, 2025",
            time: "6:30 PM - 9:00 PM",
            location: "Downtown Business Hub",
            description: "Connect with alumni professionals in various industries for an evening of networking and career opportunities.",
            image: "/api/placeholder/400/250",
            month: "mar",
            type: "networking"
        },
        {
            title: "Homecoming Weekend",
            date: "September 15, 2025",
            time: "7:00 PM - 11:00 PM",
            location: "University Campus",
            description: "Join us for the annual homecoming celebration featuring a football game, parade, and alumni reception.",
            image: "/api/placeholder/400/250",
            month: "sep",
            type: "social"
        },
        {
            title: "Career Development Workshop",
            date: "May 12, 2025",
            time: "9:00 AM - 3:00 PM",
            location: "Alumni Center",
            description: "Develop your professional skills with workshops on resume writing, interviewing, and career advancement.",
            image: "/api/placeholder/400/250",
            month: "may",
            type: "career"
        },
        {
            title: "Distinguished Lecture Series",
            date: "April 20, 2025",
            time: "5:00 PM - 7:00 PM",
            location: "Main Auditorium",
            description: "Hear from industry leaders and distinguished alumni about current trends and future opportunities.",
            image: "/api/placeholder/400/250",
            month: "apr",
            type: "academic"
        }
    ];
    
    // Display initial events
    displayEvents(eventsData);
    
    // Set up event listeners for filtering
    document.getElementById('event-type').addEventListener('change', filterEvents);
    document.getElementById('event-month').addEventListener('change', filterEvents);
    document.getElementById('search-events').addEventListener('input', filterEvents);
    
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
    
    // Load more events button (simulated)
    let currentPage = 1;
    document.getElementById('load-more-btn').addEventListener('click', function() {
        // Button animation
        this.classList.add('btn-loading');
        
        // In a real application, you would fetch the next page of events from a server
        // For this example, we'll just duplicate our existing events with new IDs
        setTimeout(() => {
            currentPage++;
            const newEvents = eventsData.map(event => ({
                ...event,
                title: `${event.title} ${currentPage}`
            }));
            
            displayEvents(newEvents, true);
            
            // After a certain number of pages, disable the load more button
            if (currentPage >= 3) {
                this.disabled = true;
                this.textContent = 'No More Events';
                this.classList.add('btn-disabled');
            }
            
            this.classList.remove('btn-loading');
            
            // Animate new cards
            animateOnScroll();
        }, 800); // Simulate loading time
    });
    
    // Update countdown timer
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // Function to display events
    function displayEvents(events, append = false) {
        const container = document.getElementById('events-container');
        
        if (!append) {
            container.innerHTML = '';
        }
        
        events.forEach((event, index) => {
            const eventCard = document.createElement('div');
            eventCard.className = 'event-card';
            eventCard.dataset.type = event.type;
            eventCard.dataset.month = event.month;
            eventCard.style.setProperty('--card-index', append ? index + 4 : index);
            
            eventCard.innerHTML = `
                <div class="event-image">
                    <img src="${event.image}" alt="${event.title}">
                </div>
                <div class="event-date">${event.date}</div>
                <div class="event-content">
                    <h3 class="card-title">${event.title}</h3>
                    <p class="card-text">${event.description}</p>
                    <div class="event-details">
                        <i class="fas fa-clock"></i> ${event.time}
                    </div>
                    <div class="event-details">
                        <i class="fas fa-map-marker-alt"></i> ${event.location}
                    </div>
                    <div class="event-actions">
                        <a href="#" class="card-link">Learn More <span class="arrow-icon">→</span></a>
                        <a href="#" class="btn">Register</a>
                    </div>
                </div>
            `;
            
            container.appendChild(eventCard);
        });
        
        // Animate cards after they're added
        animateOnScroll();
    }
    
    // Function to filter events
    function filterEvents() {
        const typeFilter = document.getElementById('event-type').value;
        const monthFilter = document.getElementById('event-month').value;
        const searchText = document.getElementById('search-events').value.toLowerCase();
        
        // Add animation to filters
        document.querySelectorAll('.filter-select, #search-events').forEach(el => {
            el.classList.add('filter-active');
            setTimeout(() => {
                el.classList.remove('filter-active');
            }, 500);
        });
        
        const filteredEvents = eventsData.filter(event => {
            // Type filter
            const typeMatch = typeFilter === 'all' || event.type === typeFilter;
            
            // Month filter
            const monthMatch = monthFilter === 'all' || event.month === monthFilter;
            
            // Search filter
            const searchMatch = event.title.toLowerCase().includes(searchText) || 
                                event.description.toLowerCase().includes(searchText) ||
                                event.location.toLowerCase().includes(searchText);
            
            return typeMatch && monthMatch && searchMatch;
        });
        
        // Add fade-out animation to existing cards
        const existingCards = document.querySelectorAll('.event-card');
        existingCards.forEach(card => {
            card.classList.add('fade-out');
        });
        
        // Wait for animation to complete
        setTimeout(() => {
            displayEvents(filteredEvents);
        }, 300);
        
        // Reset load more button
        const loadMoreBtn = document.getElementById('load-more-btn');
        loadMoreBtn.disabled = false;
        loadMoreBtn.textContent = 'Load More Events';
        loadMoreBtn.classList.remove('btn-disabled');
        currentPage = 1;
    }
    
    // Function to update countdown timer
    function updateCountdown() {
        // Set the target date (September 15, 2025)
        const targetDate = new Date('September 15, 2025 19:00:00').getTime();
        const now = new Date().getTime();
        const difference = targetDate - now;
        
        // Time calculations
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        // Update the countdown numbers with flip animation
        updateCountdownDigit('count-days', days);
        updateCountdownDigit('count-hours', hours);
        updateCountdownDigit('count-mins', minutes);
        updateCountdownDigit('count-secs', seconds);
    }
    
    // Helper function to update countdown digits with animation
    let prevDays, prevHours, prevMins, prevSecs;
    
    function updateCountdownDigit(id, value) {
        const element = document.getElementById(id);
        let prevValue;
        
        // Store previous values
        switch(id) {
            case 'count-days': prevValue = prevDays; prevDays = value; break;
            case 'count-hours': prevValue = prevHours; prevHours = value; break;
            case 'count-mins': prevValue = prevMins; prevMins = value; break;
            case 'count-secs': prevValue = prevSecs; prevSecs = value; break;
        }
        
        // Only animate if the value has changed
        if (prevValue !== value) {
            // Add animation class
            element.classList.add('flip');
            
            // Update the value
            element.textContent = value < 10 ? '0' + value : value;
            
            // Remove animation class after animation completes
            setTimeout(() => {
                element.classList.remove('flip');
            }, 500);
        }
    }
    
    // Add pulse animation to icons
    const icons = document.querySelectorAll('.icon, .fas');
    icons.forEach(icon => {
        setInterval(() => {
            icon.classList.add('pulse');
            setTimeout(() => {
                icon.classList.remove('pulse');
            }, 500);
        }, 3000);
    });
});