"use client";

import { useState } from "react";
import TypingArea from "./TypingArea";
import ResultsCard from "./ResultsCard";
import Timer from "./Timer";
import { generateRandomText } from "@/lib/TextGenerator";
import { Time } from "./Timer";

export default function TestClientWrapper() {
    const [text, setText] = useState<string[]>(generateRandomText());
    const [isRunning, setIsRunning] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [duration, setDuration] = useState<Time>(15);
    const [results, setResults] = useState<null | {
        wpm: number; 
        accuracy: number; 
        errors: number
     }>(null);

    const handleTimeUp = () => {
        setIsFinished(true);
        setIsRunning(false);
    }

    const handleDurationChange = (newDuration: Time) => {
        if (!isRunning) {
            setDuration(newDuration);
            setIsFinished(false);
            setResults(null);
            setText(generateRandomText());
        }
    };

    const handleComplete = (calculatedStats: {
        wpm: number;
        accuracy: number;
        errors: number;
    }) => {
        setResults(calculatedStats);
        setIsFinished(true);
        setIsRunning(false);
    };

    const handleRestart = () => {
        setText(generateRandomText());
        setIsRunning(false);
        setIsFinished(false);
        setResults(null);
    };

    return (
        <div className="max-h-screen flex flex-col">
            {!results && (
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
                        />
                    </div>
                </>
            )}

            {results && (
                <div className="flex-1 flex items-center justify-center">
                    <ResultsCard
                        wpm={results.wpm}
                        accuracy={results.accuracy}
                        errors={results.errors}
                        onRestart={handleRestart}
                    />
                </div>
            )}
        </div>
    );
}
