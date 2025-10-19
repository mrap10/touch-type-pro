export type Lesson = {
    id: string;
    title: string;
    description: string;
    content: string;
    level: number;
}

export const normalLessons: Lesson[] = [
    {
        id: "lesson-1",
        title: "Home Row Basics",
        description: "Learn the basics of the home row keys.",
        content: "asdf jkl; asdf jkl; ...",
        level: 1
    },
    {
        id: "lesson-2",
        title: "Top Row Introduction",
        description: "Get familiar with the top row keys.",
        content: "qwer tyui qwer tyui ...",
        level: 2
    },
];

export const devLessons: Lesson[] = [
    {
        id: "dev-lesson-1",
        title: "Developer Home Row",
        description: "Master the home row keys used in coding.",
        content: "asdf jkl; {} [] () ...",
        level: 1
    },
    {
        id: "dev-lesson-2",
        title: "Developer Top Row",
        description: "Learn the top row keys essential for developers.",
        content: "qwer tyui <> <> // ...",
        level: 2
    }
];