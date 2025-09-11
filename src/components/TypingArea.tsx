"use client";

import React, { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { RotateCcw } from "lucide-react";

interface TypingAreaProps {
    text: string[];
    onComplete: (stats: { wpm: number; accuracy: number; errors: number }) => void;
    isActive: boolean;
    setIsRunning: (running: boolean) => void;
    isFinished?: boolean;
    duration: number;
}

export default function TypingArea({ text, onComplete, isActive, setIsRunning, isFinished, duration }: TypingAreaProps) {
    const [currentText, setCurrentText] = useState("");
    const [error, setError] = useState(0);
    const targetText = text.join(" ");
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

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

            const minutes = duration / 60;
            const wpm = currentText.length > 0 ? Math.round((currentText.length / 5) / minutes) : 0;
            const accuracy = currentText.length > 0 ? Math.round(((currentText.length - currentErrors) / currentText.length) * 100) : 0;

            // console.log("Calculated stats:", { wpm, accuracy, errors: currentErrors });
            onComplete({ wpm, accuracy, errors: currentErrors });
        }
    }, [isFinished, currentText, targetText, onComplete]);

    const handleContainerClick = () => {
        if (inputRef.current && !isFinished) {
            inputRef.current.focus();
        }
    };

    // autofocusing the input when component mounts
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

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
            const minutes = duration / 60;
            const wpm = Math.round((value.length / 5) / minutes);
            const accuracy = Math.round(((value.length - currentErrors) / value.length) * 100);

            onComplete({ wpm, accuracy, errors: currentErrors });
        }
    };

    return (
        <div 
            ref={containerRef}
            onClick={handleContainerClick}
            className="flex flex-col items-center justify-center h-[calc(95vh-120px)] w-full cursor-default"
        >
            <input 
                ref={inputRef}
                type="text"
                value={currentText}
                onChange={handleChange}
                className="absolute opacity-0 pointer-events-none"
                autoFocus
                disabled={isFinished}
            />

            <div className="flex flex-wrap text-xl leading-relaxed max-w-5xl mx-auto justify-center">
                {targetText.split("").map((char, index) => (
                    <span
                        key={index}
                        className={clsx(
                            "inline-block text-3xl font-mono relative",
                            char === "  " && "w-3",
                            index < currentText.length
                            ? currentText[index] === char
                                ? "text-green-500 bg-green-100"
                                : "text-red-500 bg-red-100"
                            : "text-gray-400"
                        )}
                    >
                        {char === " " ? "\u00A0" : char}
                        {index === currentText.length && !isFinished && (
                            <span className="absolute right-1 top-0 text-blue-500 animate-pulse font-bold">|</span>
                        )}
                    </span>
                ))}
            </div>

            <button 
                onClick={(e) => {
                    e.stopPropagation(); // prevents triggering container click
                    setCurrentText("");
                    setError(0);
                    setIsRunning(false);
                    onComplete({ wpm: 0, accuracy: 0, errors: 0 });
                }}
                className="mt-8 p-3 bg-emerald-200 hover:bg-emerald-300 cursor-pointer text-black rounded-full transition-colors duration-200 flex items-center justify-center"
            >
                <RotateCcw size={20} />
            </button>
        </div>
    );
}
