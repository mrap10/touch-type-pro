"use client";

interface TimerProps {
    duration: number; // in seconds
    onTimeUp: () => void;
    isRunning: boolean;
    onDurationChange: (newDuration: Time) => void;
}

export type Time = 10 | 15 | 30 | 60;

export default function Timer({ duration, isRunning, onDurationChange }: TimerProps) {
    const timeOptions: Time[] = [10, 15, 30, 60];

    const getButtonClassName = (timeOption: Time) => {
        const isSelected = duration === timeOption;
        const baseClasses = "px-3 py-1 mx-1 rounded-lg font-semibold transition-colors cursor-pointer focus:outline-none";
        
        if (isSelected) {
            return `${baseClasses} bg-emerald-500 text-white`;
        }
        
        return `${baseClasses} text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300`;
    };

    return (
        <div className="text-lg px-4 mt-10 font-bold">
            <div className="flex flex-col sm:flex-row gap-2 items-center sm:text-2xl text-xl">
                Time:
                <div className="flex gap-1">
                    {timeOptions.map((timeOption) => (
                        <button 
                            key={timeOption}
                            className={getButtonClassName(timeOption)}
                            onClick={() => onDurationChange(timeOption)}
                            disabled={isRunning}
                        >
                            {timeOption}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}