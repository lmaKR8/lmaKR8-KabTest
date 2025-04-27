class Carousel {
    constructor(element) {
        // Elementos del DOM
        this.carousel = element;
        this.track = element.querySelector('.carousel__track');
        this.slides = Array.from(element.querySelectorAll('.carousel__slide'));
        this.indicators = Array.from(element.querySelectorAll('.carousel__indicator'));
        this.prevButton = element.querySelector('.carousel__control--prev');
        this.nextButton = element.querySelector('.carousel__control--next');

        // Estado
        this.currentSlide = 0;
        this.slideCount = this.slides.length;
        this.isTransitioning = false;
        this.autoplayInterval = null;
        this.autoplayDelay = 4000; // 4 segundos

        // Inicialización
        this.init();
    }

    init() {
        // Configurar eventos
        this.setupEventListeners();
        // Iniciar autoplay
        this.startAutoplay();
        // Pausar autoplay cuando la pestaña no está visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAutoplay();
            } else {
                this.startAutoplay();
            }
        });
    }

    setupEventListeners() {
        // Botones de navegación
        this.prevButton?.addEventListener('click', () => this.prevSlide());
        this.nextButton?.addEventListener('click', () => this.nextSlide());

        // Indicadores
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // Eventos táctiles
        let touchStartX = 0;
        let touchEndX = 0;

        this.carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        this.carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });

        // Pausar/reanudar autoplay en hover
        this.carousel.addEventListener('mouseenter', () => this.stopAutoplay());
        this.carousel.addEventListener('mouseleave', () => this.startAutoplay());

        // Soporte para teclado
        this.carousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
    }

    handleSwipe(startX, endX) {
        const diff = startX - endX;
        if (Math.abs(diff) > 50) { // Umbral mínimo para considerar como swipe
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }

    updateSlides(newIndex) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        // Actualizar slides
        this.slides[this.currentSlide].classList.remove('carousel__slide--active');
        this.slides[newIndex].classList.add('carousel__slide--active');

        // Actualizar indicadores
        this.indicators[this.currentSlide].classList.remove('carousel__indicator--active');
        this.indicators[this.currentSlide].setAttribute('aria-selected', 'false');
        this.indicators[newIndex].classList.add('carousel__indicator--active');
        this.indicators[newIndex].setAttribute('aria-selected', 'true');

        // Actualizar índice actual
        this.currentSlide = newIndex;

        // Permitir nueva transición después de la actual
        setTimeout(() => {
            this.isTransitioning = false;
        }, 300); // Debe coincidir con la duración de la transición CSS
    }

    nextSlide() {
        const newIndex = (this.currentSlide + 1) % this.slideCount;
        this.updateSlides(newIndex);
    }

    prevSlide() {
        const newIndex = (this.currentSlide - 1 + this.slideCount) % this.slideCount;
        this.updateSlides(newIndex);
    }

    goToSlide(index) {
        if (index === this.currentSlide) return;
        this.updateSlides(index);
    }

    startAutoplay() {
        if (this.autoplayInterval) return;
        this.autoplayInterval = setInterval(() => this.nextSlide(), this.autoplayDelay);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
}

// Inicializar el carrusel cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const carouselElement = document.getElementById('heroCarousel');
    if (carouselElement) {
        new Carousel(carouselElement);
    }
});