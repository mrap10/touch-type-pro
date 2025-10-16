export type Difficulty = 'easy' | 'medium' | 'hard';

const EASY_WORDS = [
    "the", "be", "to", "of", " and", "in", "that", "have", "it", "for", "not", "on", "with", "he", 
    "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", 
    "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up", "out", 
    "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", 
    "just", "him", "know", "take", "people", "into", "year", "your", "good", "some", "could", "them", 
    "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also", 
    "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", 
    "want", "because", "any", "these", "give", "day", "most", "us", "play", "run", "cat", "dog",
    "sun", "red", "blue", "ask", "hand", "life", "feel", "try", "part", "get", "form", "big", "old",
    "has", "see", "let", "man", "end", "same", "tell", "boy", "air", "put", "set", "why", "new", "word",
    "for", "car", "sit", "top", "box", "far", "yet", "was", "ran", "sad", "yet", "key", "map", "fly",
    "sky", "few", "may", "dry", "law", "jam", "zap", "vex", "quit", "jump", "back"
]

const MEDIUM_WORDS = [
    "people", "because", "another", "between", "example", "question", "through", "program", "language", 
    "practice", "keyboard", "however", "without", "government", "important", "computer", "challenge", "sentence",
    "always", "should", "believe", "answer", "experience", "beautiful", "journey", "development", "continue", 
    "thought", "system", "number", "different", "information", "something", "about", "great", "quality", 
    "writing", "their", "there", "application", "every", "nothing", "building", "become", "important", 
    "project", "another", "knowledge", "analysis", "measure", "process", "strategy", "quickly", "quality", 
    "manage", "through", "development", "function", "special", "machine", "perfect", "yourself", "another", 
    "chapter", "before", "again", "between", "character", "country", "develop", "without", "system", "special", 
    "powerful", "against", "problem", "remember", "consider", "interest", "program", "journey", "become", 
    "example", "language", "question", "together", "community", "education", "learning", "business"
]

const HARD_WORDS = [
    "abnegation", "acquiesce", "anachronistic", "archetypal", "bourgeoisie", "cacophony", "colloquially", 
    "conscientious", "disenfranchise", "ecclesiastical", "egregious", "ephemeral", "epistemology", "equivocate",
    "esoteric", "euphemism", "exacerbate", "existential", "facetious", "fiduciary", "gregarious", "harangue", 
    "iconoclast", "idiosyncratic", "ineffable", "innocuous", "intransigent", "juxtaposition", "labyrinthine", 
    "magnanimous", "malfeasance", "mnemonic", "obfuscate", "onomatopoeia", "ostentatious", "paraphernalia", 
    "pejorative", "phenomenon", "philanthropic", "picturesque", "plethora", "prescient", "profligate", "pseudonym",
    "psychoanalysis", "quintessential", "reciprocate", "rhetoric", "scintillating", "superfluous", "sycophant", 
    "syzygy", "ubiquitous", "unctuous", "vehement", "vicissitude", "vitriolic", "vociferous", "zealous", 
    "xenophobia", "zeitgeist", "antidisestablishmentarianism", "chrysanthemum", "accommodation", "acknowledgement",
    "bureaucracy", "classification", "conglomeration", "correspondence", "disproportionate", "embezzlement",
    "encyclopedia", "entrepreneur", "equilibrium", "miscellaneous", "mischievous", "parallel", "phlegm", 
    "psoriasis", "queue", "rhythm", "subconscious", "susceptible", "yacht"
]

const WORDS_PER_DIFFICULTY: Record<Difficulty, number> = {
    easy: 60,
    medium: 35,
    hard: 20
};

export function generateRandomText(wordCount?: number, difficulty: Difficulty = 'easy'): string[] {
    const words: string[] = [];
    const wordList = difficulty === 'easy' ? EASY_WORDS : difficulty === 'medium' ? MEDIUM_WORDS : HARD_WORDS;
    const count = wordCount ?? WORDS_PER_DIFFICULTY[difficulty];
    
    for(let i = 0; i < count; i++) {
        const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
        words.push(randomWord);
    }

    return words;
}

export function generateMoreWords(currentWords: string[], additionalCount?: number, difficulty: Difficulty = 'easy'): string[] {
    const newWords: string[] = [];
    const wordList = difficulty === 'easy' ? EASY_WORDS : difficulty === 'medium' ? MEDIUM_WORDS : HARD_WORDS;
    const count = additionalCount ?? WORDS_PER_DIFFICULTY[difficulty];
    
    for(let i = 0; i < count; i++) {
        const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
        newWords.push(randomWord);
    }
    return [...currentWords, ...newWords];
}