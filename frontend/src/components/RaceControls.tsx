"use client";

import { Users } from "lucide-react";
import { useState } from "react";

interface RaceControlsProps {
    onCreateRoom: (username: string) => void;
    onJoinRoom: (roomId: string, username: string) => void;
    isConnected: boolean;
    error?: string | null;
    onClearError?: () => void;
}

export default function RaceControls({ onCreateRoom, onJoinRoom, error, onClearError }: RaceControlsProps) {
    const [roomId, setRoomId] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [usernameTouched, setUsernameTouched] = useState(false);

    const handleJoinRoom = () => {
        if (!isUsernameValid) return;
        if (roomId.trim()) {
            onClearError?.();
            onJoinRoom(roomId.trim().toUpperCase(), username.trim());
        }
    };

    const handleRoomIdChange = (value: string) => {
        setRoomId(value.toUpperCase());
        if (error) onClearError?.();
    };

    const handleCreateRoom = () => {
        if (!isUsernameValid) return;
        onClearError?.();
        onCreateRoom(username.trim());
    }

    const handleUsernameChange = (value: string) => {
        setUsername(value);
        if (error) onClearError?.();
    };

    const isUsernameValid = username.trim().length > 0;
    const showUsernameError = usernameTouched && !isUsernameValid;

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
                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder="Enter a username to create/join race"
                                value={username}
                                onChange={(e) => handleUsernameChange(e.target.value)}
                                onBlur={() => setUsernameTouched(true)}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white ${showUsernameError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-emerald-500'}`}
                                maxLength={24}
                                aria-required="true"
                                aria-invalid={showUsernameError}
                            />
                            {showUsernameError && (
                                <p className="text-sm text-red-600">Username is required</p>
                            )}
                            <button
                                onClick={handleCreateRoom}
                                disabled={!isUsernameValid}
                                className="w-full mt-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                            >
                                <Users size={20} />
                                Create New Race
                            </button>
                        </div>
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
                            disabled={!roomId.trim() || !isUsernameValid}
                            className="w-full mt-3 bg-blue-500 hover:bg-blue-600 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                        >
                            Join Race
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-400 dark:border-emerald-600 rounded-lg">
                        <div className="flex-1">
                            <p className="font-semibold text-center text-emerald-800 dark:text-emerald-200 mb-1">
                                {error.includes('in progress') ? 'Race In Progress' : 'Unable to Join'}
                            </p>
                            <p className="text-sm text-justify text-emerald-700 dark:text-emerald-300">
                                {error}
                            </p>
                            {error.includes('in progress') && (
                                <button
                                    onClick={() => {
                                        onClearError?.();
                                        handleJoinRoom();
                                    }}
                                    className="mt-3 text-sm bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                >
                                    Try Again
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="text-center text-sm text-gray-500 dark:text-gray-400 space-y-1">
                {/* <p>Connection Status: {isConnected ? "Connected" : "Disconnected"}</p> */}
                {isUsernameValid && username && (
                    <p className="text-xs">Playing as <span className="font-semibold">{username.trim()}</span></p>
                )}
            </div>
        </div>
    );
}
