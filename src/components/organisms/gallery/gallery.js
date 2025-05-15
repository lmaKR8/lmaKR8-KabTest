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

        // Bind de métodos para mantener el contexto
        this.handleKeyboard = this.handleKeyboard.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        
        // Guardar el elemento activo anterior
        this.previousActiveElement = null;

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
    
        // Eventos de teclado
        document.addEventListener('keydown', this.handleKeyboard);
        this.elements.lightbox?.addEventListener('keydown', this.handleFocus);

        // Hacer los items focusables y agregar eventos de teclado
        this.elements.items.forEach(item => {
            item.setAttribute('tabindex', '0');
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const index = Array.from(this.elements.items).indexOf(item);
                    this.openLightbox(index);
                }
            });
        });
    }

    handleKeyboard(e) {
        if (this.elements.lightbox?.classList.contains('gallery__lightbox--active')) {
            switch (e.key) {
                case 'Escape':
                    e.preventDefault();
                    this.closeLightbox();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.navigateLightbox('prev');
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.navigateLightbox('next');
                    break;
            }
        }
    }

    handleFocus(e) {
        if (e.key === 'Tab') {
            // Obtener elementos focusables dentro del lightbox
            const focusableElements = this.elements.lightbox.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];

            // Crear trampa de foco
            if (e.shiftKey) { // Shift + Tab
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else { // Tab
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }
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

        // Guardar el elemento activo anterior
        this.previousActiveElement = document.activeElement;

        this.state.currentLightboxIndex = index;
        const currentItem = this.elements.items[index];
        const currentImage = this.elements.images[index];
        
        if (currentImage && currentItem) {
            // Actualizar imagen
            this.elements.lightboxImage.src = currentImage.dataset.src || currentImage.src;
            
            // Actualizar título
            const title = currentImage.dataset.title || currentImage.alt;
            this.elements.lightbox.querySelector('.gallery__lightbox-title').textContent = title;
            
            // Actualizar categoría
            const category = currentItem.dataset.category;
            this.elements.lightbox.querySelector('.gallery__lightbox-category').textContent = 
                category.charAt(0).toUpperCase() + category.slice(1); // Capitalizar primera letra
            
            // Mostrar lightbox
            this.elements.lightbox.classList.add('gallery__lightbox--active');
        }

        // Actualizar atributos ARIA
        this.elements.lightbox.setAttribute('aria-hidden', 'false');
        
        // Enfocar el primer botón después de abrir
        setTimeout(() => {
            this.elements.lightboxClose?.focus();
        }, 100);
    }

    closeLightbox() {
        if (!this.elements.lightbox) return;
        
        this.elements.lightbox.classList.remove('gallery__lightbox--active');
        this.elements.lightbox.setAttribute('aria-hidden', 'true');
        
        // Restaurar el foco al elemento anterior
        if (this.previousActiveElement) {
            this.previousActiveElement.focus();
        }
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

    destroy() {
        // Limpieza de eventos
        document.removeEventListener('keydown', this.handleKeyboard);
        this.elements.lightbox?.removeEventListener('keydown', this.handleFocus);

    }
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    new Gallery();
});