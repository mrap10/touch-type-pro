"use client";
import { useParams, useRouter } from "next/navigation";
import { devLessons, Lesson, normalLessons } from "../data/lessons";
import Navbar from "@/components/Navbar";
import LearnStatsCard from "@/components/LearnStatsCard";
import LessonOverview from "@/components/LessonOverview";
import Link from "next/link";

export default function LessonModePage() {
    const { mode } = useParams();
    const router = useRouter();
    const lessons = mode === "dev" ? devLessons : normalLessons;

    return (
        <div>
            <Navbar />
            {/* <div className="flex flex-col items-center justify-center p-5">
                <h1 className="text-center text-2xl font-bold">{mode?.indexOf("dev") !== -1 ? "<Dev />" : "Normal"} Touch Typing Lessons</h1>

                <div className="flex flex-col gap-6 mt-10">
                    {lessons.map((lesson: Lesson) => (
                        <div
                            key={lesson.id}
                            onClick={() => router.push(`/learn/${mode}/${lesson.id}`)}
                            className=""
                        >
                            <h2>{lesson.title}</h2>
                            <p>{lesson.description}</p>
                            <span>Level {lesson.level}</span>
                        </div>
                    ))}
                </div>
            </div> */}

            <main className="container mx-auto px-6 py-8 md:p-10">
                <div className="flex flex-row items-center justify-between sm:items-center gap-4 mb-8">
                    <h1 className="md:text-4xl text-2xl font-extrabold">Normal Mode</h1>
                    <Link href="/learn/dev" className="inline-block bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm font-bold py-2 px-4 rounded-lg transition-colors">
                        Go to &lt;Dev/&gt; Mode
                    </Link>
                </div>

                <LearnStatsCard />

                <h2 className="text-2xl font-bold mb-6">Lesson Overview</h2>
                <LessonOverview />
            </main>
        </div>
    )
}