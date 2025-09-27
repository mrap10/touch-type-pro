"use client";

import Navbar from "@/components/Navbar";
import RaceControls from "@/components/RaceControls";
import RaceHeader from "@/components/RaceHeader";
import OpponentsList from "@/components/OpponentsList";
import RaceStats from "@/components/RaceStats";
import TypingArea from "@/components/TypingArea";
import useRaceSocket from "@/hooks/useRaceSocket";
import useRaceState from "@/hooks/useRaceState";

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
        handleRaceStarted
    } = raceState;

    const { sendProgress, startRace: socketStartRace, finishRace, disconnect, isConnected } = useRaceSocket(
        currentRoomId,
        {
            onProgressUpdate: updateOpponentProgress,
            onUserJoined: addUser,
            onUserLeft: removeUser,
            onRaceCompleted: (data) => {
                console.log("Race completed by:", data);
            },
            onRoomJoined: handleRoomJoined,
            onRaceStarted: handleRaceStarted
        }
    );

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
        completeRace(stats);
        finishRace(stats.wpm, stats.accuracy);
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
                    onStartRace={handleStartRace}
                    onLeaveRoom={handleLeaveRoom}
                />

                <OpponentsList opponents={opponents} />

                <RaceStats 
                    progress={progress} 
                    wpm={wpm} 
                    accuracy={accuracy} 
                />

                {raceText.length > 0 && (
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
            </div>
        </div>
    );
}