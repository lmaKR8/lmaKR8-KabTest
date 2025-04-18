class Gallery {
    constructor() {
        // Estado inicial
        this.state = {
            currentFilter: 'all',
            currentLightboxIndex: 0,
            items: []
        };

        // Elementos DOM
        this.elements = {
            container: document.querySelector('.gallery'),
            grid: document.querySelector('.gallery__grid'),
            filters: document.querySelectorAll('.gallery__filter'),
            items: document.querySelectorAll('.gallery__item'),
            images: document.querySelectorAll('.gallery__image'),
            lightbox: document.querySelector('.gallery__lightbox'),
            lightboxImage: document.querySelector('.gallery__lightbox-image'),
            lightboxClose: document.querySelector('.gallery__lightbox-close'),
            lightboxPrev: document.querySelector('.gallery__lightbox-prev'),
            lightboxNext: document.querySelector('.gallery__lightbox-next')
        };

        this.init();
    }

    init() {
        try {
            this.setupLazyLoading();
            this.bindEvents();
            this.filterItems('all'); // Mostrar todos los items inicialmente
        } catch (error) {
            console.error('Error inicializando galería:', error);
        }
    }

    setupLazyLoading() {
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        }, options);

        this.elements.images.forEach(img => {
            if (img.dataset.src) {
                observer.observe(img);
            }
        });
    }

    bindEvents() {
        // Eventos de filtrado
        this.elements.filters.forEach(filter => {
            filter.addEventListener('click', () => {
                const category = filter.dataset.filter;
                this.filterItems(category);
                this.updateActiveFilter(filter);
            });
        });

        // Eventos de lightbox
        this.elements.items.forEach((item, index) => {
            item.addEventListener('click', () => this.openLightbox(index));
        });

        this.elements.lightboxClose?.addEventListener('click', () => this.closeLightbox());
        this.elements.lightboxPrev?.addEventListener('click', () => this.navigateLightbox('prev'));
        this.elements.lightboxNext?.addEventListener('click', () => this.navigateLightbox('next'));
    }

    filterItems(category) {
        this.state.currentFilter = category;
        this.elements.items.forEach(item => {
            const itemCategory = item.dataset.category;
            const shouldShow = category === 'all' || category === itemCategory;
            item.style.display = shouldShow ? 'block' : 'none';
        });
    }

    updateActiveFilter(selectedFilter) {
        this.elements.filters.forEach(filter => {
            filter.classList.toggle('gallery__filter--active', filter === selectedFilter);
        });
    }

    openLightbox(index) {
        if (!this.elements.lightbox) return;

        this.state.currentLightboxIndex = index;
        const currentImage = this.elements.images[index];
        
        if (currentImage) {
            this.elements.lightboxImage.src = currentImage.dataset.src || currentImage.src;
            this.elements.lightbox.classList.add('gallery__lightbox--active');
        }
    }

    closeLightbox() {
        if (!this.elements.lightbox) return;
        this.elements.lightbox.classList.remove('gallery__lightbox--active');
    }

    navigateLightbox(direction) {
        const visibleItems = Array.from(this.elements.items).filter(
            item => item.style.display !== 'none'
        );
        
        let newIndex = this.state.currentLightboxIndex;
        if (direction === 'prev') {
            newIndex = (newIndex - 1 + visibleItems.length) % visibleItems.length;
        } else {
            newIndex = (newIndex + 1) % visibleItems.length;
        }

        this.openLightbox(newIndex);
    }
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    new Gallery();
});