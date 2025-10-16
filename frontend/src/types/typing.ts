import type { Difficulty } from "@/lib/TextGenerator";

export interface TypingData {
    second: number;
    wpm: number;
    errors: number;
}

export interface UseTypingTestParams {
    text: string[];
    isActive: boolean;
    isFinished?: boolean;
    duration: number;
    difficulty?: Difficulty;
    setIsRunning: (running: boolean) => void;
    onTextUpdate?: (newText: string[]) => void;
    onComplete: (stats: {
        wpm: number;
        accuracy: number;
        errors: number;
        typingData: TypingData[];
    }) => void;
    onProgress?: (progress: number, wpm: number, accuracy: number) => void;
}