// Gangetabell Trener - JavaScript (Forenklet layout)

const { useState, useEffect, useRef } = React;

// Nivåsystem
const LEVELS = [
    { name: "Rookie", minScore: 0, color: "bg-green-400", emoji: "🌱" },
    { name: "Smart", minScore: 50, color: "bg-blue-400", emoji: "🧠" },
    { name: "Pro", minScore: 150, color: "bg-purple-400", emoji: "⭐" },
    { name: "Genius", minScore: 300, color: "bg-yellow-400", emoji: "🎓" }
];

// Avatar-system
const AVATARS = [
    { id: "robot", name: "Robo", emoji: "🤖", unlockScore: 0, color: "bg-gray-500" },
    { id: "cat", name: "Katt", emoji: "🐱", unlockScore: 100, color: "bg-orange-500" },
    { id: "dragon", name: "Drage", emoji: "🐉", unlockScore: 250, color: "bg-red-500" },
    { id: "unicorn", name: "Enhjørning", emoji: "🦄", unlockScore: 500, color: "bg-purple-500" }
];

// Temaer
const THEMES = [
    { id: "default", name: "Standard", class: "gradient-bg", emoji: "🌈" },
    { id: "space", name: "Rom", class: "theme-space", emoji: "🚀" },
    { id: "jungle", name: "Jungel", class: "theme-jungle", emoji: "🌿" },
    { id: "ocean", name: "Hav", class: "theme-ocean", emoji: "🌊" }
];

// Power-ups
const POWER_UPS = [
    { id: "double", name: "2x Poeng", emoji: "💎", duration: 30000, cost: 50 },
    { id: "hint", name: "Hint", emoji: "💡", duration: 0, cost: 30 },
    { id: "time", name: "Ekstra Tid", emoji: "⏰", duration: 0, cost: 40 }
];

// Klistremerker
const STICKERS = [
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
const TROPHIES = [
    { id: "first-correct", name: "Første riktige", emoji: "🎯", description: "Svar riktig på din første oppgave" },
    { id: "streak-5", name: "5 på rad", emoji: "🔥", description: "Svar riktig 5 ganger på rad" },
    { id: "streak-10", name: "10 på rad", emoji: "⚡", description: "Svar riktig 10 ganger på rad" },
    { id: "speed-demon", name: "Speed Demon", emoji: "💨", description: "Svar riktig på under 2 sekunder" },
    { id: "perfect-day", name: "Perfekt dag", emoji: "☀️", description: "Svar riktig på 20 oppgaver i dag" },
    { id: "table-master", name: "Tabell-mester", emoji: "📚", description: "Fullfør alle tabeller 2-10" }
];

// Hjelpefunksjoner
const getCurrentLevel = (score) => {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
        if (score >= LEVELS[i].minScore) {
            return LEVELS[i];
        }
    }
    return LEVELS[0];
};

const getAvailableAvatars = (score) => {
    return AVATARS.filter(avatar => score >= avatar.unlockScore);
};

const getAvailableStickers = (score) => {
    return STICKERS.filter(sticker => score >= sticker.unlockScore);
};

const checkTrophies = (stats, newTrophies) => {
    const earned = [];
    if (stats.totalCorrect >= 1 && !newTrophies.includes('first-correct')) earned.push('first-correct');
    if (stats.maxStreak >= 5 && !newTrophies.includes('streak-5')) earned.push('streak-5');
    if (stats.maxStreak >= 10 && !newTrophies.includes('streak-10')) earned.push('streak-10');
    if (stats.fastestAnswer <= 2000 && !newTrophies.includes('speed-demon')) earned.push('speed-demon');
    if (stats.dailyCorrect >= 20 && !newTrophies.includes('perfect-day')) earned.push('perfect-day');
    return earned;
};

const getDailyChallenge = () => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem('daily-challenge');
    if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.date === today) return parsed;
    }
    
    const challenges = [
        { id: 'speed', name: 'Speed Master', description: 'Svar riktig på 10 oppgaver på under 3 sekunder', target: 10, reward: 100 },
        { id: 'streak', name: 'Streak King', description: 'Få en streak på 8 eller høyere', target: 8, reward: 80 },
        { id: 'accuracy', name: 'Perfekt Presisjon', description: 'Svar riktig på 15 oppgaver i rad', target: 15, reward: 120 }
    ];
    
    const challenge = challenges[Math.floor(Math.random() * challenges.length)];
    const newChallenge = { ...challenge, date: today, progress: 0, completed: false };
    localStorage.setItem('daily-challenge', JSON.stringify(newChallenge));
    return newChallenge;
};

