"use client";

import React, { useEffect, useRef } from "react";
import clsx from "clsx";
import { RotateCcw } from "lucide-react";
import type { TypingData } from "@/types/typing";
import type { Difficulty } from "@/lib/TextGenerator";
import { useTypingTest } from "@/hooks/useTypingTest";

interface TypingAreaProps {
    text: string[];
    onComplete: (stats: { wpm: number; accuracy: number; errors: number; typingData: TypingData[] }) => void;
    isActive: boolean;
    setIsRunning: (running: boolean) => void;
    isFinished?: boolean;
    duration: number;
    difficulty?: Difficulty;
    onTextUpdate?: (newText: string[]) => void;
    onProgress?: (progress: number, wpm: number, accuracy: number) => void;
    showRestart?: boolean;
    className?: string;
}

export default function TypingArea({ 
    text, 
    onComplete, 
    isActive, 
    setIsRunning, 
    isFinished, 
    duration,
    difficulty,
    onTextUpdate,
    onProgress,
    showRestart = true,
    className,
}: TypingAreaProps) {
    const { currentText, targetText, handleChange, handleRestart } = useTypingTest({
        text,
        isActive,
        isFinished,
        duration,
        difficulty,
        setIsRunning,
        onTextUpdate,
        onComplete,
        onProgress,
    });
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    

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
    
    return (
        <div 
            ref={containerRef}
            onClick={handleContainerClick}
            className={clsx("px-2 flex flex-col items-center justify-center w-full cursor-default",className || "h-[calc(60vh-120px)]")}
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
                {targetText.split(" ").map((word, wordIndex) => {
                    const wordsBeforeCurrent = targetText.split(" ").slice(0, wordIndex);
                    const charsBeforeWord = wordsBeforeCurrent.join(" ").length + (wordIndex > 0 ? 1 : 0);
                    const isLastWord = wordIndex === targetText.split(" ").length - 1;
                    
                    return (
                        <React.Fragment key={wordIndex}>
                            <span className="inline-block">
                                {word.split("").map((char, charIndex) => {
                                    const globalCharIndex = charsBeforeWord + charIndex;
                                    return (
                                        <span
                                            key={charIndex}
                                            className={clsx(
                                                "inline-block text-3xl font-mono relative",
                                                globalCharIndex < currentText.length
                                                ? currentText[globalCharIndex] === char
                                                    ? "text-green-500 bg-green-100 dark:bg-green-900"
                                                    : "text-red-500 bg-red-100 dark:bg-red-900"
                                                : "text-gray-400 dark:text-gray-600",
                                            )}
                                        >
                                            {char}
                                            {globalCharIndex === currentText.length && !isFinished && (
                                                <span className="absolute right-1.5 top-0 text-blue-500 animate-pulse font-bold">|</span>
                                            )}
                                        </span>
                                    );
                                })}
                            </span>
                            {!isLastWord && (
                                <span
                                    className={clsx(
                                        "inline-block text-3xl font-mono relative w-3",
                                        charsBeforeWord + word.length < currentText.length
                                        ? currentText[charsBeforeWord + word.length] === " "
                                            ? "text-green-500 bg-green-100 dark:bg-green-900"
                                            : "text-red-500 bg-red-100 dark:bg-red-900"
                                        : "text-gray-400 dark:text-gray-600",
                                    )}
                                >
                                    {"\u00A0"}
                                    {charsBeforeWord + word.length === currentText.length && !isFinished && (
                                        <span className="absolute right-1.5 top-0 text-blue-500 animate-pulse font-bold">|</span>
                                    )}
                                </span>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            {showRestart && (
                <button 
                    onClick={handleRestart}
                    className="mt-8 p-3 bg-emerald-500 hover:bg-emerald-600 cursor-pointer text-white dark:text-black rounded-full transition-colors duration-200 flex items-center justify-center"
                >
                    <RotateCcw size={20} />
                </button>
            )}
        </div>
    );
}
