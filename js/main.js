// Smoke Canvas Animation
const canvas = document.getElementById('smokeCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Smoke {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = -Math.random() * 0.3 - 0.15;
        this.size = Math.random() * 180 + 120;
        this.alpha = Math.random() * 0.12 + 0.03;
        this.decay = Math.random() * 0.0003 + 0.0002;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
        this.size += 0.15;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, 'rgba(77, 208, 225, 0.06)');
        gradient.addColorStop(0.5, 'rgba(13, 71, 161, 0.03)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
        ctx.restore();
    }
}

class Ember {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = -Math.random() * 0.5 - 0.1;
        this.size = Math.random() * 3 + 1;
        this.alpha = Math.random() * 0.6 + 0.2;
        this.decay = Math.random() * 0.002 + 0.001;
        this.flicker = Math.random() * 0.3;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
        
        // Add slight drift
        this.vx += (Math.random() - 0.5) * 0.02;
        this.vy += (Math.random() - 0.5) * 0.02;
        
        // Flicker effect
        this.flicker += 0.1;
    }

    draw() {
        ctx.save();
        const flickerAlpha = this.alpha * (0.7 + Math.sin(this.flicker) * 0.3);
        ctx.globalAlpha = flickerAlpha;
        
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
        gradient.addColorStop(0, 'rgba(77, 208, 225, 1)');
        gradient.addColorStop(0.3, 'rgba(77, 208, 225, 0.6)');
        gradient.addColorStop(1, 'rgba(77, 208, 225, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x - this.size * 3, this.y - this.size * 3, this.size * 6, this.size * 6);
        ctx.restore();
    }
}

const smokes = [];
const embers = [];

function createSmoke() {
    if (smokes.length < 15) {
        smokes.push(new Smoke());
    }
}

function createEmber() {
    if (embers.length < 30) {
        embers.push(new Ember());
    }
}

function animateSmoke() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw smoke
    for (let i = smokes.length - 1; i >= 0; i--) {
        smokes[i].update();
        smokes[i].draw();
        
        if (smokes[i].alpha <= 0) {
            smokes.splice(i, 1);
        }
    }

    // Update and draw embers
    for (let i = embers.length - 1; i >= 0; i--) {
        embers[i].update();
        embers[i].draw();
        
        if (embers[i].alpha <= 0 || embers[i].y < -10) {
            embers.splice(i, 1);
        }
    }

    if (Math.random() < 0.1) createSmoke();
    if (Math.random() < 0.15) createEmber();
    
    requestAnimationFrame(animateSmoke);
}

animateSmoke();

// Audio Control
const bgMusic = document.getElementById('bgMusic');
const audioToggle = document.getElementById('audioToggle');
const audioIcon = document.getElementById('audioIcon');
let isMuted = true;

// Set initial volume
bgMusic.volume = 0.3;

// Mute icon SVG path
const mutedIconPath = 'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z';
const unmutedIconPath = 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z';

// Try to play music on first user interaction
function attemptPlay() {
    bgMusic.play().then(() => {
        isMuted = false;
        audioToggle.classList.remove('muted');
        audioIcon.innerHTML = `<path d="${unmutedIconPath}"/>`;
        audioToggle.title = 'Mute Music';
    }).catch(error => {
        console.log('Autoplay prevented. User interaction required.');
        // Keep muted state
    });
}

// Attempt to play on page load (will likely be prevented by browser)
attemptPlay();

// Toggle audio on button click
audioToggle.addEventListener('click', () => {
    if (isMuted || bgMusic.paused) {
        bgMusic.play();
        isMuted = false;
        audioToggle.classList.remove('muted');
        audioIcon.innerHTML = `<path d="${unmutedIconPath}"/>`;
        audioToggle.title = 'Mute Music';
    } else {
        bgMusic.pause();
        isMuted = true;
        audioToggle.classList.add('muted');
        audioIcon.innerHTML = `<path d="${mutedIconPath}"/>`;
        audioToggle.title = 'Play Music';
    }
});

// Also try to play on first click anywhere on the page
let firstInteraction = true;
document.addEventListener('click', () => {
    if (firstInteraction && bgMusic.paused) {
        firstInteraction = false;
        attemptPlay();
    }
}, { once: true });

// Window resize handler
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.skill-progress');
            progressBars.forEach(bar => {
                const progress = bar.getAttribute('data-progress');
                bar.style.width = progress + '%';
            });
        }
    });
}, observerOptions);

const skillsSection = document.getElementById('skills');
observer.observe(skillsSection);

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth' });
    });
});

// Project card hover effect
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

// Window resize handler
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Initialize skill bars at 0
document.querySelectorAll('.skill-dot').forEach(dot => {
    dot.classList.remove('filled');
});