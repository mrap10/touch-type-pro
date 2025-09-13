"use client";

import { RotateCcw, Share2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getChunkInterval } from "@/constants/typing";
import type { TypingData } from "@/types/typing";

interface ResultsCardProps {
    wpm: number;
    accuracy: number;
    errors: number;
    typingData: TypingData[];
    duration: number;
    onRestart: () => void;
    onShare: () => void;
}

export default function ResultsCard({ wpm, accuracy, errors, typingData, duration, onRestart, onShare }: ResultsCardProps) {
    const chartData = typingData.length > 0 ? typingData : (() => {
        const chunkInterval = getChunkInterval(duration);
        const dataPoints = [];
        
        for (let i = chunkInterval; i <= duration; i += chunkInterval) {
            const progress = i / duration;
            const baseWpm = Math.max(5, wpm * (0.5 + 0.5 * progress) + (Math.random() - 0.5) * 15);
            const currentErrors = Math.floor(errors * progress + Math.random() * 2);
            
            dataPoints.push({
                second: i,
                wpm: Math.round(baseWpm),
                errors: currentErrors
            });
        }
        
        if (dataPoints.length > 0) {
            dataPoints[dataPoints.length - 1] = { second: duration, wpm: Math.max(1, wpm), errors };
        } else {
            dataPoints.push({ second: duration, wpm: Math.max(1, wpm), errors });
        }
        
        return dataPoints;
    })();

    const finalChartData = chartData.length > 0 ? chartData : [
        { second: 1, wpm: Math.max(1, Math.floor(wpm * 0.5)), errors: Math.floor(errors * 0.3) },
        { second: Math.floor(duration * 0.5), wpm: Math.max(1, Math.floor(wpm * 0.8)), errors: Math.floor(errors * 0.7) },
        { second: duration, wpm: Math.max(1, wpm), errors }
    ];

    return (
        <div className="flex flex-col items-center justify-center p-6 w-full ">
            <div className="m-6 p-6 grid grid-cols-4 gap-4 w-full text-center">
                <div>
                    <h1 className="text-4xl text-gray-500 dark:text-gray-300">{wpm}</h1>
                    <p className="text-3xl text-gray-800 dark:text-gray-500">wpm</p>
                </div>

                <div>
                    <h1 className="text-4xl text-gray-500 dark:text-gray-300">{accuracy}%</h1>
                    <p className="text-3xl text-gray-800 dark:text-gray-500">accuracy</p>
                </div>
                <div>
                    <h1 className="text-4xl text-gray-500 dark:text-gray-300">{errors}</h1>
                    <p className="text-3xl text-gray-800 dark:text-gray-500">error strokes</p>
                </div>
                <div>
                    <h1 className="text-4xl text-gray-500 dark:text-gray-300">{duration}s</h1>
                    <p className="text-3xl text-gray-800 dark:text-gray-500">time</p>
                </div>
            </div>
            <div className="w-full h-64 p-5">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={finalChartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                            dataKey="second" 
                            label={{ value: "Time (seconds)", position: "insideBottomRight", offset: -10, dx: -20 }}
                            stroke="#6b7280"
                        />
                        <YAxis 
                            label={{ value: "WPM / Errors", angle: -90, position: "insideLeft", offset: 18, dy: 40 }}
                            stroke="#6b7280"
                            domain={[0, Math.max(100, Math.max(...finalChartData.map(d => d.wpm)) + 10)]}
                        />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: '#f9fafb', 
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                        />
                        {/* <Tooltip 
                            contentStyle={{ 
                                backgroundColor: 'rgb(31 41 55)', 
                                border: '1px solid #374151',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                color: '#f9fafb'
                            }}
                        /> */}
                        <Legend />
                        <Line 
                            type="monotone" 
                            dataKey="wpm" 
                            stroke="#10b981" 
                            strokeWidth={3} 
                            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: '#ffffff' }}
                            name="WPM"
                        />
                        <Line 
                            type="monotone" 
                            dataKey="errors" 
                            stroke="#ef4444" 
                            strokeWidth={3} 
                            dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2, fill: '#ffffff' }}
                            name="Errors"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="flex space-x-4">
                <button 
                    onClick={onRestart}
                    className="mt-8 p-3 bg-emerald-200 hover:bg-emerald-300 cursor-pointer text-black rounded-full transition-colors duration-200 flex items-center justify-center"
                >
                    <RotateCcw size={20} />
                </button>

                <button
                    onClick={onShare}
                    className="mt-8 p-3 bg-emerald-200 hover:bg-emerald-300 cursor-pointer text-black rounded-full transition-colors duration-200 flex items-center justify-center"
                >
                    <Share2 size={20} />
                </button>
            </div>
        </div>
    );
}
