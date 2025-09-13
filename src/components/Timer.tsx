"use client";

import { useEffect, useState } from "react";

interface TimerProps {
    duration: number; // in seconds
    onTimeUp: () => void;
    isRunning: boolean;
    onDurationChange: (newDuration: Time) => void;
}

export type Time = 10 | 15 | 30 | 60;

export default function Timer({ duration, onTimeUp, isRunning, onDurationChange }: TimerProps) {
    const [timeLeft, setTimeLeft] = useState<number>(duration);

    useEffect(() => {
        setTimeLeft(duration);
    }, [duration]);

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

    // const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     const newTime = parseInt(e.target.value) as Time;
    //     onDurationChange(newTime);
    // };

    return (
        <div className="text-lg flex justify-around items-center w-full px-4 mt-10 font-bold">
            <div className="flex gap-2 items-center text-2xl">
                Choose Time Limit:
                {/* <select 
                    value={duration} 
                    onChange={handleTimeChange}
                    disabled={isRunning} // Disable during test
                    className="ml-2 p-1 border rounded"
                >
                    <option value={10} className="">10</option>
                    <option value={15} className="">15</option>
                    <option value={30} className="">30</option>
                    <option value={60} className="">60</option>
                </select> */}
                <button className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer" onClick={() => onDurationChange(10)}>10</button>
                <button className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer" onClick={() => onDurationChange(15)}>15</button>
                <button className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer" onClick={() => onDurationChange(30)}>30</button>
                <button className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer" onClick={() => onDurationChange(60)}>60</button>
            </div>
            <div className="text-2xl">
                Time: <span className="text-gray-500">{timeLeft}s</span>
            </div>
        </div>
    );
}