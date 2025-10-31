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

        this.maxAlpha = Math.random() * 0.28 + 0.34;
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
        if (this.alpha <= 0) return;

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

function animateVFX() {
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

    if (Math.random() < 0.1) createSmoke();
    if (Math.random() < 0.15) createEmber();
    
    requestAnimationFrame(animateVFX);
}

// Start the animation loop
animateVFX();

// Window resize handler
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});