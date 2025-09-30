import { NextApiRequest, NextApiResponse } from "next";
import { Server as NetServer } from "http";
import { Socket as NetSocket } from "net";
import { Server as SocketIOServer } from "socket.io";

interface SocketServer extends NetServer {
    io?: SocketIOServer | undefined;
}

interface SocketWithIO extends NetSocket {
    server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
    socket: SocketWithIO;
}

// need to use redis/db in near future for scalability
const roomData = new Map<string, {
    text: string[];
    users: Set<string>;
    isStarted: boolean;
    startTime?: number;
    countdown?: {
        endsAt: number;
        duration: number;
        initiator: string;
        interval?: NodeJS.Timeout;
    }
}>();

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

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
    if (res.socket.server.io) {
        console.log("Socket.io already initialized");
        res.end();
        return;
    }

    console.log("Initializing new Socket.io server...");
  
    const io = new SocketIOServer(res.socket.server, {
        path: "/api/socketio",
        addTrailingSlash: false,
        cors: {
            origin: process.env.NODE_ENV === "production" ? false : "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);

        socket.on("join_race", (roomId: string) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room: ${roomId}`);

            if (!roomData.has(roomId)) {
                roomData.set(roomId, {
                    text: generateRaceText(),
                    users: new Set(),
                    isStarted: false
                });
            }

            const room = roomData.get(roomId)!;
            
            const existingUsers = Array.from(room.users);
            room.users.add(socket.id);

            socket.emit("room_joined", {
                roomId,
                text: room.text,
                userCount: room.users.size,
                isStarted: room.isStarted,
                existingUsers: existingUsers
            });

            existingUsers.forEach(userId => {
                socket.emit("user_joined", {
                    message: "Existing user in room",
                    playerId: userId,
                    userCount: room.users.size
                });
            });

            socket.to(roomId).emit("user_joined", { 
                message: "A new user has joined the race!",
                playerId: socket.id,
                userCount: room.users.size
            });
        });

        socket.on("progress_update", ({ roomId, progress }: { roomId: string; progress: number }) => {
            socket.to(roomId).emit("progress_broadcast", {
                playerId: socket.id,
                progress
            });
        });

        socket.on("race_finished", ({ roomId, wpm, accuracy, errors, finishTime }: { 
            roomId: string; 
            wpm: number; 
            accuracy: number; 
            errors: number; 
            finishTime: number; // still accepted for backward compat, but recomputed if possible
        }) => {
            const room = roomData.get(roomId);
            let authoritativeFinishTime = finishTime;
            if (room?.startTime) {
                authoritativeFinishTime = Date.now() - room.startTime;
            }
            socket.to(roomId).emit("race_completed", {
                playerId: socket.id,
                wpm,
                accuracy,
                errors,
                finishTime: authoritativeFinishTime
            });
        });

        socket.on("start_race", (roomId: string) => {
            const room = roomData.get(roomId);
            if (room) {
                room.isStarted = true;
                room.startTime = Date.now();
                io.to(roomId).emit("race_started", {
                    message: "Race has started!",
                    text: room.text,
                    startTime: room.startTime
                });
            }
        });

        socket.on("initiate_countdown", ({ roomId, duration }: { roomId: string; duration: number }) => {
            const room = roomData.get(roomId);
            if (!room) return;
            if (room.isStarted || room.countdown) {
                socket.emit("countdown_rejected", { reason: "Race already started or countdown active" });
                return;
            }
            if (room.users.size < 2) {
                socket.emit("countdown_rejected", { reason: "Need at least 2 players" });
                return;
            }

            const now = Date.now();
            const endsAt = now + duration * 1000;
            room.countdown = { endsAt, duration, initiator: socket.id };

            io.to(roomId).emit("countdown_started", { duration, initiator: socket.id, endsAt });

            room.countdown.interval = setInterval(() => {
                const remainingMs = endsAt - Date.now();
                const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
                if (remainingSeconds > 0) {
                    io.to(roomId).emit("countdown_tick", { remaining: remainingSeconds });
                } else {
                    if (room.countdown?.interval) clearInterval(room.countdown.interval);
                    delete room.countdown;
                    room.isStarted = true;
                    room.startTime = Date.now();
                    io.to(roomId).emit("race_started", {
                        message: "Race has started!",
                        text: room.text,
                        startTime: room.startTime
                    });
                }
            }, 1000);
        });

        socket.on("cancel_countdown", ({ roomId }: { roomId: string }) => {
            const room = roomData.get(roomId);
            if (!room || !room.countdown) return;
            if (room.countdown.initiator !== socket.id) return;
            if (room.countdown.interval) clearInterval(room.countdown.interval);
            delete room.countdown;
            io.to(roomId).emit("countdown_cancelled", { by: socket.id });
        });

        socket.on("reset_race", (roomId: string) => {
            const room = roomData.get(roomId);
            if (!room) return;
            if (room.countdown?.interval) clearInterval(room.countdown.interval);
            if (room.countdown) delete room.countdown;
            room.isStarted = false;
            room.startTime = undefined;
            room.text = generateRaceText();
            io.to(roomId).emit("race_reset", { roomId, text: room.text });
        });

        socket.on("leave_race", (roomId: string) => {
            socket.leave(roomId);
            console.log(`User ${socket.id} left room: ${roomId}`);
            
            const room = roomData.get(roomId);
            if (room) {
                room.users.delete(socket.id);

                if (room.countdown && room.countdown.initiator === socket.id) {
                    if (room.countdown.interval) clearInterval(room.countdown.interval);
                    delete room.countdown;
                    io.to(roomId).emit("countdown_cancelled", { by: socket.id });
                }
                
                if (room.users.size === 0) {
                    roomData.delete(roomId);
                } else {
                    socket.to(roomId).emit("user_left", {
                        message: "A user has left the race",
                        playerId: socket.id,
                        userCount: room.users.size
                    });
                }
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
            
            for (const [roomId, room] of roomData.entries()) {
                if (room.users.has(socket.id)) {
                    room.users.delete(socket.id);
                    if (room.countdown && room.countdown.initiator === socket.id) {
                        if (room.countdown.interval) clearInterval(room.countdown.interval);
                        delete room.countdown;
                        socket.to(roomId).emit("countdown_cancelled", { by: socket.id });
                    }
                    
                    socket.to(roomId).emit("user_left", {
                        message: "A user has disconnected",
                        playerId: socket.id,
                        userCount: room.users.size
                    });
                    
                    if (room.users.size === 0) {
                        roomData.delete(roomId);
                    }
                }
            }
        });
    });

    res.socket.server.io = io;
    res.end();
}