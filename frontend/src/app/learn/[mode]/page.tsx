"use client";
import { useParams } from "next/navigation";
import { getLessonsByMode } from "../data/lessons";
import Navbar from "@/components/Navbar";
import LearnStatsCard from "@/components/LearnStatsCard";
import LessonOverview from "@/components/LessonOverview";
import Link from "next/link";

export default function LessonModePage() {
    const { mode } = useParams();
    const modeString = Array.isArray(mode) ? mode[0] : mode || 'normal';
    const isDev = modeString.indexOf("dev") !== -1;
    const lessons = getLessonsByMode(modeString);
    const modeType = isDev ? 'DEV' : 'NORMAL';

    return (
        <div>
            <Navbar />
            <main className="container mx-auto px-6 py-8 md:p-10">
                <div className="flex flex-row items-center justify-between sm:items-center gap-4 mb-8">
                    <h1 className="md:text-4xl text-2xl font-extrabold">
                        {isDev ? "<Dev />" : "Normal"} Mode
                    </h1>
                    {!isDev ? (
                        <Link
                            href="/learn/dev"
                            className="inline-block bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm font-bold py-2 px-4 rounded-lg transition-colors"
                        >
                            Go to &lt;Dev/&gt; Mode →
                        </Link>
                    ) : (
                        <Link
                            href="/learn/normal"
                            className="inline-block bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm font-bold py-2 px-4 rounded-lg transition-colors"
                        >
                            ← Go to Normal Mode
                        </Link>
                    )}
                </div>

                <LearnStatsCard mode={modeType as 'NORMAL' | 'DEV'} />

                <h2 className="text-2xl font-bold mb-6">Lesson Overview</h2>
                <LessonOverview lessons={lessons} mode={modeString} />
            </main>
        </div>
    );
}