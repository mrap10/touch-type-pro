"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Landing() {
    const [activeKeyIndex, setActiveKeyIndex] = useState(0);

    const keys = ["A", "S", "D", "F", "G", "H", "J", "K", "L", ";"];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveKeyIndex((prev) => (prev + 1) % keys.length);
        }, 500);

        return () => clearInterval(interval);
    }, [keys.length]);

    return (
        <div className="dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-[calc(100vh-4rem)] flex flex-col transition-colors duration-300">
            <main className="flex-grow flex flex-col items-center justify-center text-center px-4 relative">
                <div className="relative z-10">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
                        Master the Art of{" "}
                        <span className="bg-gradient-to-r from-emerald-500 to-green-400 bg-clip-text text-transparent">
                            Typing
                        </span>
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
                        Your playground to improve touch typing speed, challenge friends, and track your progress.
                    </p>

                    <div className="my-10 flex justify-center gap-1.5 p-3 bg-gray-200/50 dark:bg-gray-800/50 rounded-lg max-w-sm mx-auto backdrop-blur-sm">
                        {keys.map((key, index) => (
                            <div
                                key={key}
                                className={`w-10 h-10 flex items-center justify-center rounded font-mono transition-all duration-300 ${
                                activeKeyIndex === index
                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/50 ring-2 ring-emerald-400/30 scale-110"
                                    : "bg-white dark:bg-gray-700 text-gray-500"
                                }`}
                            >
                                {key}
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Link
                            href="/type"
                            className="w-full sm:w-auto bg-emerald-500 text-white font-bold py-3 px-8 rounded-lg flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/20"
                        >
                            Start Typing
                        </Link>
                        <Link
                            href="/race"
                            className="w-full sm:w-auto bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold py-3 px-8 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-300 hover:scale-105 shadow-lg shadow-gray-500/20 dark:hover:bg-gray-700 transition-colors"
                        >
                            Challenge a Friend
                        </Link>
                    </div>
                </div>
            </main>

            <footer className="container mx-auto px-6 py-4 text-center text-sm text-gray-400 dark:text-gray-500">
                <p>&copy; {new Date().getFullYear()} TouchTypePro. All Rights Reserved.</p>
            </footer>
        </div>
    )
}