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

// Gangemon – V1 enkel liste (id, navn, emoji, sjeldenhet, unlockAt, optional table)
const GANGEMON = [
    { id: 'c1', name: 'Fire Dragon', emoji: '🐉', rarity: 'common', unlockAt: 0, table: 2 },
    { id: 'c2', name: 'Aqua Turtle', emoji: '🐢', rarity: 'common', unlockAt: 0, table: 3 },
    { id: 'c3', name: 'Earth Bear', emoji: '🐻', rarity: 'common', unlockAt: 0, table: 4 },
    { id: 'r1', name: 'Flame Sprite', emoji: '🔥', rarity: 'rare', unlockAt: 15, table: 2 },
    { id: 'r2', name: 'Wave Spirit', emoji: '🌊', rarity: 'rare', unlockAt: 30, table: 3 },
    { id: 'r3', name: 'Mountain Giant', emoji: '⛰️', rarity: 'rare', unlockAt: 45, table: 4 },
    { id: 'r4', name: 'Storm Cloud', emoji: '⛈️', rarity: 'rare', unlockAt: 60, table: 5 },
    { id: 'l1', name: 'Star Emperor', emoji: '⭐', rarity: 'legendary', unlockAt: 90 },
    { id: 'l2', name: 'Diamond King', emoji: '💎', rarity: 'legendary', unlockAt: 120 },
    { id: 'm1', name: 'Phoenix', emoji: '🔥', rarity: 'mythical', unlockAt: 180 }
];

