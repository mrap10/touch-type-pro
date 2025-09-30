"use client";

import { Users } from "lucide-react";
import { Opponent } from "@/types/race";
import React, { useMemo } from "react";

interface OpponentsListProps {
    opponents: Map<string, Opponent>;
    currentPlayerId?: string;
}

export default function OpponentsList({ opponents, currentPlayerId }: OpponentsListProps) {
    const { opponentArray, version } = useMemo(() => {
        let arr = Array.from(opponents.entries()).map(([id, opp]) => ({
            playerId: id,
            progress: opp.progress ?? 0,
            wpm: opp.wpm,
            accuracy: opp.accuracy,
            username: opp.username
        }));
        if (currentPlayerId) {
            arr = arr.filter(o => o.playerId !== currentPlayerId);
        }
        const v = arr.map(o => `${o.playerId}:${o.progress.toFixed(2)}`).join("|");
        return { opponentArray: arr, version: v };
    }, [opponents, currentPlayerId]);

    if (opponentArray.length === 0) {
        return null;
    }

    return (
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Users size={20} />
                {currentPlayerId ? 'Opponents' : 'User list'} ({opponentArray.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3" data-version={version}>
                {opponentArray.map((opponent, index) => {
                    return (
                        <OpponentCard
                            key={opponent.playerId + ':' + opponent.progress}
                            opponent={opponent}
                            index={index}
                        />
                    );
                })}
            </div>
        </div>
    );
}

interface OpponentCardProps {
    opponent: Opponent;
    index: number;
}

const OpponentCard = React.memo(function OpponentCard({ opponent, index }: OpponentCardProps) {
    const raw = opponent.progress ?? 0;
    const progress = Math.max(0, Math.min(raw, 100));
    const display = progress < 10 && progress > 0 ? progress.toFixed(1) : Math.round(progress).toString();
    
    return (
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-gray-500 dark:text-gray-400 text-sm truncate max-w-[90px]" title={opponent.username || `Player ${index + 1}`}>
                    {opponent.username || `Player ${index + 1}`}
                </p>
                <p className="text-xl font-bold text-orange-500 tabular-nums">
                    {display}%
                </p>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mt-2">
                <div
                    className="bg-orange-500 h-1.5 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
});