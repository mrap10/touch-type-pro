"use client";

import { Users, Play, Timer, XCircle } from "lucide-react";

interface RaceHeaderProps {
    roomId: string;
    playerCount: number;
    isRaceStarted: boolean;
    isRaceFinished: boolean;
    onStartRace: () => void;
    onLeaveRoom: () => void;
    countdown?: number | null;
    countdownInitiator?: string | null;
    canCancelCountdown?: boolean;
    onCancelCountdown?: () => void;
    isCountdownPending?: boolean;
}

export default function RaceHeader({
    roomId,
    playerCount,
    isRaceStarted,
    isRaceFinished,
    onStartRace,
    onLeaveRoom,
    countdown,
    canCancelCountdown,
    onCancelCountdown,
    isCountdownPending
}: RaceHeaderProps) {
    const startDisabled = playerCount < 2 || isRaceStarted || !!countdown || isCountdownPending;
    let startLabel: string;
    if (playerCount < 2) startLabel = 'Waiting for players...';
    else if (countdown) startLabel = `Starting in ${countdown}`;
    else if (isCountdownPending) startLabel = 'Requesting countdown...';
    else startLabel = 'Start Race';

    return (
        <div className="flex justify-between items-center mb-6 relative">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold">Room: {roomId}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Users size={16} />
                    {playerCount} players
                </div>
            </div>

            <div className="text-center">
                {!isRaceStarted ? (
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onStartRace}
                                disabled={startDisabled}
                                className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 mx-auto transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${startDisabled ? 'bg-gray-400 dark:bg-gray-600 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}
                            >
                                <Play size={20} />
                                {startLabel}
                            </button>
                            {countdown && canCancelCountdown && (
                                <button
                                    onClick={onCancelCountdown}
                                    className="px-3 py-2 rounded-lg font-semibold flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white transition-colors cursor-pointer"
                                >
                                    <XCircle size={18} />
                                    Cancel
                                </button>
                            )}
                        </div>
                        {playerCount < 2 && (
                            <p className="text-xs text-red-500 dark:text-red-400">Need at least 2 players to start</p>
                        )}
                        {isCountdownPending && !countdown && (
                            <p className="text-xs text-emerald-500 dark:text-emerald-400">Requesting countdown...</p>
                        )}
                        {countdown && (
                            <p className="text-xs text-emerald-500 dark:text-emerald-400">Countdown started {canCancelCountdown ? '(You)' : ''}</p>
                        )}
                    </div>
                ) : isRaceFinished ? (
                    <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
                        <Users size={20} />
                        Race Completed
                    </div>
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

            {countdown && !isRaceStarted && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-6xl md:text-7xl font-extrabold text-emerald-500 opacity-40 select-none">
                        {countdown}
                    </div>
                </div>
            )}
        </div>
    );
}