export const DISPLAY_WORD_COUNT = 30;

export const getChunkInterval = (duration: number): number => {
    if (duration <= 15) return 1;
    if (duration <= 30) return 3;
    if (duration <= 60) return 5;
    return 10;
};