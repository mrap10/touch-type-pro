"use client";

import type { Difficulty } from "@/lib/TextGenerator";

interface ModeProps {
    difficulty: Difficulty;
    onTimeUp: () => void;
    isRunning: boolean;
    onModeChange: (newDifficulty: Difficulty) => void;
}

export default function Mode({ difficulty, isRunning, onModeChange }: ModeProps) {
    const difficultyOptions: Difficulty[] = ['easy', 'medium', 'hard'];

    const getButtonClassName = (difficultyOption: Difficulty) => {
        const isSelected = difficulty === difficultyOption;
        const baseClasses = "px-3 py-1 mx-1 rounded-lg font-semibold transition-colors cursor-pointer focus:outline-none";
        
        if (isSelected) {
            return `${baseClasses} bg-emerald-500 text-white`;
        }
        
        return `${baseClasses} text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300`;
    };

    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

    return (
        <div className="text-lg px-4 mt-10 font-bold">
            <div className="flex flex-col sm:flex-row gap-2 items-center sm:text-2xl text-xl">
                Mode:
                <div className="flex gap-1">
                    {difficultyOptions.map((difficultyOption) => (
                        <button 
                            key={difficultyOption}
                            className={getButtonClassName(difficultyOption)}
                            onClick={() => onModeChange(difficultyOption)}
                            disabled={isRunning}
                        >
                            {capitalize(difficultyOption)}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}