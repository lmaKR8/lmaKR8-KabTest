class Gallery {
    constructor() {
        this.gallery = document.querySelector('.gallery');
        this.filters = document.querySelectorAll('.gallery-filter');
        this.items = document.querySelectorAll('.gallery-item');
        this.lightbox = document.querySelector('.lightbox');
        this.currentIndex = 0;
        
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Filtros
        this.filters.forEach(filter => {
            filter.addEventListener('click', () => this.handleFilter(filter));
        });

        // Lightbox
        this.items.forEach((item, index) => {
            item.addEventListener('click', () => this.openLightbox(index));
        });

        // Navegación Lightbox
        document.querySelector('.lightbox__close').addEventListener('click', () => this.closeLightbox());
        document.querySelector('.lightbox__prev').addEventListener('click', () => this.navigate(-1));
        document.querySelector('.lightbox__next').addEventListener('click', () => this.navigate(1));
    }

    handleFilter(selectedFilter) {
        // Actualizar clases activas
        this.filters.forEach(filter => {
            filter.classList.remove('active');
        });
        selectedFilter.classList.add('active');

        const filterValue = selectedFilter.dataset.name;

        // Filtrar items
        this.items.forEach(item => {
            const shouldShow = filterValue === 'all' || item.dataset.name === filterValue;
            item.style.display = shouldShow ? 'block' : 'none';
        });
    }

    openLightbox(index) {
        this.currentIndex = index;
        this.lightbox.classList.add('active');
        this.updateLightboxContent();
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    navigate(direction) {
        this.currentIndex = (this.currentIndex + direction + this.items.length) % this.items.length;
        this.updateLightboxContent();
    }

    updateLightboxContent() {
        const item = this.items[this.currentIndex];
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-caption');

        const lightboxImg = this.lightbox.querySelector('.lightbox__image');
        const lightboxTitle = this.lightbox.querySelector('.lightbox__title');
        const lightboxCategory = this.lightbox.querySelector('.lightbox__category');

        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxTitle.textContent = caption.textContent;
        lightboxCategory.textContent = item.dataset.name;
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new Gallery();
});