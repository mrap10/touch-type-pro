"use client";

interface CircularTimerProps {
    timeLeft: number;
    duration: number;
}

export default function CircularTimer({ timeLeft, duration }: CircularTimerProps) {
    const progress = ((duration - timeLeft) / duration) * 100;
    
    const circumference = 2 * Math.PI * 45; // radius = 45
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="flex justify-center items-center mt-8">
            <div className="relative w-32 h-32">
                <svg 
                    className="w-full h-full transform -rotate-90" 
                    viewBox="0 0 100 100"
                >
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="rgb(55, 65, 81)"
                        strokeWidth="6"
                        opacity="0.3"
                    />
                    
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="rgb(16, 185, 129)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-1000 ease-linear"
                    />
                </svg>
                
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-black dark:text-white">
                        {timeLeft}
                    </span>
                </div>
            </div>
        </div>
    );
}