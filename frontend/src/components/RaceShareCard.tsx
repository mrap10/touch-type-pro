"use client";

import { useMemo, useRef } from "react";
import { toPng } from "html-to-image";
import { Download, Trophy, X } from "lucide-react";
import Xlogo from "@/assets/xlogo.png";
import Image from "next/image";
import { PlayerResult } from "@/hooks/useRaceState";

interface RaceShareCardProps {
    isOpen: boolean;
    onClose: () => void;
    wpm: number;
    accuracy: number;
    raceResults?: Map<string, PlayerResult>;
    currentPlayerId?: string;
    usernamesMap?: Map<string, string | undefined>;
}

export default function RaceShareCard({ isOpen, onClose, wpm, accuracy, raceResults, currentPlayerId, usernamesMap }: RaceShareCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    const sortedResults = useMemo(() => {
        if (!raceResults) return [] as PlayerResult[];
        return Array.from(raceResults.values()).sort((a, b) => {
            if (b.wpm !== a.wpm) return b.wpm - a.wpm;
            return a.finishTime - b.finishTime;
        });
    }, [raceResults]);

    const displayCount = sortedResults.length >= 3 ? 3 : 2;
    const displayPlayers = sortedResults.slice(0, displayCount);
    // const topOne = displayPlayers[0];
    // const topTwo = displayPlayers[1];
    // const topThree = displayPlayers[2];

    const getDisplayName = (result: PlayerResult | undefined, index: number) => {
        if (!result) return `Racer${index + 1}`;
        const isSelf = currentPlayerId && result.playerId === currentPlayerId;
        const uname = usernamesMap?.get(result.playerId);
        if (uname) return isSelf ? `${uname} (You)` : uname;
        if (isSelf) return 'You';
        return `Player ${result.playerId.slice(-4)}`;
    };

    const getInitial = (result: PlayerResult | undefined, fallbackIndex: number) => {
        if (!result) return String.fromCharCode(65 + (fallbackIndex % 26));
        
        const username = usernamesMap?.get(result.playerId);
        if (username && username.length > 0) {
            return username.charAt(0).toUpperCase();
        }
        
        if (currentPlayerId && result.playerId === currentPlayerId) {
            return 'Y';
        }
        
        return String.fromCharCode(65 + (fallbackIndex % 26));
    };

    const ordinal = (pos?: number) => {
        if (!pos) return '';
        if (pos === 1) return '1st Place';
        if (pos === 2) return '2nd Place';
        if (pos === 3) return '3rd Place';
        return `${pos}th Place`;
    };

    const handleDownload = async () => {
        if (cardRef.current) {
            const dataUrl = await toPng(cardRef.current);
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `typing-results-${Date.now()}.png`;
            link.click();
        }
    };

    const handleTwitterShare = () => {
        const tweetText = `🔥 I just completed a touch typing race at ${Math.round(wpm)} WPM with ${Math.round(accuracy)}% accuracy! Race your touch typing speed at: https://touchtypepro.vercel.app`;
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
        window.open(twitterUrl, "_blank");
    };

    if (!isOpen) return null;

    return (
        <div>
            <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 z-50 flex justify-center items-center p-4">
                <div className="bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg shadow-xl w-full max-w-md px-6 py-3 relative animate-fade-in-up">
                    <div>
                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                            <X className="w-6 h-6" />
                        </button>
                        <h2 className="text-2xl font-bold">Share Race Results</h2>
                    </div>

                    <div ref={cardRef} className="p-5 dark:bg-gray-800 bg-gray-100">
                        <div className="flex items-center justify-between mb-6 border-b border-b-gray-200 dark:border-b-gray-600 pb-3">
                            <h1 className="text-xl font-bold dark:text-white">touchtypepro</h1>
                            <div className="bg-emerald-500 text-white px-3 py-1 rounded-full">
                                <p className="">Race Result</p>
                            </div>
                        </div>

                        <div className={`flex justify-around items-center ${displayCount === 3 ? 'space-x-2' : 'space-x-3'}`}>
                            {displayPlayers.map((player, idx) => {
                                const bgMap = ['bg-emerald-500 border-4 border-emerald-400', 'bg-purple-700', 'bg-indigo-600'];
                                const wrapperColor = bgMap[idx] || 'bg-gray-600';
                                const isWinner = player && player.position === 1;
                                const isYou = currentPlayerId && player && player.playerId === currentPlayerId;
                                return (
                                    <div key={player?.playerId || idx} className="flex flex-col items-center">
                                        <div className={`relative rounded-full w-16 h-16 flex items-center justify-center text-white ${wrapperColor} ${isYou ? 'ring-2 ring-emerald-400' : ''}`}>
                                            <h1 className="font-bold text-3xl">{getInitial(player, idx)}</h1>
                                            {isWinner && (
                                                <Trophy className="absolute w-6 h-6 text-yellow-400 fill-amber-500 -top-1 -right-1" />
                                            )}
                                        </div>
                                        <h1 className="font-bold text-xl">{getDisplayName(player, idx)}</h1>
                                        <p className={`${isWinner ? 'text-emerald-500' : 'text-emerald-600'}`}>{ordinal(player?.position) || 'Waiting'}</p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex justify-around items-center space-x-3 mt-5">
                            {displayPlayers.map((player, idx) => (
                                <div key={player?.playerId || idx} className="bg-gray-200 dark:bg-gray-700 p-2 rounded-lg w-full">
                                    <div className="flex flex-col items-center justify-center">
                                        <h1 className="text-3xl font-bold dark:text-white">{player ? Math.round(player.wpm) : '--'}</h1>
                                        <p className="font-semibold text-emerald-500">WPM</p>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <h1 className="text-3xl font-bold dark:text-white">{player ? Math.round(player.accuracy) : '--'}%</h1>
                                        <p className="font-semibold text-emerald-500">Accuracy</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {currentPlayerId && raceResults && !displayPlayers.some(p => p && p.playerId === currentPlayerId) && (() => {
                            const yourResult = sortedResults.find(r => r.playerId === currentPlayerId);
                            if (!yourResult) return null;
                            return (
                                <div className="mt-5">
                                    <div className="bg-blue-600/20 border border-blue-500 rounded-lg p-3">
                                        <p className="text-center text-blue-400 text-sm mb-2">Your Result</p>
                                        <div className="flex justify-around">
                                            <div className="flex flex-col items-center">
                                                <p className="text-sm text-emerald-500">WPM</p>
                                                <h1 className="text-2xl font-bold text-white">{Math.round(yourResult.wpm)}</h1>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <p className="text-sm text-emerald-500">Accuracy</p>
                                                <h1 className="text-2xl font-bold text-white">{Math.round(yourResult.accuracy)}%</h1>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <p className="text-sm text-emerald-500">Place</p>
                                                <h1 className="text-2xl font-bold text-white">{yourResult.position}</h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* <div className="flex justify-between items-center mt-8 px-3 space-x-4">
                            <div className="flex flex-col items-center">
                                <h1 className="text-3xl font-bold">{time}s</h1>
                                <p className="text-xl font-semibold text-gray-500">Time</p>
                            </div>

                            <div className="flex flex-col items-center">
                                <h1 className="text-3xl font-bold">{errors}</h1>
                                <p className="text-xl font-semibold text-gray-500">Error strokes</p>
                            </div>
                        </div> */}

                        <div className="text-center border-t border-gray-200 dark:border-gray-600 pt-3 mt-6">
                            <p className="text-gray-600 dark:text-gray-400 italic">&ldquo;Every word counts — make them count fast&rdquo;</p>
                            <p className="text-sm text-indigo-400 font-semibold mt-2">touchtype.vercel.app</p>
                        </div>
                    </div>

                    <div className="flex justify-between space-x-4">
                        <button
                            onClick={handleTwitterShare}
                            className="flex items-center gap-x-2 bg-emerald-500 hover:bg-emerald-600 text-white sm:px-4 px-2 py-2 rounded-lg transition-colors cursor-pointer"
                        >
                            <Image width={16} height={16} src={Xlogo.src} alt="X logo" className="rounded-md" />
                            Share on Twitter
                        </button>

                        <button
                            onClick={handleDownload}
                            className="flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors cursor-pointer"
                        >
                            <Download className="w-4 h-4" />
                            <span>Download Image</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}