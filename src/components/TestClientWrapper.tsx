"use client";

import { useState, useEffect } from "react";
import TypingArea from "./TypingArea";
import ResultsCard from "./ResultsCard";
import Timer from "./Timer";
import { generateRandomText } from "@/lib/TextGenerator";
import { Time } from "./Timer";

export default function TestClientWrapper() {
    const [text, setText] = useState<string[]>([]); // Start empty
    const [isRunning, setIsRunning] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [duration, setDuration] = useState<Time>(15);
    const [results, setResults] = useState<null | {
        wpm: number; 
        accuracy: number; 
        errors: number;
        typingData: Array<{ second: number; wpm: number; errors: number; }>;
     }>(null);

    useEffect(() => {
        setText(generateRandomText(50));
    }, []);

    const handleTimeUp = () => {
        setIsFinished(true);
        setIsRunning(false);
    }

    const handleDurationChange = (newDuration: Time) => {
        if (!isRunning) {
            setDuration(newDuration);
            setIsFinished(false);
            setResults(null);
            setText(generateRandomText(50));
        }
    };

    const handleComplete = (calculatedStats: {
        wpm: number;
        accuracy: number;
        errors: number;
        typingData: Array<{ second: number; wpm: number; errors: number; }>;
    }) => {
        setResults(calculatedStats);
        setIsFinished(true);
        setIsRunning(false);
    };

    const handleRestart = () => {
        setText(generateRandomText(50));
        setIsRunning(false);
        setIsFinished(false);
        setResults(null);
    };

    const handleTextUpdate = (newText: string[]) => {
        setText(newText);
    };

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
                    />
                </div>
            )}
        </div>
    );
}
