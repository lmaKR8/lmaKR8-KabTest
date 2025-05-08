const slides = document.querySelectorAll(".category__slide");

for (const slide of slides) {
    slide.addEventListener("click", () => {
        clearActiveClasses();
        slide.classList.add("category__slide--active");
    });
}

function clearActiveClasses() {
    slides.forEach((slide) => {
        slide.classList.remove("category__slide--active");
    });
}