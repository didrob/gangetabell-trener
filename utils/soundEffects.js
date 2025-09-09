// Gangetabell Trener - Lydeffekter

import { SOUND_URLS } from '../data/constants.js';

class SoundManager {
    constructor() {
        this.audioElements = {};
        this.isMuted = false;
        this.initAudio();
    }

    initAudio() {
        // Opprett audio elementer
        Object.keys(SOUND_URLS).forEach(type => {
            const audio = new Audio(SOUND_URLS[type]);
            audio.preload = 'auto';
            this.audioElements[type] = audio;
        });
    }

    setMuted(muted) {
        this.isMuted = muted;
    }

    play(type) {
        if (this.isMuted) return;
        
        const audio = this.audioElements[type];
        if (audio) {
            try {
                audio.currentTime = 0;
                audio.play().catch(() => {
                    // Ignorer lyd-feil (f.eks. autoplay policy)
                });
            } catch (error) {
                console.warn(`Failed to play sound: ${type}`, error);
            }
        }
    }

    // Spesifikke lyd-metoder
    playCorrect() {
        this.play('correct');
    }

    playWrong() {
        this.play('wrong');
    }

    playBadge() {
        this.play('badge');
    }
}

// Eksporter singleton instance
export const soundManager = new SoundManager();
