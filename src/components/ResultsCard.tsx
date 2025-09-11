"use client";

interface ResultsCardProps {
    wpm: number;
    accuracy: number;
    errors: number;
    onRestart: () => void;
}

export default function ResultsCard({ wpm, accuracy, errors, onRestart }: ResultsCardProps) {
    return (
        <div className="m-6 p-6 border rounded-lg shadow-md text-center max-w-m">
            <h2 className="text-xl font-bold">Results</h2>
            <p className="mt-2">Your typing speed: {wpm} WPM</p>
            <p className="mt-2">Accuracy: {accuracy}%</p>
            <p className="mt-2">Errors: {errors}</p>
            <button onClick={onRestart} className="mt-4 p-2 bg-blue-500 text-white rounded">
                Restart
            </button>
        </div>
    );
}
