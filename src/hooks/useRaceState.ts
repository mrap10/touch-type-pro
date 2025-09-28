import { useState, useCallback } from "react";
import { Opponent, RaceStats } from "@/types/race";

export default function useRaceState() {
    const [roomId, setRoomId] = useState<string>("");
    const [currentRoomId, setCurrentRoomId] = useState<string>("");
    const [isInRace, setIsInRace] = useState(false);
    const [raceText, setRaceText] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);
    const [opponents, setOpponents] = useState<Map<string, Opponent>>(new Map());
    const [connectedUsers, setConnectedUsers] = useState<Set<string>>(new Set());
    const [serverUserCount, setServerUserCount] = useState<number>(1);
    const [isRaceStarted, setIsRaceStarted] = useState(false);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [isRaceFinished, setIsRaceFinished] = useState(false);

    const generateRoomId = useCallback(() => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }, []);

    const createRoom = useCallback(() => {
        const newRoomId = generateRoomId();
        setRoomId(newRoomId);
        setCurrentRoomId(newRoomId);
        setIsInRace(true);
    }, [generateRoomId]);

    const joinRoom = useCallback((roomId: string) => {
        setCurrentRoomId(roomId);
        setIsInRace(true);
    }, []);

    const startRace = useCallback(() => {
        setIsRaceStarted(true);
    }, []);

    const resetRaceState = useCallback(() => {
        setIsInRace(false);
        setCurrentRoomId("");
        setRoomId("");
        setIsRaceStarted(false);
        setIsRaceFinished(false);
        setProgress(0);
        setOpponents(new Map());
        setConnectedUsers(new Set());
        setServerUserCount(1);
        setWpm(0);
        setAccuracy(100);
    }, []);

    const updateProgress = useCallback((progressPercent: number, currentWpm: number, currentAccuracy: number) => {
        // console.log("Updating own race stats:", { progressPercent, currentWpm, currentAccuracy });
        setProgress(progressPercent);
        setWpm(currentWpm);
        setAccuracy(currentAccuracy);
    }, []);

    const completeRace = useCallback((stats: RaceStats) => {
        setIsRaceFinished(true);
        setWpm(stats.wpm);
        setAccuracy(stats.accuracy);
    }, []);

    const updateOpponentProgress = useCallback((data: { playerId: string; progress: number }) => {
        // console.log("Updating opponent progress:", data);
        setOpponents(prev => {
            const newOpponents = new Map(prev);
            // console.log("Current opponents before update:", Array.from(prev.entries()));
            if (newOpponents.has(data.playerId)) {
                newOpponents.set(data.playerId, {
                    ...newOpponents.get(data.playerId)!,
                    progress: data.progress
                });
            } else {
                newOpponents.set(data.playerId, {
                    playerId: data.playerId,
                    progress: data.progress
                });
            }
            // console.log("Updated opponents:", Array.from(newOpponents.entries()));
            return newOpponents;
        });
    }, []);

    const addUser = useCallback((data: { playerId: string; userCount?: number }) => {
        setConnectedUsers(prev => new Set(prev).add(data.playerId));
        setOpponents(prev => {
            const newOpponents = new Map(prev);
            if (!newOpponents.has(data.playerId)) {
                newOpponents.set(data.playerId, {
                    playerId: data.playerId,
                    progress: 0
                });
            }
            return newOpponents;
        });
        
        if (data.userCount !== undefined) {
            setServerUserCount(data.userCount);
        }
    }, []);

    const removeUser = useCallback((data: { playerId: string; userCount?: number }) => {
        setConnectedUsers(prev => {
            const newSet = new Set(prev);
            newSet.delete(data.playerId);
            return newSet;
        });
        setOpponents(prev => {
            const newOpponents = new Map(prev);
            newOpponents.delete(data.playerId);
            return newOpponents;
        });
        
        if (data.userCount !== undefined) {
            setServerUserCount(data.userCount);
        }
    }, []);

    const handleRoomJoined = useCallback((data: { roomId: string; text: string[]; userCount: number; isStarted: boolean; existingUsers?: string[] }) => {
        setRaceText(data.text);
        setIsRaceStarted(data.isStarted);
        setServerUserCount(data.userCount);

        if (data.existingUsers && data.existingUsers.length > 0) {
            setOpponents(prev => {
                const newOpponents = new Map(prev);
                data.existingUsers!.forEach(userId => {
                    if (!newOpponents.has(userId)) {
                        newOpponents.set(userId, {
                            playerId: userId,
                            progress: 0
                        });
                    }
                });
                return newOpponents;
            });
            
            setConnectedUsers(prev => {
                const newSet = new Set(prev);
                data.existingUsers!.forEach(userId => newSet.add(userId));
                return newSet;
            });
        }
    }, []);

    const handleRaceStarted = useCallback((data: { message: string; text: string[] }) => {
        setRaceText(data.text);
        setIsRaceStarted(true);
    }, []);

    return {
        roomId,
        currentRoomId,
        isInRace,
        raceText,
        progress,
        opponents,
        connectedUsers,
        isRaceStarted,
        wpm,
        accuracy,
        isRaceFinished,
        
        createRoom,
        joinRoom,
        startRace,
        resetRaceState,
        updateProgress,
        completeRace,
        updateOpponentProgress,
        addUser,
        removeUser,
        setRaceText,
        handleRoomJoined,
        handleRaceStarted,
        
        playerCount: serverUserCount,
    };
}