'use client';

import { STATIC_METRICS } from "@/staticdata/club";
import React from "react";

interface MetricCardProps {
    metric: typeof STATIC_METRICS[0];
    matchesPlayed?: number; 
}

const CircularMetricCard: React.FC<MetricCardProps> = ({ metric, matchesPlayed = 5 }) => {
    
    // --- SAFELY GET THE MAIN NUMBER ---
    // Fix for NaN: Check if 'value' exists. If not, use 'total' (e.g., total attempts).
    // If both are missing, default to 0.
    const actualValue = Number(metric.value ?? metric.total ?? 0);

    // --- CALCULATION LOGIC ---
    
    // 1. Calculate Average Per Game (APG) using safe value
    const apg = matchesPlayed > 0 ? (actualValue / matchesPlayed) : 0;

    // 2. Conversion % (Only used for the stroke animation visual)
    const percentage = metric.total > 0 ? (metric.made / metric.total) * 100 : 100;
    
    // 3. Stroke Offset
    const strokeDashoffset = 188.5 - (188.5 * percentage) / 100; 

    return (
        <div 
            className="bg-gradient-to-br from-[#1b1c28] to-[#252834] p-4 rounded-xl shadow-2xl border border-[#3b3e4e] flex flex-col items-center space-y-3 hover:border-purple-500/50 transition-all group select-none relative"
        >
            {/* Title */}
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider group-hover:text-white transition-colors">
                {metric.title}
            </h3>

            {/* Circular Chart */}
            <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="50%" cy="50%" r="30" strokeWidth="6"
                        stroke="#2f3142" fill="transparent"
                    />
                    <circle
                        cx="50%" cy="50%" r="30" strokeWidth="6"
                        stroke={metric.color} fill="transparent" strokeLinecap="round"
                        style={{
                            strokeDasharray: '188.5',
                            strokeDashoffset: strokeDashoffset,
                            transition: 'stroke-dashoffset 0.5s ease',
                        }}
                    />
                </svg>
                
                {/* Center Value (Total Volume) */}
                <div className="absolute flex flex-col items-center justify-center animate-fadeIn">
                    <span className="text-xl font-bold text-white">
                        {actualValue}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-gray-500 tracking-wider">
                        Total
                    </span>
                </div>
            </div>

            {/* Bottom Legend: APG */}
            <div className="flex flex-col items-center justify-center h-8">
                 <span className={`text-sm font-bold ${metric.title === 'Attempts' ? 'text-white' : 'text-blue-400'}`}>
                    {/* .toFixed(1) prevents long decimals, e.g., 31.6 */}
                    {!isNaN(apg) ? apg.toFixed(1) : '0.0'}
                 </span>
                 <span className="text-[9px] font-mono text-gray-500 uppercase">
                    Avg / Match
                 </span>
            </div>
            
        </div>
    );
};

export default CircularMetricCard;