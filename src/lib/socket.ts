import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initializeSocket = (): Socket => {
    if (!socket) {
        socket = io(process.env.NODE_ENV === "production" ? "" : "http://localhost:3000", {
            path: "/api/socketio",
        });

        socket.on("connect", () => {
            console.log("Connected to server:", socket?.id);
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from server");
        });

        socket.on("connect_error", (error) => {
            console.error("Connection error:", error);
        });
    }
    return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const joinRace = (roomId: string) => {
    if (socket) {
        socket.emit("join_race", roomId);
    }
};

export const leaveRace = (roomId: string) => {
    if (socket) {
        socket.emit("leave_race", roomId);
    }
};

export const updateProgress = (roomId: string, progress: number) => {
    if (socket) {
        socket.emit("progress_update", { roomId, progress });
    }
};

export const finishRace = (roomId: string, wpm: number, accuracy: number) => {
    if (socket) {
        socket.emit("race_finished", { roomId, wpm, accuracy });
    }
};

export const onUserJoined = (callback: (data: { message: string; playerId: string }) => void) => {
    if (socket) {
        socket.on("user_joined", callback);
    }
};

export const onUserLeft = (callback: (data: { message: string; playerId: string }) => void) => {
    if (socket) {
        socket.on("user_left", callback);
    }
};

export const onProgressBroadcast = (callback: (data: { playerId: string; progress: number }) => void) => {
    if (socket) {
        socket.on("progress_broadcast", callback);
    }
};

export const onRaceCompleted = (callback: (data: { playerId: string; wpm: number; accuracy: number }) => void) => {
    if (socket) {
        socket.on("race_completed", callback);
    }
};

export const removeAllListeners = () => {
    if (socket) {
        socket.removeAllListeners("user_joined");
        socket.removeAllListeners("user_left");
        socket.removeAllListeners("progress_broadcast");
        socket.removeAllListeners("race_completed");
    }
};