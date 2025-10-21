interface LessonResultCardProps {
    wpm: number;
    accuracy: number;
    errors: number;
    stars: number;
    isSaving: boolean;
    savedMessage: string;
    onSaveProgress: () => void;
    onRestart: () => void;
    onBackToLessons: () => void;
}

export default function LessonResultCard({
    wpm,
    accuracy,
    errors,
    stars,
    isSaving,
    savedMessage,
    onSaveProgress,
    onRestart,
    onBackToLessons,
}: LessonResultCardProps) {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-20">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center max-w-md w-full">
                <h2 className="text-3xl font-extrabold text-emerald-500">Lesson Complete!</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Well done! Here are your results.
                </p>
                
                <div className="my-8 flex justify-around items-end">
                    <div>
                        <div className="text-5xl font-bold text-gray-900 dark:text-white">{wpm}</div>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">WPM</div>
                    </div>
                    <div>
                        <div className="text-5xl font-bold text-gray-900 dark:text-white">
                            {accuracy.toFixed(0)}<span className="text-2xl">%</span>
                        </div>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Accuracy</div>
                    </div>
                </div>

                <div className="flex justify-center gap-1 mb-8">
                    {[1, 2, 3].map((star) => (
                        <svg
                            key={star}
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-10 w-10 ${
                                star <= stars
                                    ? 'text-amber-400'
                                    : 'text-gray-300 dark:text-gray-600'
                            }`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                </div>

                {savedMessage && (
                    <div className="mb-4 text-emerald-600 dark:text-emerald-400 font-semibold">
                        {savedMessage}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={onRestart}
                        className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 cursor-pointer font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                        Retry Lesson
                    </button>
                    <button
                        onClick={onSaveProgress}
                        disabled={isSaving}
                        className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 text-gray-800 dark:text-gray-200 cursor-pointer font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                        {isSaving ? 'Saving...' : 'Save Progress'}
                    </button>
                    <button
                        onClick={onBackToLessons}
                        className="col-span-2 bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                        Back to Lessons →
                    </button>
                </div>
            </div>
        </div>
    );
}

// TODO: feedback model
// auth logic & swap "save" with "next"