import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { RaceProgressData, UserEventData, RaceCompletedData, RaceSocketCallbacks } from "@/types/race";

const PROGRESS_THROTTLE_MS = 250;
const MIN_PROGRESS_DIFF = 0.1;

export default function useRaceSocket(
    roomId: string, 
    callbacks: RaceSocketCallbacks = {}
) {
    const socketRef = useRef<Socket | null>(null);
    const roomIdRef = useRef<string>("");
    const lastProgressSent = useRef<number>(0);
    const progressThrottleRef = useRef<NodeJS.Timeout | null>(null);
    
    const { onProgressUpdate, onUserJoined, onUserLeft, onRaceCompleted, onRoomJoined, onRaceStarted, onCountdownStarted, onCountdownTick, onCountdownCancelled, onRaceReset, onCountdownRejected, onRematchRequested, onRematchAccepted, onRematchDeclined, onJoinError } = callbacks;

    useEffect(() => {
        if (!socketRef.current) {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
            
            socketRef.current = io(backendUrl, {
                transports: ['websocket', 'polling'],
                withCredentials: true
            });

            const socket = socketRef.current;

            socket.on("progress_broadcast", (data: RaceProgressData) => {
                // console.log("Received progress broadcast:", data);
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

            socket.on("race_started", (data: { message: string; text: string[]; startTime: number }) => {
                onRaceStarted?.(data);
            });
            socket.on("countdown_started", (data: { duration: number; initiator: string; endsAt: number }) => {
                onCountdownStarted?.(data);
            });
            socket.on("countdown_tick", (data: { remaining: number }) => {
                onCountdownTick?.(data);
            });
            socket.on("countdown_cancelled", (data: { by: string }) => {
                onCountdownCancelled?.(data);
            });
            socket.on("race_reset", (data: { roomId: string; text: string[] }) => {
                onRaceReset?.(data);
            });
            socket.on("countdown_rejected", (data: { reason: string }) => {
                onCountdownRejected?.(data);
            });
            socket.on("rematch_requested", (data: { requesterId: string; requesterName: string }) => {
                onRematchRequested?.(data);
            });
            socket.on("rematch_accepted", (data: { accepterId: string; accepterName: string }) => {
                onRematchAccepted?.(data);
            });
            socket.on("rematch_declined", (data: { declinerId: string; declinerName: string }) => {
                onRematchDeclined?.(data);
            });
            socket.on("join_error", (data: { roomId: string; message: string }) => {
                onJoinError?.(data);
            });
        }

        return () => {
            if (progressThrottleRef.current) {
                clearTimeout(progressThrottleRef.current);
            }
        };
    }, [onProgressUpdate, onUserJoined, onUserLeft, onRaceCompleted, onRaceStarted, onRoomJoined, onCountdownStarted, onCountdownTick, onCountdownCancelled, onRaceReset, onCountdownRejected, onRematchRequested, onRematchAccepted, onRematchDeclined, onJoinError]);

    useEffect(() => {
        if (!roomId || !socketRef.current) return;
        roomIdRef.current = roomId;
        return () => {
            if (roomIdRef.current) {
                socketRef.current?.emit("leave_race", roomIdRef.current);
            }
        };
    }, [roomId]);

    const sendProgress = useCallback((progress: number) => {
        if (!socketRef.current || !roomIdRef.current) {
            console.log("Cannot send progress: socket or room not available", {
                hasSocket: !!socketRef.current,
                roomId: roomIdRef.current
            });
            return;
        }

        const now = Date.now();
        const last = (sendProgress as unknown as { _lastSentAt?: number })._lastSentAt;
        const progressDiff = Math.abs(progress - lastProgressSent.current);

        const isCompletion = progress >= 100;

        if (!isCompletion && progressDiff < MIN_PROGRESS_DIFF) return;

        const shouldSendImmediately = !last || now - last >= PROGRESS_THROTTLE_MS || isCompletion;

        if (shouldSendImmediately) {
            console.log("Throttle-send progress update (immediate):", { roomId: roomIdRef.current, progress });
            socketRef.current.emit("progress_update", {
                roomId: roomIdRef.current,
                progress
            });
            lastProgressSent.current = progress;
            (sendProgress as unknown as { _lastSentAt: number })._lastSentAt = now;
            if (progressThrottleRef.current) {
                clearTimeout(progressThrottleRef.current);
            }
        } else {
            // scheduling trailing send (ensures opponent sees near-latest value)
            if (progressThrottleRef.current) clearTimeout(progressThrottleRef.current);
            progressThrottleRef.current = setTimeout(() => {
                if (!socketRef.current || !roomIdRef.current) return;
                console.log("Throttle-send progress update (trailing):", { roomId: roomIdRef.current, progress });
                socketRef.current.emit("progress_update", {
                    roomId: roomIdRef.current,
                    progress
                });
                lastProgressSent.current = progress;
                (sendProgress as unknown as { _lastSentAt: number })._lastSentAt = Date.now();
            }, PROGRESS_THROTTLE_MS - (now - last));
        }
    }, []);

    const startRace = useCallback(() => {
        if (!socketRef.current || !roomIdRef.current) return;
        
        socketRef.current.emit("start_race", roomIdRef.current);
    }, []);

    const initiateCountdown = useCallback((duration: number) => {
        if (!socketRef.current || !roomIdRef.current) return;
        socketRef.current.emit("initiate_countdown", { roomId: roomIdRef.current, duration });
    }, []);

    const cancelCountdown = useCallback(() => {
        if (!socketRef.current || !roomIdRef.current) return;
        socketRef.current.emit("cancel_countdown", { roomId: roomIdRef.current });
    }, []);

    const resetRace = useCallback(() => {
        if (!socketRef.current || !roomIdRef.current) return;
        socketRef.current.emit("reset_race", roomIdRef.current);
    }, []);

    const createRace = useCallback((roomId: string, username?: string) => {
        if (!socketRef.current) return;
        
        if (roomIdRef.current && roomIdRef.current !== roomId) {
            socketRef.current.emit("leave_race", roomIdRef.current);
        }

        roomIdRef.current = roomId;
        // dual emit for backward compatibility
        socketRef.current.emit("create_race", roomId); // legacy
        socketRef.current.emit("create_race", { roomId, username }); // new with username
    }, []);

    const joinRoom = useCallback((roomId: string, username?: string) => {
        if (!socketRef.current) return;
        
        if (roomIdRef.current && roomIdRef.current !== roomId) {
            socketRef.current.emit("leave_race", roomIdRef.current);
        }

        roomIdRef.current = roomId;
        socketRef.current.emit("join_race", roomId);
        socketRef.current.emit("join_race", { roomId, username });
    }, []);

    const requestRematch = useCallback(() => {
        if (!socketRef.current || !roomIdRef.current) return;
        socketRef.current.emit("request_rematch", roomIdRef.current);
    }, []);

    const acceptRematch = useCallback(() => {
        if (!socketRef.current || !roomIdRef.current) return;
        socketRef.current.emit("accept_rematch", roomIdRef.current);
    }, []);

    const declineRematch = useCallback(() => {
        if (!socketRef.current || !roomIdRef.current) return;
        socketRef.current.emit("decline_rematch", roomIdRef.current);
    }, []);

    const finishRace = useCallback((wpm: number, accuracy: number, errors: number, finishTime: number) => {
        if (!socketRef.current || !roomIdRef.current) return;
        
        socketRef.current.emit("race_finished", { 
            roomId: roomIdRef.current, 
            wpm, 
            accuracy,
            errors,
            finishTime
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
        initiateCountdown,
        cancelCountdown,
        resetRace,
        requestRematch,
        acceptRematch,
        declineRematch,
        createRace,
        joinRoom,
        isConnected: !!socketRef.current?.connected,
        socketId: socketRef.current?.id
    };
}