// Evolusjonsnivåer
const EVOLUTION_LEVELS = [
    { name: "Bronze", emoji: "🥉", minScore: 0, color: "bg-orange-600" },
    { name: "Silver", emoji: "🥈", minScore: 100, color: "bg-gray-400" },
    { name: "Gold", emoji: "🥇", minScore: 300, color: "bg-yellow-400" },
    { name: "Diamond", emoji: "💎", minScore: 600, color: "bg-blue-400" }
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

const deleteUserData = (userName) => {
    localStorage.removeItem(`gangetabell-user-${userName}`);
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
// Normaliserer powerUps-objektet fra lagrede eller ufullstendige data
const normalizePowerUps = (raw) => {
    const defaults = { double: { active: false, endTime: 0 }, hint: { uses: 0 }, time: { uses: 0 } };
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return defaults;
    return {
        double: {
            active: Boolean(raw.double && raw.double.active),
            endTime: Number(raw.double && raw.double.endTime) || 0
        },
        hint: { uses: Number(raw.hint && raw.hint.uses) || 0 },
        time: { uses: Number(raw.time && raw.time.uses) || 0 }
    };
};
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

// Gangemon-hjelpefunksjoner (temporarily removed)

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
            <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 mb-6">
                <p className="text-lg text-white font-bold">{getRecommendation()}</p>
            </div>

            {/* Blandet statistikk */}
            <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 mb-6">
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
            <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6">
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

// Tilgjengelig Modal-komponent (ESC-lukk, fokusfelle, ARIA)
const Modal = ({ titleId = 'modal-title', onClose, children }) => {
    const modalRef = React.useRef(null);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') onClose && onClose();
            if (e.key === 'Tab' && modalRef.current) {
                const focusables = modalRef.current.querySelectorAll(
                    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
                );
                if (focusables.length === 0) return;
                const first = focusables[0];
                const last = focusables[focusables.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };
        document.addEventListener('keydown', handleKey);
        // sett initialt fokus
        setTimeout(() => {
            modalRef.current?.focus();
        }, 0);
        return () => document.removeEventListener('keydown', handleKey);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true" aria-labelledby={titleId}>
            <div ref={modalRef} tabIndex={-1} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 w-full max-w-md outline-none">
                {children}
                <div className="mt-4 text-right">
                    <button onClick={onClose} className="bg-white text-purple-700 px-4 py-2 rounded-xl font-bold hover:bg-gray-100" aria-label="Lukk dialog">
                        Lukk
                    </button>
                </div>
            </div>
        </div>
    );
};

// Gangemon Collection komponent (temporarily removed)

// Ny Gangemon Unlock komponent (temporarily removed)

// Badge Collection komponent
const BadgeCollection = ({ badges, onClose }) => {
    const allBadges = [
        { id: '5-paa-rad', name: '5 på rad', emoji: '🔥', description: 'Få 5 riktige svar på rad', color: 'bg-green-500' },
        { id: '10-paa-rad', name: '10 på rad', emoji: '⚡', description: 'Få 10 riktige svar på rad', color: 'bg-blue-500' },
        { id: '20-paa-rad', name: '20 på rad', emoji: '🌟', description: 'Få 20 riktige svar på rad', color: 'bg-purple-500' },
        { id: '100-poeng', name: '100 poeng', emoji: '💯', description: 'Oppnå 100 poeng totalt', color: 'bg-yellow-500' },
        { id: '500-poeng', name: '500 poeng', emoji: '🏆', description: 'Oppnå 500 poeng totalt', color: 'bg-orange-500' },
        { id: '1000-poeng', name: '1000 poeng', emoji: '👑', description: 'Oppnå 1000 poeng totalt', color: 'bg-red-500' },
        { id: 'speed-demon', name: 'Speed Demon', emoji: '⚡', description: 'Svar riktig på under 2 sekunder', color: 'bg-indigo-500' },
        { id: 'perfectionist', name: 'Perfeksjonist', emoji: '💎', description: 'Få 100% riktig i en runde', color: 'bg-pink-500' },
        { id: 'daily-warrior', name: 'Daglig Kriger', emoji: '🗡️', description: 'Fullfør daglig utfordring', color: 'bg-teal-500' },
        // { id: 'gangemon-master', name: 'Gangemon Mester', emoji: '🎮', description: 'Samle alle Gangemon', color: 'bg-cyan-500' } // temporarily removed
    ];
    
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-white">🏅 Badge Collection</h2>
                    <button
                        onClick={onClose}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-bold"
                    >
                        ✕ Lukk
                    </button>
                </div>
                
                {/* Badge grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allBadges.map(badge => {
                        const isEarned = badges.includes(badge.id);
                        
                        return (
                            <div
                                key={badge.id}
                                className={`p-4 rounded-xl transition-all duration-200 ${
                                    isEarned 
                                        ? 'bg-white/30 hover:bg-white/40' 
                                        : 'bg-white/10 opacity-50'
                                }`}
                            >
                                <div className="text-center">
                                    <div className="text-4xl mb-2">{isEarned ? badge.emoji : '🔒'}</div>
                                    <h4 className="font-bold text-white text-sm mb-1">
                                        {isEarned ? badge.name : '???'}
                                    </h4>
                                    <div className={`inline-block px-2 py-1 rounded-full text-xs font-bold text-white ${badge.color}`}>
                                        {isEarned ? 'OPPNÅDD' : 'LÅST'}
                                    </div>
                                    {isEarned && (
                                        <p className="text-xs text-white/80 mt-2">{badge.description}</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {/* Progress summary */}
                <div className="mt-6 bg-white/20 rounded-xl p-4">
                    <h3 className="text-xl font-bold text-white mb-2">Fremgang</h3>
                    <div className="flex items-center gap-3">
                        <div className="flex-1 bg-white/20 rounded-full h-4">
                            <div 
                                className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-500"
                                style={{ width: `${(badges.length / allBadges.length) * 100}%` }}
                            ></div>
                        </div>
                        <span className="text-white font-bold">
                            {badges.length} / {allBadges.length}
                        </span>
                    </div>
                </div>
            </div>
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

    const handleDeleteUser = (userName) => {
        if (!userName) return;
        if (!confirm(`Slette bruker "${userName}"? Dette kan ikke angres.`)) return;
        deleteUserData(userName);
        const current = getCurrentUser();
        if (current === userName) {
            localStorage.removeItem('gangetabell-current-user');
        }
        setUsers(getAllUsers());
    };

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
                powerUps: normalizePowerUps(),
                stickers: [],
                trophies: [],
                // gangemon temporarily removed
                badges: [],
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
                        <div key={user.name} className="flex items-center gap-2">
                        <button
                            onClick={() => onUserSelect(user.name, user)}
                                className="flex-1 bg-white/30 hover:bg-white/50 active:bg-white/60 text-white p-4 rounded-xl transition-all duration-200 text-left touch-target"
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
                            <button
                                onClick={() => handleDeleteUser(user.name)}
                                className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white p-3 rounded-xl font-bold"
                                title="Slett bruker"
                                aria-label={`Slett ${user.name}`}
                            >
                                🗑️
                            </button>
                        </div>
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
const StartMenu = ({ onStartGame, onStartRush, currentLevel, score, isMuted, setIsMuted, currentAvatar, setCurrentAvatar, currentTheme, setCurrentTheme, powerUps, usePowerUp, dailyChallenge, soundVolume, setSoundVolume, soundType, setSoundType, soundFrequency, setSoundFrequency, playSfx, currentUser, onSwitchUser, onShowStats, onDeleteCurrentUser, badges, onShowBadges }) => {
    const [gameMode, setGameMode] = useState(null); // 'classic' or 'adventure'
    const [selectedTable, setSelectedTable] = useState(null);
    const [showSettings, setShowSettings] = useState(false);
    const [showAvatarSelect, setShowAvatarSelect] = useState(false);
    const [showThemeSelect, setShowThemeSelect] = useState(false);
    const [showSoundSelect, setShowSoundSelect] = useState(false);
    const [showPowerUps, setShowPowerUps] = useState(false);

    const handleStart = () => {
        onStartGame(selectedTable, gameMode);
    };

    // Reset gameMode when component mounts (when returning from game)
    useEffect(() => {
        setGameMode(null);
        setSelectedTable(null);
    }, []);

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
                    <span className="text-3xl animate-float">{currentAvatar.emoji}</span>
                    <div className="text-left">
                        <p className="text-lg text-white font-bold">{currentUser || 'Bruker'}</p>
                        <p className="text-base text-white">
                            {currentLevel.emoji} {currentLevel.name} · <span className="font-bold">{score}</span> poeng
                        </p>
                        <p className="text-sm text-white/80">
                            🎮 Gangemon system midlertidig deaktivert
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
                    {currentUser && (
                        <button
                            onClick={onDeleteCurrentUser}
                            className="px-3 py-2 rounded-lg text-white font-bold transition-all duration-200 bg-red-600 hover:bg-red-700"
                            aria-label="Slett nåværende bruker"
                            title="Slett nåværende bruker"
                        >
                            🗑️
                        </button>
                    )}
                </div>
            </div>

            {/* Daglig utfordring - kompakt */}
            {dailyChallenge && !dailyChallenge.completed && (
                <div className="bg-yellow-500/30 backdrop-blur-sm rounded-xl p-3 mb-6 text-white">
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

            {/* Spillmodus valg */}
            {!gameMode && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Velg spillmodus</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                        {/* Klassisk Modus */}
                        <button
                            onClick={() => setGameMode('classic')}
                            className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white hover:bg-white/30 transition-all duration-200 hover:scale-105"
                        >
                            <div className="text-4xl mb-3">📚</div>
                            <h3 className="text-xl font-bold mb-2">Klassisk Modus</h3>
                            <p className="text-sm text-white/80">
                                Tradisjonell gangetabell-trening. Velg en spesifikk tabell eller blandet oppgaver.
                            </p>
                        </button>
                        
                        {/* Adventure Modus */}
                        <button
                            onClick={() => setGameMode('adventure')}
                            className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white hover:bg-white/30 transition-all duration-200 hover:scale-105"
                        >
                            <div className="text-4xl mb-3">🎮</div>
                            <h3 className="text-xl font-bold mb-2">Adventure Modus</h3>
                            <p className="text-sm text-white/80">
                                Samle Gangemon, bruk power-ups og fullfør daglige utfordringer!
                            </p>
                        </button>
                    </div>
                </div>
            )}

            {/* Tabell valg - kun vis hvis spillmodus er valgt */}
            {gameMode && (
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">Velg tabell:</h2>
                        <button
                            onClick={() => setGameMode(null)}
                            className="text-white/80 hover:text-white text-sm"
                        >
                            ← Tilbake til modus
                        </button>
                    </div>
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
            )}

            {/* Start knapper - kun vis hvis spillmodus og tabell er valgt */}
            {gameMode && (
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
                <button
                    onClick={handleStart}
                    className="bg-green-500 hover:bg-green-600 text-white text-2xl md:text-3xl font-bold py-4 md:py-6 px-8 md:px-12 rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-2xl w-full md:w-auto"
                >
                        🚀 START {gameMode === 'classic' ? 'KLASSISK' : 'ADVENTURE'}
                </button>
                    {gameMode === 'adventure' && (
                <button
                    onClick={() => onStartRush(selectedTable)}
                    className="bg-orange-500 hover:bg-orange-600 text-white text-xl md:text-2xl font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-xl w-full md:w-auto"
                >
                    ⏱️ Rush 60s
                </button>
                    )}
            </div>
            )}

            {/* Kompakt navigasjon */}
            <div className="flex justify-center gap-3">
                <button aria-label="Åpne avatarvalg"
                    onClick={() => setShowAvatarSelect(!showAvatarSelect)}
                    className="p-3 rounded-xl text-white font-bold transition-all duration-200 bg-blue-500 hover:bg-blue-600"
                    title="Avatars"
                >
                    👤
                </button>
                <button aria-label="Åpne temavelger"
                    onClick={() => setShowThemeSelect(!showThemeSelect)}
                    className="p-3 rounded-xl text-white font-bold transition-all duration-200 bg-green-500 hover:bg-green-600"
                    title="Temaer"
                >
                    🎨
                </button>
                <button aria-label="Åpne power-ups"
                    onClick={() => setShowPowerUps(!showPowerUps)}
                    className="p-3 rounded-xl text-white font-bold transition-all duration-200 bg-purple-500 hover:bg-purple-600"
                    title="Power-ups"
                >
                    ⚡
                </button>
                <button aria-label="Åpne lydinnstillinger"
                    onClick={() => setShowSoundSelect(!showSoundSelect)}
                    className="p-3 rounded-xl text-white font-bold transition-all duration-200 bg-pink-500 hover:bg-pink-600"
                    title="Lyd"
                >
                    🎵
                </button>
                <button aria-label="Åpne statistikk"
                    onClick={onShowStats}
                    className="p-3 rounded-xl text-white font-bold transition-all duration-200 bg-indigo-500 hover:bg-indigo-600"
                    title="Statistikk"
                >
                    📊
                </button>
                {/* Gangemon button temporarily removed */}
                <button aria-label="Åpne badges"
                    onClick={onShowBadges}
                    className="p-3 rounded-xl text-white font-bold transition-all duration-200 bg-yellow-500 hover:bg-yellow-600"
                    title="Badge Collection"
                >
                    🏅
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
                {/* Gangemon button temporarily removed */}
                <button
                    onClick={onShowBadges}
                    className="p-2 rounded-lg text-white font-bold transition-all duration-200 bg-yellow-500 hover:bg-yellow-600"
                >
                    🏅 Badges
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
const Game = ({ selectedTable, onBackToMenu, onScoreUpdate, onGameOver, mode = 'normal', playSfx, triggerConfetti, powerUps, usePowerUp }) => {
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [animation, setAnimation] = useState('');
    const [showCorrectAnimation, setShowCorrectAnimation] = useState(false);
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
            setAnimation('animate-bounce-in');
            setShowCorrectAnimation(true);
            const newStreak = streak + 1;
            setStreak(newStreak);
            onScoreUpdate(10 + (newStreak * 2), true, answerTime, newStreak);
            playSfx('correct');
            triggerConfetti();
            setCorrectCount(c => c + 1);
            
            setTimeout(() => {
                setShowCorrectAnimation(false);
                setAnimation('');
                generateNewQuestion();
            }, 1500);
        } else {
            setFeedback(`❌ Feil svar. Riktig svar er ${currentQuestion.answer}. Prøv igjen!`);
            setAnimation('animate-shake');
            setStreak(0);
            playSfx('wrong');
            onScoreUpdate(0, false);
            
            setTimeout(() => {
                setAnimation('');
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
                    className="bg-red-500 hover:bg-red-600 text-white text-xl font-bold py-3 px-6 rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                    ← Tilbake til meny
                </button>
                <div className="flex items-center gap-4 text-white text-xl">
                    {mode === 'rush' && (
                        <span>⏱️ {timeLeft}s</span>
                    )}
                    <span>🔥 Streak: {streak}</span>
                </div>
            </div>

            {/* Power-ups - kun i adventure mode */}
            {mode === 'adventure' && powerUps && (
                <div className="mb-6 bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                    <h3 className="text-lg font-bold text-white mb-3">⚡ Power-ups</h3>
                    <div className="flex gap-3 flex-wrap">
                        <button
                            onClick={() => usePowerUp('double')}
                            disabled={powerUps.double.active || powerUps.double.uses <= 0}
                            className={`px-3 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                                powerUps.double.active 
                                    ? 'bg-green-500 text-white' 
                                    : powerUps.double.uses > 0 
                                        ? 'bg-blue-500 text-white hover:bg-blue-600' 
                                        : 'bg-gray-500 text-white/50'
                            }`}
                        >
                            💎 2x Poeng {powerUps.double.active ? '(Aktiv)' : `(${powerUps.double.uses})`}
                        </button>
                        <button
                            onClick={() => usePowerUp('hint')}
                            disabled={powerUps.hint.uses <= 0}
                            className={`px-3 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                                powerUps.hint.uses > 0 
                                    ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                                    : 'bg-gray-500 text-white/50'
                            }`}
                        >
                            💡 Hint ({powerUps.hint.uses})
                        </button>
                        <button
                            onClick={() => usePowerUp('time')}
                            disabled={powerUps.time.uses <= 0}
                            className={`px-3 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                                powerUps.time.uses > 0 
                                    ? 'bg-purple-500 text-white hover:bg-purple-600' 
                                    : 'bg-gray-500 text-white/50'
                            }`}
                        >
                            ⏰ Ekstra Tid ({powerUps.time.uses})
                        </button>
                    </div>
                </div>
            )}

            {/* Klassisk modus info */}
            {mode === 'normal' && (
                <div className="mb-6 bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                    <h3 className="text-lg font-bold text-white mb-2">📚 Klassisk Modus</h3>
                    <p className="text-white/80 text-sm">
                        Fokus på læring og repetisjon. Ingen power-ups eller Gangemon, bare ren gangetabell-trening.
                    </p>
                </div>
            )}

            <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 mb-8">
                <h2 className="text-4xl font-bold text-white mb-8">
                    {mode === 'adventure' ? '🎮 Adventure Mode' : '📚 Klassisk Modus'} - {selectedTable ? `${selectedTable}-gangen` : 'Blandet oppgaver'}
                </h2>
                
                <div className={`text-6xl font-bold text-white mb-8 transition-all duration-300 ${animation} relative`}>
                    {currentQuestion.question} = ?
                    {showCorrectAnimation && (
                        <div className="absolute -top-4 -right-4 text-4xl animate-sparkle">✨</div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                    {answers.map((answer, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswer(answer)}
                            disabled={selectedAnswer}
                            className={`p-6 rounded-2xl text-3xl font-bold transition-all duration-300 transform ${
                                selectedAnswer === answer
                                    ? answer === currentQuestion.answer
                                        ? 'bg-green-500 text-white scale-110 shadow-2xl animate-pulse'
                                        : 'bg-red-500 text-white scale-95 animate-shake'
                                    : selectedAnswer && answer === currentQuestion.answer
                                        ? 'bg-green-500 text-white scale-110 shadow-2xl animate-pulse'
                                        : 'bg-white/30 text-white hover:bg-white/50 hover:scale-105 hover:shadow-lg'
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
    // Gangemon V1 state
    const [gangemon, setGangemon] = useState([]); // owned ids
    const [pendingGangemon, setPendingGangemon] = useState([]); // queue for modal
    const [showNewGangemon, setShowNewGangemon] = useState(false);
    const [showBadgeCollection, setShowBadgeCollection] = useState(false);
    
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
        setPowerUps(normalizePowerUps(data.powerUps));
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
        // Gangemon V1: load owned and pending if present
        setGangemon(Array.isArray(data.gangemon) ? data.gangemon : []);
        setPendingGangemon(Array.isArray(data.pendingGangemon) ? data.pendingGangemon : []);
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
                badges,
                gangemon,
                pendingGangemon
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
                gangemon: [],
                pendingGangemon: [],
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

    const handleStartGame = (table, gameMode = 'classic') => {
        setSelectedTable(table);
        setMode(gameMode === 'adventure' ? 'adventure' : 'normal');
        // V1: Gi start-common første gang Adventure åpnes for bruker uten noen gangemon
        if (gameMode === 'adventure' && gangemon.length === 0) {
            const commons = GANGEMON.filter(g => g.rarity === 'common');
            const random = commons[Math.floor(Math.random() * commons.length)];
            if (random && !gangemon.includes(random.id)) {
                setGangemon([random.id]);
                setPendingGangemon([random.id]);
                setShowNewGangemon(true);
            }
        }
        setCurrentView('game');
    };

    const handleStartRush = (table) => {
        setSelectedTable(table);
        setMode('rush');
        setCurrentView('game');
    };

    const handleBackToMenu = () => {
        setCurrentView('menu');
        // Reset game mode when going back to menu
        setSelectedTable(null);
        setMode('normal');
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

    const handleScoreUpdate = (points, isCorrect, answerTime, currentStreak = 0) => {
        let finalPoints = points;
        
        // 2x poeng power-up
        if (powerUps?.double?.active && Date.now() < (powerUps?.double?.endTime || 0)) {
            finalPoints *= 2;
        }

        const newScore = score + finalPoints;
        setScore(newScore);
        localStorage.setItem('gangetabell-score', newScore.toString());

        // Oppdater stats (kombiner begge oppdateringene i én)
        setStats(prev => {
            const tableKey = selectedTable || 'mixed';
            const tableStats = prev.tableStats || {};
            const currentTableStats = tableStats[tableKey] || { correct: 0, total: 0 };
            
            return {
                ...prev,
                // Oppdater totalCorrect og dailyCorrect hvis riktig svar
                ...(isCorrect && {
                    totalCorrect: prev.totalCorrect + 1,
                    dailyCorrect: prev.dailyCorrect + 1,
                    fastestAnswer: Math.min(prev.fastestAnswer, answerTime || 999999)
                }),
                // Oppdater statistikk per gangetabell
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
        const newBadges = [];
        if (newScore >= 100 && !badges.includes('100-poeng')) newBadges.push('100-poeng');
        if (newScore >= 500 && !badges.includes('500-poeng')) newBadges.push('500-poeng');
        if (newScore >= 1000 && !badges.includes('1000-poeng')) newBadges.push('1000-poeng');
        
        // Sjekk streak badges
        if (currentStreak >= 5 && !badges.includes('5-paa-rad')) newBadges.push('5-paa-rad');
        if (currentStreak >= 10 && !badges.includes('10-paa-rad')) newBadges.push('10-paa-rad');
        if (currentStreak >= 20 && !badges.includes('20-paa-rad')) newBadges.push('20-paa-rad');
        
        // Sjekk speed badge
        if (answerTime && answerTime < 2000 && !badges.includes('speed-demon')) newBadges.push('speed-demon');
        
        if (newBadges.length > 0) {
            const updated = [...badges, ...newBadges];
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

        // Gangemon V1 unlock (Adventure only, 1 per riktig svar)
        // Kun når en terskel passeres (ikke hver gang noe er «tilgjengelig»)
        if (mode === 'adventure' && isCorrect) {
            const previousTotal = stats.totalCorrect;
            const updatedTotalCorrect = previousTotal + 1;
            // Starter‑commons håndteres separat ved oppstart; ignorer unlockAt === 0 her
            const next = GANGEMON.find(g => g.unlockAt > 0 &&
                previousTotal < g.unlockAt && g.unlockAt <= updatedTotalCorrect &&
                !gangemon.includes(g.id));
            if (next) {
                setGangemon(prev => [...prev, next.id]);
                setPendingGangemon(prev => [...prev, next.id]);
                setShowNewGangemon(true);
            }
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
        // Reset game mode when game ends
        setSelectedTable(null);
        setMode('normal');
    };

    const handleDeleteCurrentUser = () => {
        if (!currentUser) return;
        if (!confirm(`Slette bruker "${currentUser}"? Dette kan ikke angres.`)) return;
        deleteUserData(currentUser);
        localStorage.removeItem('gangetabell-current-user');
        setCurrentUserState(null);
        setUserData(null);
        setScore(0);
        setCurrentView('userSelect');
    };

    // Gangemon handlers temporarily removed

    const handleShowBadges = () => {
        setShowBadgeCollection(true);
    };

    const handleCloseBadges = () => {
        setShowBadgeCollection(false);
    };

    return (
        <div className={`min-h-screen flex items-center justify-center ${currentTheme.class}`}>
            <div className="w-full max-w-4xl">
                {/* Audio elementer fjernet - bruker Web Audio API */}
                <ConfettiLayer burst={confettiBurst} />
                
                {/* Power-up indikator */}
                {powerUps?.double?.active && Date.now() < (powerUps?.double?.endTime || 0) && (
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
                        onDeleteCurrentUser={handleDeleteCurrentUser}
                        // Gangemon props temporarily removed
                        badges={badges}
                        onShowBadges={handleShowBadges}
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
                        onScoreUpdate={(points, isCorrect, answerTime, currentStreak) => {
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
                            handleScoreUpdate(points, isCorrect, answerTime, currentStreak);
                        }}
                        onGameOver={handleGameOver}
                        mode={mode}
                        playSfx={playSfx}
                        triggerConfetti={triggerConfetti}
                        powerUps={powerUps}
                        usePowerUp={usePowerUp}
                    />
                )}
                
                {currentView === 'menu' && lastRushSummary && (
                    <div className="mt-6 bg-white/30 backdrop-blur-sm rounded-2xl p-5 text-white">
                        <div className="text-2xl font-bold mb-2">⏱️ Rush resultater</div>
                        <div className="text-lg">Riktig: <span className="font-bold">{lastRushSummary.correct}</span> av {lastRushSummary.total}</div>
                        <div className="text-lg mb-4">Bra jobbet! Prøv igjen og slå rekorden din! 🏆</div>
                        <button
                            onClick={() => setLastRushSummary(null)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-bold transition-all duration-200"
                        >
                            ✕ Lukk resultater
                        </button>
                    </div>
                )}
                
                {badges.length > 0 && currentView === 'menu' && (
                    <div className="mt-6 bg-white/30 backdrop-blur-sm rounded-2xl p-4 text-white">
                        <div className="font-bold mb-2">🏅 Dine merker ({badges.length}):</div>
                        <div className="flex gap-2 flex-wrap">
                            {badges.includes('5-paa-rad') && <span className="px-2 py-1 rounded-lg bg-green-500 text-white text-sm">🔥 5 på rad</span>}
                            {badges.includes('10-paa-rad') && <span className="px-2 py-1 rounded-lg bg-blue-500 text-white text-sm">⚡ 10 på rad</span>}
                            {badges.includes('20-paa-rad') && <span className="px-2 py-1 rounded-lg bg-purple-500 text-white text-sm">🌟 20 på rad</span>}
                            {badges.includes('100-poeng') && <span className="px-2 py-1 rounded-lg bg-yellow-500 text-black text-sm">💯 100 poeng</span>}
                            {badges.includes('500-poeng') && <span className="px-2 py-1 rounded-lg bg-orange-500 text-white text-sm">🏆 500 poeng</span>}
                            {badges.includes('1000-poeng') && <span className="px-2 py-1 rounded-lg bg-red-500 text-white text-sm">👑 1000 poeng</span>}
                            {badges.includes('speed-demon') && <span className="px-2 py-1 rounded-lg bg-indigo-500 text-white text-sm">⚡ Speed Demon</span>}
                            {badges.includes('perfectionist') && <span className="px-2 py-1 rounded-lg bg-pink-500 text-white text-sm">💎 Perfeksjonist</span>}
                            {badges.includes('daily-warrior') && <span className="px-2 py-1 rounded-lg bg-teal-500 text-white text-sm">🗡️ Daglig Kriger</span>}
                            {/* {badges.includes('gangemon-master') && <span className="px-2 py-1 rounded-lg bg-cyan-500 text-white text-sm">🎮 Gangemon Mester</span>} */}
                        </div>
                    </div>
                )}

                {/* New Gangemon Unlock Modal (V1) */}
                {showNewGangemon && pendingGangemon.length > 0 && (
                    <Modal onClose={() => { setPendingGangemon(prev => prev.slice(1)); setShowNewGangemon(prev => prev && pendingGangemon.length - 1 > 0); }}>
                            <h2 id="modal-title" className="text-3xl font-bold text-white mb-4">🎉 Ny Gangemon!</h2>
                            {(() => {
                                const id = pendingGangemon[0];
                                const g = GANGEMON.find(x => x.id === id);
                                if (!g) return null;
                                return (
                                    <div className="mb-4">
                                        <div className="text-6xl mb-2 animate-bounce">{g.emoji}</div>
                                        <h3 className="text-2xl font-bold text-white mb-2">{g.name}</h3>
                                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold text-white ${
                                            g.rarity === 'common' ? 'bg-gray-500' :
                                            g.rarity === 'rare' ? 'bg-blue-500' :
                                            g.rarity === 'legendary' ? 'bg-purple-500' :
                                            'bg-yellow-500'
                                        }`}>
                                            {g.rarity.toUpperCase()}
                                        </div>
                                    </div>
                                );
                            })()}
                        <button
                            onClick={() => {
                                setPendingGangemon(prev => prev.slice(1));
                                setShowNewGangemon(prev => prev && pendingGangemon.length - 1 > 0);
                            }}
                            className="bg-white text-purple-600 px-6 py-3 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors"
                            aria-label="Lukk og gå videre"
                        >
                            Fantastisk! 🚀
                        </button>
                    </Modal>
                )}

                {/* Badge Collection Modal */}
                {showBadgeCollection && (
                    <BadgeCollection 
                        badges={badges}
                        onClose={handleCloseBadges}
                    />
                )}

                {/* Enkel Gangemon-oversikt i meny */}
                {currentView === 'menu' && gangemon.length > 0 && (
                    <div className="mt-6 bg-white/30 backdrop-blur-sm rounded-2xl p-4 text-white">
                        <div className="flex items-center justify-between">
                            <div className="font-bold">🎮 Gangemon: {gangemon.length}</div>
                            <div className="flex gap-2 flex-wrap">
                                {gangemon.slice(0,6).map(id => {
                                    const g = GANGEMON.find(x => x.id === id);
                                    return <span key={id} className="text-2xl" title={g?.name}>{g?.emoji || '❓'}</span>
                                })}
                                {gangemon.length > 6 && <span className="opacity-80">+{gangemon.length - 6}</span>}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

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

// Legg til CSS-animasjoner
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes bounce-in {
        0% { transform: scale(0.3); opacity: 0; }
        50% { transform: scale(1.05); }
        70% { transform: scale(0.9); }
        100% { transform: scale(1); opacity: 1; }
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }
    
    @keyframes sparkle {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(1.2); }
    }
    
    .animate-shake {
        animation: shake 0.5s ease-in-out;
    }
    
    .animate-bounce-in {
        animation: bounce-in 0.6s ease-out;
    }
    
    .animate-float {
        animation: float 2s ease-in-out infinite;
    }
    
    .animate-sparkle {
        animation: sparkle 1s ease-in-out infinite;
    }
    
    .confetti-piece {
        position: absolute;
        animation: confetti-fall 3s linear infinite;
    }
    
    @keyframes confetti-fall {
        0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Render appen
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<><App /><InstallButton /></>);
