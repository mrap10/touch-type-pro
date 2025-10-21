"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LearnTypingArea from "@/components/LearnTypingArea";
import LessonResultCard from "@/components/LessonResultCard";
import { learnAPI, isAuthenticated } from "@/lib/api";
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
            alert("Please sign in to save your progress!\n\n(Sign-in component will be implemented)");
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

            setSavedMessage("Progress saved successfully! ✅");
            setTimeout(() => setSavedMessage(""), 3000);
        } catch (error: any) {
            console.error('Failed to save progress:', error);
            if (error.message.includes('401') || error.message.includes('authenticated')) {
                alert("Please sign in to save your progress!\n\n(Sign-in component will be implemented)");
            } else {
                alert("Failed to save progress. Please try again.");
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
                />
            )}

            {testResults && (
                <LessonResultCard
                    wpm={testResults.wpm}
                    accuracy={testResults.accuracy}
                    errors={testResults.errors}
                    stars={calculateStars(testResults.accuracy, testResults.wpm)}
                    isSaving={isSaving}
                    savedMessage={savedMessage}
                    onSaveProgress={handleSaveProgress}
                    onRestart={handleRestart}
                    onBackToLessons={() => router.push(`/learn/${mode}`)}
                />
            )}
        </div>
    );
}