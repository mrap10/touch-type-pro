export default function LearnStatsCard() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 text-center">
            <div className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-emerald-500">75 <span className="text-base text-gray-500 dark:text-gray-400">WPM</span></div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-300">Average Speed</div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-emerald-500">98<span className="text-base text-gray-500 dark:text-gray-400">%</span></div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-300">Average Accuracy</div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-emerald-500">42</div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Stars</div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-emerald-500">2.8<span className="text-base text-gray-500 dark:text-gray-400">/3</span></div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-300">Average Stars</div>
            </div>
        </div>
    )
}