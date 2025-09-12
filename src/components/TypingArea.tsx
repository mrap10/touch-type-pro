"use client";

import React, { useEffect, useRef } from "react";
import clsx from "clsx";
import { RotateCcw } from "lucide-react";
import type { TypingData } from "@/types/typing";
import { useTypingTest } from "@/hooks/useTypingTest";

interface TypingAreaProps {
    text: string[];
    onComplete: (stats: { wpm: number; accuracy: number; errors: number; typingData: TypingData[] }) => void;
    isActive: boolean;
    setIsRunning: (running: boolean) => void;
    isFinished?: boolean;
    duration: number;
    onTextUpdate?: (newText: string[]) => void;
}

export default function TypingArea({ 
    text, 
    onComplete, 
    isActive, 
    setIsRunning, 
    isFinished, 
    duration, 
    onTextUpdate 
}: TypingAreaProps) {
    const { currentText, targetText, handleChange, handleRestart } = useTypingTest({
        text,
        isActive,
        isFinished,
        duration,
        setIsRunning,
        onTextUpdate,
        onComplete
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
                            <span className="absolute right-1.5 top-0 text-blue-500 animate-pulse font-bold">|</span>
                        )}
                    </span>
                ))}
            </div>

            <button 
                onClick={handleRestart}
                className="mt-8 p-3 bg-emerald-200 hover:bg-emerald-300 cursor-pointer text-black rounded-full transition-colors duration-200 flex items-center justify-center"
            >
                <RotateCcw size={20} />
            </button>
        </div>
    );
}
