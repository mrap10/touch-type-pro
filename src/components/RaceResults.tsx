import { PlayerResult } from "@/hooks/useRaceState";
import { RotateCcw, Share2 } from "lucide-react";

interface RaceResultsProps {
    isFinished: boolean;
    raceResults: Map<string, PlayerResult>;
    currentPlayerResult: PlayerResult | null;
    onRematch?: () => void;
    onShare?: () => void;
    usernamesMap?: Map<string, string | undefined>;
}

export default function RaceResults({ 
    isFinished, 
    raceResults, 
    currentPlayerResult, 
    onRematch, 
    onShare,
    usernamesMap
}: RaceResultsProps) {
    const formatTime = (milliseconds: number) => {
        if (!milliseconds || milliseconds <= 0) {
            return "0s";
        }
        
        if (milliseconds > 1000 * 60 * 10) {
            return "N/A";
        }
        
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        if (minutes > 0) {
            return `${minutes}m ${remainingSeconds}s`;
        }
        return `${seconds}s`;
    };

    const getPlayerInitial = (playerId: string, index: number) => {
        if (currentPlayerResult && playerId === currentPlayerResult.playerId) return 'Y';
        return String.fromCharCode(65 + (index % 26)); // A, B, C, etc.
    };

    const getPositionSuffix = (position: number) => {
        if (position === 1) return 'st';
        if (position === 2) return 'nd';
        if (position === 3) return 'rd';
        return 'th';
    };

    const getPlayerName = (playerId: string) => {
        const uname = usernamesMap?.get(playerId);
        if (uname) return uname;
        if (currentPlayerResult && playerId === currentPlayerResult.playerId) return 'You';
        return `Player ${playerId.slice(-4)}`;
    };

    const isCurrentPlayer = (playerId: string) => {
        return currentPlayerResult && playerId === currentPlayerResult.playerId;
    };

    const sortedResults = Array.from(raceResults.values()).sort((a, b) => {
        if (b.wpm !== a.wpm) return b.wpm - a.wpm;
        return a.finishTime - b.finishTime;
    });

    const getErrors = (result: PlayerResult) => {
        return result.errors ?? 0;
    };

    const getErrorsDisplay = (result: PlayerResult) => {
        return `${getErrors(result)}`;
    };

    if (!isFinished || sortedResults.length === 0) {
        return (
            <div className="mt-10 text-center text-gray-600 dark:text-gray-400">
                <h1 className="text-4xl font-semibold text-gray-700 dark:text-gray-300">
                    Waiting for results...
                </h1>
            </div>
        );
    }

    return (
        <div className="mt-10 text-center text-gray-600 dark:text-gray-400">
            <div className="mb-6">
                <h1 className="text-4xl font-semibold text-gray-700 dark:text-gray-300">
                    Race Results
                </h1>
                <p className="mt-2 text-xl">
                    Here&apos;s how everyone did!
                </p>
            </div>

            <div className="space-y-6 px-4 md:px-10">
                {sortedResults.map((result, index) => {
                    const isPlayerCurrent = isCurrentPlayer(result.playerId);
                    const borderClass = result.position === 1 
                        ? 'border-2 border-emerald-300 dark:border-emerald-700' 
                        : 'border border-gray-300 dark:border-gray-700';
                    
                    return (
                        <div 
                            key={result.playerId}
                            className={`flex flex-col md:flex-row justify-around items-center space-y-6 md:space-y-0 md:space-x-10 ${borderClass} rounded-lg p-6 bg-gray-50 dark:bg-gray-800 ${isPlayerCurrent ? 'ring-2 ring-blue-400' : ''}`}
                        >
                            <div className="flex flex-col items-center space-y-2">
                                <h1 className="text-4xl font-bold">
                                    {result.position}{getPositionSuffix(result.position)}
                                </h1>
                                <div className={`rounded-full w-16 h-16 flex items-center justify-center text-white ${isPlayerCurrent ? 'bg-blue-500' : 'bg-emerald-500'}`}>
                                    <h1 className="font-bold text-3xl">
                                        {getPlayerInitial(result.playerId, index)}
                                    </h1>
                                </div>
                                <p className={`font-semibold text-xl ${isPlayerCurrent ? 'text-blue-500' : 'text-emerald-500'}`}>
                                    {getPlayerName(result.playerId)}
                                    {result.position === 1 && ' 🏆'}
                                </p>
                            </div>
                            
                            <div className="flex flex-col items-center">
                                <h1 className="text-5xl font-bold">{Math.round(result.wpm)}</h1>
                                <p className="text-gray-400">WPM</p>
                            </div>
                            
                            <div className="flex flex-col items-center">
                                <h1 className="text-5xl font-bold">{Math.round(result.accuracy)}%</h1>
                                <p className="text-gray-400">Accuracy</p>
                            </div>
                            
                            <div className="flex flex-col items-center">
                                <h1 className="text-5xl font-bold">
                                    {getErrorsDisplay(result)}
                                </h1>
                                <p className="text-gray-400">Error strokes</p>
                            </div>
                            
                            <div className="flex flex-col items-center">
                                <h1 className="text-5xl font-bold">{formatTime(result.finishTime)}</h1>
                                <p className="text-gray-400">Time</p>
                            </div>
                            
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-12 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center text-sm">
                                    Chart
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-10 flex justify-center space-x-6">
                <button 
                    onClick={onRematch}
                    className="flex items-center space-x-1 px-3 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 cursor-pointer transition-colors"
                >
                    <RotateCcw className="w-4 h-4" />
                    <p>Race Again</p>
                </button>

                <button 
                    onClick={onShare}
                    className="flex items-center space-x-1 px-3 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 cursor-pointer transition-colors"
                >
                    <Share2 className="w-4 h-4" />
                    <p>Share Results</p>
                </button>
            </div>
        </div>
    );
}