// Generer tilfeldig oppgave
const generateQuestion = (selectedTable = null) => {
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
const generateWrongAnswers = (correctAnswer) => {
    const wrongAnswers = [];
    while (wrongAnswers.length < 3) {
        const wrong = correctAnswer + Math.floor(Math.random() * 20) - 10;
        if (wrong !== correctAnswer && wrong > 0 && !wrongAnswers.includes(wrong)) {
            wrongAnswers.push(wrong);
        }
    }
    return wrongAnswers;
};

// Confetti komponent
const ConfettiLayer = ({ burst }) => {
    if (!burst) return null;
    const pieces = Array.from({ length: 20 });
    const colors = ['🟡','🟣','🟢','🔵','🔴','🟠','⭐'];
    return (
        <div className="confetti w-full h-full">
            {pieces.map((_, i) => (
                <div
                    key={i}
                    className="confetti-piece"
                    style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 0.2}s`,
                        color: 'transparent'
                    }}
                >
                    {colors[Math.floor(Math.random() * colors.length)]}
                </div>
            ))}
        </div>
    );
};

// FORENKLET StartMenu komponent
const StartMenu = ({ onStartGame, onStartRush, currentLevel, score, isMuted, setIsMuted, currentAvatar, setCurrentAvatar, currentTheme, setCurrentTheme, powerUps, usePowerUp, dailyChallenge, soundVolume, setSoundVolume, soundType, setSoundType, soundFrequency, setSoundFrequency, playSfx }) => {
    const [selectedTable, setSelectedTable] = useState(null);
    const [showSettings, setShowSettings] = useState(false);
    const [showAvatarSelect, setShowAvatarSelect] = useState(false);
    const [showThemeSelect, setShowThemeSelect] = useState(false);
    const [showSoundSelect, setShowSoundSelect] = useState(false);
    const [showPowerUps, setShowPowerUps] = useState(false);

    const handleStart = () => {
        onStartGame(selectedTable);
    };

    const availableAvatars = getAvailableAvatars(score);

    return (
        <div className="text-center p-4 md:p-8 max-w-4xl mx-auto">
            {/* Hovedtittel */}
            <h1 className="text-4xl md:text-6xl font-bold rainbow-text mb-8">
                🎯 Gangetabell Trener
            </h1>
            
            {/* Brukerinfo - kompakt */}
            <div className="flex items-center justify-center gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <span className="text-3xl">{currentAvatar.emoji}</span>
                    <div className="text-left">
                        <p className="text-lg text-white font-bold">{currentAvatar.name}</p>
                        <p className="text-base text-white">
                            {currentLevel.emoji} {currentLevel.name} · <span className="font-bold">{score}</span> poeng
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsMuted(v => !v)}
                        className={`px-3 py-2 rounded-lg text-white font-bold transition-all duration-200 ${isMuted ? 'bg-gray-500' : 'bg-indigo-500 hover:bg-indigo-600'}`}
                        aria-label="Lyd av/på"
                    >
                        {isMuted ? '🔇' : '🔊'}
                    </button>
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="px-3 py-2 rounded-lg text-white font-bold transition-all duration-200 bg-gray-600 hover:bg-gray-700"
                        aria-label="Innstillinger"
                    >
                        ⚙️
                    </button>
                </div>
            </div>

            {/* Daglig utfordring - kompakt */}
            {dailyChallenge && !dailyChallenge.completed && (
                <div className="bg-yellow-500/20 backdrop-blur-sm rounded-xl p-3 mb-6 text-white">
                    <div className="flex items-center justify-between">
                        <div className="text-left">
                            <p className="text-sm font-bold">🎯 {dailyChallenge.name}</p>
                            <p className="text-xs">{dailyChallenge.progress}/{dailyChallenge.target}</p>
                        </div>
                        <div className="w-20 bg-white/20 rounded-full h-2">
                            <div 
                                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(dailyChallenge.progress / dailyChallenge.target) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabell valg - hovedfokus */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">Velg tabell:</h2>
                <div className="grid grid-cols-5 gap-3 mb-4">
                    {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(table => (
                        <button
                            key={table}
                            onClick={() => setSelectedTable(selectedTable === table ? null : table)}
                            className={`p-3 rounded-xl text-lg font-bold transition-all duration-200 ${
                                selectedTable === table 
                                    ? 'bg-yellow-400 text-black transform scale-105' 
                                    : 'bg-white/30 text-white hover:bg-white/50'
                            }`}
                        >
                            {table}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => setSelectedTable(null)}
                    className={`p-3 rounded-xl text-lg font-bold transition-all duration-200 ${
                        selectedTable === null 
                            ? 'bg-yellow-400 text-black transform scale-105' 
                            : 'bg-white/30 text-white hover:bg-white/50'
                    }`}
                >
                    🎲 Blandet
                </button>
            </div>

            {/* Start knapper - hovedhandling */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
                <button
                    onClick={handleStart}
                    className="bg-green-500 hover:bg-green-600 text-white text-2xl md:text-3xl font-bold py-4 md:py-6 px-8 md:px-12 rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-2xl w-full md:w-auto"
                >
                    🚀 START SPILL
                </button>
                <button
                    onClick={() => onStartRush(selectedTable)}
                    className="bg-orange-500 hover:bg-orange-600 text-white text-xl md:text-2xl font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-xl w-full md:w-auto"
                >
                    ⏱️ Rush 60s
                </button>
            </div>

            {/* Kompakt navigasjon */}
            <div className="flex justify-center gap-3">
                <button
                    onClick={() => setShowAvatarSelect(!showAvatarSelect)}
                    className="p-3 rounded-xl text-white font-bold transition-all duration-200 bg-blue-500 hover:bg-blue-600"
                    title="Avatars"
                >
                    👤
                </button>
                <button
                    onClick={() => setShowThemeSelect(!showThemeSelect)}
                    className="p-3 rounded-xl text-white font-bold transition-all duration-200 bg-green-500 hover:bg-green-600"
                    title="Temaer"
                >
                    🎨
                </button>
                <button
                    onClick={() => setShowPowerUps(!showPowerUps)}
                    className="p-3 rounded-xl text-white font-bold transition-all duration-200 bg-purple-500 hover:bg-purple-600"
                    title="Power-ups"
                >
                    ⚡
                </button>
                <button
                    onClick={() => setShowSoundSelect(!showSoundSelect)}
                    className="p-3 rounded-xl text-white font-bold transition-all duration-200 bg-pink-500 hover:bg-pink-600"
                    title="Lyd"
                >
                    🎵
                </button>
            </div>

            {/* Kollapsible seksjoner */}
            {showSettings && (
                <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                    <h3 className="text-lg font-bold text-white mb-3">⚙️ Innstillinger</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <button
                            onClick={() => setShowAvatarSelect(!showAvatarSelect)}
                            className="p-2 rounded-lg text-white font-bold transition-all duration-200 bg-blue-500 hover:bg-blue-600"
                        >
                            👤 Avatars
                        </button>
                        <button
                            onClick={() => setShowThemeSelect(!showThemeSelect)}
                            className="p-2 rounded-lg text-white font-bold transition-all duration-200 bg-green-500 hover:bg-green-600"
                        >
                            🎨 Temaer
                        </button>
                        <button
                            onClick={() => setShowSoundSelect(!showSoundSelect)}
                            className="p-2 rounded-lg text-white font-bold transition-all duration-200 bg-pink-500 hover:bg-pink-600"
                        >
                            🎵 Lyd
                        </button>
                        <button
                            onClick={() => setShowPowerUps(!showPowerUps)}
                            className="p-2 rounded-lg text-white font-bold transition-all duration-200 bg-purple-500 hover:bg-purple-600"
                        >
                            ⚡ Power-ups
                        </button>
                    </div>
                </div>
            )}

            {/* Avatar selector */}
            {showAvatarSelect && (
                <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                    <h3 className="text-lg font-bold text-white mb-3">👤 Velg Avatar</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {availableAvatars.map(avatar => (
                            <button
                                key={avatar.id}
                                onClick={() => setCurrentAvatar(avatar)}
                                className={`p-3 rounded-xl text-white font-bold transition-all duration-200 ${
                                    currentAvatar.id === avatar.id 
                                        ? 'bg-yellow-400 text-black transform scale-105' 
                                        : 'bg-white/30 hover:bg-white/50'
                                }`}
                            >
                                <div className="text-3xl mb-1">{avatar.emoji}</div>
                                <div className="text-sm">{avatar.name}</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Theme selector */}
            {showThemeSelect && (
                <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                    <h3 className="text-lg font-bold text-white mb-3">🎨 Velg Tema</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {THEMES.map(theme => (
                            <button
                                key={theme.id}
                                onClick={() => setCurrentTheme(theme)}
                                className={`p-3 rounded-xl text-white font-bold transition-all duration-200 ${
                                    currentTheme.id === theme.id 
                                        ? 'bg-yellow-400 text-black transform scale-105' 
                                        : 'bg-white/30 hover:bg-white/50'
                                }`}
                            >
                                <div className="text-3xl mb-1">{theme.emoji}</div>
                                <div className="text-sm">{theme.name}</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Power-ups */}
            {showPowerUps && (
                <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                    <h3 className="text-lg font-bold text-white mb-3">⚡ Power-ups</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {POWER_UPS.map(powerUp => (
                            <button
                                key={powerUp.id}
                                onClick={() => usePowerUp(powerUp.id)}
                                disabled={score < powerUp.cost}
                                className={`p-3 rounded-xl text-white font-bold transition-all duration-200 ${
                                    score >= powerUp.cost 
                                        ? 'bg-purple-500 hover:bg-purple-600 hover:scale-105' 
                                        : 'bg-gray-500 opacity-50'
                                }`}
                            >
                                <div className="text-2xl">{powerUp.emoji}</div>
                                <div className="text-sm">{powerUp.name}</div>
                                <div className="text-xs">{powerUp.cost} poeng</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Sound selector */}
            {showSoundSelect && (
                <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                    <h3 className="text-lg font-bold text-white mb-3">🎵 Lydinnstillinger</h3>
                    
                    {/* Volum */}
                    <div className="mb-4">
                        <h4 className="text-base font-bold text-white mb-2">Volum:</h4>
                        <div className="flex items-center gap-3">
                            <span className="text-white text-sm">🔊</span>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={soundVolume}
                                onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
                                className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-white text-sm w-12">{Math.round(soundVolume * 100)}%</span>
                        </div>
                    </div>

                    {/* Lydtype */}
                    <div className="mb-4">
                        <h4 className="text-base font-bold text-white mb-2">Lydtype:</h4>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => setSoundType('soft')}
                                className={`p-2 rounded-lg text-white font-bold transition-all duration-200 ${
                                    soundType === 'soft' 
                                        ? 'bg-green-400 text-black' 
                                        : 'bg-white/30 hover:bg-white/50'
                                }`}
                            >
                                <div className="text-sm">🔔 Myk</div>
                            </button>
                            <button
                                onClick={() => setSoundType('classic')}
                                className={`p-2 rounded-lg text-white font-bold transition-all duration-200 ${
                                    soundType === 'classic' 
                                        ? 'bg-green-400 text-black' 
                                        : 'bg-white/30 hover:bg-white/50'
                                }`}
                            >
                                <div className="text-sm">🎵 Klassisk</div>
                            </button>
                            <button
                                onClick={() => setSoundType('minimal')}
                                className={`p-2 rounded-lg text-white font-bold transition-all duration-200 ${
                                    soundType === 'minimal' 
                                        ? 'bg-green-400 text-black' 
                                        : 'bg-white/30 hover:bg-white/50'
                                }`}
                            >
                                <div className="text-sm">🔇 Minimal</div>
                            </button>
                        </div>
                    </div>

                    {/* Test lyd */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => playSfx('correct')}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg font-bold text-sm"
                        >
                            🎵 Test
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Resten av komponentene (Game, App, etc.) kan kopieres fra den originale app.js
// For nå fokuserer vi på den nye StartMenu layouten

// Eksport for testing
window.StartMenu = StartMenu;