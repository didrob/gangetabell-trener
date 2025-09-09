// Gangetabell Trener - Confetti komponent

import { CONFETTI_COLORS } from '../data/constants.js';

const { useState, useEffect } = React;

export const ConfettiLayer = ({ burst }) => {
    const [pieces, setPieces] = useState([]);

    useEffect(() => {
        if (burst) {
            setPieces(Array.from({ length: 20 }));
        } else {
            setPieces([]);
        }
    }, [burst]);

    if (!burst || pieces.length === 0) return null;

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
                    {CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]}
                </div>
            ))}
        </div>
    );
};
