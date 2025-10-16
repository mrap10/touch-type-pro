"use client";

import { useEffect, useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import RaceControls from "@/components/RaceControls";
import RaceHeader from "@/components/RaceHeader";
import OpponentsList from "@/components/OpponentsList";
import RaceStats from "@/components/RaceStats";
import TypingArea from "@/components/TypingArea";
import useRaceSocket from "@/hooks/useRaceSocket";
import useRaceState from "@/hooks/useRaceState";
import RaceResults from "@/components/RaceResults";
import RaceShareCard from "@/components/RaceShareCard";

export default function RacePage() {
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);
    const [joinError, setJoinError] = useState<string | null>(null);
    const raceState = useRaceState();
    const {
        currentRoomId,
        isInRace,
        isCreatingRoom,
        raceText,
        progress,
        opponents,
        isRaceStarted,
        wpm,
        accuracy,
        isRaceFinished,
        raceResults,
        currentPlayerResult,
        raceStartTime,
        playerCount,
        createRoom,
        joinRoom,
        resetRaceState,
        updateProgress,
        completeRace,
        updateOpponentProgress,
        addUser,
        removeUser,
        handleRoomJoined,
        handleRaceStarted,
        handlePlayerFinished,
        setCurrentPlayerId,
        currentPlayerId,
        username,
        setUsername
    } = raceState;

    const [countdownRemaining, setCountdownRemaining] = useState<number | null>(null);
    const [countdownInitiator, setCountdownInitiator] = useState<string | null>(null);
    const [isCountdownPending, setIsCountdownPending] = useState(false);
    const { sendProgress, finishRace, disconnect, isConnected, socketId, initiateCountdown, cancelCountdown, resetRace, createRace, joinRoom: socketJoinRoom } = useRaceSocket(
        currentRoomId,
        {
            onProgressUpdate: (data) => {
                updateOpponentProgress(data);
            },
            onUserJoined: addUser,
            onUserLeft: removeUser,
            onRaceCompleted: handlePlayerFinished,
            onRoomJoined: handleRoomJoined,
            onRaceStarted: (data) => {
                setCountdownRemaining(null);
                setCountdownInitiator(null);
                handleRaceStarted(data);
            },
            onCountdownStarted: ({ duration, initiator }) => {
                setCountdownRemaining(duration);
                setCountdownInitiator(initiator);
                setIsCountdownPending(false);
            },
            onCountdownTick: ({ remaining }) => {
                setCountdownRemaining(remaining);
            },
            onCountdownCancelled: () => {
                setCountdownRemaining(null);
                setCountdownInitiator(null);
                setIsCountdownPending(false);
            },
            onRaceReset: ({ text }) => {
                setCountdownRemaining(null);
                setCountdownInitiator(null);
                setIsCountdownPending(false);
                raceState.setRaceText(text);
                raceState.prepareRematch();
                setNotification("New race is ready! Click 'Start Race' when ready.");
                setTimeout(() => setNotification(null), 4000);
            },
            onCountdownRejected: () => {
                setIsCountdownPending(false);
            },
            onJoinError: (data) => {
                resetRaceState();
                setJoinError(data.message);
            }
        }
    );

    const handleCreateRoom = (uname: string) => {
        setUsername(uname);
        createRoom();
    };

    const handleJoinRoom = (roomId: string, uname: string) => {
        setUsername(uname);
        joinRoom(roomId);
    };

    const clearJoinError = () => {
        setJoinError(null);
    };

    useEffect(() => {
        if (currentRoomId && isConnected) {
            console.log("Room ID changed:", { currentRoomId, isCreatingRoom });
            if (isCreatingRoom) {
                createRace(currentRoomId, username);
            } else {
                socketJoinRoom(currentRoomId, username);
            }
        }
    }, [currentRoomId, isConnected, isCreatingRoom, createRace, socketJoinRoom, username]);

    useEffect(() => {
        if (socketId && socketId !== currentPlayerId) {
            setCurrentPlayerId(socketId);
        }
    }, [socketId, currentPlayerId, setCurrentPlayerId]);

    // if username already captured before socket id arrived, inject it once id is known
    useEffect(() => {
        if (currentPlayerId && username) {
            // trigger username map rebuild 
            raceState.setUsername(username);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPlayerId]);

    const handleStartRace = () => {
        console.log("handleStartRace called with state:", {
            countdownRemaining,
            playerCount,
            isRaceStarted,
            isCountdownPending,
            isRaceFinished
        });
        
        if (!countdownRemaining && playerCount >= 2 && !isRaceStarted && !isCountdownPending && !isRaceFinished) {
            setIsCountdownPending(true);
            initiateCountdown(5);
            // failsafe timeout: if no server ack in 3s, clear pending
            setTimeout(() => setIsCountdownPending(false), 3000);
        } else {
            console.log("Cannot start race - conditions not met");
        }
    };

    const handleCancelCountdown = () => {
        if (countdownInitiator === socketId) {
            cancelCountdown();
        }
    }

    const handleLeaveRoom = () => {
        disconnect();
        resetRaceState();
    };

    const handleRaceComplete = (stats: { 
        wpm: number; 
        accuracy: number; 
        errors: number; 
        typingData: Array<{ second: number; wpm: number; errors: number; }> 
    }) => {
        const raceFinishTime = Date.now() - (raceStartTime || Date.now());
        completeRace(stats);
        finishRace(stats.wpm, stats.accuracy, stats.errors, raceFinishTime);
    };

    const handleProgress = (progressPercent: number, currentWpm: number, currentAccuracy: number) => {
        updateProgress(progressPercent, currentWpm, currentAccuracy);
        sendProgress(progressPercent);
    };

    const handleShare = () => {
        setIsShareOpen(true);
    }

    const usernamesMap = useMemo(() => {
        const map = new Map<string, string | undefined>();
        opponents.forEach((o, id) => {
            if (o.username) map.set(id, o.username);
        });
        if (currentPlayerId && username) {
            map.set(currentPlayerId, username);
        }
        return map;
    }, [opponents, currentPlayerId, username]);

    if (!isInRace) {
        return (
            <div className="bg-gray-200 dark:bg-gray-900">
                <Navbar />
                <RaceControls
                    onCreateRoom={handleCreateRoom}
                    onJoinRoom={handleJoinRoom}
                    isConnected={isConnected}
                    error={joinError}
                    onClearError={clearJoinError}
                />
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="p-4 min-h-[calc(100vh-4rem)]">
                {notification && (
                    <div className="mb-4 p-3 bg-blue-100 dark:bg-emerald-900 border border-emerald-300 dark:border-emerald-700 rounded-lg text-emerald-800 dark:text-emerald-200 text-center">
                        {notification}
                    </div>
                )}
                
                <RaceHeader
                    roomId={currentRoomId}
                    playerCount={playerCount}
                    isRaceStarted={isRaceStarted}
                    isRaceFinished={isRaceFinished}
                    onStartRace={handleStartRace}
                    onLeaveRoom={handleLeaveRoom}
                    countdown={countdownRemaining}
                    countdownInitiator={countdownInitiator}
                    canCancelCountdown={countdownInitiator === socketId}
                    onCancelCountdown={handleCancelCountdown}
                    isCountdownPending={isCountdownPending}
                />

                <OpponentsList opponents={opponents} currentPlayerId={currentPlayerId} />

                {countdownRemaining && !isRaceStarted && (
                    <div className="flex items-center justify-center mt-7">
                        <div className="text-6xl md:text-7xl font-extrabold text-emerald-500 opacity-70 select-none">
                            {countdownRemaining}
                        </div>
                    </div>
                )}

                {!countdownRemaining && !isRaceStarted && (
                    <div className="flex flex-col items-center justify-center text-center mt-7">
                        <h1 className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300 mt-20">
                            Typing Area will appear here once race is started!
                        </h1>
                    </div>
                )}

                {isRaceStarted && !isRaceFinished && (
                    <RaceStats 
                        progress={progress} 
                        wpm={wpm} 
                        accuracy={accuracy} 
                    />
                )}

                {raceText.length > 0 && isRaceStarted && !isRaceFinished && (
                    <TypingArea
                        text={raceText}
                        onComplete={handleRaceComplete}
                        isActive={isRaceStarted}
                        setIsRunning={() => {}}
                        isFinished={isRaceFinished}
                        duration={30} // should be made configurable
                        onTextUpdate={() => {}}
                        onProgress={handleProgress}
                        showRestart={false}
                        className="h-[calc(95vh-120px)]"
                    />
                )}

                {isRaceFinished && (
                    <RaceResults
                        isFinished={isRaceFinished}
                        raceResults={raceResults}
                        currentPlayerResult={currentPlayerResult}
                        onRematch={() => {
                            setNotification("Preparing new race...");
                            setCountdownRemaining(null);
                            setCountdownInitiator(null);
                            setIsCountdownPending(false);
                            resetRace();
                        }}
                        onShare={handleShare}
                        usernamesMap={usernamesMap}
                    />
                )}

                {isShareOpen && currentPlayerResult && (
                    <RaceShareCard
                        isOpen={isShareOpen}
                        onClose={() => setIsShareOpen(false)}
                        wpm={currentPlayerResult.wpm}
                        accuracy={currentPlayerResult.accuracy}
                        raceResults={raceResults}
                        currentPlayerId={currentPlayerId}
                        usernamesMap={usernamesMap}
                    />
                )}
            </div>
        </div>
    );
}