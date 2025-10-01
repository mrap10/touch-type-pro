"use client";

import { useState, useEffect, useCallback } from "react";
import TypingArea from "./TypingArea";
import ResultsCard from "./ResultsCard";
import Timer from "./Timer";
import CircularTimer from "./CircularTimer";
import { generateRandomText } from "@/lib/TextGenerator";
import { Time } from "./Timer";
import ShareCard from "./ShareCard";

export default function TestClientWrapper() {
    const [text, setText] = useState<string[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [duration, setDuration] = useState<Time>(15);
    const [timeLeft, setTimeLeft] = useState<number>(15);
    const [results, setResults] = useState<null | {
        wpm: number; 
        accuracy: number; 
        errors: number;
        typingData: Array<{ second: number; wpm: number; errors: number; }>;
     }>(null);

    useEffect(() => {
        setText(generateRandomText(100));
    }, []);

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
            setText(generateRandomText(100));
        }
    };

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
        setText(generateRandomText(100));
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
                    <div className="flex-shrink-0">
                        <Timer
                            duration={duration}
                            onTimeUp={handleTimeUp}
                            isRunning={isRunning}
                            onDurationChange={handleDurationChange}
                        />
                    </div>
                    
                    <div className="flex-shrink-0 mb-5">
                        <CircularTimer 
                            timeLeft={timeLeft}
                            duration={duration}
                            isRunning={isRunning}
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
                <div className="flex-1 flex items-center justify-center">
                    <ResultsCard
                        wpm={results.wpm}
                        accuracy={results.accuracy}
                        errors={results.errors}
                        typingData={results.typingData}
                        duration={duration}
                        onRestart={handleRestart}
                        onShare={handleShare}
                    />
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
