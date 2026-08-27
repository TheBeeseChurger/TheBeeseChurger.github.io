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

// StorageSession keys
const STORAGE_KEY_TIME = 'bgMusicTime';
const STORAGE_KEY_MUTED = 'bgMusicMuted';

// Restore saved playback position
function restorePlaybackPosition() {
    try {
        const savedTime = sessionStorage.getItem(STORAGE_KEY_TIME);
        if (savedTime !== null) {
            bgMusic.currentTime = parseFloat(savedTime);
        }
    } catch (error) {
        console.log('Could not restore playback position: ', error);
    }
}

// Save current playback position
function savePlaybackPostition() {
    try {
        sessionStorage.setItem(STORAGE_KEY_TIME, bgMusic.currentTime);
    } catch (error) {
        console.log('Could not save playback position: ', error);
    }
}

// Save mute/unmuted state
function saveMutedState(muted) {
    try {
        sessionStorage.setItem(STORAGE_KEY_MUTED, muted ? 'true' : 'false');
    } catch (error) {
        console.log('Could not save muted state: ', error);
    }
}

// Update icon
function updateIcon(muted) {
    isMuted = muted;
    if (muted) {
        audioToggle.classList.add('muted');
        audioIcon.innerHTML = '<path d="${mutedIconPath}"/>';
        audioToggle.title = 'Play Music';
    } else {
        audioToggle.classList.remove('muted');
        audioIcon.innerHTML = '<path d="${unmutedIconPath}"/>';
        audioToggle.title = 'Mute Music';
    }
}

// Try to play music on first user interaction
function attemptPlay() {
    restorePlaybackPosition();
    bgMusic.play().then(() => {
        updateIcon(false);

    }).catch(error => {
        console.log('Autoplay prevented. User interaction required.');
        updateIcon(true);
    });
}

// Check if music was playing before
const wasMuted = sessionStorage.getItem(STORAGE_KEY_MUTED);
if (wasMuted === 'true') {
    restorePlaybackPosition();
} else {
    attemptPlay();
}

// Toggle audio on button click
audioToggle.addEventListener('click', () => {
    if (isMuted && bgMusic.paused) {
        bgMusic.play();
        isMuted = false;
        updateIcon(false);
        saveMutedState(false);
    } else {
        bgMusic.pause();
        isMuted = true;
        updateIcon(true);
        saveMutedState(true);
    }
});

// Also try to play on first click anywhere on the page
let firstInteraction = true;
document.addEventListener('click', (e) => {
    if (!firstInteraction) {
        return;
    }
    firstInteraction = false;
    
    if (audioToggle && audioToggle.contains(e.target)) {
        return; // Already handled in the toggle listener
    }

    if (bgMusic.paused && wasMuted === 'false') {
        attemptPlay();
    }
    
}, { once: true });

// Continuously save playback position if playing
setInterval(() => {
    if (!bgMusic.paused) {
        savePlaybackPostition();
    }
}, 1000);

// Save before unloading as well
window.addEventListener('beforeunload', () => {
    savePlaybackPostition();
    saveMutedState(bgMusic.paused);
});