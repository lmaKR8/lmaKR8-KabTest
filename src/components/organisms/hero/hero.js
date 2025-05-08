document.addEventListener('DOMContentLoaded', () => {
    const videos = Array.from(document.querySelectorAll('.hero__video-mp4'));
    let currentIndex = 0;

    function switchVideos() {
        // Oculta el video actual
        videos[currentIndex].classList.remove('hero__video-mp4--active');
        videos[currentIndex].classList.add('hero__video-mp4--next');
        
        // Actualiza el índice al siguiente video
        currentIndex = (currentIndex + 1) % videos.length;
        
        // Muestra y reproduce el siguiente video
        videos[currentIndex].classList.remove('hero__video-mp4--next');
        videos[currentIndex].classList.add('hero__video-mp4--active');
        videos[currentIndex].currentTime = 0;
        videos[currentIndex].play();
    }

    // Configura los eventos para todos los videos
    videos.forEach(video => {
        video.addEventListener('ended', () => {
            setTimeout(switchVideos, 50); // Pequeño retraso para suavizar la transición
        });
    });

    // Inicia el primer video
    videos[0].play().catch(error => {
        console.log("Error al reproducir el video:", error);
    });
});