"use client";

import { useEffect, useState } from "react";

interface TimerProps {
    duration: number; // in seconds
    onTimeUp: () => void;
    isRunning: boolean;
}

export default function Timer({ duration, onTimeUp, isRunning }: TimerProps) {
    const [timeLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
        if (!isRunning) return;

        if(timeLeft <= 0) {
            onTimeUp();
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, timeLeft, onTimeUp]);

    return (
        <div className="text-lg font-bold">
            Time: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
        </div>
    );
}