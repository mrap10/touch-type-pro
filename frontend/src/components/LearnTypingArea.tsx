"use client";

import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import type { TypingData } from "@/types/typing";

interface LearnTypingAreaProps {
    text: string;
    onComplete: (stats: { wpm: number; accuracy: number; errors: number; typingData: TypingData[] }) => void;
    isActive: boolean;
}

export default function LearnTypingArea({ 
    text, 
    onComplete, 
    isActive,
}: LearnTypingAreaProps) {
    const [currentText, setCurrentText] = useState("");
    const [startTime, setStartTime] = useState<number | null>(null);
    const [errors, setErrors] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const CHARS_PER_LINE = 60;
    const DISPLAY_CHARS = CHARS_PER_LINE * 2;
    const OVERLAP_CHARS = Math.floor(CHARS_PER_LINE * 0.5); // Keep 50% overlap when refreshing
    
    const getDisplayText = () => {
        const currentPosition = currentText.length;
        
        const windowSize = DISPLAY_CHARS - OVERLAP_CHARS;
        const currentWindow = Math.floor(currentPosition / windowSize);
        const windowStart = currentWindow * windowSize;
        
        return text.slice(windowStart, windowStart + DISPLAY_CHARS);
    };

    const displayText = getDisplayText();
    
    // offset calc for correct character highlighting
    const windowSize = DISPLAY_CHARS - OVERLAP_CHARS;
    const currentWindow = Math.floor(currentText.length / windowSize);
    const displayOffset = currentWindow * windowSize;

    const nextChar = currentText.length < text.length ? text[currentText.length] : "";

    useEffect(() => {
        if (inputRef.current && isActive) {
            inputRef.current.focus();
        }
    }, [isActive]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isActive) return;

        const value = e.target.value;
        
        if (!startTime && value.length === 1) {
            setStartTime(Date.now());
        }

        if (value.length < currentText.length) return;

        const newChar = value[value.length - 1];
        const expectedChar = text[currentText.length];

        if (newChar !== expectedChar) {
            setErrors(prev => prev + 1);
        }

        setCurrentText(value);

        if (value.length === text.length) {
            const endTime = Date.now();
            const timeInMinutes = startTime ? (endTime - startTime) / 60000 : 1;
            const wordsTyped = text.split(" ").length;
            const wpm = Math.round(wordsTyped / timeInMinutes);
            const accuracy = ((text.length - errors - (newChar !== expectedChar ? 1 : 0)) / text.length) * 100;

            onComplete({
                wpm,
                accuracy,
                errors: errors + (newChar !== expectedChar ? 1 : 0),
                typingData: [],
            });
        }
    };

    const handleContainerClick = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    return (
        <div className="">
            <div 
                ref={containerRef}
                onClick={handleContainerClick}
                className="px-6 py-8 min-h-[200px] flex items-center justify-center cursor-default bg-white dark:bg-gray-900 rounded-lg mb-6"
            >
                <input 
                    ref={inputRef}
                    type="text"
                    value={currentText}
                    onChange={handleChange}
                    className="absolute opacity-0 pointer-events-none"
                    autoFocus
                />

                <div className="text-2xl md:text-3xl leading-relaxed max-w-4xl font-mono">
                    {displayText.split("").map((char, index) => {
                        const globalIndex = displayOffset + index;
                        const isTyped = globalIndex < currentText.length;
                        const isCorrect = isTyped && currentText[globalIndex] === char;
                        const isCurrent = globalIndex === currentText.length;
                        
                        return (
                            <span
                                key={index}
                                className={clsx(
                                    "relative inline-block",
                                    char === " " ? "w-3" : "",
                                    isTyped
                                        ? isCorrect
                                            ? "text-green-500 bg-green-100 dark:bg-green-900/30"
                                            : "text-red-500 bg-red-100 dark:bg-red-900/30"
                                        : "text-gray-400 dark:text-gray-600"
                                )}
                            >
                                {char === " " ? "\u00A0" : char}
                                {isCurrent && (
                                    <span className="absolute right-2 top-0 text-blue-500 animate-pulse font-bold">|</span>
                                )}
                            </span>
                        );
                    })}
                </div>
            </div>

            <KeyboardBar nextKey={nextChar} />
        </div>
    );
}

const KEYBOARD_LAYOUT = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "j", "k", "l", ";"],
    ["z", "x", "c", "v", "b", "n", "m"],
    [" "],
];

interface KeyboardBarProps {
    nextKey: string;
}

function KeyboardBar({ nextKey }: KeyboardBarProps) {
    const normalizedNextKey = nextKey.toLowerCase();

    return (
        <div className="mt-8 p-3 w-fit place-self-center bg-gray-200/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
            <div className="flex flex-col gap-1.5 justify-center font-mono text-gray-600 dark:text-gray-400">
                {KEYBOARD_LAYOUT.map((row, rowIndex) => (
                    <div key={row.join("-")} className="flex gap-1.5 justify-center">
                        {row.map((key) => {
                            const isNext = normalizedNextKey === key;
                            const isSpacebar = key === " ";

                            return (
                                <div
                                    key={key + rowIndex}
                                    className={clsx(
                                        "h-12 flex items-center justify-center rounded-md bg-white dark:bg-gray-700 transition-all duration-100 ease-in-out",
                                        isSpacebar ? "w-full px-20" : "w-12",
                                        isNext && "transform -translate-y-0.5 scale-105 bg-emerald-500 dark:text-white shadow-[0_0_20px_#10b981]"
                                    )}
                                >
                                    {isSpacebar ? "Space" : key}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}