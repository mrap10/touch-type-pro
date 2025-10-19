import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Learn() {
    return (
        <div>
            <Navbar />
            <main className="flex-grow flex flex-col items-center justify-center text-center min-h-[calc(100vh-120px)] mt-5 md:mt-0 px-4">
                <div className="max-w-4xl w-full">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Choose Your Path</h1>
                    <p className="mt-3 max-w-xl mx-auto text-lg text-gray-500 dark:text-gray-400">
                        Select a learning mode to begin your journey to becoming a typing master.
                    </p>

                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Link href="/learn/normal" className="block p-8 bg-gray-100 dark:bg-gray-800/50 rounded-2xl text-left hover:transition hover:transform hover:scale-105 ease-in-out">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Normal Mode</h2>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Master the fundamentals of touch typing. Progress through lessons covering the entire keyboard, from the home row to complex symbols.
                            </p>
                            <div className="mt-6 font-semibold text-emerald-500 flex items-center gap-2">
                                Start Learning
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </Link>

                        <Link href="/learn/dev" className="block p-8 bg-gray-100 dark:bg-gray-800/50 rounded-2xl text-left hover:transition hover:transform hover:scale-105 ease-in-out">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Developer Mode</h2>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Hone your typing skills for programming. Practice with code snippets, special characters, and common syntax patterns.
                            </p>
                            <div className="mt-6 font-semibold text-emerald-500 flex items-center gap-2">
                                Start Coding Keys
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                                </svg>
                            </div>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}