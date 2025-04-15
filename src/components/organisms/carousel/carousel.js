/**
 * Clase Carousel - Implementa un carrusel de imágenes con contenido
 * siguiendo principios de programación funcional y modular
 */
class Carousel {
    /**
     * @param {HTMLElement} element - Elemento DOM del carrusel
     */
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
            backgrounds: [...element.querySelectorAll('.carousel__background__img')],
            contents: [...element.querySelectorAll('.carousel__content')],
            images: [...element.querySelectorAll('.carousel__img')],
            dots: [...element.querySelectorAll('.carousel__dot')]
        };

        // Configuración
        this.config = {
            autoplayDelay: 3000, // Tiempo entre transiciones automáticas
            transitionDelay: 150, // Tiempo de transición de CSS
            transitionDuration: 200, // Duración de la transición
            minSwipeDistance: 50 // Distancia mínima para considerar un swipe
        };

        // Inicialización0
        this.init();
    }

    /**
     * Inicializa el carrusel
     */
    init() {
        this.showSlide(0);
        this.bindEvents();
        this.startAutoplay();
    }

    /**
     * Vincula los eventos del carrusel
     */
    bindEvents() {
        // Eventos de los dots
        this.elements.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (this.state.currentIndex !== index) {
                    this.showSlide(index);
                }
            });
        });

        // Eventos de hover
        this.elements.carousel.addEventListener('mouseenter', () => this.stopAutoplay());
        this.elements.carousel.addEventListener('mouseleave', () => this.startAutoplay());

        // Eventos táctiles
        this.setupTouchEvents();
    }

    /**
     * Muestra el slide especificado
     * @param {number} index - Índice del slide a mostrar
     */
    showSlide(index) {
        if (this.state.isTransitioning) return;
        this.state.isTransitioning = true;

        // Remover clases activas del slide actual
        this.updateActiveClasses(this.state.currentIndex, false);
        
        // Actualizar dots
        this.updateDots(index);

        // Activar nuevo slide
        this.state.currentIndex = index;
        this.updateActiveClasses(index, true);

        // Finalizar transición
        setTimeout(() => {
            this.state.isTransitioning = false;
        }, this.config.transitionDelay);
    }

    /**
     * Actualiza las clases activas de los elementos
     * @param {number} index - Índice del elemento
     * @param {boolean} isActive - Estado activo
     */
    updateActiveClasses(index, isActive) {
        const action = isActive ? 'add' : 'remove';
        // Corregir nombre de clase para background
        this.elements.backgrounds[index].classList[action]('active');
        // Corregir nombres de clases para content e images
        this.elements.contents[index].classList[action]('carousel__content--active');
        this.elements.images[index].classList[action]('carousel__img--active');
    }


    updateDots(activeIndex) {
        this.elements.dots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add('carousel__dot--active');
            } else {
                dot.classList.remove('carousel__dot--active');
            }
        });
    }

    /**
     * Maneja el clic en los dots
     * @param {number} index - Índice del dot clickeado
     */
    handleDotClick(index) {
        if (index === this.state.currentIndex || this.state.isTransitioning) return;
        this.showSlide(index);
    }

    /**
     * Avanza al siguiente slide
     */
    nextSlide() {
        const nextIndex = (this.state.currentIndex + 1) % this.elements.backgrounds.length;
        this.showSlide(nextIndex);
    }

    /**
     * Inicia el autoplay
     */
    startAutoplay() {
        this.state.autoplayInterval = setInterval(
            () => this.nextSlide(), 
            this.config.autoplayDelay
        );
    }

    /**
     * Detiene el autoplay
     */
    stopAutoplay() {
        clearInterval(this.state.autoplayInterval);
    }

    /**
     * Configura los eventos táctiles
     */
    setupTouchEvents() {
        let touchStartX = 0;

        const touchStart = (e) => {
            touchStartX = e.changedTouches[0].screenX;
        };

        const touchEnd = (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const swipeDistance = touchStartX - touchEndX;
            this.handleSwipe(swipeDistance);
        };

        this.elements.carousel.addEventListener('touchstart', touchStart, { passive: true });
        this.elements.carousel.addEventListener('touchend', touchEnd, { passive: true });
    }

    /**
     * Maneja el evento de swipe
     * @param {number} swipeDistance - Distancia del swipe
     */
    handleSwipe(swipeDistance) {
        if (Math.abs(swipeDistance) < this.config.minSwipeDistance) return;

        const totalSlides = this.elements.backgrounds.length;
        if (swipeDistance > 0) {
            const nextIndex = (this.state.currentIndex + 1) % totalSlides;
            this.showSlide(nextIndex);
        } else {
            const prevIndex = (this.state.currentIndex - 1 + totalSlides) % totalSlides;
            this.showSlide(prevIndex);
        }
    }
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.carousel');
    if (carousel) new Carousel(carousel);
});