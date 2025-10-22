import { notFound } from "next/navigation";
import { getLessonById, getLessonsByMode } from "../../data/lessons";
import Navbar from "@/components/Navbar";
import LessonClient from "@/components/LessonClient";
import Link from "next/link";

export default async function LessonPage({ params }: { params: Promise<{ mode: string; lessonId: string }> }) {
    const { mode, lessonId } = await params;

    const lesson = getLessonById(lessonId, mode);
    const lessons = getLessonsByMode(mode);

    if (!lesson) {
        notFound();
    }

    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="container mx-auto px-6 py-8 md:p-10">
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <Link
                            href={`/learn/${mode}`}
                            className="text-emerald-500 hover:text-emerald-600 flex items-center gap-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Back to Lessons
                        </Link>

                        <div className="relative inline-block group">
                            <button className="flex items-center gap-2 font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" /></svg>
                                See Lessons
                            </button>
                            <div className="hidden group-hover:block absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-10">
                                {lessons.map((lessonItem) => (
                                    <Link key={lessonItem.id} href={`/learn/${mode}/${lessonItem.id}`} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">{lessonItem.title}</Link>
                                ))}
                            </div>
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{lesson.title}</h1>
                    <p className="text-gray-600 dark:text-gray-400">{lesson.description}</p>
                    
                    {/* {lesson.focusKeys.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                                Focus Keys:
                            </h3>
                            <div className="flex gap-2 flex-wrap">
                                {lesson.focusKeys.map((key, index) => (
                                    <span
                                        key={`${key}-${index}`}
                                        className="font-mono text-sm font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded"
                                    >
                                        {key}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )} */}
                </div>

                <LessonClient lesson={lesson} mode={mode} />
            </main>
        </div>
    );
}
