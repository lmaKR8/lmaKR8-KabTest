class ParallaxEffect {
    constructor() {
        this.parallaxElement = document.querySelector('.about__parallax');
        this.aboutSection = document.querySelector('.about');
        this.container = document.querySelector('.about__container');
        this.lastScrollPosition = 0;
        this.ticking = false;
        this.initialPosition = 0;
        this.maxOffset = 50;
        this.visibilityThreshold = 0.3; // Umbral de visibilidad para la aparición

        this.init();
    }

    init() {
        if (!this.parallaxElement || !this.aboutSection) return;
        
        window.addEventListener('scroll', () => {
            this.lastScrollPosition = window.scrollY;
            
            if (!this.ticking) {
                window.requestAnimationFrame(() => {
                    this.updateParallax();
                    this.updateContainerVisibility();
                    this.ticking = false;
                });
                
                this.ticking = true;
            }
        });

        // Inicializar posición y visibilidad
        this.updateParallax();
        this.updateContainerVisibility();
    }

    updateParallax() {
        const sectionRect = this.aboutSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        const sectionTop = sectionRect.top;
        const sectionBottom = sectionRect.bottom;
        const isVisible = sectionTop < viewportHeight && sectionBottom > 0;
        
        if (isVisible) {
            const progress = Math.max(0, Math.min(1, 
                1 - (sectionTop / (viewportHeight + sectionRect.height))
            ));
            
            const offset = this.maxOffset * progress;
            this.parallaxElement.style.transform = `translateX(${offset}%)`;
        }
    }

    updateContainerVisibility() {
        if (!this.container) return;

        const rect = this.aboutSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Calcular el porcentaje de la sección visible
        const visiblePercentage = 1 - (rect.top / (viewportHeight * 0.8));

        if (visiblePercentage >= this.visibilityThreshold) {
            this.container.classList.add('visible');
        } else {
            this.container.classList.remove('visible');
        }
    }
}

// Inicializar el efecto parallax cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    new ParallaxEffect();
});