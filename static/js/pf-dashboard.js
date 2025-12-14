const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const menuItems = document.querySelectorAll('.menu-item');

// Toggle sidebar
hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
});

// Close sidebar when clicking overlay
overlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
});

// Close sidebar when clicking menu items on mobile
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        if (window.innerWidth <= 769) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        }
    });
});

// Close sidebar on window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 769) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    }
});