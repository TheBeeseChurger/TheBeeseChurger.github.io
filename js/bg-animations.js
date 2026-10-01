// Smoke Canvas Animation
const canvas = document.getElementById('smokeCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const DEFAULT_FADE_RGB = {r: 77, g: 208, b: 225};

const COLOR_TRANSITION_MS = 600;

function readColorVar(varName, fallback) {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    if (!raw) return fallback;

    const parts = raw.split(',').map(n => parseInt(n.trim(), 10));
    if (parts.length === 3 && parts.every(n => !isNaN(n))) {
        return {r: parts[0], g: parts[1], b: parts[2]};
    }
    return fallback;
}

function lerpColor(from, to, t) {
    return {
        r: from.r + (to.r - from.r) * t,
        g: from.g + (to.g - from.g) * t,
        b: from.b + (to.b - from.b) * t
    };
}

let accentColor = readColorVar('--fade-rgb', DEFAULT_FADE_RGB);

let colorFrom = {...accentColor};
let colorTo = {...accentColor};
let transitionStart = null;

function triggerColorTransition() {
    colorFrom = {...accentColor};
    colorTo = readColorVar('--fade-rgb', DEFAULT_FADE_RGB);
    transitionStart = performance.now();
}

function updateColorTransition(now) {
    if (transitionStart === null) return;

    const elapsed = now - transitionStart;
    const t = Math.min(elapsed / COLOR_TRANSITION_MS, 1);

    accentColor = lerpColor(colorFrom, colorTo, t);

    if (t >= 1) {
        transitionStart = null;
    }
}

// Watch for changes to data-view
const themeObserver = new MutationObserver(mutations => {
    for (const mutation of mutations) {
        if (mutation.attributeName === 'data-view') {
            triggerColorTransition();
        }
    }
});
themeObserver.observe(document.documentElement, { attributes: true });

class Smoke {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = -Math.random() * 0.3 - 0.15;
        this.size = Math.random() * 180 + 120;

        this.maxAlpha = Math.random() * 0.26 + 0.5;
        this.life = 0;
        this.maxLife = Math.random() * 600 + 400;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.size += 0.15;

        this.life++;

        const progress = this.life / this.maxLife;

        if (progress < 0.3) {
            this.alpha = this.maxAlpha * (progress / 0.3);
        } else if (progress > 0.7) {
            this.alpha = this.maxAlpha * ((1 - progress) / 0.3);
        } else {
            this.alpha = this.maxAlpha;
        }
    }

    draw() {
        if (this.alpha <= 0) return;

        ctx.save();
        ctx.globalAlpha = this.alpha;
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        const {r, g, b} = accentColor;
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.06)`);
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.03)`);
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
        if (this.alpha <= 0) return;

        ctx.save();
        const flickerAlpha = this.alpha * (0.7 + Math.sin(this.flicker * 0.3) * 0.3);
        ctx.globalAlpha = flickerAlpha;
        
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
        const {r, g, b} = accentColor;
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`);
        gradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, 0.6)`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x - this.size * 3, this.y - this.size * 3, this.size * 6, this.size * 6);
        ctx.restore();
    }
}

const smokes = [];
const embers = [];

function createSmoke() {
    if (smokes.length < 20) {
        smokes.push(new Smoke());
    }
}

function createEmber() {
    if (embers.length < 30) {
        embers.push(new Ember());
    }
}

function animateVFX(timestamp) {
    updateColorTransition(timestamp);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw smoke
    for (let i = smokes.length - 1; i >= 0; i--) {
        smokes[i].update();
        smokes[i].draw();
        
        if (smokes[i].life >= smokes[i].maxLife) {
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

    if (Math.random() < 0.08) createSmoke();
    if (Math.random() < 0.1) createEmber();
    
    requestAnimationFrame(animateVFX);
}

// Start the animation loop
requestAnimationFrame(animateVFX);

// Window resize handler
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});