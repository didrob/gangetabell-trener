// Gangetabell Trener - StartMenu komponent

import { POWER_UPS, THEMES, TROPHIES } from '../data/constants.js';
import { getAvailableAvatars, getAvailableStickers } from '../data/gameLogic.js';

const { useState } = React;

export const StartMenu = ({ 
    onStartGame, 
    onStartRush, 
    currentLevel, 
    score, 
    isMuted, 
    setIsMuted, 
    currentAvatar, 
    setCurrentAvatar, 
    currentTheme, 
    setCurrentTheme, 
    powerUps, 
    usePowerUp, 
    dailyChallenge 
}) => {
    const [selectedTable, setSelectedTable] = useState(null);
    const [showAvatarSelect, setShowAvatarSelect] = useState(false);
    const [showThemeSelect, setShowThemeSelect] = useState(false);
    const [showStickers, setShowStickers] = useState(false);
    const [showTrophies, setShowTrophies] = useState(false);
    const [showPowerUps, setShowPowerUps] = useState(false);

    const handleStart = () => {
        onStartGame(selectedTable);
    };

    const availableAvatars = getAvailableAvatars(score);
    const availableStickers = getAvailableStickers(score);

    return (
        <div className="text-center p-4 md:p-8 max-w-6xl mx-auto">
            {/* Hovedtittel */}
            <h1 className="text-4xl md:text-6xl font-bold rainbow-text mb-6">
                🎯 Gangetabell Trener
            </h1>
            
            {/* Avatar og nivå info */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <span className="text-3xl md:text-4xl">{currentAvatar.emoji}</span>
                    <div className="text-center md:text-left">
                        <p className="text-lg md:text-xl text-white font-bold">{currentAvatar.name}</p>
                        <p className="text-base md:text-lg text-white">
                            {currentLevel.emoji} {currentLevel.name} · <span className="font-bold">{score}</span> poeng
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setIsMuted(v => !v)}
                    className={`px-4 py-2 rounded-xl text-white font-bold transition-all duration-200 ${
                        isMuted ? 'bg-gray-500' : 'bg-indigo-500 hover:bg-indigo-600'
                    }`}
                    aria-label="Lyd av/på"
                >
                    {isMuted ? '🔇 Lyd av' : '🔊 Lyd på'}
                </button>
            </div>

            {/* Daglig utfordring */}
            {dailyChallenge && !dailyChallenge.completed && (
                <div className="bg-yellow-500/20 backdrop-blur-sm rounded-2xl p-4 mb-6 text-white">
                    <h3 className="text-lg md:text-xl font-bold mb-2">🎯 Daglig utfordring</h3>
                    <p className="text-base md:text-lg mb-3">{dailyChallenge.description}</p>
                    <div className="bg-white/20 rounded-full h-4">
                        <div 
                            className="bg-yellow-400 h-4 rounded-full transition-all duration-300"
                            style={{ width: `${(dailyChallenge.progress / dailyChallenge.target) * 100}%` }}
                        ></div>
                    </div>
                    <p className="text-sm mt-2">{dailyChallenge.progress}/{dailyChallenge.target}</p>
                </div>
            )}

            {/* Tabell valg */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Velg hvilken tabell du vil øve på:</h2>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 mb-6">
                    {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(table => (
                        <button
                            key={table}
                            onClick={() => setSelectedTable(selectedTable === table ? null : table)}
                            className={`p-3 md:p-4 rounded-xl md:rounded-2xl text-lg md:text-2xl font-bold transition-all duration-200 ${
                                selectedTable === table 
                                    ? 'bg-yellow-400 text-black transform scale-105' 
                                    : 'bg-white/30 text-white hover:bg-white/50'
                            }`}
                        >
                            {table}-gangen
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => setSelectedTable(null)}
                    className={`p-3 md:p-4 rounded-xl md:rounded-2xl text-lg md:text-2xl font-bold transition-all duration-200 ${
                        selectedTable === null 
                            ? 'bg-yellow-400 text-black transform scale-105' 
                            : 'bg-white/30 text-white hover:bg-white/50'
                    }`}
                >
                    🎲 Blande alle tabeller
                </button>
            </div>

            {/* Start knapper */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
                <button
                    onClick={handleStart}
                    className="bg-green-500 hover:bg-green-600 text-white text-2xl md:text-3xl font-bold py-4 md:py-6 px-8 md:px-12 rounded-2xl md:rounded-3xl transition-all duration-200 transform hover:scale-105 shadow-2xl w-full md:w-auto"
                >
                    🚀 Start Spill!
                </button>
                <button
                    onClick={() => onStartRush(selectedTable)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black text-2xl md:text-3xl font-bold py-4 md:py-6 px-8 md:px-12 rounded-2xl md:rounded-3xl transition-all duration-200 transform hover:scale-105 shadow-2xl w-full md:w-auto"
                >
                    ⏱️ Rush 60s
                </button>
            </div>

            {/* Navigasjonsknapper */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
                <button
                    onClick={() => setShowAvatarSelect(!showAvatarSelect)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl font-bold transition-all duration-200"
                >
                    👤 Avatars
                </button>
                <button
                    onClick={() => setShowThemeSelect(!showThemeSelect)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl font-bold transition-all duration-200"
                >
                    🎨 Temaer
                </button>
                <button
                    onClick={() => setShowPowerUps(!showPowerUps)}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-xl font-bold transition-all duration-200"
                >
                    ⚡ Power-ups
                </button>
                <button
                    onClick={() => setShowStickers(!showStickers)}
                    className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-3 rounded-xl font-bold transition-all duration-200"
                >
                    🏷️ Klistremerker
                </button>
            </div>

            {/* Power-ups seksjon */}
            {showPowerUps && (
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-6">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3">⚡ Power-ups</h3>
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

            {/* Avatar selector */}
            {showAvatarSelect && (
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-6">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3">👤 Velg Avatar</h3>
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
                                {score < avatar.unlockScore && (
                                    <div className="text-xs opacity-75">🔒 Låst</div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Theme selector */}
            {showThemeSelect && (
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-6">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3">🎨 Velg Tema</h3>
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

            {/* Stickers */}
            {showStickers && (
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-6">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3">🏷️ Dine Klistremerker</h3>
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                        {availableStickers.map(sticker => (
                            <div key={sticker.id} className="text-center">
                                <div className="text-3xl sparkle">{sticker.emoji}</div>
                                <div className="text-xs text-white">{sticker.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Trophies */}
            {showTrophies && (
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-6">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3">🏆 Troféer</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {TROPHIES.map(trophy => (
                            <div key={trophy.id} className="flex items-center gap-3 p-2 bg-white/10 rounded-xl">
                                <span className="text-2xl">{trophy.emoji}</span>
                                <div>
                                    <div className="text-white font-bold">{trophy.name}</div>
                                    <div className="text-sm text-white/80">{trophy.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
