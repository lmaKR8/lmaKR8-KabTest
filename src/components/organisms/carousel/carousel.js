class Carousel {
    constructor(element) {
        // Elementos
        this.carousel = element; // Elemento del carrusel
        this.backgrounds = [...this.carousel.querySelectorAll('.carousel__background__img')];
        this.contents = [...this.carousel.querySelectorAll('.carousel__content')];
        this.images = [...this.carousel.querySelectorAll('.carousel__img')];
        this.dots = [...this.carousel.querySelectorAll('.carousel__dot')];
        
        // Estado
        this.currentIndex = 0; // Índice del slide actual
        this.isTransitioning = false; // Estado de transición
        this.autoplayInterval = null; // Intervalo de autoplay
        
        // Inicialización
        this.init(); // Llamar a la función de inicialización
    }

    init() {
        // Activar primer slide
        this.showSlide(0);
        
        // Eventos
        this.bindEvents();
        
        // Autoplay
        this.startAutoplay(); 
    }

    bindEvents() {
        // Click en dots
        this.carousel.addEventListener('click', (e) => {
            const dot = e.target.closest('.carousel__dot');
            if (!dot) return;
            
            const dotIndex = Array.from(dot.parentElement.children).indexOf(dot);
            this.handleDotClick(dotIndex);
        });

        // Pausar autoplay al hover
        this.carousel.addEventListener('mouseenter', () => this.stopAutoplay());
        this.carousel.addEventListener('mouseleave', () => this.startAutoplay());

        // Gestos táctiles
        this.setupTouchEvents();
    }

    showSlide(index) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        // Remover clases activas
        this.backgrounds[this.currentIndex].classList.remove('active');
        this.contents[this.currentIndex].classList.remove('carousel__content--active');
        this.images[this.currentIndex].classList.remove('carousel__img--active');
        
        // Actualizar dots
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('carousel__dot--active', i === index); // Activar el dot correspondiente
        });

        // Activar nuevo slide
        this.currentIndex = index;
        this.backgrounds[index].classList.add('active');
        this.contents[index].classList.add('carousel__content--active');
        this.images[index].classList.add('carousel__img--active');

        setTimeout(() => {
            this.isTransitioning = false;
        }, 300);
    }

    handleDotClick(index) {
        if (index === this.currentIndex || this.isTransitioning) return; // Si el índice es el mismo o está en transición, no hacer nada
        this.showSlide(index); // Mostrar el slide correspondiente al punto clicado
    }

    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.slides.length;     // Calcular el siguiente índice
        this.showSlide(nextIndex);   // Mostrar el siguiente slide
    }

    startAutoplay() {
        this.autoplayInterval = setInterval(() => this.nextSlide(), 5000); // Iniciar autoplay cada 5 segundos
    }

    stopAutoplay() {
        clearInterval(this.autoplayInterval); // Detener autoplay
    }

    setupTouchEvents() {
        let touchStartX = 0; // Posición inicial del toque
        let touchEndX = 0; // Posición final del toque

        this.carousel.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX; // Guardar posición inicial del toque
        }, { passive: true }); // Usar passive para mejorar el rendimiento

        this.carousel.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;    // Guardar posición final del toque
            this.handleSwipe(touchStartX - touchEndX); // Manejar el gesto de deslizamiento
        }, { passive: true }); // Usar passive para mejorar el rendimiento
    }

    handleSwipe(swipeDistance) {
        const minSwipeDistance = 50; // Distancia mínima para considerar un deslizamiento
        if (Math.abs(swipeDistance) < minSwipeDistance) return; // Si la distancia de deslizamiento es menor a la mínima, no hacer nada

        if (swipeDistance > 0) {
            this.nextSlide(); // Si el deslizamiento es hacia la izquierda, mostrar el siguiente slide
        } else {
            const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length; // Calcular el índice anterior
            this.showSlide(prevIndex); // Mostrar el slide anterior
        }
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.carousel');
    if (carousel) new Carousel(carousel);
});