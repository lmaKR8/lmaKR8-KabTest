document.addEventListener('DOMContentLoaded', () => {
    const footerLinks = document.querySelectorAll('.footer__link');
    
    // Añadir indicador visual para el enlace activo
    footerLinks.forEach(link => {
        if (link.getAttribute('href') === window.location.hash) {
            link.classList.add('footer__link--active');
        }
        
        link.addEventListener('click', (e) => {
            footerLinks.forEach(l => l.classList.remove('footer__link--active'));
            link.classList.add('footer__link--active');
        });
    });
});