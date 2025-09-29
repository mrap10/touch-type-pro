"use client";

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import RaceControls from "@/components/RaceControls";
import RaceHeader from "@/components/RaceHeader";
import OpponentsList from "@/components/OpponentsList";
import RaceStats from "@/components/RaceStats";
import TypingArea from "@/components/TypingArea";
import useRaceSocket from "@/hooks/useRaceSocket";
import useRaceState from "@/hooks/useRaceState";
import RaceResults from "@/components/RaceResults";

export default function RacePage() {
    const raceState = useRaceState();
    const {
        currentRoomId,
        isInRace,
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
        currentPlayerId
    } = raceState;

    const { sendProgress, startRace: socketStartRace, finishRace, disconnect, isConnected, socketId } = useRaceSocket(
        currentRoomId,
        {
            onProgressUpdate: (data) => {
                updateOpponentProgress(data);
            },
            onUserJoined: addUser,
            onUserLeft: removeUser,
            onRaceCompleted: handlePlayerFinished,
            onRoomJoined: handleRoomJoined,
            onRaceStarted: handleRaceStarted
        }
    );

    useEffect(() => {
        if (socketId && socketId !== currentPlayerId) {
            setCurrentPlayerId(socketId);
        }
    }, [socketId, currentPlayerId, setCurrentPlayerId]);

    const handleStartRace = () => {
        socketStartRace();
    };

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

    if (!isInRace) {
        return (
            <div>
                <Navbar />
                <RaceControls
                    onCreateRoom={createRoom}
                    onJoinRoom={joinRoom}
                    isConnected={isConnected}
                />
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="p-4 min-h-[calc(100vh-4rem)]">
                <RaceHeader
                    roomId={currentRoomId}
                    playerCount={playerCount}
                    isRaceStarted={isRaceStarted}
                    isRaceFinished={isRaceFinished}
                    onStartRace={handleStartRace}
                    onLeaveRoom={handleLeaveRoom}
                />

                <OpponentsList opponents={opponents} />

                {!isRaceStarted && (
                    <div className="flex flex-col items-center justify-center text-center mt-10">
                        <p className="text-gray-600 dark:text-gray-400">
                            Waiting for players to join...
                        </p>
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
                    />
                )}

                {isRaceFinished && (
                    <RaceResults
                        isFinished={isRaceFinished}
                        raceResults={raceResults}
                        currentPlayerResult={currentPlayerResult}
                        onRematch={() => {
                            resetRaceState();
                            createRoom();
                        }}
                        onShare={() => {
                            // TODO: Implement share functionality
                            console.log('Share results clicked');
                        }}
                    />
                )}
            </div>
        </div>
    );
}