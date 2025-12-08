document.addEventListener('DOMContentLoaded', () => {
    // Basic interaction logging
    console.log('Game Portfolio Loaded');

    // Highlight active nav link based on current path
    const path = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        // Handle root path
        if (path.endsWith('/') && (href === './index.html' || href === 'index.html')) {
             // link.classList.add('active'); // Optional: home usually doesn't need highlight if logo is there
        } else if (href && path.includes(href.replace('./', ''))) {
            link.classList.add('active');
        }
    });
});
