"use client";

import { Users, Play, Timer } from "lucide-react";

interface RaceHeaderProps {
    roomId: string;
    playerCount: number;
    isRaceStarted: boolean;
    onStartRace: () => void;
    onLeaveRoom: () => void;
}

export default function RaceHeader({ 
    roomId, 
    playerCount, 
    isRaceStarted, 
    onStartRace, 
    onLeaveRoom 
}: RaceHeaderProps) {
    return (
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold">Room: {roomId}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Users size={16} />
                    {playerCount} players
                </div>
            </div>

            <div className="text-center">
                {!isRaceStarted ? (
                    <button
                        onClick={onStartRace}
                        className="bg-emerald-500 hover:bg-emerald-600 cursor-pointer text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 mx-auto transition-colors"
                    >
                        <Play size={20} />
                        Start Race
                    </button>
                ) : (
                    <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <Timer size={20} />
                        Race in Progress
                    </div>
                )}
            </div>

            <button
                onClick={onLeaveRoom}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
                Leave Race
            </button>
        </div>
    );
}