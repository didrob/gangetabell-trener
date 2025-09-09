// Gangetabell Trener - Hovedapp (Refaktorert)

const { useState, useEffect, useRef } = React;

// Importer komponenter
import { StartMenu } from './components/StartMenu.js';
import { Game } from './components/Game.js';
import { ConfettiLayer } from './components/ConfettiLayer.js';
import { InstallButton } from './components/InstallButton.js';

// Importer utilities
import { gameStorage } from './utils/localStorage.js';
import { soundManager } from './utils/soundEffects.js';
import { getCurrentLevel, checkTrophies, getDailyChallenge } from './data/gameLogic.js';
import { AVATARS, THEMES, POWER_UPS } from './data/constants.js';

// Hovedkomponent
const App = () => {
    // State management
    const [currentView, setCurrentView] = useState('menu');
    const [score, setScore] = useState(() => gameStorage.getScore());
    const [selectedTable, setSelectedTable] = useState(null);
    const [mode, setMode] = useState('normal');
    const [isMuted, setIsMuted] = useState(() => gameStorage.getMuted());
    const [confettiBurst, setConfettiBurst] = useState(false);
    const [badges, setBadges] = useState(() => gameStorage.getBadges());
    const [streakForBadge, setStreakForBadge] = useState(0);
    const [lastRushSummary, setLastRushSummary] = useState(null);
    
    // Nye state for alle funksjoner
    const [currentAvatar, setCurrentAvatar] = useState(() => {
        const saved = gameStorage.getAvatar();
        return saved || AVATARS[0];
    });
    const [currentTheme, setCurrentTheme] = useState(() => {
        const saved = gameStorage.getTheme();
        return saved || THEMES[0];
    });
    const [powerUps, setPowerUps] = useState({
        double: { active: false, endTime: 0 },
        hint: { uses: 0 },
        time: { uses: 0 }
    });
    const [dailyChallenge, setDailyChallenge] = useState(() => getDailyChallenge());
    const [stats, setStats] = useState(() => gameStorage.getStats());
    const [trophies, setTrophies] = useState(() => gameStorage.getTrophies());

    const currentLevel = getCurrentLevel(score);

    // Lagre state endringer
    useEffect(() => {
        gameStorage.setAvatar(currentAvatar);
    }, [currentAvatar]);

    useEffect(() => {
        gameStorage.setTheme(currentTheme);
    }, [currentTheme]);

    useEffect(() => {
        gameStorage.setStats(stats);
    }, [stats]);

    useEffect(() => {
        gameStorage.setTrophies(trophies);
    }, [trophies]);

    useEffect(() => {
        gameStorage.setMuted(isMuted);
        soundManager.setMuted(isMuted);
    }, [isMuted]);

    // Sjekk daglig progress
    useEffect(() => {
        const today = new Date().toDateString();
        if (stats.lastPlayDate !== today) {
            setStats(prev => ({ ...prev, dailyCorrect: 0, lastPlayDate: today }));
            setDailyChallenge(getDailyChallenge());
        }
    }, []);

    // Game handlers
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
                hint: { uses: prev.hint.uses + 1 }
            }));
        } else if (powerUpId === 'time') {
            setPowerUps(prev => ({
                ...prev,
                time: { uses: prev.time.uses + 1 }
            }));
        }
    };

    const handleScoreUpdate = (points, isCorrect, answerTime) => {
        let finalPoints = points;
        
        // 2x poeng power-up
        if (powerUps.double.active && Date.now() < powerUps.double.endTime) {
            finalPoints *= 2;
        }

        const newScore = score + finalPoints;
        setScore(newScore);
        gameStorage.setScore(newScore);

        // Oppdater stats
        if (isCorrect) {
            setStats(prev => ({
                ...prev,
                totalCorrect: prev.totalCorrect + 1,
                dailyCorrect: prev.dailyCorrect + 1,
                fastestAnswer: Math.min(prev.fastestAnswer, answerTime || 999999)
            }));
        }

        // Sjekk badges
        if (newScore >= 100 && !badges.includes('100-poeng')) {
            const updated = [...badges, '100-poeng'];
            setBadges(updated);
            gameStorage.setBadges(updated);
            soundManager.playBadge();
            setConfettiBurst(true);
            setTimeout(() => setConfettiBurst(false), 1200);
        }

        // Sjekk troféer
        const newTrophies = checkTrophies(stats, trophies);
        if (newTrophies.length > 0) {
            const updated = [...trophies, ...newTrophies];
            setTrophies(updated);
            soundManager.playBadge();
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
            gameStorage.setDailyChallenge(updated);
        }
    };

    const playSfx = (type) => {
        if (type === 'correct') soundManager.playCorrect();
        else if (type === 'wrong') soundManager.playWrong();
        else if (type === 'badge') soundManager.playBadge();
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
            <div className="w-full max-w-6xl">
                <ConfettiLayer burst={confettiBurst} />
                
                {/* Power-up indikator */}
                {powerUps.double.active && Date.now() < powerUps.double.endTime && (
                    <div className="fixed top-4 right-4 bg-yellow-400 text-black px-4 py-2 rounded-xl font-bold z-50 power-up-active">
                        💎 2x Poeng aktivt!
                    </div>
                )}

                {currentView === 'menu' ? (
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
                                    gameStorage.setBadges(updated);
                                    soundManager.playBadge();
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
                
                {/* Rush resultater */}
                {currentView === 'menu' && lastRushSummary && (
                    <div className="mt-6 bg-white/30 backdrop-blur-sm rounded-2xl p-5 text-white max-w-2xl mx-auto">
                        <div className="text-2xl font-bold mb-2">⏱️ Rush resultater</div>
                        <div className="text-lg">Riktig: <span className="font-bold">{lastRushSummary.correct}</span> av {lastRushSummary.total}</div>
                        <div className="text-lg">Bra jobbet! Prøv igjen og slå rekorden din! 🏆</div>
                    </div>
                )}
                
                {/* Badges */}
                {badges.length > 0 && currentView === 'menu' && (
                    <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-white max-w-2xl mx-auto">
                        <div className="font-bold mb-2">🏅 Dine merker:</div>
                        <div className="flex gap-3 flex-wrap justify-center">
                            {badges.includes('5-paa-rad') && <span className="px-3 py-1 rounded-xl bg-green-500 text-white">5 på rad</span>}
                            {badges.includes('100-poeng') && <span className="px-3 py-1 rounded-xl bg-yellow-500 text-black">100 poeng</span>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// PWA: registrer service worker hvis støttet
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
}

// Render appen
ReactDOM.render(<><App /><InstallButton /></>, document.getElementById('root'));
