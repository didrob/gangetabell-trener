// Gangetabell Trener - Konstanter

// Nivåsystem
export const LEVELS = [
    { name: "Rookie", minScore: 0, color: "bg-green-400", emoji: "🌱" },
    { name: "Smart", minScore: 50, color: "bg-blue-400", emoji: "🧠" },
    { name: "Pro", minScore: 150, color: "bg-purple-400", emoji: "⭐" },
    { name: "Genius", minScore: 300, color: "bg-yellow-400", emoji: "🎓" }
];

// Avatar-system
export const AVATARS = [
    { id: "robot", name: "Robo", emoji: "🤖", unlockScore: 0, color: "bg-gray-500" },
    { id: "cat", name: "Katt", emoji: "🐱", unlockScore: 100, color: "bg-orange-500" },
    { id: "dragon", name: "Drage", emoji: "🐉", unlockScore: 250, color: "bg-red-500" },
    { id: "unicorn", name: "Enhjørning", emoji: "🦄", unlockScore: 500, color: "bg-purple-500" }
];

// Temaer
export const THEMES = [
    { id: "default", name: "Standard", class: "gradient-bg", emoji: "🌈" },
    { id: "space", name: "Rom", class: "theme-space", emoji: "🚀" },
    { id: "jungle", name: "Jungel", class: "theme-jungle", emoji: "🌿" },
    { id: "ocean", name: "Hav", class: "theme-ocean", emoji: "🌊" }
];

// Power-ups
export const POWER_UPS = [
    { id: "double", name: "2x Poeng", emoji: "💎", duration: 30000, cost: 50 },
    { id: "hint", name: "Hint", emoji: "💡", duration: 0, cost: 30 },
    { id: "time", name: "Ekstra Tid", emoji: "⏰", duration: 0, cost: 40 }
];

// Klistremerker
export const STICKERS = [
    { id: "star", emoji: "⭐", name: "Stjerne", unlockScore: 0 },
    { id: "heart", emoji: "❤️", name: "Hjerte", unlockScore: 50 },
    { id: "trophy", emoji: "🏆", name: "Trofé", unlockScore: 100 },
    { id: "fire", emoji: "🔥", name: "Ild", unlockScore: 150 },
    { id: "rainbow", emoji: "🌈", name: "Regnbue", unlockScore: 200 },
    { id: "rocket", emoji: "🚀", name: "Rakett", unlockScore: 300 },
    { id: "crown", emoji: "👑", name: "Krone", unlockScore: 400 },
    { id: "diamond", emoji: "💎", name: "Diamant", unlockScore: 500 }
];

// Troféer
export const TROPHIES = [
    { id: "first-correct", name: "Første riktige", emoji: "🎯", description: "Svar riktig på din første oppgave" },
    { id: "streak-5", name: "5 på rad", emoji: "🔥", description: "Svar riktig 5 ganger på rad" },
    { id: "streak-10", name: "10 på rad", emoji: "⚡", description: "Svar riktig 10 ganger på rad" },
    { id: "speed-demon", name: "Speed Demon", emoji: "💨", description: "Svar riktig på under 2 sekunder" },
    { id: "perfect-day", name: "Perfekt dag", emoji: "☀️", description: "Svar riktig på 20 oppgaver i dag" },
    { id: "table-master", name: "Tabell-mester", emoji: "📚", description: "Fullfør alle tabeller 2-10" }
];

// Daglige utfordringer
export const DAILY_CHALLENGES = [
    { id: 'speed', name: 'Speed Master', description: 'Svar riktig på 10 oppgaver på under 3 sekunder', target: 10, reward: 100 },
    { id: 'streak', name: 'Streak King', description: 'Få en streak på 8 eller høyere', target: 8, reward: 80 },
    { id: 'accuracy', name: 'Perfekt Presisjon', description: 'Svar riktig på 15 oppgaver i rad', target: 15, reward: 120 }
];

// Lyd-URLs
export const SOUND_URLS = {
    correct: "https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3",
    wrong: "https://assets.mixkit.co/active_storage/sfx/2569/2569-preview.mp3",
    badge: "https://assets.mixkit.co/active_storage/sfx/2011/2011-preview.mp3"
};

// Konfetti farger
export const CONFETTI_COLORS = ['🟡','🟣','🟢','🔵','🔴','🟠','⭐'];
