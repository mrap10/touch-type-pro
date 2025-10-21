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
    {
        id: "lesson-1",
        title: "Home Row Basics",
        description: "Get comfortable with the foundation of typing: ASDF JKL;",
        content: "aaaa ssss dddd ffff jjjj kkkk llll ;;;; aass aass aass ssdd ssdd ddff ffgg ghgh hjhj gjgj jkjk klkl kkll llkj asdf jkl; asdf jkl; ask djf l;ajsd f;lkaj sd;flk ajsd; flkaj sd;fl kajsd f;",
        level: 1,
        focusKeys: ["A", "S", "D", "F", "J", "K", "L", ";"],
        category: "fundamentals"
    },
    {
        id: "lesson-2",
        title: "Top Row Introduction",
        description: "Extend your reach to the top row keys: QWERTY UIOP",
        content: "qwer tyui qwer tyui qqq www eee rrr ttt yyy uuu iii ooo ppp qwerty uiop",
        level: 2,
        focusKeys: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        category: "fundamentals"
    },
    {
        id: "lesson-3",
        title: "Bottom Row Practice",
        description: "Master the bottom row: ZXCV BNM",
        content: "zxcv bnm zxcv bnm zzz xxx ccc vvv bbb nnn mmm zxcvbnm",
        level: 3,
        focusKeys: ["Z", "X", "C", "V", "B", "N", "M"],
        category: "fundamentals"
    },
    {
        id: "lesson-4",
        title: "Numbers Row",
        description: "Practice typing numbers and common symbols",
        content: "1234567890 !@#$%^&*() 1234567890",
        level: 4,
        focusKeys: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
        category: "advanced"
    },
];

export const devLessons: Lesson[] = [
    {
        id: "dev-lesson-1",
        title: "Developer Home Row",
        description: "Master the home row keys used in coding with special characters",
        content: "asdf jkl; {} [] () <> asdf jkl; const let var function",
        level: 1,
        focusKeys: ["A", "S", "D", "F", "J", "K", "L", ";", "{", "}", "[", "]"],
        category: "syntax"
    },
    {
        id: "dev-lesson-2",
        title: "Brackets & Braces",
        description: "Practice common programming brackets and braces",
        content: "{} [] () <> {} [] () <> const arr = [1, 2, 3]; const obj = {key: value};",
        level: 2,
        focusKeys: ["{", "}", "[", "]", "(", ")", "<", ">"],
        category: "syntax"
    },
    {
        id: "dev-lesson-3",
        title: "Operators Practice",
        description: "Learn common operators used in programming",
        content: "=== !== >= <= && || ++ -- += -= *= /= == != > < & | + - * /",
        level: 3,
        focusKeys: ["=", "!", ">", "<", "&", "|", "+", "-", "*", "/"],
        category: "operators"
    },
    {
        id: "dev-lesson-4",
        title: "Code Snippets",
        description: "Practice typing real code patterns",
        content: "const handleClick = () => {}; if (condition) { return true; } else { return false; }",
        level: 4,
        focusKeys: [],
        category: "patterns"
    },
];

export const getLessonsByMode = (mode: string): Lesson[] => {
    return mode === 'dev' ? devLessons : normalLessons;
};

export const getLessonById = (lessonId: string, mode: string): Lesson | undefined => {
    const lessons = getLessonsByMode(mode);
    return lessons.find(lesson => lesson.id === lessonId);
};