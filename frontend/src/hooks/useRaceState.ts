import { useState, useCallback } from "react";
import { Opponent, RaceStats, RaceCompletedData, LeaderboardEntry } from "@/types/race";

export interface PlayerResult extends RaceCompletedData {
    position: number;
}

export default function useRaceState() {
    const [roomId, setRoomId] = useState<string>("");
    const [currentRoomId, setCurrentRoomId] = useState<string>("");
    const [isInRace, setIsInRace] = useState(false);
    const [isCreatingRoom, setIsCreatingRoom] = useState(false);
    const [raceText, setRaceText] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);
    const [opponents, setOpponents] = useState<Map<string, Opponent>>(new Map());
    const [username, setUsername] = useState<string>("");
    const [connectedUsers, setConnectedUsers] = useState<Set<string>>(new Set());
    const [serverUserCount, setServerUserCount] = useState<number>(1);
    const [isRaceStarted, setIsRaceStarted] = useState(false);
    const [raceStartTime, setRaceStartTime] = useState<number>(0); // server authoritative when available
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [isRaceFinished, setIsRaceFinished] = useState(false);
    const [raceResults, setRaceResults] = useState<Map<string, PlayerResult>>(new Map());
    const [currentPlayerResult, setCurrentPlayerResult] = useState<PlayerResult | null>(null);
    const [currentPlayerId, setCurrentPlayerId] = useState<string>("");

    const generateRoomId = useCallback(() => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }, []);

    const createRoom = useCallback(() => {
        const newRoomId = generateRoomId();
        setRoomId(newRoomId);
        setCurrentRoomId(newRoomId);
        setIsCreatingRoom(true);
        setIsInRace(true);
    }, [generateRoomId]);

    const joinRoom = useCallback((roomId: string) => {
        setCurrentRoomId(roomId);
        setIsCreatingRoom(false);
    }, []);

    const startRace = useCallback(() => {
        // fallback manual start
        setIsRaceStarted(true);
        if (!raceStartTime) {
            setRaceStartTime(Date.now());
        }
    }, [raceStartTime]);

    const resetRaceState = useCallback(() => {
        setIsInRace(false);
        setCurrentRoomId("");
        setRoomId("");
        setIsCreatingRoom(false);
        setIsRaceStarted(false);
        setIsRaceFinished(false);
        setRaceStartTime(0);
        setProgress(0);
        setOpponents(new Map());
        setConnectedUsers(new Set());
        setServerUserCount(1);
        setWpm(0);
        setAccuracy(100);
        setRaceResults(new Map());
        setCurrentPlayerResult(null);
        setCurrentPlayerId("");
        setUsername("");
    }, []);

    const prepareRematch = useCallback(() => {
        setIsRaceStarted(false);
        setIsRaceFinished(false);
        setRaceStartTime(0);
        setProgress(0);
        setWpm(0);
        setAccuracy(100);
        setRaceResults(new Map());
        setCurrentPlayerResult(null);
    }, []);

    const updateProgress = useCallback((progressPercent: number, currentWpm: number, currentAccuracy: number) => {
        // console.log("Updating own race stats:", { progressPercent, currentWpm, currentAccuracy });
        setProgress(progressPercent);
        setWpm(currentWpm);
        setAccuracy(currentAccuracy);
    }, []);

    const recomputePositions = useCallback((results: Map<string, PlayerResult>) => {
        const arr = Array.from(results.values());
        arr.sort((a, b) => {
            if (b.wpm !== a.wpm) return b.wpm - a.wpm;
            return a.finishTime - b.finishTime;
        });
        arr.forEach((r, idx) => {
            results.set(r.playerId, { ...r, position: idx + 1 });
        });
    }, []);

    const completeRace = useCallback((stats: RaceStats) => {
        setIsRaceFinished(true);
        setWpm(stats.wpm);
        setAccuracy(stats.accuracy);
        const baseStart = raceStartTime || Date.now();
        const finishTime = Date.now() - baseStart;
        const currentResult: PlayerResult = {
            playerId: currentPlayerId,
            wpm: stats.wpm,
            accuracy: stats.accuracy,
            errors: stats.errors,
            finishTime,
            position: 0
        };
        setCurrentPlayerResult(currentResult);
        setRaceResults(prev => {
            const newResults = new Map(prev);
            newResults.set(currentPlayerId, currentResult);
            recomputePositions(newResults);
            return newResults;
        });
    }, [raceStartTime, currentPlayerId, recomputePositions]);

    const updateOpponentProgress = useCallback((data: { playerId: string; progress: number; username?: string }) => {
        // console.log("Updating opponent progress:", data);
        setOpponents(prev => {
            const newOpponents = new Map(prev);
            // console.log("Current opponents before update:", Array.from(prev.entries()));
            if (newOpponents.has(data.playerId)) {
                newOpponents.set(data.playerId, {
                    ...newOpponents.get(data.playerId)!,
                    progress: data.progress,
                    username: newOpponents.get(data.playerId)!.username || data.username
                });
            } else {
                newOpponents.set(data.playerId, {
                    playerId: data.playerId,
                    progress: data.progress,
                    username: data.username
                });
            }
            // console.log("Updated opponents:", Array.from(newOpponents.entries()));
            return newOpponents;
        });
    }, []);

    const addUser = useCallback((data: { playerId: string; userCount?: number; username?: string }) => {
        setConnectedUsers(prev => new Set(prev).add(data.playerId));
        setOpponents(prev => {
            const newOpponents = new Map(prev);
            if (!newOpponents.has(data.playerId)) {
                newOpponents.set(data.playerId, {
                    playerId: data.playerId,
                    progress: 0,
                    username: data.username
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

    const handleRoomJoined = useCallback((data: { roomId: string; text: string[]; userCount: number; isStarted: boolean; existingUsers?: string[]; usersMeta?: Array<{ playerId: string; username?: string }> }) => {
        setRaceText(data.text);
        setIsRaceStarted(data.isStarted);
        setServerUserCount(data.userCount);
        setIsInRace(true);

        if (data.existingUsers && data.existingUsers.length > 0) {
            setOpponents(prev => {
                const newOpponents = new Map(prev);
                const usernameLookup = new Map<string, string | undefined>();
                if (data.usersMeta) {
                    data.usersMeta.forEach(u => usernameLookup.set(u.playerId, u.username));
                }
                data.existingUsers!.forEach(userId => {
                    if (!newOpponents.has(userId)) {
                        newOpponents.set(userId, {
                            playerId: userId,
                            progress: 0,
                            username: usernameLookup.get(userId)
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

    const handleRaceStarted = useCallback((data: { message: string; text: string[]; startTime: number }) => {
        setRaceText(data.text);
        setIsRaceStarted(true);
        setRaceStartTime(data.startTime);
    }, []);

    const handlePlayerFinished = useCallback((data: RaceCompletedData) => {
        setRaceResults(prev => {
            const newResults = new Map(prev);
            const playerResult: PlayerResult = { ...data, position: 0 };
            newResults.set(data.playerId, playerResult);
            recomputePositions(newResults);
            return newResults;
        });
    }, [recomputePositions]);

    const handleLeaderboardUpdate = useCallback((leaderboard: LeaderboardEntry[]) => {
        const newResults = new Map<string, PlayerResult>();
        leaderboard.forEach(entry => {
            newResults.set(entry.playerId, entry);
        });
        setRaceResults(newResults);
        
        const myResult = leaderboard.find(entry => entry.playerId === currentPlayerId);
        if (myResult) {
            setCurrentPlayerResult(myResult);
        }
    }, [currentPlayerId]);

    const updateLocalUsername = useCallback((name: string) => {
        setUsername(name);
        setOpponents(prev => {
            if (!currentPlayerId) return prev; // will update later when id arrives
            const newMap = new Map(prev);
            const existing = newMap.get(currentPlayerId);
            if (existing) {
                newMap.set(currentPlayerId, { ...existing, username: name });
            } else {
                newMap.set(currentPlayerId, { playerId: currentPlayerId, progress: 0, username: name });
            }
            return newMap;
        });
    }, [currentPlayerId]);

    return {
        roomId,
        currentRoomId,
        isInRace,
        isCreatingRoom,
        raceText,
        progress,
        opponents,
        connectedUsers,
        isRaceStarted,
        wpm,
        accuracy,
        isRaceFinished,
        raceResults,
        currentPlayerResult,
        raceStartTime,
        
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
        handlePlayerFinished,
        handleLeaderboardUpdate,
        setCurrentPlayerId,
        prepareRematch,
        
        playerCount: serverUserCount,
        currentPlayerId,
        username,
        setUsername: updateLocalUsername,
    };
}