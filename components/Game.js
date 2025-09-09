// Gangetabell Trener - Game komponent

import { generateQuestion, generateWrongAnswers } from '../data/gameLogic.js';

const { useState, useEffect, useRef } = React;

export const Game = ({ 
    selectedTable, 
    onBackToMenu, 
    onScoreUpdate, 
    onGameOver, 
    mode = 'normal', 
    playSfx, 
    triggerConfetti, 
    powerUps 
}) => {
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [animation, setAnimation] = useState('');
    const [streak, setStreak] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [totalCount, setTotalCount] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    
    const intervalRef = useRef(null);
    const startTimeRef = useRef(null);

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
        setIsLoading(true);
        setTimeout(() => {
            const question = generateQuestion(selectedTable);
            const wrongAnswers = generateWrongAnswers(question.answer);
            const allAnswers = [question.answer, ...wrongAnswers].sort(() => Math.random() - 0.5);
            
            setCurrentQuestion(question);
            setAnswers(allAnswers);
            setSelectedAnswer(null);
            setFeedback('');
            setAnimation('');
            setIsLoading(false);
        }, 200);
    };

    const handleAnswer = (answer) => {
        if (selectedAnswer || isLoading) return;
        
        startTimeRef.current = Date.now();
        setSelectedAnswer(answer);
        
        setTotalCount(c => c + 1);
        if (answer === currentQuestion.answer) {
            const answerTime = Date.now() - startTimeRef.current;
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

    if (isLoading) {
        return (
            <div className="text-center p-8">
                <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8">
                    <div className="text-4xl mb-4">⏳</div>
                    <div className="text-2xl text-white font-bold">Laster oppgave...</div>
                </div>
            </div>
        );
    }

    if (!currentQuestion) return <div>Laster...</div>;

    return (
        <div className="text-center p-4 md:p-8">
            {/* Header med navigasjon og info */}
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={onBackToMenu}
                    className="bg-red-500 hover:bg-red-600 text-white text-lg md:text-xl font-bold py-2 md:py-3 px-4 md:px-6 rounded-xl md:rounded-2xl transition-all duration-200 transform hover:scale-105"
                >
                    ← Tilbake
                </button>
                <div className="flex items-center gap-3 md:gap-4 text-white text-lg md:text-xl">
                    {mode === 'rush' && (
                        <div className="bg-yellow-500 text-black px-3 py-1 rounded-lg font-bold">
                            ⏱️ {timeLeft}s
                        </div>
                    )}
                    <div className="bg-orange-500 text-white px-3 py-1 rounded-lg font-bold">
                        🔥 {streak}
                    </div>
                </div>
            </div>

            {/* Spillområde */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 mb-6">
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">
                    {selectedTable ? `${selectedTable}-gangen` : 'Blandet oppgaver'}
                </h2>
                
                <div className={`text-4xl md:text-6xl font-bold text-white mb-8 ${animation}`}>
                    {currentQuestion.question} = ?
                </div>

                <div className="grid grid-cols-2 gap-4 md:gap-6">
                    {answers.map((answer, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswer(answer)}
                            disabled={selectedAnswer || isLoading}
                            className={`p-4 md:p-6 rounded-xl md:rounded-2xl text-2xl md:text-3xl font-bold transition-all duration-200 transform hover:scale-105 ${
                                selectedAnswer === answer
                                    ? answer === currentQuestion.answer
                                        ? 'bg-green-500 text-white scale-105'
                                        : 'bg-red-500 text-white scale-105'
                                    : selectedAnswer && answer === currentQuestion.answer
                                        ? 'bg-green-500 text-white scale-105'
                                        : 'bg-white/30 text-white hover:bg-white/50'
                            }`}
                        >
                            {answer}
                        </button>
                    ))}
                </div>

                {feedback && (
                    <div className={`mt-6 text-xl md:text-2xl font-bold ${animation}`}>
                        {feedback}
                    </div>
                )}
            </div>

            {/* Progress indikator */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-white text-lg">
                    Riktig: <span className="font-bold text-green-400">{correctCount}</span> av <span className="font-bold">{totalCount}</span>
                </div>
                {totalCount > 0 && (
                    <div className="mt-2 bg-white/20 rounded-full h-2">
                        <div 
                            className="bg-green-400 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(correctCount / totalCount) * 100}%` }}
                        ></div>
                    </div>
                )}
            </div>
        </div>
    );
};
