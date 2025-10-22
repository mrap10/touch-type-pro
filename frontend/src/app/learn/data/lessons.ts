export type Lesson = {
    id: string;
    title: string;
    description: string;
    content: string;
    level: number;
    focusKeys: string[];
    category: string;
}

export const normalLessons: Lesson[] = [
    // === PHASE 1: HOME ROW MASTERY ===
    {
        id: "lesson-1",
        title: "Home Row Foundation",
        description: "Master the core position: ASDF JKL; - Your fingers' home base",
        content: "fff jjj fff jjj ddd kkk ddd kkk sss lll sss lll aaa ;;; aaa ;;; ffff jjjj dddd kkkk ssss llll aaaa ;;;; fj fj fj dk dk dk sl sl sl a; a; a; fjdk fjdk sl;a sl;a asdf jkl; asdf jkl; asdf jkl;",
        level: 1,
        focusKeys: ["A", "S", "D", "F", "J", "K", "L", ";"],
        category: "fundamentals"
    },
    {
        id: "lesson-2",
        title: "Home Row Words",
        description: "Form real words using only home row keys",
        content: "ad ads ask asks dad dads fad fads fall falls flask flasks had lass sad salad salads sad ads ask dad fall flask had lass salad asask fall flask salad add adds all",
        level: 1,
        focusKeys: ["A", "S", "D", "F", "J", "K", "L", ";"],
        category: "fundamentals"
    },

    // === PHASE 2: EXPANDING TO TOP ROW ===
    {
        id: "lesson-3",
        title: "Top Row - Index Fingers",
        description: "Reach up with your index fingers: R T Y U",
        content: "fff rrr fff rrr jjj yyy jjj yyy fff ttt fff ttt jjj uuu jjj uuu frf frf tft tft juj juj jyj jyj frfr tftf juju jyjy rut rut try try turf turf far far rat rat rut try turf far rat tar",
        level: 2,
        focusKeys: ["R", "T", "Y", "U"],
        category: "fundamentals"
    },
    {
        id: "lesson-4",
        title: "Top Row - All Fingers",
        description: "Complete the top row: QWER TYUI OP",
        content: "aaa qqq aaa qqq sss www sss www ddd eee ddd eee kkk iii kkk iii lll ooo lll ooo ;;; ppp ;;; ppp qwe qwe rty rty uio uio ppp quit quit were were type type your your wow wow pet pet tip tip pier pier quote quite",
        level: 2,
        focusKeys: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        category: "fundamentals"
    },
    {
        id: "lesson-5",
        title: "Top and Home Row Combo",
        description: "Combine everything you've learned so far",
        content: "the quick quilt was quite popular today at the fair are you ready to type faster write your first story do not stop water your plants play outside first the word their paper power request require",
        level: 3,
        focusKeys: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "J", "K", "L", ";"],
        category: "fundamentals"
    },

    // === PHASE 3: BOTTOM ROW ===
    {
        id: "lesson-6",
        title: "Bottom Row - Gentle Start",
        description: "Extend downward: ZXCV BNM",
        content: "aaa zzz aaa zzz sss xxx sss xxx ddd ccc ddd ccc fff vvv fff vvv jjj nnn jjj nnn kkk mmm kkk mmm aza aza sxs sxs dcd dcd fvf fvf jnj jnj kmk kmk zap zap fix fix can can van van jam jam man man mix mix cab cab zone buzz",
        level: 3,
        focusKeys: ["Z", "X", "C", "V", "B", "N", "M"],
        category: "fundamentals"
    },
    {
        id: "lesson-7",
        title: "Full Alphabet Practice",
        description: "Use all letter keys together",
        content: "the quick brown fox jumps over lazy dogs pack my box with five dozen liquor jugs amazingly few discotheques provide jukeboxes every complex job requires mixing dozen liquid oxygen",
        level: 4,
        focusKeys: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
        category: "fundamentals"
    },

    // === PHASE 4: COMMON WORDS & PATTERNS ===
    {
        id: "lesson-8",
        title: "Common Words & Bigrams",
        description: "Practice the most frequently used words and letter combinations",
        content: "the and for are but not you all can her was one our out day get has him his how man new now old see two way who boy did its let put say she too use that with have this will your from they been",
        level: 4,
        focusKeys: [],
        category: "advanced"
    },

    // === PHASE 5: NUMBERS & PUNCTUATION ===
    {
        id: "lesson-9",
        title: "Numbers Row",
        description: "Master the number keys 1-0",
        content: "111 222 333 444 555 666 777 888 999 000 123 456 789 012 345 678 901 234 567 890 1234567890 10 20 30 40 50 60 70 80 90 100 2024 365 24 7 911 411 2025",
        level: 5,
        focusKeys: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
        category: "advanced"
    },
    {
        id: "lesson-10",
        title: "Punctuation & Sentences",
        description: "Complete your typing with punctuation and real sentences",
        content: "Hello, how are you? I'm doing great! Let's practice typing. Don't worry; you'll improve quickly. Ready? Let's go! What's your name? My name is Alex. Nice to meet you! Today is a good day. Tomorrow will be better. \"Practice makes perfect,\" they say. I agree 100%. You can do it!",
        level: 5,
        focusKeys: [".", ",", "?", "!", "'", "\"", "-"],
        category: "advanced"
    }
];

