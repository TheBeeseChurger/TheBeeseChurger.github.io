// Carousel functionality
let currentSlide = 0;
const carousel = document.getElementById('carousel');
const slides = document.querySelectorAll('.carousel-item');
const indicatorsContainer = document.getElementById('indicators');

// Create indicators
slides.forEach((_, index) => {
    const indicator = document.createElement('div');
    indicator.className = 'indicator';
    if (index === 0) indicator.classList.add('active');
    indicator.addEventListener('click', () => goToSlide(index));
    indicatorsContainer.appendChild(indicator);
});

function updateCarousel() {
    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update indicators
    document.querySelectorAll('.indicator').forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateCarousel();
}

function previousSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateCarousel();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});