class Carousel {
    constructor(element) {
        // Estado inicial
        this.state = {
            currentIndex: 0,
            isTransitioning: false,
            autoplayInterval: null
        };

        // Elementos DOM
        this.elements = {
            carousel: element,
            backgrounds: [...element.querySelectorAll('.carousel__background-image')],
            slides: [...element.querySelectorAll('.carousel__slide')],
            mediaImages: [...element.querySelectorAll('.carousel__media-image')],
            dots: [...element.querySelectorAll('.carousel__navigation-dot')]
        };

        // Vincular métodos al contexto
        this.handleKeyboard = this.handleKeyboard.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        this.handleMouseEnter = () => this.stopAutoplay();
        this.handleMouseLeave = () => this.startAutoplay();

        // Configuración
        this.config = {
            autoplayDelay: 5000,
            transitionDelay: 300,
            transitionDuration: 400,
            minSwipeDistance: 50,
            touchThreshold: 20
        };

        this.touchData = {
            startX: 0,
            startY: 0
        };

        // Inicialización
        this.init();
    }

    init() {
        try {
            this.validateElements();
            this.showSlide(0);
            this.bindEvents();
            this.startAutoplay();
        } catch (error) {
            console.error('Error al inicializar el carrusel:', error);
        }
    }

    validateElements() {
        const requiredElements = ['backgrounds', 'slides', 'mediaImages', 'dots'];
        requiredElements.forEach(key => {
            if (!this.elements[key].length) {
                throw new Error(`No se encontraron elementos ${key}`);
            }
        });
    }

    bindEvents() {
        // Eventos de los dots
        this.elements.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.handleDotClick(index));
        });

        // Eventos de hover
        this.elements.carousel.addEventListener('mouseenter', this.handleMouseEnter);
        this.elements.carousel.addEventListener('mouseleave', this.handleMouseLeave);

        // Eventos táctiles
        this.elements.carousel.addEventListener('touchstart', this.handleTouchStart, { passive: true });
        this.elements.carousel.addEventListener('touchend', this.handleTouchEnd, { passive: true });

        // Eventos de teclado
        document.addEventListener('keydown', this.handleKeyboard);
    }

    handleTouchStart(e) {
        this.touchData.startX = e.changedTouches[0].screenX;
        this.touchData.startY = e.changedTouches[0].screenY;
        this.stopAutoplay();
    }

    handleTouchEnd(e) {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        
        if (Math.abs(touchEndX - this.touchData.startX) > Math.abs(touchEndY - this.touchData.startY)) {
            const swipeDistance = this.touchData.startX - touchEndX;
            this.handleSwipe(swipeDistance);
        }

        this.startAutoplay();
    }

    updateActiveClasses(index, isActive) {
        const action = isActive ? 'add' : 'remove';
        const activeClass = '--active';
        
        try {
            this.elements.backgrounds[index].classList[action](`carousel__background-image${activeClass}`);
            this.elements.slides[index].classList[action](`carousel__slide${activeClass}`);
            this.elements.mediaImages[index].classList[action](`carousel__media-image${activeClass}`);
        } catch (error) {
            console.error('Error al actualizar clases activas:', error);
        }
    }

    destroy() {
        // Limpieza de eventos
        this.stopAutoplay();
        
        document.removeEventListener('keydown', this.handleKeyboard);
        this.elements.carousel.removeEventListener('mouseenter', this.handleMouseEnter);
        this.elements.carousel.removeEventListener('mouseleave', this.handleMouseLeave);
        this.elements.carousel.removeEventListener('touchstart', this.handleTouchStart);
        this.elements.carousel.removeEventListener('touchend', this.handleTouchEnd);
        
        this.elements.dots.forEach((dot, index) => {
            dot.removeEventListener('click', () => this.handleDotClick(index));
        });
    }
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    try {
        const carousel = document.querySelector('.carousel');
        if (carousel) new Carousel(carousel);
    } catch (error) {
        console.error('Error al inicializar el carrusel:', error);
    }
});