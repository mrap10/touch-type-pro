export interface Opponent {
    playerId: string;
    progress: number;
    wpm?: number;
    accuracy?: number;
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
}

export interface UserEventData {
    message: string;
    playerId: string;
}

export interface RaceCompletedData {
    playerId: string;
    wpm: number;
    accuracy: number;
    errors: number;
    finishTime: number;
}

export interface RaceSocketCallbacks {
    onProgressUpdate?: (data: RaceProgressData) => void;
    onUserJoined?: (data: UserEventData & { userCount: number }) => void;
    onUserLeft?: (data: UserEventData & { userCount: number }) => void;
    onRaceCompleted?: (data: RaceCompletedData) => void;
    onRoomJoined?: (data: { roomId: string; text: string[]; userCount: number; isStarted: boolean; existingUsers?: string[] }) => void;
    onRaceStarted?: (data: { message: string; text: string[]; startTime: number }) => void;
}