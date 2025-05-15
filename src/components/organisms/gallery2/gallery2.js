document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.gallery__grid .gallery__column .gallery__image');
    const lightbox = document.querySelector('.mansory-lightbox');
    const lightboxImg = document.querySelector('.mansory-lightbox__image');
    const close = document.querySelector('.mansory-lightbox__close');
    const prev = document.querySelector('.mansory-lightbox__prev');
    const next = document.querySelector('.mansory-lightbox__next');
    
    let currentImageIndex = 0;
    const imagesArray = Array.from(images);

    // Abrir lightbox
    images.forEach((img, index) => {
        img.addEventListener('click', () => {
            currentImageIndex = index;
            updateLightboxImage();
            lightbox.classList.add('mansory-lightbox--active');
        });
    });

    // Cerrar lightbox
    close.addEventListener('click', () => {
        lightbox.classList.remove('mansory-lightbox--active');
    });

    // Imagen anterior
    prev.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + imagesArray.length) % imagesArray.length;
        updateLightboxImage();
    });

    // Imagen siguiente
    next.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % imagesArray.length;
        updateLightboxImage();
    });

    // Cerrar con tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            lightbox.classList.remove('mansory-lightbox--active');
        }
        if (e.key === 'ArrowLeft') {
            prev.click();
        }
        if (e.key === 'ArrowRight') {
            next.click();
        }
    });

    function updateLightboxImage() {
        lightboxImg.src = imagesArray[currentImageIndex].src;
        lightboxImg.alt = imagesArray[currentImageIndex].alt;
    }
});