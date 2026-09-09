// Portfolio page specific JavaScript

// Create project cards
async function createProjectCards() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    try {
        const response = await fetch('./data/data.json');
        if (!response.ok) throw new Error(`Failed to fetch project data: ${response.status}`);
        const data = await response.json();

        grid.innerHTML = data
            .filter(project => project.disabled === false && project.featured === true)
            .map(project => `
                <a href="${project.page_link}" class="project-card">
                    <div class="project-link">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7z"/>
                        </svg>
                    </div>
                    <h3 class="project-title">${project.title}</h3>
                    <h4 class="project-role">${project.main_role}</h4>
                    <img src="${project.featured_thumbnail}" alt="${project.featured_thumbnail_alt}" class="project-image">
                    <p class="project-desc">${project.description}</p>
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </a>
            `).join('');

        initProjectCardHoverEffects();
    } catch (error) {
        console.error('Error creating project cards:', error);
        grid.innerHTML = '<p class="project-error">Failed to load projects at this time. |^| </p>';
    }
}

// Project card hover effects
function initProjectCardHoverEffects() {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

createProjectCards();

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
                    item.classList.add('in-view');
                }, index * 50);
            });
        }
    });
}, observerOptions);

const skillsSection = document.getElementById('skills');
if (skillsSection) {
    observer.observe(skillsSection);
}

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