"use client";

import { useState, useEffect, useCallback } from "react";
import TypingArea from "./TypingArea";
import ResultsCard from "./ResultsCard";
import Timer from "./Timer";
import CircularTimer from "./CircularTimer";
import { generateRandomText, type Difficulty } from "@/lib/TextGenerator";
import { Time } from "./Timer";
import ShareCard from "./ShareCard";
import Mode from "./Mode";

export default function TestClientWrapper() {
    const [text, setText] = useState<string[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [duration, setDuration] = useState<Time>(15);
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [timeLeft, setTimeLeft] = useState<number>(15);
    const [results, setResults] = useState<null | {
        wpm: number; 
        accuracy: number; 
        errors: number;
        typingData: Array<{ second: number; wpm: number; errors: number; }>;
     }>(null);

    useEffect(() => {
        setText(generateRandomText(undefined, difficulty));
    }, [difficulty]);

    useEffect(() => {
        setTimeLeft(duration);
    }, [duration]);

    useEffect(() => {
        if (!isRunning) return;

        if (timeLeft <= 0) {
            handleTimeUp();
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, timeLeft]);

    const handleTimeUp = () => {
        setIsFinished(true);
        setIsRunning(false);
    }

    const handleDurationChange = (newDuration: Time) => {
        if (!isRunning) {
            setDuration(newDuration);
            setTimeLeft(newDuration);
            setIsFinished(false);
            setResults(null);
            setIsRunning(false);
            setText(generateRandomText(undefined, difficulty));
        }
    };

    const handleModeChange = (newDifficulty: Difficulty) => {
        if (!isRunning) {
            setDifficulty(newDifficulty);
            setIsFinished(false);
            setResults(null);
            setIsRunning(false);
            setText(generateRandomText(undefined, newDifficulty));
        }
    }

    const handleComplete = useCallback((calculatedStats: {
        wpm: number;
        accuracy: number;
        errors: number;
        typingData: Array<{ second: number; wpm: number; errors: number; }>;
    }) => {
        setResults(calculatedStats);
        setIsFinished(true);
        setIsRunning(false);
    }, []);

    const handleRestart = () => {
        setText(generateRandomText(undefined, difficulty));
        setIsRunning(false);
        setIsFinished(false);
        setResults(null);
        setTimeLeft(duration);
    };

    const handleShare = () => {
        setIsShareOpen(true);
    }

    const handleTextUpdate = useCallback((newText: string[]) => {
        setText(newText);
    }, []);

    return (
        <div className="max-h-screen flex flex-col">
            {!results && text.length > 0 && (
                <>
                    <div className="flex-shrink-0 flex justify-around items-center">
                        <div>
                            <Mode
                                difficulty={difficulty}
                                onTimeUp={handleTimeUp}
                                isRunning={isRunning}
                                onModeChange={handleModeChange}
                            />
                        </div>
                        <Timer
                            duration={duration}
                            onTimeUp={handleTimeUp}
                            isRunning={isRunning}
                            onDurationChange={handleDurationChange}
                        />
                    </div>
                    
                    <div className="flex-shrink-0">
                        <CircularTimer 
                            timeLeft={timeLeft}
                            duration={duration}
                        />
                    </div>
                    
                    <div className="flex-1">
                        <TypingArea
                            text={text}
                            onComplete={handleComplete}
                            isActive={isRunning}
                            setIsRunning={setIsRunning}
                            isFinished={isFinished}
                            duration={duration}
                            difficulty={difficulty}
                            onTextUpdate={handleTextUpdate}
                        />
                    </div>

                </>
            )}

            {!results && text.length === 0 && (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-xl text-gray-500">Loading words...</div>
                </div>
            )}

            {results && (
                <div className="flex-1 flex flex-col items-center justify-center">
                    <ResultsCard
                        wpm={results.wpm}
                        accuracy={results.accuracy}
                        errors={results.errors}
                        typingData={results.typingData}
                        duration={duration}
                        onRestart={handleRestart}
                        onShare={handleShare}
                    />
                    <div className="mt-10 flex items-center justify-center">
                        <p className="font-mono text-gray-500 dark:text-gray-400">🛠️ We are working to improve your typing experience. If you encounter any bugs, please report them.</p>
                        <button className="text-sm font-bold p-2 bg-emerald-500 text-white dark:text-black cursor-pointer rounded-lg ml-4 hover:bg-emerald-600 transition-colors duration-200">
                            Report
                        </button>
                    </div>
                </div>
            )}

            {isShareOpen && 
                <ShareCard 
                    isOpen={isShareOpen}
                    onClose={() => setIsShareOpen(false)}
                    wpm={results ? results.wpm : 0}
                    accuracy={results ? results.accuracy : 0}
                    errors={results ? results.errors : 0}
                    time={duration}
                />
            }
        </div>
    );
}
