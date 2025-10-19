import Link from "next/link";

export default function LessonOverview() {
    return (
        <div className="space-y-4">
            <Link href="#" className="block bg-gray-100 dark:bg-gray-800/50 p-5 rounded-lg ">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                    <div>
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white">1. Home Row Basics</h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Get comfortable with the foundation of typing: ASDF JKL;</p>
                        <div className="mt-2 flex gap-1.5">
                            <span className="font-mono text-xs font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded">A</span>
                            <span className="font-mono text-xs font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded">S</span>
                            <span className="font-mono text-xs font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded">D</span>
                            <span className="font-mono text-xs font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded">F</span>
                            <span className="font-mono text-xs font-bold bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">...</span>
                        </div>
                    </div>
                    <div className="mt-4 sm:mt-0 flex-shrink-0">
                        <div className="flex items-center sm:justify-end gap-4 text-right">
                            <div className="flex text-amber-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="sm:h-10 sm:w-10 h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                <svg xmlns="http://www.w3.org/2000/svg" className="sm:h-10 sm:w-10 h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                <svg xmlns="http://www.w3.org/2000/svg" className="sm:h-10 sm:w-10 h-5 w-5 text-gray-300 dark:text-gray-600" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            </div>
                            <div className="flex sm:flex-col items-center sm:gap-0 gap-6">
                                <div className="font-bold sm:text-2xl">65 <span className="sm:text-base">WPM</span></div>
                                <div className="text-xs sm:text-base text-gray-400 font-bold">97% Acc</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>

            <Link href="#" className="block bg-gray-100 dark:bg-gray-800/50 p-5 rounded-lg opacity-60 hover:opacity-100">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                    <div>
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white">2. Top Row Introduction</h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Extend your reach to the top row keys: QWERTY UIOP</p>
                        <div className="mt-2 flex gap-1.5">
                            <span className="font-mono text-xs font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded">Q</span>
                            <span className="font-mono text-xs font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded">W</span>
                            <span className="font-mono text-xs font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded">E</span>
                            <span className="font-mono text-xs font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded">R</span>
                            <span className="font-mono text-xs font-bold bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">...</span>
                        </div>
                    </div>
                    <div className="mt-4 sm:mt-0 flex-shrink-0 text-gray-400 dark:text-white font-semibold">
                        Start Lesson
                    </div>
                </div>
            </Link>
        </div>
    )
}