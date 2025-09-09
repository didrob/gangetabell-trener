// Gangetabell Trener - localStorage utilities

// Safe JSON parse med fallback
export const safeJsonParse = (str, fallback = null) => {
    try {
        return JSON.parse(str);
    } catch {
        return fallback;
    }
};

// Safe JSON stringify
export const safeJsonStringify = (obj) => {
    try {
        return JSON.stringify(obj);
    } catch {
        return null;
    }
};

// localStorage wrapper med error handling
export const storage = {
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? safeJsonParse(item, defaultValue) : defaultValue;
        } catch {
            return defaultValue;
        }
    },
    
    set: (key, value) => {
        try {
            const serialized = typeof value === 'string' ? value : safeJsonStringify(value);
            if (serialized !== null) {
                localStorage.setItem(key, serialized);
                return true;
            }
        } catch {
            console.warn(`Failed to save ${key} to localStorage`);
        }
        return false;
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch {
            return false;
        }
    }
};

// Spesifikke getters/setters for appen
export const gameStorage = {
    getScore: () => storage.get('gangetabell-score', 0),
    setScore: (score) => storage.set('gangetabell-score', score.toString()),
    
    getAvatar: () => storage.get('gangetabell-avatar', null),
    setAvatar: (avatar) => storage.set('gangetabell-avatar', avatar),
    
    getTheme: () => storage.get('gangetabell-theme', null),
    setTheme: (theme) => storage.set('gangetabell-theme', theme),
    
    getStats: () => storage.get('gangetabell-stats', {
        totalCorrect: 0,
        maxStreak: 0,
        fastestAnswer: 999999,
        dailyCorrect: 0,
        lastPlayDate: new Date().toDateString()
    }),
    setStats: (stats) => storage.set('gangetabell-stats', stats),
    
    getBadges: () => storage.get('gangetabell-badges', []),
    setBadges: (badges) => storage.set('gangetabell-badges', badges),
    
    getTrophies: () => storage.get('gangetabell-trophies', []),
    setTrophies: (trophies) => storage.set('gangetabell-trophies', trophies),
    
    getMuted: () => storage.get('gangetabell-muted', '0') === '1',
    setMuted: (muted) => storage.set('gangetabell-muted', muted ? '1' : '0'),
    
    getDailyChallenge: () => storage.get('daily-challenge', null),
    setDailyChallenge: (challenge) => storage.set('daily-challenge', challenge)
};
