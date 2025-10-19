"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Lesson } from "@/app/learn/data/lessons";
import { learnAPI, isAuthenticated, LessonProgress } from "@/lib/api";

interface LessonOverviewProps {
    lessons: Lesson[];
    mode: string;
}

export default function LessonOverview({ lessons, mode }: LessonOverviewProps) {
    const [progressMap, setProgressMap] = useState<Map<string, LessonProgress>>(new Map());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgress = async () => {
            if (!isAuthenticated()) {
                setLoading(false);
                return;
            }

            try {
                const modeParam = mode === 'dev' ? 'DEV' : 'NORMAL';
                const response = await learnAPI.getUserProgress(modeParam);
                
                if (response.success && response.data) {
                    const map = new Map<string, LessonProgress>();
                    response.data.forEach(progress => {
                        map.set(progress.lessonId, progress);
                    });
                    setProgressMap(map);
                }
            } catch (error) {
                console.error('Failed to fetch progress:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, [mode]);

    const renderStars = (stars: number) => {
        return (
            <div className="flex text-amber-400">
                {[1, 2, 3].map(star => (
                    <svg
                        key={star}
                        xmlns="http://www.w3.org/2000/svg"
                        className={`sm:h-10 sm:w-10 h-5 w-5 ${star > stars ? 'text-gray-300 dark:text-gray-600' : ''}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="space-y-4">
                {lessons.map((_, index) => (
                    <div key={index} className="bg-gray-100 dark:bg-gray-800/50 p-5 rounded-lg animate-pulse">
                        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {lessons.map((lesson, index) => {
                const progress = progressMap.get(lesson.id);
                const hasProgress = progress !== undefined;
                const stars = progress?.star || 0;
                const wpm = progress?.wpm || 0;
                const accuracy = progress?.accuracy || 0;

                return (
                    <Link
                        key={lesson.id}
                        href={`/learn/${mode}/${lesson.id}`}
                        className={`block bg-gray-100 dark:bg-gray-800/50 p-5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${!hasProgress ? 'opacity-70 hover:opacity-100' : ''}`}
                    >
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                            <div className="flex-1">
                                <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                                    {index + 1}. {lesson.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    {lesson.description}
                                </p>
                                <div className="mt-2 flex gap-1.5 flex-wrap">
                                    {lesson.focusKeys.slice(0, 10).map((key) => (
                                        <span
                                            key={key}
                                            className="font-mono text-xs font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded"
                                        >
                                            {key}
                                        </span>
                                    ))}
                                    {lesson.focusKeys.length > 10 && (
                                        <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                                            +{lesson.focusKeys.length - 10} more
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="mt-4 sm:mt-0 flex-shrink-0">
                                {hasProgress ? (
                                    <div className="flex items-center sm:justify-end gap-4 text-right">
                                        {renderStars(stars)}
                                        <div className="flex sm:flex-col items-center sm:gap-0 gap-6">
                                            <div className="font-bold sm:text-2xl">
                                                {wpm.toFixed(0)} <span className="sm:text-base">WPM</span>
                                            </div>
                                            <div className="text-xs sm:text-base text-gray-400 font-bold">
                                                {accuracy.toFixed(0)}% Acc
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-gray-400 dark:text-gray-500 font-semibold">
                                        Start Lesson →
                                    </div>
                                )}
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}