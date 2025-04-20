// Add JavaScript to initialize card animations
document.addEventListener('DOMContentLoaded', function() {
    // Add animation to SVG icons for continuous subtle movement
    const cardIcons = document.querySelectorAll('.card-icon svg');
    
    cardIcons.forEach(icon => {
      // Add a small pulse animation
      setInterval(() => {
        icon.style.transform = 'scale(1.05)';
        setTimeout(() => {
          icon.style.transform = 'scale(1)';
        }, 500);
      }, 3000);
    });
    
    // Add reveal animation for cards when they come into view
    const cards = document.querySelectorAll('.card');
    
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
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
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      });
    }
  });