"use client";

import { Users } from "lucide-react";
import { Opponent } from "@/types/race";

interface OpponentsListProps {
    opponents: Map<string, Opponent>;
}

export default function OpponentsList({ opponents }: OpponentsListProps) {
    const opponentArray = Array.from(opponents.values());

    if (opponentArray.length === 0) {
        return null;
    }

    return (
        <div className="flex mb-6 bg-white dark:bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 w-full">
                <Users size={20} />
                Opponents ({opponentArray.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 w-full">
                {opponentArray.map((opponent, index) => (
                    <OpponentCard 
                        key={opponent.playerId} 
                        opponent={opponent} 
                        index={index} 
                    />
                ))}
            </div>
        </div>
    );
}

interface OpponentCardProps {
    opponent: Opponent;
    index: number;
}

function OpponentCard({ opponent, index }: OpponentCardProps) {
    return (
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-gray-500 dark:text-gray-400">
                    Player {index + 1}
                </p>
                <p className="text-2xl font-bold text-orange-500">
                    {Math.round(opponent.progress)}%
                </p>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mt-2">
                <div
                    className="bg-orange-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(opponent.progress, 100)}%` }}
                />
            </div>
        </div>
    );
}