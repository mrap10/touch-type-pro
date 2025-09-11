const WORDS = [
    "quick", "brown", "fox", "jumps", "over", "lazy", "dog", "pack", "my", "box",
    "with", "five", "dozen", "liquor", "jugs", "how", "vexingly", "daft", "zebras", "jump",
    "animals", "are", "great", "companions", "for", "humans", "and", "bring", "joy", "to",
    "life", "coding", "is", "fun", "and", "challenging", "practice", "makes", "perfect",
    "never", "give", "up", "on", "your", "dreams", "believe", "in", "yourself", "always",
    "stay", "positive", "and", "work", "hard", "to", "achieve", "goals"
]

export function generateRandomText(wordCount: number = 30): string[] {
    const words: string[] = [];
    for(let i = 0; i < wordCount; i++) {
        const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
        words.push(randomWord);
    }

    return words;
}