"use client";

import React, { useState, useEffect } from "react";
import clsx from "clsx";

interface TypingAreaProps {
    text: string[];
    onComplete: (stats: { wpm: number; accuracy: number; errors: number }) => void;
    isActive: boolean;
    setIsRunning: (running: boolean) => void;
    isFinished?: boolean;
}

export default function TypingArea({ text, onComplete, isActive, setIsRunning, isFinished }: TypingAreaProps) {
    const [currentText, setCurrentText] = useState("");
    const [error, setError] = useState(0);
    const targetText = text.join(" ");

    useEffect(() => {
        if (isFinished) {
            // console.log("Current text:", currentText);
            // console.log("Target text:", targetText);
            
            let currentErrors = 0;
            if (currentText.length > 0) {
                currentText.split("").forEach((char, index) => {
                    if (char !== targetText[index]) {
                        currentErrors++;
                    }
                });
            }

            const minutes = 15 / 60;
            const wpm = currentText.length > 0 ? Math.round((currentText.length / 5) / minutes) : 0;
            const accuracy = currentText.length > 0 ? Math.round(((currentText.length - currentErrors) / currentText.length) * 100) : 0;

            // console.log("Calculated stats:", { wpm, accuracy, errors: currentErrors });
            onComplete({ wpm, accuracy, errors: currentErrors });
        }
    }, [isFinished, currentText, targetText, onComplete]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(!isActive) {
            setIsRunning(true);
        }

        const value = e.target.value;
        setCurrentText(value);

        let currentErrors = 0;
        value.split("").forEach((char, index) => {
            if(char !== targetText[index]) {
                currentErrors++;
            }
        });
        setError(currentErrors);

        if(value.length >= targetText.length) {
            const minutes = 15 / 60;
            const wpm = Math.round((value.length / 5) / minutes);
            const accuracy = Math.round(((value.length - currentErrors) / value.length) * 100);

            onComplete({ wpm, accuracy, errors: currentErrors });
        }
    };

    return (
        <div className="border p-4 m-4 rounded shadow flex flex-col gap-4 w-full max-w-2xl">
            <div className="flex flex-wrap text-xl leading-relaxed font-mono">
                {targetText.split("").map((char, index) => (
                    <span
                        key={index}
                        className={clsx(
                            "inline-block",
                            char === " " && "w-2",
                            index < currentText.length
                            ? currentText[index] === char
                                ? "text-green-500 bg-green-100"
                                : "text-red-500 bg-red-100"
                            : "text-gray-400"
                        )}
                    >
                        {char === " " ? "\u00A0" : char} {/* non-breaking space */}
                    </span>
                ))}
            </div>

            <input 
                type="text"
                value={currentText}
                onChange={handleChange}
                className="mt-2 w-full p-2 border rounded font-mono"
                placeholder="Start typing..."
                autoFocus
                disabled={isFinished}
            />

            <button 
                onClick={() => {
                    setCurrentText("");
                    setError(0);
                    setIsRunning(false);
                    onComplete({ wpm: 0, accuracy: 100, errors: 0 });
                }}
                className="mt-4 p-2 bg-blue-500 text-white rounded">
                    Restart
            </button>
        </div>
    );
}
