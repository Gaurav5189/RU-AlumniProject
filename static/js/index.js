document.addEventListener('DOMContentLoaded', function () {
  // Async load Font Awesome (CSP-compliant)
  const fontAwesomeLink = document.getElementById('font-awesome-css');
  if (fontAwesomeLink) {
    fontAwesomeLink.media = 'all';
  }

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

  // Handle Learn More button clicks (CSP-compliant)
  document.querySelectorAll('.learn-more-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const redirectPath = btn.dataset.redirect;
      if (redirectPath) {
        window.location.href = redirectPath;
      }
    });
  });
});