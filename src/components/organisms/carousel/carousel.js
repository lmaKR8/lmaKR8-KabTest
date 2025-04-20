class Carousel {
    constructor(element) {
        // Elementos del DOM
        this.carousel = element;
        this.backgrounds = [...this.carousel.querySelectorAll('.carousel__background-img')];
        this.slides = [...this.carousel.querySelectorAll('.carousel__slide')];
        this.images = [...this.carousel.querySelectorAll('.carousel__img')];
        this.dots = [...this.carousel.querySelectorAll('.carousel__dot')];
        this.prevButton = this.carousel.querySelector('.carousel__button--prev');
        this.nextButton = this.carousel.querySelector('.carousel__button--next');

        // Estado
        this.currentIndex = 0;
        this.isTransitioning = false;
        this.autoplayInterval = null;
        this.autoplayDelay = 3000;
        this.touchStartX = 0;
        this.minSwipeDistance = 50;

        // Inicialización
        this.init();
    }

    init() {
        // Mostrar primer slide
        this.showSlide(0);

        // Eventos
        this.bindEvents();

        // Iniciar autoplay
        this.startAutoplay();

        // Anunciar para lectores de pantalla
        this.announceSlide();
    }

    bindEvents() {
        // Navegación con botones
        this.prevButton?.addEventListener('click', () => this.prevSlide());
        this.nextButton?.addEventListener('click', () => this.nextSlide());

        // Navegación con dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.showSlide(index));
        });

        // Control de autoplay
        this.carousel.addEventListener('mouseenter', () => this.stopAutoplay());
        this.carousel.addEventListener('mouseleave', () => this.startAutoplay());
        this.carousel.addEventListener('focusin', () => this.stopAutoplay());
        this.carousel.addEventListener('focusout', () => this.startAutoplay());

        // Eventos táctiles
        this.carousel.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.carousel.addEventListener('touchend', this.handleTouchEnd.bind(this));

        // Teclas de accesibilidad
        this.carousel.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    showSlide(index) {
        if (this.isTransitioning || index === this.currentIndex) return;

        // Prevenir múltiples transiciones
        this.isTransitioning = true;

        // Actualizar clases
        this.backgrounds[this.currentIndex].classList.remove('is-active');
        this.slides[this.currentIndex].classList.remove('is-active');
        this.images[this.currentIndex].classList.remove('is-active');
        this.dots[this.currentIndex].setAttribute('aria-selected', 'false');

        // Activar nuevo slide
        this.currentIndex = index;
        this.backgrounds[index].classList.add('is-active');
        this.slides[index].classList.add('is-active');
        this.images[index].classList.add('is-active');
        this.dots[index].setAttribute('aria-selected', 'true');

        // Anunciar cambio
        this.announceSlide();

        // Permitir nueva transición
        setTimeout(() => {
            this.isTransitioning = false;
        }, 300);
    }

    prevSlide() {
        const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prevIndex);
    }

    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.slides.length;
        this.showSlide(nextIndex);
    }

    startAutoplay() {
        if (!this.autoplayInterval) {
            this.autoplayInterval = setInterval(() => this.nextSlide(), this.autoplayDelay);
        }
    }

    stopAutoplay() {
        clearInterval(this.autoplayInterval);
        this.autoplayInterval = null;
    }

    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
    }

    handleTouchEnd(e) {
        const touchEndX = e.changedTouches[0].clientX;
        const deltaX = this.touchStartX - touchEndX;

        if (Math.abs(deltaX) > this.minSwipeDistance) {
            deltaX > 0 ? this.nextSlide() : this.prevSlide();
        }
    }

    handleKeydown(e) {
        switch (e.key) {
            case 'ArrowLeft':
                this.prevSlide();
                break;
            case 'ArrowRight':
                this.nextSlide();
                break;
            case 'Home':
                this.showSlide(0);
                break;
            case 'End':
                this.showSlide(this.slides.length - 1);
                break;
        }
    }

    announceSlide() {
        // Anunciar para lectores de pantalla
        const liveRegion = this.carousel.querySelector('[aria-live]') || 
            (() => {
                const region = document.createElement('div');
                region.setAttribute('aria-live', 'polite');
                region.setAttribute('aria-atomic', 'true');
                region.classList.add('visually-hidden');
                this.carousel.appendChild(region);
                return region;
            })();

        const currentSlide = this.slides[this.currentIndex];
        const title = currentSlide.querySelector('.carousel__title').textContent;
        liveRegion.textContent = `Mostrando slide ${this.currentIndex + 1} de ${this.slides.length}: ${title}`;
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.carousel');
    if (carousel) new Carousel(carousel);
});