"use client";

import { useState } from "react";
import TypingArea from "./TypingArea";
import ResultsCard from "./ResultsCard";
import Timer from "./Timer";
import { generateRandomText } from "@/lib/TextGenerator";

export default function TestClientWrapper() {
    const [text, setText] = useState<string[]>(generateRandomText());
    const [isRunning, setIsRunning] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [results, setResults] = useState<null | {
        wpm: number; 
        accuracy: number; 
        errors: number
     }>(null);

    const handleTimeUp = () => {
        setIsFinished(true);
        setIsRunning(false);
    }

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
        <>
            {!results && (
                <>
                    <Timer
                        duration={15}
                        onTimeUp={handleTimeUp}
                        isRunning={isRunning}
                    />
                    <TypingArea
                        text={text}
                        onComplete={handleComplete}
                        isActive={isRunning}
                        setIsRunning={setIsRunning}
                        isFinished={isFinished}
                    />
                </>
            )}

            {results && (
                <ResultsCard
                    wpm={results.wpm}
                    accuracy={results.accuracy}
                    errors={results.errors}
                    onRestart={handleRestart}
                />
            )}
        </>
    );
}
