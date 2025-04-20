document.addEventListener('DOMContentLoaded', function() {
    const alumniCards = document.querySelectorAll('.alumni-card');

    // Initialize IntersectionObserver with threshold
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add show class with a slight delay to ensure proper animation
          setTimeout(() => {
            entry.target.classList.add('show');
          }, 100);
          observer.unobserve(entry.target); // Trigger animation once
        }
      });
    }, {
      threshold: 0.3 // Trigger when 30% of the card is visible
    });

    // Start observing each alumni card
    alumniCards.forEach(card => observer.observe(card));
  });