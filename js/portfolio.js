// Portfolio page specific JavaScript

// Skill animation on scroll
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillItems = document.querySelectorAll('.skill-item');
            skillItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 50);
            });
        }
    });
}, observerOptions);

const skillsSection = document.getElementById('skills');
if (skillsSection) {
    observer.observe(skillsSection);
}

//Initalize skills as hidden
document.querySelectorAll('.skill-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = 'all 0.5s ease';
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Project card hover effects
const cards = document.querySelectorAll('.project-card');
cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });

    // Prevent default link behavior for demo - remove when you have actual project pages
    card.addEventListener('click', function(e) {
        e.preventDefault();
        const projectName = this.querySelector('.project-title').textContent;
        alert(`Project page for "${projectName}" would open here.\n\nUpdate the href attributes in the HTML to link to your actual project pages.`);
    });
});