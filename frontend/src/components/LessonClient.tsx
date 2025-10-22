"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LearnTypingArea from "@/components/LearnTypingArea";
import LessonResultCard from "@/components/LessonResultCard";
import { learnAPI, isAuthenticated } from "@/lib/api";
import { getLessonsByMode } from "@/app/learn/data/lessons";
import type { TypingData } from "@/types/typing";

interface LessonClientProps {
    lesson: {
        id: string;
        title: string;
        description: string;
        content: string;
        focusKeys: string[];
    };
    mode: string;
}

export default function LessonClient({ lesson, mode }: LessonClientProps) {
    const router = useRouter();
    const [isTestActive, setIsTestActive] = useState(false);
    const [testResults, setTestResults] = useState<{
        wpm: number;
        accuracy: number;
        errors: number;
        typingData: TypingData[];
    } | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [savedMessage, setSavedMessage] = useState("");

    const handleTestComplete = (stats: { 
        wpm: number; 
        accuracy: number; 
        errors: number; 
        typingData: TypingData[] 
    }) => {
        setTestResults(stats);
        setIsTestActive(false);
    };

    const calculateStars = (accuracy: number, wpm: number): number => {
        if (accuracy < 85) return 0;
        if (accuracy >= 95 && wpm >= 40) return 3;
        if (accuracy >= 90 && wpm >= 30) return 2;
        return 1;
    };

    const handleSaveProgress = async () => {
        if (!isAuthenticated()) {
            router.push('/signin');
            return;
        }

        if (!testResults) {
            alert("Complete the lesson first to save progress!");
            return;
        }

        setIsSaving(true);
        setSavedMessage("");

        try {
            const stars = calculateStars(testResults.accuracy, testResults.wpm);
            const modeType = mode === 'dev' ? 'DEV' : 'NORMAL';

            await learnAPI.saveLessonProgress({
                lessonId: lesson.id,
                accuracy: testResults.accuracy,
                wpm: testResults.wpm,
                focusKeys: lesson.focusKeys,
                star: stars,
                mode: modeType as 'NORMAL' | 'DEV',
            });

            setSavedMessage("Progress saved successfully!");
            setTimeout(() => setSavedMessage(""), 3000);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to save progress. Please try again.";
            console.error('Failed to save progress:', error);
            if (errorMessage.includes('401') || errorMessage.includes('authenticated')) {
                router.push('/signin');
            } else {
                setSavedMessage(errorMessage);
                setTimeout(() => setSavedMessage(""), 3000);
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleStartLesson = () => {
        setIsTestActive(true);
        setTestResults(null);
    };

    const handleRestart = () => {
        setTestResults(null);
        setIsTestActive(true);
    };

    const handleNextLesson = () => {
        const lessons = getLessonsByMode(mode);
        const currentIndex = lessons.findIndex(l => l.id === lesson.id);
        
        if (currentIndex !== -1 && currentIndex < lessons.length - 1) {
            const nextLesson = lessons[currentIndex + 1];
            router.push(`/learn/${mode}/${nextLesson.id}`);
        } else {
            router.push(`/learn/${mode}`);
        }
    };

    return (
        <div className=" rounded-2xl p-8">
            {!isTestActive && !testResults && (
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold mb-4">Ready to start?</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Type the text below as accurately and quickly as you can.
                    </p>
                    <button
                        onClick={handleStartLesson}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer font-bold px-8 py-3 rounded-lg transition-colors"
                    >
                        Start Lesson
                    </button>
                </div>
            )}

            {isTestActive && (
                <LearnTypingArea
                    text={lesson.content}
                    onComplete={handleTestComplete}
                    isActive={isTestActive}
                    mode={mode}
                />
            )}

            {testResults && (
                <LessonResultCard
                    wpm={testResults.wpm}
                    accuracy={testResults.accuracy}
                    stars={calculateStars(testResults.accuracy, testResults.wpm)}
                    isSaving={isSaving}
                    savedMessage={savedMessage}
                    onSaveProgress={handleSaveProgress}
                    onRestart={handleRestart}
                    onNextLesson={handleNextLesson}
                />
            )}
        </div>
    );
}