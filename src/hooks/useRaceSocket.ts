import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { RaceProgressData, UserEventData, RaceCompletedData, RaceSocketCallbacks } from "@/types/race";

const PROGRESS_THROTTLE_MS = 300;
const MIN_PROGRESS_DIFF = 1;

export default function useRaceSocket(
    roomId: string, 
    callbacks: RaceSocketCallbacks = {}
) {
    const socketRef = useRef<Socket | null>(null);
    const roomIdRef = useRef<string>("");
    const lastProgressSent = useRef<number>(0);
    const progressThrottleRef = useRef<NodeJS.Timeout | null>(null);
    
    const { onProgressUpdate, onUserJoined, onUserLeft, onRaceCompleted, onRoomJoined, onRaceStarted } = callbacks;

    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io({
                path: "/api/socketio",
            });

            const socket = socketRef.current;

            socket.on("progress_broadcast", (data: RaceProgressData) => {
                onProgressUpdate?.(data);
            });

            socket.on("user_joined", (data: UserEventData & { userCount: number }) => {
                onUserJoined?.(data);
            });

            socket.on("user_left", (data: UserEventData & { userCount: number }) => {
                onUserLeft?.(data);
            });

            socket.on("race_completed", (data: RaceCompletedData) => {
                onRaceCompleted?.(data);
            });

            socket.on("room_joined", (data: { roomId: string; text: string[]; userCount: number; isStarted: boolean; existingUsers?: string[] }) => {
                onRoomJoined?.(data);
            });

            socket.on("race_started", (data: { message: string; text: string[] }) => {
                onRaceStarted?.(data);
            });
        }

        return () => {
            if (progressThrottleRef.current) {
                clearTimeout(progressThrottleRef.current);
            }
        };
    }, [onProgressUpdate, onUserJoined, onUserLeft, onRaceCompleted]);

    useEffect(() => {
        if (!roomId || !socketRef.current) return;

        const socket = socketRef.current;

        if (roomIdRef.current && roomIdRef.current !== roomId) {
            socket.emit("leave_race", roomIdRef.current);
        }

        roomIdRef.current = roomId;
        socket.emit("join_race", roomId);

        return () => {
            if (roomIdRef.current) {
                socket.emit("leave_race", roomIdRef.current);
            }
        };
    }, [roomId]);

    const sendProgress = useCallback((progress: number) => {
        if (!socketRef.current || !roomIdRef.current) return;

        const progressDiff = Math.abs(progress - lastProgressSent.current);
        if (progressDiff < MIN_PROGRESS_DIFF) return;

        if (progressThrottleRef.current) {
            clearTimeout(progressThrottleRef.current);
        }

        progressThrottleRef.current = setTimeout(() => {
            if (socketRef.current && roomIdRef.current) {
                socketRef.current.emit("progress_update", { 
                    roomId: roomIdRef.current, 
                    progress 
                });
                lastProgressSent.current = progress;
            }
        }, PROGRESS_THROTTLE_MS);
    }, []);

    const startRace = useCallback(() => {
        if (!socketRef.current || !roomIdRef.current) return;
        
        socketRef.current.emit("start_race", roomIdRef.current);
    }, []);

    const finishRace = useCallback((wpm: number, accuracy: number) => {
        if (!socketRef.current || !roomIdRef.current) return;
        
        socketRef.current.emit("race_finished", { 
            roomId: roomIdRef.current, 
            wpm, 
            accuracy 
        });
    }, []);

    const leaveRace = useCallback(() => {
        if (!socketRef.current || !roomIdRef.current) return;
        
        socketRef.current.emit("leave_race", roomIdRef.current);
        roomIdRef.current = "";
    }, []);

    const disconnect = useCallback(() => {
        if (progressThrottleRef.current) {
            clearTimeout(progressThrottleRef.current);
        }
        
        if (socketRef.current) {
            if (roomIdRef.current) {
                socketRef.current.emit("leave_race", roomIdRef.current);
            }
            socketRef.current.disconnect();
            socketRef.current = null;
        }
        
        roomIdRef.current = "";
        lastProgressSent.current = 0;
    }, []);

    return { 
        sendProgress,
        startRace,
        finishRace, 
        leaveRace,
        disconnect,
        isConnected: !!socketRef.current?.connected 
    };
}