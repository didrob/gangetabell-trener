// Gangetabell Trener - JavaScript (Forbedret versjon)

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

// Brukerhåndteringsfunksjoner
const getUserData = (userName) => {
    const data = localStorage.getItem(`gangetabell-user-${userName}`);
    return data ? JSON.parse(data) : null;
};

const saveUserData = (userName, data) => {
    localStorage.setItem(`gangetabell-user-${userName}`, JSON.stringify(data));
};

const getAllUsers = () => {
    const users = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('gangetabell-user-')) {
            const userName = key.replace('gangetabell-user-', '');
            const userData = getUserData(userName);
            if (userData) {
                users.push({ name: userName, ...userData });
            }
        }
    }
    return users;
};

const getCurrentUser = () => {
    return localStorage.getItem('gangetabell-current-user');
};

const setCurrentUser = (userName) => {
    localStorage.setItem('gangetabell-current-user', userName);
};

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

// Statistikk komponent
const StatsOverview = ({ stats, onBack }) => {
    const getTableStats = () => {
        const tables = [2, 3, 4, 5, 6, 7, 8, 9, 10];
        return tables.map(table => {
            const tableStat = stats.tableStats?.[table] || { correct: 0, total: 0 };
            const percentage = tableStat.total > 0 ? Math.round((tableStat.correct / tableStat.total) * 100) : 0;
            return {
                table,
                correct: tableStat.correct,
                total: tableStat.total,
                percentage
            };
        }).sort((a, b) => a.percentage - b.percentage); // Sorter etter lavest prosent først
    };

    const tableStats = getTableStats();
    const mixedStat = stats.tableStats?.mixed || { correct: 0, total: 0 };
    const mixedPercentage = mixedStat.total > 0 ? Math.round((mixedStat.correct / mixedStat.total) * 100) : 0;

    const getColorClass = (percentage) => {
        if (percentage >= 80) return 'bg-green-500';
        if (percentage >= 60) return 'bg-yellow-500';
        if (percentage >= 40) return 'bg-orange-500';
        return 'bg-red-500';
    };

    const getRecommendation = () => {
        const needsWork = tableStats.filter(t => t.percentage < 70 && t.total > 0);
        if (needsWork.length === 0) {
            return "🎉 Fantastisk! Du behersker alle gangetabellene godt!";
        }
        const worst = needsWork[0];
        return `💡 Anbefaling: Øv mer på ${worst.table}-gangen (${worst.percentage}% riktig)`;
    };

    return (
        <div className="text-center p-4 md:p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={onBack}
                    className="bg-red-500 hover:bg-red-600 text-white text-xl font-bold py-3 px-6 rounded-2xl transition-all duration-200"
                >
                    ← Tilbake
                </button>
                <h1 className="text-3xl md:text-4xl font-bold rainbow-text">
                    📊 Statistikk
                </h1>
                <div></div>
            </div>

            {/* Anbefaling */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-6">
                <p className="text-lg text-white font-bold">{getRecommendation()}</p>
            </div>

            {/* Blandet statistikk */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">🎲 Blandet oppgaver</h2>
                <div className="flex items-center justify-center gap-4">
                    <div className="text-4xl font-bold text-white">
                        {mixedStat.correct}/{mixedStat.total}
                    </div>
                    <div className="text-2xl font-bold text-white">
                        ({mixedPercentage}%)
                    </div>
                </div>
                <div className="w-full bg-white/20 rounded-full h-4 mt-4">
                    <div 
                        className={`h-4 rounded-full transition-all duration-300 ${getColorClass(mixedPercentage)}`}
                        style={{ width: `${mixedPercentage}%` }}
                    ></div>
                </div>
            </div>

            {/* Gangetabell statistikk */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">📈 Gangetabell oversikt</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {tableStats.map(({ table, correct, total, percentage }) => (
                        <div key={table} className="bg-white/10 rounded-xl p-4">
                            <div className="text-2xl font-bold text-white mb-2">{table}-gangen</div>
                            <div className="text-lg text-white mb-2">
                                {correct}/{total}
                            </div>
                            <div className="text-sm text-white mb-3">
                                {percentage}% riktig
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-2">
                                <div 
                                    className={`h-2 rounded-full transition-all duration-300 ${getColorClass(percentage)}`}
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                            {percentage < 70 && total > 0 && (
                                <div className="text-xs text-red-300 mt-2">💪 Trenger øving</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Generell statistikk */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mt-6">
                <h2 className="text-2xl font-bold text-white mb-4">🏆 Generell statistikk</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
                    <div className="text-center">
                        <div className="text-2xl font-bold">{stats.totalCorrect}</div>
                        <div className="text-sm">Riktige svar</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold">{stats.maxStreak}</div>
                        <div className="text-sm">Beste streak</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold">
                            {stats.fastestAnswer < 999999 ? `${stats.fastestAnswer}ms` : 'N/A'}
                        </div>
                        <div className="text-sm">Raskeste svar</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold">{stats.dailyCorrect}</div>
                        <div className="text-sm">I dag</div>
                    </div>
                </div>
            </div>
        </div>
    );
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

// Brukervalg komponent
const UserSelect = ({ onUserSelect, onNewUser }) => {
    const [users, setUsers] = useState([]);
    const [showNewUserModal, setShowNewUserModal] = useState(false);
    const [newUserName, setNewUserName] = useState('');

    useEffect(() => {
        setUsers(getAllUsers());
    }, []);

    const handleNewUser = () => {
        if (newUserName.trim()) {
            const userName = newUserName.trim();
            const userData = {
                score: 0,
                currentAvatar: AVATARS[0],
                currentTheme: THEMES[0],
                isMuted: false,
                soundVolume: 0.3,
                soundType: 'soft',
                soundFrequency: 'normal',
                powerUps: [],
                stickers: [],
                trophies: [],
                stats: {
                    totalCorrect: 0,
                    totalWrong: 0,
                    maxStreak: 0,
                    fastestAnswer: 999999,
                    dailyCorrect: 0
                },
                createdAt: new Date().toISOString()
            };
            saveUserData(userName, userData);
            setCurrentUser(userName);
            onUserSelect(userName, userData);
            setShowNewUserModal(false);
            setNewUserName('');
        }
    };

    return (
        <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 md:p-8 max-w-2xl w-full">
                <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-6 md:mb-8">
                    🎯 Velg Bruker
                </h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 mb-6">
                    {users.map(user => (
                        <button
                            key={user.name}
                            onClick={() => onUserSelect(user.name, user)}
                            className="bg-white/30 hover:bg-white/50 active:bg-white/60 text-white p-4 rounded-xl transition-all duration-200 text-left touch-target"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl md:text-3xl">{user.currentAvatar?.emoji || '👤'}</span>
                                <div>
                                    <h3 className="text-base md:text-lg font-bold">{user.name}</h3>
                                    <p className="text-xs md:text-sm opacity-80">
                                        {getCurrentLevel(user.score || 0).emoji} {getCurrentLevel(user.score || 0).name} · {user.score || 0} poeng
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => setShowNewUserModal(true)}
                    className="w-full bg-green-500 hover:bg-green-600 active:bg-green-700 text-white py-4 rounded-xl font-bold text-base md:text-lg transition-all duration-200 touch-target"
                >
                    ➕ Ny Bruker
                </button>

                {showNewUserModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 max-w-md w-full">
                            <h3 className="text-lg md:text-xl font-bold text-white mb-4">Ny Bruker</h3>
                            <input
                                type="text"
                                value={newUserName}
                                onChange={(e) => setNewUserName(e.target.value)}
                                placeholder="Skriv inn navn..."
                                className="w-full p-3 rounded-lg bg-white/30 text-white placeholder-white/70 mb-4 text-base"
                                onKeyPress={(e) => e.key === 'Enter' && handleNewUser()}
                                autoFocus
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={handleNewUser}
                                    className="flex-1 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white py-3 rounded-lg font-bold touch-target"
                                >
                                    Opprett
                                </button>
                                <button
                                    onClick={() => setShowNewUserModal(false)}
                                    className="flex-1 bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white py-3 rounded-lg font-bold touch-target"
                                >
                                    Avbryt
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// FORENKLET StartMenu komponent
const StartMenu = ({ onStartGame, onStartRush, currentLevel, score, isMuted, setIsMuted, currentAvatar, setCurrentAvatar, currentTheme, setCurrentTheme, powerUps, usePowerUp, dailyChallenge, soundVolume, setSoundVolume, soundType, setSoundType, soundFrequency, setSoundFrequency, playSfx, currentUser, onSwitchUser, onShowStats }) => {
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
                        <p className="text-lg text-white font-bold">{currentUser || 'Bruker'}</p>
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
                    <button
                        onClick={onSwitchUser}
                        className="px-3 py-2 rounded-lg text-white font-bold transition-all duration-200 bg-blue-600 hover:bg-blue-700"
                        aria-label="Bytt bruker"
                    >
                        👤
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
                <button
                    onClick={onShowStats}
                    className="p-3 rounded-xl text-white font-bold transition-all duration-200 bg-indigo-500 hover:bg-indigo-600"
                    title="Statistikk"
                >
                    📊
                </button>
            </div>

            {/* Kollapsible seksjoner */}
            {showSettings && (
                <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                    <h3 className="text-lg font-bold text-white mb-3">⚙️ Innstillinger</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
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
                <button
                    onClick={onShowStats}
                    className="p-2 rounded-lg text-white font-bold transition-all duration-200 bg-indigo-500 hover:bg-indigo-600"
                >
                    📊 Statistikk
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

                    {/* Lydfrekvens */}
                    <div className="mb-4">
                        <h4 className="text-base font-bold text-white mb-2">Lydfrekvens:</h4>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => setSoundFrequency('normal')}
                                className={`p-2 rounded-lg text-white font-bold transition-all duration-200 ${
                                    soundFrequency === 'normal' 
                                        ? 'bg-green-400 text-black' 
                                        : 'bg-white/30 hover:bg-white/50'
                                }`}
                            >
                                <div className="text-sm">🔊 Normal</div>
                            </button>
                            <button
                                onClick={() => setSoundFrequency('reduced')}
                                className={`p-2 rounded-lg text-white font-bold transition-all duration-200 ${
                                    soundFrequency === 'reduced' 
                                        ? 'bg-green-400 text-black' 
                                        : 'bg-white/30 hover:bg-white/50'
                                }`}
                            >
                                <div className="text-sm">🔉 Redusert</div>
                            </button>
                            <button
                                onClick={() => setSoundFrequency('minimal')}
                                className={`p-2 rounded-lg text-white font-bold transition-all duration-200 ${
                                    soundFrequency === 'minimal' 
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


// Spill komponent
const Game = ({ selectedTable, onBackToMenu, onScoreUpdate, onGameOver, mode = 'normal', playSfx, triggerConfetti, powerUps }) => {
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [animation, setAnimation] = useState('');
    const [streak, setStreak] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const intervalRef = useRef(null);
    const [totalCount, setTotalCount] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);

    useEffect(() => {
        generateNewQuestion();
        if (mode === 'rush') {
            setTimeLeft(60);
            intervalRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(intervalRef.current);
                        setTimeout(() => onGameOver && onGameOver({ correctCount, totalCount }), 300);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
    }, []);

    const generateNewQuestion = () => {
        const question = generateQuestion(selectedTable);
        const wrongAnswers = generateWrongAnswers(question.answer);
        const allAnswers = [question.answer, ...wrongAnswers].sort(() => Math.random() - 0.5);
        setCurrentQuestion(question);
        setAnswers(allAnswers);
        setSelectedAnswer(null);
        setFeedback('');
        setAnimation('');
    };

    const handleAnswer = (answer) => {
        if (selectedAnswer) return;
        
        const startTime = Date.now();
        setSelectedAnswer(answer);
        
        setTotalCount(c => c + 1);
        if (answer === currentQuestion.answer) {
            const answerTime = Date.now() - startTime;
            setFeedback('🎉 Riktig! Fantastisk jobb!');
            setAnimation('bounce-animation');
            const newStreak = streak + 1;
            setStreak(newStreak);
            onScoreUpdate(10 + (newStreak * 2), true, answerTime);
            playSfx('correct');
            triggerConfetti();
            setCorrectCount(c => c + 1);
            
            setTimeout(() => {
                generateNewQuestion();
            }, 1500);
        } else {
            setFeedback(`❌ Feil svar. Riktig svar er ${currentQuestion.answer}. Prøv igjen!`);
            setAnimation('shake-animation');
            setStreak(0);
            playSfx('wrong');
            onScoreUpdate(0, false);
            
            setTimeout(() => {
                generateNewQuestion();
            }, 2000);
        }
    };

    if (!currentQuestion) return <div>Laster...</div>;

    return (
        <div className="text-center p-8">
            <div className="flex justify-between items-center mb-8">
                <button
                    onClick={onBackToMenu}
                    className="bg-red-500 hover:bg-red-600 text-white text-xl font-bold py-3 px-6 rounded-2xl transition-all duration-200"
                >
                    ← Tilbake
                </button>
                <div className="flex items-center gap-4 text-white text-xl">
                    {mode === 'rush' && (
                        <span>⏱️ {timeLeft}s</span>
                    )}
                    <span>🔥 Streak: {streak}</span>
                </div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 mb-8">
                <h2 className="text-4xl font-bold text-white mb-8">
                    {selectedTable ? `${selectedTable}-gangen` : 'Blandet oppgaver'}
                </h2>
                
                <div className={`text-6xl font-bold text-white mb-8 ${animation}`}>
                    {currentQuestion.question} = ?
                </div>

                <div className="grid grid-cols-2 gap-6">
                    {answers.map((answer, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswer(answer)}
                            disabled={selectedAnswer}
                            className={`p-6 rounded-2xl text-3xl font-bold transition-all duration-200 ${
                                selectedAnswer === answer
                                    ? answer === currentQuestion.answer
                                        ? 'bg-green-500 text-white transform scale-105'
                                        : 'bg-red-500 text-white transform scale-105'
                                    : selectedAnswer && answer === currentQuestion.answer
                                        ? 'bg-green-500 text-white transform scale-105'
                                        : 'bg-white/30 text-white hover:bg-white/50 hover:scale-105'
                            }`}
                        >
                            {answer}
                        </button>
                    ))}
                </div>

                {feedback && (
                    <div className={`mt-6 text-2xl font-bold ${animation}`}>
                        {feedback}
                    </div>
                )}
            </div>
        </div>
    );
};

// Hovedkomponent
const App = () => {
    const [currentView, setCurrentView] = useState('userSelect');
    const [currentUser, setCurrentUserState] = useState(null);
    const [userData, setUserData] = useState(null);
    const [score, setScore] = useState(0);
    const [selectedTable, setSelectedTable] = useState(null);
    const [mode, setMode] = useState('normal');
    const [isMuted, setIsMuted] = useState(false);
    const [confettiBurst, setConfettiBurst] = useState(false);
    const [badges, setBadges] = useState([]);
    const [streakForBadge, setStreakForBadge] = useState(0);
    const [lastRushSummary, setLastRushSummary] = useState(null);
    
    // Nye state for alle funksjoner
    const [currentAvatar, setCurrentAvatar] = useState(AVATARS[0]);
    const [currentTheme, setCurrentTheme] = useState(THEMES[0]);
    const [powerUps, setPowerUps] = useState({
        double: { active: false, endTime: 0 },
        hint: { uses: 0 },
        time: { uses: 0 }
    });
    const [dailyChallenge, setDailyChallenge] = useState(null);
    const [stats, setStats] = useState({
            totalCorrect: 0,
            maxStreak: 0,
            fastestAnswer: 999999,
            dailyCorrect: 0,
            lastPlayDate: new Date().toDateString(),
            tableStats: {
                2: { correct: 0, total: 0 },
                3: { correct: 0, total: 0 },
                4: { correct: 0, total: 0 },
                5: { correct: 0, total: 0 },
                6: { correct: 0, total: 0 },
                7: { correct: 0, total: 0 },
                8: { correct: 0, total: 0 },
                9: { correct: 0, total: 0 },
                10: { correct: 0, total: 0 },
                mixed: { correct: 0, total: 0 }
            }
    });

    // Brukerhåndtering
    const handleUserSelect = (userName, data) => {
        setCurrentUserState(userName);
        setUserData(data);
        setScore(data.score || 0);
        setCurrentAvatar(data.currentAvatar || AVATARS[0]);
        setCurrentTheme(data.currentTheme || THEMES[0]);
        setIsMuted(data.isMuted || false);
        setPowerUps(data.powerUps || { double: { active: false, endTime: 0 }, hint: { uses: 0 }, time: { uses: 0 } });
        setStats(data.stats || { 
            totalCorrect: 0, 
            maxStreak: 0, 
            fastestAnswer: 999999, 
            dailyCorrect: 0, 
            lastPlayDate: new Date().toDateString(),
            tableStats: {
                2: { correct: 0, total: 0 },
                3: { correct: 0, total: 0 },
                4: { correct: 0, total: 0 },
                5: { correct: 0, total: 0 },
                6: { correct: 0, total: 0 },
                7: { correct: 0, total: 0 },
                8: { correct: 0, total: 0 },
                9: { correct: 0, total: 0 },
                10: { correct: 0, total: 0 },
                mixed: { correct: 0, total: 0 }
            }
        });
        setBadges(data.badges || []);
        setDailyChallenge(getDailyChallenge());
        setCurrentView('menu');
    };

    const saveCurrentUserData = () => {
        if (currentUser && userData) {
            const updatedData = {
                ...userData,
                score,
                currentAvatar,
                currentTheme,
                isMuted,
                powerUps,
                stats,
                badges
            };
            saveUserData(currentUser, updatedData);
            setUserData(updatedData);
        }
    };

    // Migrer eksisterende data til brukerbasert system
    useEffect(() => {
        const existingScore = localStorage.getItem('gangetabell-score');
        const existingAvatar = localStorage.getItem('gangetabell-avatar');
        const existingTheme = localStorage.getItem('gangetabell-theme');
        
        if (existingScore && !currentUser) {
            // Migrer til "Standard Bruker"
            const migratedData = {
                score: parseInt(existingScore) || 0,
                currentAvatar: existingAvatar ? JSON.parse(existingAvatar) : AVATARS[0],
                currentTheme: existingTheme ? JSON.parse(existingTheme) : THEMES[0],
                isMuted: localStorage.getItem('gangetabell-muted') === '1',
                soundVolume: parseFloat(localStorage.getItem('gangetabell-sound-volume')) || 0.3,
                soundType: localStorage.getItem('gangetabell-sound-type') || 'soft',
                soundFrequency: localStorage.getItem('gangetabell-sound-frequency') || 'normal',
                powerUps: { double: { active: false, endTime: 0 }, hint: { uses: 0 }, time: { uses: 0 } },
                badges: [],
                stats: {
                    totalCorrect: 0,
                    maxStreak: 0,
                    fastestAnswer: 999999,
                    dailyCorrect: 0,
                    lastPlayDate: new Date().toDateString(),
                    tableStats: {
                        2: { correct: 0, total: 0 },
                        3: { correct: 0, total: 0 },
                        4: { correct: 0, total: 0 },
                        5: { correct: 0, total: 0 },
                        6: { correct: 0, total: 0 },
                        7: { correct: 0, total: 0 },
                        8: { correct: 0, total: 0 },
                        9: { correct: 0, total: 0 },
                        10: { correct: 0, total: 0 },
                        mixed: { correct: 0, total: 0 }
                    }
                },
                createdAt: new Date().toISOString()
            };
            
            saveUserData('Standard Bruker', migratedData);
            setCurrentUser('Standard Bruker');
            handleUserSelect('Standard Bruker', migratedData);
            
            // Rydd opp gamle data
            localStorage.removeItem('gangetabell-score');
            localStorage.removeItem('gangetabell-avatar');
            localStorage.removeItem('gangetabell-theme');
            localStorage.removeItem('gangetabell-muted');
            localStorage.removeItem('gangetabell-sound-volume');
            localStorage.removeItem('gangetabell-sound-type');
            localStorage.removeItem('gangetabell-sound-frequency');
        }
    }, []);

    // Lagre data når det endres
    useEffect(() => {
        if (currentUser) {
            saveCurrentUserData();
        }
    }, [score, currentAvatar, currentTheme, isMuted, powerUps, stats, badges]);
    const [trophies, setTrophies] = useState(() => {
        try { return JSON.parse(localStorage.getItem('gangetabell-trophies') || '[]'); } catch { return []; }
    });

    const currentLevel = getCurrentLevel(score);

    // Lagre state endringer
    useEffect(() => {
        localStorage.setItem('gangetabell-avatar', JSON.stringify(currentAvatar));
    }, [currentAvatar]);

    useEffect(() => {
        localStorage.setItem('gangetabell-theme', JSON.stringify(currentTheme));
    }, [currentTheme]);

    useEffect(() => {
        localStorage.setItem('gangetabell-stats', JSON.stringify(stats));
    }, [stats]);

    useEffect(() => {
        localStorage.setItem('gangetabell-trophies', JSON.stringify(trophies));
    }, [trophies]);

    // Sjekk daglig progress
    useEffect(() => {
        const today = new Date().toDateString();
        if (stats.lastPlayDate !== today) {
            setStats(prev => ({ ...prev, dailyCorrect: 0, lastPlayDate: today }));
            setDailyChallenge(getDailyChallenge());
        }
    }, []);

    const handleStartGame = (table) => {
        setSelectedTable(table);
        setMode('normal');
        setCurrentView('game');
    };

    const handleStartRush = (table) => {
        setSelectedTable(table);
        setMode('rush');
        setCurrentView('game');
    };

    const handleBackToMenu = () => {
        setCurrentView('menu');
    };

    const usePowerUp = (powerUpId) => {
        const powerUp = POWER_UPS.find(p => p.id === powerUpId);
        if (!powerUp || score < powerUp.cost) return;

        setScore(prev => prev - powerUp.cost);
        
        if (powerUpId === 'double') {
            setPowerUps(prev => ({
                ...prev,
                double: { active: true, endTime: Date.now() + powerUp.duration }
            }));
        } else if (powerUpId === 'hint') {
            setPowerUps(prev => ({
                ...prev,
                hint: { uses: (prev?.hint?.uses || 0) + 1 }
            }));
        } else if (powerUpId === 'time') {
            setPowerUps(prev => ({
                ...prev,
                time: { uses: (prev?.time?.uses || 0) + 1 }
            }));
        }
    };

    const handleScoreUpdate = (points, isCorrect, answerTime) => {
        let finalPoints = points;
        
        // 2x poeng power-up
        if (powerUps && powerUps.double && powerUps.double.active && Date.now() < powerUps.double.endTime) {
            finalPoints *= 2;
        }

        const newScore = score + finalPoints;
        setScore(newScore);
        localStorage.setItem('gangetabell-score', newScore.toString());

        // Oppdater stats
        if (isCorrect) {
            setStats(prev => ({
                ...prev,
                totalCorrect: prev.totalCorrect + 1,
                dailyCorrect: prev.dailyCorrect + 1,
                fastestAnswer: Math.min(prev.fastestAnswer, answerTime || 999999)
            }));
        }

        // Oppdater statistikk per gangetabell
        setStats(prev => {
            const tableKey = selectedTable || 'mixed';
            const tableStats = prev.tableStats || {};
            const currentTableStats = tableStats[tableKey] || { correct: 0, total: 0 };
            
            return {
                ...prev,
                tableStats: {
                    ...tableStats,
                    [tableKey]: {
                        correct: currentTableStats.correct + (isCorrect ? 1 : 0),
                        total: currentTableStats.total + 1
                    }
                }
            };
        });

        // Sjekk badges
        if (newScore >= 100 && !badges.includes('100-poeng')) {
            const updated = [...badges, '100-poeng'];
            setBadges(updated);
            localStorage.setItem('gangetabell-badges', JSON.stringify(updated));
            playSfx('badge');
            setConfettiBurst(true);
            setTimeout(() => setConfettiBurst(false), 1200);
        }

        // Sjekk troféer
        const newTrophies = checkTrophies(stats, trophies);
        if (newTrophies.length > 0) {
            const updated = [...trophies, ...newTrophies];
            setTrophies(updated);
            playSfx('badge');
            setConfettiBurst(true);
            setTimeout(() => setConfettiBurst(false), 1200);
        }

        // Oppdater daglig utfordring
        if (isCorrect && dailyChallenge && !dailyChallenge.completed) {
            const updated = { ...dailyChallenge, progress: dailyChallenge.progress + 1 };
            if (updated.progress >= updated.target) {
                updated.completed = true;
                setScore(prev => prev + updated.reward);
            }
            setDailyChallenge(updated);
            localStorage.setItem('daily-challenge', JSON.stringify(updated));
        }
    };

// Forbedret lydsystem
const [soundVolume, setSoundVolume] = useState(() => {
    const saved = localStorage.getItem('gangetabell-sound-volume');
    return saved ? parseFloat(saved) : 0.3; // Standard 30% volum
});
const [soundType, setSoundType] = useState(() => {
    const saved = localStorage.getItem('gangetabell-sound-type');
    return saved || 'soft'; // soft, classic, minimal
});
const [soundFrequency, setSoundFrequency] = useState(() => {
    const saved = localStorage.getItem('gangetabell-sound-frequency');
    return saved || 'normal'; // normal, reduced, minimal
});

    // Audio refs fjernet - bruker Web Audio API i stedet

// Forbedret lydsystem med Web Audio API
const createTone = (frequency, duration, type = 'sine') => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
};

const SOUNDS = {
    correct: () => {
        createTone(523, 0.2); // C5
        setTimeout(() => createTone(659, 0.2), 100); // E5
        setTimeout(() => createTone(784, 0.3), 200); // G5
    },
    wrong: () => {
        createTone(200, 0.5, 'sawtooth'); // Lav tone
    },
    badge: () => {
        createTone(523, 0.1); // C5
        setTimeout(() => createTone(659, 0.1), 50); // E5
        setTimeout(() => createTone(784, 0.1), 100); // G5
        setTimeout(() => createTone(1047, 0.2), 150); // C6
    }
};

    useEffect(() => {
        localStorage.setItem('gangetabell-muted', isMuted ? '1' : '0');
    localStorage.setItem('gangetabell-sound-volume', soundVolume.toString());
    localStorage.setItem('gangetabell-sound-type', soundType);
    localStorage.setItem('gangetabell-sound-frequency', soundFrequency);
}, [isMuted, soundVolume, soundType, soundFrequency]);

    const playSfx = (type) => {
        if (isMuted || soundVolume === 0) return;
        
        // Smart lyd - reduser frekvens basert på innstilling
        if (soundFrequency === 'reduced' && type === 'correct' && Math.random() > 0.5) return;
        if (soundFrequency === 'minimal' && type !== 'badge') return;
        
        try {
            // Bruk Web Audio API for bedre kompatibilitet
            if (SOUNDS[type]) {
                SOUNDS[type]();
            }
        } catch (error) {
            console.warn('Could not play sound:', error);
            // Fallback til enkel beep
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                const frequency = type === 'correct' ? 800 : type === 'wrong' ? 200 : 600;
                oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(soundVolume * 0.1, audioContext.currentTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.2);
            } catch (fallbackError) {
                console.warn('Fallback sound also failed:', fallbackError);
            }
        }
    };

    const triggerConfetti = () => {
        setConfettiBurst(true);
        setTimeout(() => setConfettiBurst(false), 1000);
    };

    const handleGameOver = (summary) => {
        if (summary && typeof summary === 'object') {
            setLastRushSummary({
                correct: summary.correctCount || 0,
                total: summary.totalCount || 0,
                gainedPoints: 0
            });
        }
        setCurrentView('menu');
    };

    return (
        <div className={`min-h-screen flex items-center justify-center ${currentTheme.class}`}>
            <div className="w-full max-w-4xl">
                {/* Audio elementer fjernet - bruker Web Audio API */}
                <ConfettiLayer burst={confettiBurst} />
                
                {/* Power-up indikator */}
                {powerUps && powerUps.double && powerUps.double.active && Date.now() < powerUps.double.endTime && (
                    <div className="fixed top-4 right-4 bg-yellow-400 text-black px-4 py-2 rounded-xl font-bold z-50 power-up-active">
                        💎 2x Poeng aktivt!
                    </div>
                )}

                {currentView === 'userSelect' ? (
                    <UserSelect 
                        onUserSelect={handleUserSelect}
                    />
                ) : currentView === 'menu' ? (
                    <StartMenu 
                        onStartGame={handleStartGame}
                        onStartRush={handleStartRush}
                        currentLevel={currentLevel}
                        score={score}
                        isMuted={isMuted}
                        setIsMuted={setIsMuted}
                        currentAvatar={currentAvatar}
                        setCurrentAvatar={setCurrentAvatar}
                        currentTheme={currentTheme}
                        setCurrentTheme={setCurrentTheme}
                        powerUps={powerUps}
                        usePowerUp={usePowerUp}
                        dailyChallenge={dailyChallenge}
                        soundVolume={soundVolume}
                        setSoundVolume={setSoundVolume}
                        soundType={soundType}
                        setSoundType={setSoundType}
                        soundFrequency={soundFrequency}
                        setSoundFrequency={setSoundFrequency}
                        playSfx={playSfx}
                        currentUser={currentUser}
                        onSwitchUser={() => setCurrentView('userSelect')}
                        onShowStats={() => setCurrentView('stats')}
                    />
                ) : currentView === 'stats' ? (
                    <StatsOverview 
                        stats={stats}
                        onBack={() => setCurrentView('menu')}
                    />
                ) : (
                    <Game 
                        selectedTable={selectedTable}
                        onBackToMenu={handleBackToMenu}
                        onScoreUpdate={(points, isCorrect, answerTime) => {
                            setStreakForBadge(prev => {
                                const next = points > 0 ? prev + 1 : 0;
                                if (next >= 5 && !badges.includes('5-paa-rad')) {
                                    const updated = [...badges, '5-paa-rad'];
                                    setBadges(updated);
                                    localStorage.setItem('gangetabell-badges', JSON.stringify(updated));
                                    playSfx('badge');
                                    triggerConfetti();
                                }
                                return next;
                            });
                            handleScoreUpdate(points, isCorrect, answerTime);
                        }}
                        onGameOver={handleGameOver}
                        mode={mode}
                        playSfx={playSfx}
                        triggerConfetti={triggerConfetti}
                        powerUps={powerUps}
                    />
                )}
                
                {currentView === 'menu' && lastRushSummary && (
                    <div className="mt-6 bg-white/30 backdrop-blur-sm rounded-2xl p-5 text-white">
                        <div className="text-2xl font-bold mb-2">⏱️ Rush resultater</div>
                        <div className="text-lg">Riktig: <span className="font-bold">{lastRushSummary.correct}</span> av {lastRushSummary.total}</div>
                        <div className="text-lg">Bra jobbet! Prøv igjen og slå rekorden din! 🏆</div>
                    </div>
                )}
                
                {badges.length > 0 && currentView === 'menu' && (
                    <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-white">
                        <div className="font-bold mb-2">🏅 Dine merker:</div>
                        <div className="flex gap-3 flex-wrap">
                            {badges.includes('5-paa-rad') && <span className="px-3 py-1 rounded-xl bg-green-500 text-white">5 på rad</span>}
                            {badges.includes('100-poeng') && <span className="px-3 py-1 rounded-xl bg-yellow-500 text-black">100 poeng</span>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Installer-app prompt
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

const InstallButton = () => {
    const [canInstall, setCanInstall] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    
    useEffect(() => {
        // Sjekk om det er iOS
        const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                   (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        setIsIOS(iOS);
        
        const handler = (e) => { 
            e.preventDefault(); 
            deferredPrompt = e; 
            setCanInstall(true); 
        };
        window.addEventListener('beforeinstallprompt', handler);
        if (deferredPrompt) setCanInstall(true);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);
    
    if (!canInstall && !isIOS) return null;
    
    const handleInstall = async () => {
        if (isIOS) {
            // For iOS, vis instruksjoner
            alert('For å installere appen på iOS:\n\n1. Trykk på del-knappen (⬆️)\n2. Velg "Legg til på startskjerm"\n3. Trykk "Legg til"');
            return;
        }
        
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
        setCanInstall(false);
    };
    
    return (
        <button
            onClick={handleInstall}
            className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-5 rounded-2xl shadow-xl z-50"
        >
            {isIOS ? '📱 Installasjon' : '➕ Installer appen'}
        </button>
    );
};

// PWA: registrer service worker hvis støttet
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
}

// Render appen
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<><App /><InstallButton /></>);
