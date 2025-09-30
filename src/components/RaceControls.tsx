"use client";

import { Users } from "lucide-react";
import { useState } from "react";

interface RaceControlsProps {
    onCreateRoom: () => void;
    onJoinRoom: (roomId: string) => void;
    isConnected: boolean;
    error?: string | null;
    onClearError?: () => void;
}

export default function RaceControls({ onCreateRoom, onJoinRoom, isConnected, error, onClearError }: RaceControlsProps) {
    const [roomId, setRoomId] = useState<string>("");

    const handleJoinRoom = () => {
        if (roomId.trim()) {
            onClearError?.();
            onJoinRoom(roomId.trim().toUpperCase());
        }
    };

    const handleRoomIdChange = (value: string) => {
        setRoomId(value.toUpperCase());
        if (error) {
            onClearError?.();
        }
    };

    return (
        <div className="flex flex-col justify-center items-center gap-6 min-h-[calc(100vh-4rem)] p-4">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">Typing Race</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Compete with friends in real-time typing challenges
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
                <div className="space-y-6">
                    <div>
                        <button
                            onClick={onCreateRoom}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                            <Users size={20} />
                            Create New Race
                        </button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">or</span>
                        </div>
                    </div>

                    <div>
                        <input
                            type="text"
                            placeholder="Enter Race ID"
                            value={roomId}
                            onChange={(e) => handleRoomIdChange(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                            maxLength={6}
                        />
                        <button
                            onClick={handleJoinRoom}
                            disabled={!roomId.trim()}
                            className="w-full mt-3 bg-blue-500 hover:bg-blue-600 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                        >
                            Join Race
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mt-4 text-red-600 text-center">{error}</div>
                )}
            </div>

            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                Connection Status: {isConnected ? "Connected" : "Disconnected"}
            </div>
        </div>
    );
}