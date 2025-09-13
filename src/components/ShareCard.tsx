"use client";

import { useRef } from "react";
import { toPng } from "html-to-image";
import { Download, X } from "lucide-react";
import Xlogo from "@/assets/xlogo.png";
import Image from "next/image";

interface ShareCardProps {
    isOpen: boolean;
    onClose: () => void;
    wpm: number;
    accuracy: number;
    errors: number;
    time: number;
}

export default function ShareCard({ isOpen, onClose, wpm, accuracy, errors, time }: ShareCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (cardRef.current) {
            const dataUrl = await toPng(cardRef.current);
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `typing-results-${Date.now()}.png`;
            link.click();
        }
    };

    if (!isOpen) return null;

    return (
        <div>
            <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 z-50 flex justify-center items-center p-4">
                <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg shadow-xl w-full max-w-md p-6 relative animate-fade-in-up">
                    <div>
                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                            <X className="w-6 h-6" />
                        </button>
                        <h2 className="text-2xl font-bold mb-4">Share your Results</h2>
                    </div>

                    <div ref={cardRef} className="p-5 dark:bg-gray-800">
                        <div className="flex items-center space-x-3">
                            <div className="rounded-full w-10 h-10 flex items-center justify-center bg-emerald-500 text-white">
                                <h1 className="font-bold">A</h1>
                            </div>
                            <div>
                                <p className="font-bold text-xl rounded-xl">mrtestdotcom</p>
                                <p className="text-gray-500">Just completed a typing test!</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center mt-8">
                            <h1 className="text-7xl font-bold text-emerald-500">{wpm}</h1>
                            <p className="text-xl font-semibold text-gray-500">words per minute</p>
                        </div>

                        <div className="flex justify-between items-center mt-8 px-3 space-x-4">
                            <div className="flex flex-col items-center">
                                <h1 className="text-3xl font-bold">{accuracy}%</h1>
                                <p className="font-semibold text-gray-500">Accuracy</p>
                            </div>
                            
                            <div className="flex flex-col items-center">
                                <h1 className="text-3xl font-bold">{time}s</h1>
                                <p className="text-xl font-semibold text-gray-500">Time</p>
                            </div>

                            <div className="flex flex-col items-center">
                                <h1 className="text-3xl font-bold">{errors}</h1>
                                <p className="text-xl font-semibold text-gray-500">Error strokes</p>
                            </div>
                        </div>

                        <div className="text-center border-t border-gray-200 dark:border-gray-600 pt-6 mt-6">
                            <p className="text-gray-600 dark:text-gray-400 italic">&ldquo;Every word counts — make them count fast&rdquo;</p>
                            <p className="text-sm text-indigo-400 font-semibold mt-4">touchtype.com</p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-between space-x-4">
                        <button className="flex items-center gap-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer">
                            <Image width={16} height={16} src={Xlogo.src} alt="X logo" className="rounded-md" />
                            Share on Twitter
                        </button>

                        <button
                            onClick={handleDownload}
                            className="flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors cursor-pointer"
                        >
                            <Download className="w-4 h-4" />
                            <span>Download Image</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}