const slideData = [
    {
        src: "src/components/organisms/slider/img/carousel-background-1_1440x900.png",
        title: "Slide 1",
        copy: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
        src: "src/components/organisms/slider/img/carousel-background-2_1440x900.png",
        title: "Slide 2", 
        copy: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
        src: "src/components/organisms/slider/img/carousel-background-3_1440x900.png",
        title: "Slide 3",
        copy: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    }
];

class Slider {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.captions = [];
        this.autoplayInterval = null;
        
        this.init();
        this.setupEventListeners();
        this.startAutoplay();
    }

    init() {
        const leftSlider = document.getElementById('left-slider');
        const container = document.getElementById('container');

        slideData.forEach((slide, index) => {
            // Crear slide
            const slideDiv = document.createElement('div');
            slideDiv.classList.add('slide');
            slideDiv.style.background = `url(${slide.src})`;
            
            // Crear caption
            const caption = document.createElement('div');
            caption.classList.add('caption');
            caption.innerHTML = `
                <div class="caption-heading">
                    <h1>${slide.title}</h1>
                </div>
                <div class="caption-subhead">
                    <span>${slide.copy}</span>
                </div>
            `;

            if (index === 0) {
                slideDiv.classList.add('current');
                caption.classList.add('current-caption');
            }

            this.slides.push(slideDiv);
            this.captions.push(caption);
            
            leftSlider.appendChild(slideDiv);
            container.appendChild(caption);
        });
    }

    setupEventListeners() {
        document.querySelector('.slide-up').addEventListener('click', () => {
            this.prevSlide();
        });

        document.querySelector('.slide-down').addEventListener('click', () => {
            this.nextSlide();
        });
    }

    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }

    nextSlide() {
        this.slides[this.currentSlide].classList.remove('current');
        this.captions[this.currentSlide].classList.remove('current-caption');

        this.currentSlide = (this.currentSlide + 1) % this.slides.length;

        this.slides[this.currentSlide].classList.add('current');
        this.captions[this.currentSlide].classList.add('current-caption');
    }

    prevSlide() {
        this.slides[this.currentSlide].classList.remove('current');
        this.captions[this.currentSlide].classList.remove('current-caption');

        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;

        this.slides[this.currentSlide].classList.add('current');
        this.captions[this.currentSlide].classList.add('current-caption');
    }
}

// Inicializar el slider cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new Slider();
});