import { Server, Socket } from 'socket.io';
import { SocketEvent, ClientToServerEvents, ServerToClientEvents, SocketData } from './types/socket-events';

const HEARTBEAT_INTERVAL = 25000; // ping every 25 seconds
const HEARTBEAT_TIMEOUT = 35000;

const roomData = new Map<string, {
    text: string[];
    users: Set<string>;
    usernames: Map<string, string>;
    isStarted: boolean;
    startTime?: number;
    countdown?: {
        endsAt: number;
        duration: number;
        initiator: string;
        interval?: NodeJS.Timeout;
    }
}>();

const heartbeatIntervals = new Map<string, NodeJS.Timeout>();

function generateRaceText(): string[] {
    const words = [
        "the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog", "and", "runs",
        "through", "forest", "with", "great", "speed", "while", "being", "chased", "by", "hunters",
        "who", "are", "trying", "to", "catch", "this", "magnificent", "creature", "but", "fail",
        "because", "it", "is", "too", "fast", "for", "them", "to", "keep", "up",
        "with", "its", "incredible", "pace", "across", "the", "meadow", "and", "into", "safety"
    ];
    
    const shuffled = words.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 30);
}

export function setupSocketHandlers(io: Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData>) {
    io.on(SocketEvent.CONNECTION, (socket: Socket<ClientToServerEvents, ServerToClientEvents, {}, SocketData>) => {
        console.log('New client connected:', socket.id);

        socket.data.lastHeartbeat = Date.now();

        const heartbeatInterval = setInterval(() => {
            const now = Date.now();
            const timeSinceLastHeartbeat = now - socket.data.lastHeartbeat;

            if (timeSinceLastHeartbeat > HEARTBEAT_TIMEOUT) {
                console.log(`Client ${socket.id} timed out (no heartbeat for ${timeSinceLastHeartbeat}ms). Disconnecting...`);
                socket.disconnect(true);
            } else {
                socket.emit(SocketEvent.PING);
            }
        }, HEARTBEAT_INTERVAL);

        heartbeatIntervals.set(socket.id, heartbeatInterval);

        socket.on(SocketEvent.PONG, () => {
            socket.data.lastHeartbeat = Date.now();
        });

        socket.on(SocketEvent.CREATE_RACE, (payload: string | { roomId: string; username?: string }) => {
            const { roomId, username } = typeof payload === 'string' 
                ? { roomId: payload, username: undefined } 
                : payload;
            
            if (!roomId) return;
            socket.join(roomId);

            if (!roomData.has(roomId)) {
                roomData.set(roomId, {
                    text: generateRaceText(),
                    users: new Set(),
                    usernames: new Map(),
                    isStarted: false
                });
            }

            const room = roomData.get(roomId)!;
            const existingUsers = Array.from(room.users);
            room.users.add(socket.id);
            if (username) {
                room.usernames.set(socket.id, username);
            }

            socket.emit(SocketEvent.ROOM_JOINED, {
                roomId,
                text: room.text,
                userCount: room.users.size,
                isStarted: room.isStarted,
                existingUsers: existingUsers,
                usersMeta: Array.from(room.usernames.entries()).map(([playerId, uname]) => ({ 
                    playerId, 
                    username: uname 
                }))
            });

            socket.to(roomId).emit(SocketEvent.USER_JOINED, {
                message: 'A user joined the race',
                playerId: socket.id,
                userCount: room.users.size,
                username: username
            });
        });

        socket.on(SocketEvent.JOIN_RACE, (payload: string | { roomId: string; username?: string }) => {
            const { roomId, username } = typeof payload === 'string' 
                ? { roomId: payload, username: undefined } 
                : payload;
            
            if (!roomId) return;

            if (!roomData.has(roomId)) {
                socket.emit(SocketEvent.JOIN_ERROR, { 
                    roomId, 
                    message: 'Race ID does not exist. Please check the ID and try again.' 
                });
                return;
            }

            socket.join(roomId);
            const room = roomData.get(roomId)!;
            const existingUsers = Array.from(room.users);
            room.users.add(socket.id);
            if (username) {
                room.usernames.set(socket.id, username);
            }

            socket.emit(SocketEvent.ROOM_JOINED, {
                roomId,
                text: room.text,
                userCount: room.users.size,
                isStarted: room.isStarted,
                existingUsers: existingUsers,
                usersMeta: Array.from(room.usernames.entries()).map(([playerId, uname]) => ({ 
                    playerId, 
                    username: uname 
                }))
            });

            existingUsers.forEach(userId => {
                socket.emit(SocketEvent.USER_JOINED, {
                message: 'Existing user in room',
                playerId: userId,
                userCount: room.users.size,
                username: room.usernames.get(userId)
                });
            });

            socket.to(roomId).emit(SocketEvent.USER_JOINED, { 
                message: 'A new user has joined the race!',
                playerId: socket.id,
                userCount: room.users.size,
                username
            });
        });

        socket.on(SocketEvent.PROGRESS_UPDATE, ({ roomId, progress }: { roomId: string; progress: number }) => {
            const room = roomData.get(roomId);
            socket.to(roomId).emit(SocketEvent.PROGRESS_BROADCAST, {
                playerId: socket.id,
                progress,
                username: room?.usernames.get(socket.id)
            });
        });

        socket.on(SocketEvent.RACE_FINISHED, ({ roomId, wpm, accuracy, errors, finishTime }: { 
            roomId: string; 
            wpm: number; 
            accuracy: number; 
            errors: number; 
            finishTime: number;
        }) => {
            const room = roomData.get(roomId);
            let authoritativeFinishTime = finishTime;
            if (room?.startTime) {
                authoritativeFinishTime = Date.now() - room.startTime;
            }
            socket.to(roomId).emit(SocketEvent.RACE_COMPLETED, {
                playerId: socket.id,
                wpm,
                accuracy,
                errors,
                finishTime: authoritativeFinishTime
            });
        });

        socket.on(SocketEvent.START_RACE, (roomId: string) => {
            const room = roomData.get(roomId);
            if (room) {
                room.isStarted = true;
                room.startTime = Date.now();
                io.to(roomId).emit(SocketEvent.RACE_STARTED, {
                    message: 'Race has started!',
                    text: room.text,
                    startTime: room.startTime
                });
            }
        });

        socket.on(SocketEvent.INITIATE_COUNTDOWN, ({ roomId, duration }: { roomId: string; duration: number }) => {
            const room = roomData.get(roomId);
            if (!room) return;
            
            if (room.isStarted || room.countdown) {
                socket.emit(SocketEvent.COUNTDOWN_REJECTED, { reason: 'Race already started or countdown active' });
                return;
            }
            
            if (room.users.size < 2) {
                socket.emit(SocketEvent.COUNTDOWN_REJECTED, { reason: 'Need at least 2 players' });
                return;
            }

            const now = Date.now();
            const endsAt = now + duration * 1000;
            room.countdown = { endsAt, duration, initiator: socket.id };

            io.to(roomId).emit(SocketEvent.COUNTDOWN_STARTED, { duration, initiator: socket.id, endsAt });

            room.countdown.interval = setInterval(() => {
                const remainingMs = endsAt - Date.now();
                const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
                
                if (remainingSeconds > 0) {
                    io.to(roomId).emit(SocketEvent.COUNTDOWN_TICK, { remaining: remainingSeconds });
                } else {
                    if (room.countdown?.interval) clearInterval(room.countdown.interval);
                    delete room.countdown;
                    room.isStarted = true;
                    room.startTime = Date.now();
                    io.to(roomId).emit(SocketEvent.RACE_STARTED, {
                        message: 'Race has started!',
                        text: room.text,
                        startTime: room.startTime
                    });
                }
            }, 1000);
        });

        socket.on(SocketEvent.CANCEL_COUNTDOWN, ({ roomId }: { roomId: string }) => {
            const room = roomData.get(roomId);
            if (!room || !room.countdown) return;
            if (room.countdown.initiator !== socket.id) return;
            
            if (room.countdown.interval) clearInterval(room.countdown.interval);
            delete room.countdown;
            io.to(roomId).emit(SocketEvent.COUNTDOWN_CANCELLED, { by: socket.id });
        });

        socket.on(SocketEvent.RESET_RACE, (roomId: string) => {
            const room = roomData.get(roomId);
            if (!room) return;
            
            if (room.countdown?.interval) clearInterval(room.countdown.interval);
            if (room.countdown) delete room.countdown;
            
            room.isStarted = false;
            room.startTime = undefined;
            room.text = generateRaceText();
            io.to(roomId).emit(SocketEvent.RACE_RESET, { roomId, text: room.text });
        });

        socket.on(SocketEvent.LEAVE_RACE, (roomId: string) => {
            socket.leave(roomId);
            console.log(`User ${socket.id} left room: ${roomId}`);
            
            const room = roomData.get(roomId);
            if (room) {
                room.users.delete(socket.id);
                room.usernames.delete(socket.id);

                if (room.countdown && room.countdown.initiator === socket.id) {
                    if (room.countdown.interval) clearInterval(room.countdown.interval);
                    delete room.countdown;
                    io.to(roomId).emit(SocketEvent.COUNTDOWN_CANCELLED, { by: socket.id });
                }
                
                if (room.users.size === 0) {
                    roomData.delete(roomId);
                } else {
                    socket.to(roomId).emit(SocketEvent.USER_LEFT, {
                        message: 'A user has left the race',
                        playerId: socket.id,
                        userCount: room.users.size,
                        username: undefined
                    });
                }
            }
        });

        socket.on(SocketEvent.DISCONNECT, () => {
            console.log('User disconnected:', socket.id);
            
            const interval = heartbeatIntervals.get(socket.id);
            if (interval) {
                clearInterval(interval);
                heartbeatIntervals.delete(socket.id);
            }
            
            for (const [roomId, room] of roomData.entries()) {
                if (room.users.has(socket.id)) {
                    room.users.delete(socket.id);
                    room.usernames.delete(socket.id);
                    
                    if (room.countdown && room.countdown.initiator === socket.id) {
                        if (room.countdown.interval) clearInterval(room.countdown.interval);
                        delete room.countdown;
                        socket.to(roomId).emit(SocketEvent.COUNTDOWN_CANCELLED, { by: socket.id });
                    }
                    
                    socket.to(roomId).emit(SocketEvent.USER_LEFT, {
                        message: 'A user has disconnected',
                        playerId: socket.id,
                        userCount: room.users.size,
                        username: undefined
                    });
                    
                    if (room.users.size === 0) {
                        roomData.delete(roomId);
                    }
                }
            }
        });
    });
}