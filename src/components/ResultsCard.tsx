"use client";

import { RotateCcw } from "lucide-react";

interface ResultsCardProps {
    wpm: number;
    accuracy: number;
    errors: number;
    onRestart: () => void;
}

export default function ResultsCard({ wpm, accuracy, errors, onRestart }: ResultsCardProps) {
    return (
        <div className="flex flex-col items-center justify-center p-6 w-full ">
            <div className="m-6 p-6 grid grid-cols-4 gap-4 w-full text-center">
                <div>
                    <h1 className="text-4xl text-gray-500">{wpm}</h1>
                    <p className="text-3xl text-gray-800">wpm</p>
                </div>

                <div>
                    <h1 className="text-4xl text-gray-500">{accuracy}%</h1>
                    <p className="text-3xl text-gray-800">accuracy</p>
                </div>
                <div>
                    <h1 className="text-4xl text-gray-500">{errors}</h1>
                    <p className="text-3xl text-gray-800">error chars</p>
                </div>
                <div>
                    <h1 className="text-4xl text-gray-500">15s</h1>
                    <p className="text-3xl text-gray-800">time</p>
                </div>
            </div>
            <div>
                
            </div>
            <button 
                onClick={onRestart}
                className="mt-8 p-3 bg-emerald-200 hover:bg-emerald-300 cursor-pointer text-black rounded-full transition-colors duration-200 flex items-center justify-center"
            >
                <RotateCcw size={20} />
            </button>
        </div>
    );
}
