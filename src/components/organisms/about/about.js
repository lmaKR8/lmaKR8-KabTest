class ParallaxEffect {
    constructor() {
        this.parallaxElement = document.querySelector('.about__parallax');
        this.aboutSection = document.querySelector('.about');
        this.lastScrollPosition = 0;
        this.ticking = false;
        this.initialPosition = 0;
        this.maxOffset = 50; // Porcentaje máximo de desplazamiento

        this.init();
    }

    init() {
        if (!this.parallaxElement || !this.aboutSection) return;
        
        window.addEventListener('scroll', () => {
            this.lastScrollPosition = window.scrollY;
            
            if (!this.ticking) {
                window.requestAnimationFrame(() => {
                    this.updateParallax();
                    this.ticking = false;
                });
                
                this.ticking = true;
            }
        });

        // Inicializar posición
        this.updateParallax();
    }

    updateParallax() {
        const sectionRect = this.aboutSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Calcular la visibilidad de la sección en la ventana
        const sectionTop = sectionRect.top;
        const sectionBottom = sectionRect.bottom;
        const isVisible = sectionTop < viewportHeight && sectionBottom > 0;
        
        if (isVisible) {
            // Calcular el progreso de scroll (0 a 1)
            const progress = Math.max(0, Math.min(1, 
                1 - (sectionTop / (viewportHeight + sectionRect.height))
            ));
            
            // Aplicar el desplazamiento horizontal
            const offset = this.maxOffset * progress;
            this.parallaxElement.style.transform = `translateX(${offset}%)`;
        }
    }
}

// Inicializar el efecto parallax cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    new ParallaxEffect();
});