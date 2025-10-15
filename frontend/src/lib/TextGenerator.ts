const WORDS = [
    "quick", "brown", "fox", "jumps", "over", "lazy", "dog", "pack", "my", "box",
    "with", "five", "dozen", "liquor", "jugs", "how", "vexingly", "daft", "zebras", "jump",
    "animals", "are", "great", "companions", "for", "humans", "and", "bring", "joy", "to",
    "life", "coding", "is", "fun", "and", "challenging", "practice", "makes", "perfect",
    "never", "give", "up", "on", "your", "dreams", "believe", "in", "yourself", "always",
    "stay", "positive", "and", "work", "hard", "to", "achieve", "goals"
]

export function generateRandomText(wordCount: number = 50): string[] {
    const words: string[] = [];
    for(let i = 0; i < wordCount; i++) {
        const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
        words.push(randomWord);
    }

    return words;
}

export function generateMoreWords(currentWords: string[], additionalCount: number = 50): string[] {
    const newWords: string[] = [];
    for(let i = 0; i < additionalCount; i++) {
        const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
        newWords.push(randomWord);
    }
    return [...currentWords, ...newWords];
}