export interface Opponent {
    playerId: string;
    progress: number;
    wpm?: number;
    accuracy?: number;
    username?: string;
}

export interface RaceStats {
    wpm: number;
    accuracy: number;
    errors: number;
    typingData: Array<{ 
        second: number; 
        wpm: number; 
        errors: number; 
    }>;
}

export interface RaceProgressData {
    playerId: string;
    progress: number;
    username?: string;
}

export interface UserEventData {
    message: string;
    playerId: string;
    username?: string;
}

export interface RaceCompletedData {
    playerId: string;
    wpm: number;
    accuracy: number;
    errors: number;
    finishTime: number;
}

export interface LeaderboardEntry {
    playerId: string;
    wpm: number;
    accuracy: number;
    errors: number;
    finishTime: number;
    position: number;
    username?: string;
}

export interface LeaderboardUpdateData {
    leaderboard: LeaderboardEntry[];
}

export interface RaceSocketCallbacks {
    onProgressUpdate?: (data: RaceProgressData) => void;
    onUserJoined?: (data: UserEventData & { userCount: number }) => void;
    onUserLeft?: (data: UserEventData & { userCount: number }) => void;
    onRaceCompleted?: (data: RaceCompletedData) => void;
    onLeaderboardUpdate?: (data: LeaderboardUpdateData) => void;
    onRoomJoined?: (data: { roomId: string; text: string[]; userCount: number; isStarted: boolean; existingUsers?: string[] }) => void;
    onRaceStarted?: (data: { message: string; text: string[]; startTime: number }) => void;
    onCountdownStarted?: (data: { duration: number; initiator: string; endsAt: number }) => void;
    onCountdownTick?: (data: { remaining: number }) => void;
    onCountdownCancelled?: (data: { by: string }) => void;
    onRaceReset?: (data: { roomId: string; text: string[] }) => void;
    onCountdownRejected?: (data: { reason: string }) => void;
    onRematchRequested?: (data: { requesterId: string; requesterName: string }) => void;
    onRematchAccepted?: (data: { accepterId: string; accepterName: string }) => void;
    onRematchDeclined?: (data: { declinerId: string; declinerName: string }) => void;
    onJoinError?: (data: { roomId: string; message: string }) => void;
}

export interface CountdownState {
    remaining: number | null;
    initiator: string | null;
    isActive: boolean;
}