export const devLessons: Lesson[] = [
    // === PHASE 1: BASIC SYNTAX FOUNDATION ===
    {
        id: "dev-lesson-1",
        title: "Developer Home Row + Semicolons",
        description: "Home row with the essential semicolon",
        content: "asdf jkl; asdf; jkl; fdsa ;lkj fdsa; ;lkj; let a; let s; let d; let f; let j; let k; let l; data; false; class; flask; kafka; salad; dallas;",
        level: 1,
        focusKeys: ["A", "S", "D", "F", "J", "K", "L", ";"],
        category: "syntax"
    },

    // === PHASE 2: BRACKETS & STRUCTURE ===
    {
        id: "dev-lesson-2",
        title: "Brackets & Braces Mastery",
        description: "Master the most common code delimiters",
        content: "() {} [] <> () {} [] <> [] [] {} {} () () <> <> [item] {key} (arg) <Type> [1, 2] {a: b} (x, y) [[]] {{}} (()) array[0] obj[key] func() list[i]",
        level: 2,
        focusKeys: ["{", "}", "[", "]", "(", ")", "<", ">"],
        category: "syntax"
    },
    {
        id: "dev-lesson-3",
        title: "Basic Declarations",
        description: "Practice variable and function declarations",
        content: "const const let let var var function function const x const data let count let value var i var j function test function getData const myVar let isValid const userName let totalCount",
        level: 2,
        focusKeys: [],
        category: "syntax"
    },

    // === PHASE 3: OPERATORS ===
    {
        id: "dev-lesson-4",
        title: "Basic Operators",
        description: "Essential mathematical and assignment operators",
        content: "= + - * / = + - * / x = 5 y = 10 z = x + y sum = a + b diff = a - b prod = a * b quot = a / b += -= *= /= x += 1 y -= 2 count += 1 total -= value",
        level: 3,
        focusKeys: ["=", "+", "-", "*", "/"],
        category: "operators"
    },
    {
        id: "dev-lesson-5",
        title: "Comparison & Logic Operators",
        description: "Boolean operations and comparisons",
        content: "=== !== == != > < >= <= && || ! === !== >= <= && || a === b x !== y count > 0 value < max i >= 0 j <= len isValid && isReady hasData || hasCache !isEmpty a == b x != y",
        level: 3,
        focusKeys: ["=", "!", ">", "<", "&", "|"],
        category: "operators"
    },

    // === PHASE 4: SPECIAL CHARACTERS ===
    {
        id: "dev-lesson-6",
        title: "Dots, Underscores & Quotes",
        description: "Practice special characters used in code",
        content: "___ ... '' \"\" `` : , . _ user_name first_name is_valid get_data console.log array.map object.key person.name string.length 'hello' \"world\" `template` key: value a, b, c obj.prop",
        level: 4,
        focusKeys: ["_", ".", ",", ":", "'", "\"", "`"],
        category: "syntax"
    },

    // === PHASE 5: COMMON PATTERNS ===
    {
        id: "dev-lesson-7",
        title: "Arrow Functions",
        description: "Master arrow function syntax",
        content: "=> => => const fn = () => {} const map = (x) => x * 2 const filter = (item) => item.valid const getData = async () => {} (a, b) => a + b x => x + 1 () => true array.map(x => x * 2)",
        level: 4,
        focusKeys: ["=", ">"],
        category: "patterns"
    },
    {
        id: "dev-lesson-8",
        title: "Array Methods",
        description: "Common array manipulation patterns",
        content: ".map() .filter() .reduce() .forEach() .find() .some() .every() array.map(item => item.id) list.filter(x => x > 0) data.forEach(item => console.log(item)) nums.reduce((a, b) => a + b) items.find(x => x.name)",
        level: 5,
        focusKeys: [],
        category: "patterns"
    },

    // === PHASE 6: REAL CODE ===
    {
        id: "dev-lesson-9",
        title: "Import & Export Statements",
        description: "Module import/export syntax",
        content: "import React from 'react' import { useState } from 'react' export const data export default App import * as utils from './utils' import type { User } from './types' export { getData, setData }",
        level: 5,
        focusKeys: [],
        category: "patterns"
    },
    {
        id: "dev-lesson-10",
        title: "Complete Code Snippets",
        description: "Practice typing real code blocks",
        content: "const handleClick = () => { setState(prev => !prev); }; if (condition) { return true; } else { return false; } const fetchData = async () => { const res = await fetch(url); return res.json(); }; const user = { name: 'John', age: 30, active: true };",
        level: 6,
        focusKeys: [],
        category: "patterns"
    }
];

export const getLessonsByMode = (mode: string): Lesson[] => {
    return mode === 'dev' ? devLessons : normalLessons;
};

export const getLessonById = (lessonId: string, mode: string): Lesson | undefined => {
    const lessons = getLessonsByMode(mode);
    return lessons.find(lesson => lesson.id === lessonId);
};