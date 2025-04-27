// Script para mejorar accesibilidad en navegación
document.querySelectorAll('.footer__link').forEach(link => {
  link.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      link.click();
    }
  });
});

// Smooth scroll para enlaces internos (opcional)
document.querySelectorAll('.footer__link[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});