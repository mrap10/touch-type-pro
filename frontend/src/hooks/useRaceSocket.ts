import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { RaceProgressData, UserEventData, RaceCompletedData, RaceSocketCallbacks, LeaderboardUpdateData } from "@/types/race";
import { SocketEvent } from "@/types/socket-events";

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
    
    const { onProgressUpdate, onUserJoined, onUserLeft, onRaceCompleted, onLeaderboardUpdate, onRoomJoined, onRaceStarted, onCountdownStarted, onCountdownTick, onCountdownCancelled, onRaceReset, onCountdownRejected, onRematchRequested, onRematchAccepted, onRematchDeclined, onJoinError } = callbacks;

    useEffect(() => {
        if (!socketRef.current) {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
            
            socketRef.current = io(backendUrl, {
                transports: ['websocket', 'polling'],
                withCredentials: true
            });

            const socket = socketRef.current;

            // heartbeat ping from server
            socket.on(SocketEvent.PING, () => {
                socket.emit(SocketEvent.PONG);
            });

            socket.on(SocketEvent.PROGRESS_BROADCAST, (data: RaceProgressData) => {
                // console.log("Received progress broadcast:", data);
                onProgressUpdate?.(data);
            });

            socket.on(SocketEvent.USER_JOINED, (data: UserEventData & { userCount: number }) => {
                onUserJoined?.(data);
            });

            socket.on(SocketEvent.USER_LEFT, (data: UserEventData & { userCount: number }) => {
                onUserLeft?.(data);
            });

            socket.on(SocketEvent.RACE_COMPLETED, (data: RaceCompletedData) => {
                onRaceCompleted?.(data);
            });

            socket.on(SocketEvent.LEADERBOARD_UPDATE, (data: LeaderboardUpdateData) => {
                onLeaderboardUpdate?.(data);
            });

            socket.on(SocketEvent.ROOM_JOINED, (data: { roomId: string; text: string[]; userCount: number; isStarted: boolean; existingUsers?: string[] }) => {
                roomIdRef.current = data.roomId;
                onRoomJoined?.(data);
            });

            socket.on(SocketEvent.RACE_STARTED, (data: { message: string; text: string[]; startTime: number }) => {
                onRaceStarted?.(data);
            });
            socket.on(SocketEvent.COUNTDOWN_STARTED, (data: { duration: number; initiator: string; endsAt: number }) => {
                onCountdownStarted?.(data);
            });
            socket.on(SocketEvent.COUNTDOWN_TICK, (data: { remaining: number }) => {
                onCountdownTick?.(data);
            });
            socket.on(SocketEvent.COUNTDOWN_CANCELLED, (data: { by: string }) => {
                onCountdownCancelled?.(data);
            });
            socket.on(SocketEvent.RACE_RESET, (data: { roomId: string; text: string[] }) => {
                onRaceReset?.(data);
            });
            socket.on(SocketEvent.COUNTDOWN_REJECTED, (data: { reason: string }) => {
                onCountdownRejected?.(data);
            });
            socket.on(SocketEvent.REMATCH_REQUESTED, (data: { requesterId: string; requesterName: string }) => {
                onRematchRequested?.(data);
            });
            socket.on(SocketEvent.REMATCH_ACCEPTED, (data: { accepterId: string; accepterName: string }) => {
                onRematchAccepted?.(data);
            });
            socket.on(SocketEvent.REMATCH_DECLINED, (data: { declinerId: string; declinerName: string }) => {
                onRematchDeclined?.(data);
            });
            socket.on(SocketEvent.JOIN_ERROR, (data: { roomId: string; message: string }) => {
                onJoinError?.(data);
            });

            socket.on("user_left", (data: UserEventData & { userCount: number }) => {
                onUserLeft?.(data);
            });

            socket.on("race_completed", (data: RaceCompletedData) => {
                onRaceCompleted?.(data);
            });

            socket.on("room_joined", (data: { roomId: string; text: string[]; userCount: number; isStarted: boolean; existingUsers?: string[] }) => {
                roomIdRef.current = data.roomId;
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
    }, [onProgressUpdate, onUserJoined, onUserLeft, onRaceCompleted, onLeaderboardUpdate, onRaceStarted, onRoomJoined, onCountdownStarted, onCountdownTick, onCountdownCancelled, onRaceReset, onCountdownRejected, onRematchRequested, onRematchAccepted, onRematchDeclined, onJoinError]);

    useEffect(() => {
        if (!roomId || !socketRef.current) return;
        roomIdRef.current = roomId;
        return () => {
            if (roomIdRef.current) {
                socketRef.current?.emit(SocketEvent.LEAVE_RACE, roomIdRef.current);
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
            // console.log("Throttle-send progress update (immediate):", { roomId: roomIdRef.current, progress });
            socketRef.current.emit(SocketEvent.PROGRESS_UPDATE, {
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
                // console.log("Throttle-send progress update (trailing):", { roomId: roomIdRef.current, progress });
                socketRef.current.emit(SocketEvent.PROGRESS_UPDATE, {
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
        
        socketRef.current.emit(SocketEvent.START_RACE, roomIdRef.current);
    }, []);

    const initiateCountdown = useCallback((duration: number) => {
        if (!socketRef.current || !roomIdRef.current) return;
        socketRef.current.emit(SocketEvent.INITIATE_COUNTDOWN, { roomId: roomIdRef.current, duration });
    }, []);

    const cancelCountdown = useCallback(() => {
        if (!socketRef.current || !roomIdRef.current) return;
        socketRef.current.emit(SocketEvent.CANCEL_COUNTDOWN, { roomId: roomIdRef.current });
    }, []);

    const resetRace = useCallback(() => {
        if (!socketRef.current || !roomIdRef.current) return;
        socketRef.current.emit(SocketEvent.RESET_RACE, roomIdRef.current);
    }, []);

    const createRace = useCallback((roomId: string, username?: string) => {
        if (!socketRef.current) return;
        
        if (roomIdRef.current && roomIdRef.current !== roomId) {
            socketRef.current.emit(SocketEvent.LEAVE_RACE, roomIdRef.current);
        }

        roomIdRef.current = roomId;
        // dual emit for backward compatibility
        socketRef.current.emit(SocketEvent.CREATE_RACE, roomId); // legacy
        socketRef.current.emit(SocketEvent.CREATE_RACE, { roomId, username }); // new with username
    }, []);

    const joinRoom = useCallback((roomId: string, username?: string) => {
        if (!socketRef.current) return;
        
        if (roomIdRef.current && roomIdRef.current !== roomId) {
            socketRef.current.emit(SocketEvent.LEAVE_RACE, roomIdRef.current);
        }

        socketRef.current.emit(SocketEvent.JOIN_RACE, { roomId, username });
    }, []);

    const requestRematch = useCallback(() => {
        if (!socketRef.current || !roomIdRef.current) return;
        socketRef.current.emit(SocketEvent.REQUEST_REMATCH, roomIdRef.current);
    }, []);

    const acceptRematch = useCallback(() => {
        if (!socketRef.current || !roomIdRef.current) return;
        socketRef.current.emit(SocketEvent.ACCEPT_REMATCH, roomIdRef.current);
    }, []);

    const declineRematch = useCallback(() => {
        if (!socketRef.current || !roomIdRef.current) return;
        socketRef.current.emit(SocketEvent.DECLINE_REMATCH, roomIdRef.current);
    }, []);

    const finishRace = useCallback((wpm: number, accuracy: number, errors: number, finishTime: number) => {
        if (!socketRef.current || !roomIdRef.current) return;
        
        socketRef.current.emit(SocketEvent.RACE_FINISHED, { 
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