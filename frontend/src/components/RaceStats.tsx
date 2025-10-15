"use client";

interface RaceStatsProps {
    progress: number;
    wpm: number;
    accuracy: number;
}

export default function RaceStats({ progress, wpm, accuracy }: RaceStatsProps) {
    return (
        <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-center">Race Statistics</h3>
            <div className="grid grid-cols-3 gap-4 bg-white dark:bg-gray-800 rounded-lg p-4">
                <StatCard 
                    value={Math.round(progress)} 
                    unit="%" 
                    label="Progress" 
                    color="text-emerald-500" 
                />
                <StatCard 
                    value={wpm} 
                    unit="" 
                    label="WPM" 
                    color="text-blue-500" 
                />
                <StatCard 
                    value={accuracy} 
                    unit="%" 
                    label="Accuracy" 
                    color="text-purple-500" 
                />
            </div>
        </div>
    );
}

interface StatCardProps {
    value: number;
    unit: string;
    label: string;
    color: string;
}

function StatCard({ value, unit, label, color }: StatCardProps) {
    const displayValue = Math.max(0, value || 0);
    
    return (
        <div className="flex flex-col items-center">
            <div className={`text-4xl md:text-5xl font-bold ${color} transition-all duration-200`}>
                {displayValue}{unit}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">
                {label}
            </div>
        </div>
    );
}