"use client";
import { useEffect, useState } from "react";
import { learnAPI, isAuthenticated, UserStats } from "@/lib/api";

interface LearnStatsCardProps {
    mode?: 'NORMAL' | 'DEV';
}

export default function LearnStatsCard({ mode }: LearnStatsCardProps) {
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            setIsAuth(isAuthenticated());
            
            if (!isAuthenticated()) {
                setLoading(false);
                return;
            }

            try {
                const response = await learnAPI.getUserProgress(mode);
                if (response.success && response.stats) {
                    setStats(response.stats);
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [mode]);

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 text-center">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-lg animate-pulse">
                        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!isAuth) {
        return (
            <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-lg mb-10 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                    Sign in to track your progress and view stats
                </p>
            </div>
        );
    }

    const averageStars = stats && stats.totalLessons > 0 
        ? (stats.totalStars / stats.totalLessons).toFixed(1) 
        : '0.0';

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 text-center">
            <div className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-emerald-500">
                    {stats?.averageWpm.toFixed(0) || 0} 
                    <span className="text-base text-gray-500 dark:text-gray-400"> WPM</span>
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-300">Average Speed</div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-emerald-500">
                    {stats?.averageAccuracy.toFixed(0) || 0}
                    <span className="text-base text-gray-500 dark:text-gray-400">%</span>
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-300">Average Accuracy</div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-emerald-500">{stats?.totalStars || 0}</div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Stars</div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-emerald-500">
                    {averageStars}
                    <span className="text-base text-gray-500 dark:text-gray-400">/3</span>
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-300">Average Stars</div>
            </div>
        </div>
    );
}