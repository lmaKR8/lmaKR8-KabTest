document.addEventListener('DOMContentLoaded', () => {
    // Elementos
    const toggle = document.querySelector('.navbar__toggle');
    const menu = document.querySelector('.navbar__menu');
    const links = document.querySelectorAll('.navbar__link');

    // Toggle menú
    toggle.addEventListener('click', () => {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !isExpanded);
        toggle.classList.toggle('navbar__toggle--active');
        menu.classList.toggle('navbar__menu--active');
    });

    // Cerrar menú al hacer click en un enlace
    links.forEach(link => {
        link.addEventListener('click', () => {
            toggle.setAttribute('aria-expanded', 'false');
            toggle.classList.remove('navbar__toggle--active');
            menu.classList.remove('navbar__menu--active');
        });
    });

    // Actualizar enlace activo al hacer scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const link = document.querySelector(`.navbar__link[href="#${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                links.forEach(l => l.classList.remove('navbar__link--active'));
                link?.classList.add('navbar__link--active');
            }
        });
    });
});