// Gangetabell Trener - Spilllogikk

import { LEVELS, AVATARS, STICKERS, TROPHIES, DAILY_CHALLENGES } from './constants.js';

// Hjelpefunksjoner
export const getCurrentLevel = (score) => {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
        if (score >= LEVELS[i].minScore) {
            return LEVELS[i];
        }
    }
    return LEVELS[0];
};

export const getAvailableAvatars = (score) => {
    return AVATARS.filter(avatar => score >= avatar.unlockScore);
};

export const getAvailableStickers = (score) => {
    return STICKERS.filter(sticker => score >= sticker.unlockScore);
};

export const checkTrophies = (stats, newTrophies) => {
    const earned = [];
    if (stats.totalCorrect >= 1 && !newTrophies.includes('first-correct')) earned.push('first-correct');
    if (stats.maxStreak >= 5 && !newTrophies.includes('streak-5')) earned.push('streak-5');
    if (stats.maxStreak >= 10 && !newTrophies.includes('streak-10')) earned.push('streak-10');
    if (stats.fastestAnswer <= 2000 && !newTrophies.includes('speed-demon')) earned.push('speed-demon');
    if (stats.dailyCorrect >= 20 && !newTrophies.includes('perfect-day')) earned.push('perfect-day');
    return earned;
};

export const getDailyChallenge = () => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem('daily-challenge');
    if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.date === today) return parsed;
    }
    
    const challenge = DAILY_CHALLENGES[Math.floor(Math.random() * DAILY_CHALLENGES.length)];
    const newChallenge = { ...challenge, date: today, progress: 0, completed: false };
    localStorage.setItem('daily-challenge', JSON.stringify(newChallenge));
    return newChallenge;
};

// Generer tilfeldig oppgave
export const generateQuestion = (selectedTable = null) => {
    let tables = [2, 3, 4, 5, 6, 7, 8, 9, 10];
    if (selectedTable) {
        tables = [selectedTable];
    }
    
    const table = tables[Math.floor(Math.random() * tables.length)];
    const multiplier = Math.floor(Math.random() * 10) + 1;
    const answer = table * multiplier;
    
    return {
        question: `${table} × ${multiplier}`,
        answer: answer,
        table: table
    };
};

// Generer feil svar alternativer
export const generateWrongAnswers = (correctAnswer) => {
    const wrongAnswers = [];
    while (wrongAnswers.length < 3) {
        const wrong = correctAnswer + Math.floor(Math.random() * 20) - 10;
        if (wrong !== correctAnswer && wrong > 0 && !wrongAnswers.includes(wrong)) {
            wrongAnswers.push(wrong);
        }
    }
    return wrongAnswers;
};
