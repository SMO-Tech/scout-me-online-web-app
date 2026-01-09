import React from 'react';
import { FiClock } from 'react-icons/fi';

interface LegacyMatchTimingProps {
    matchTiming: {
        first_half: {
            start: string;
            end: string;
        };
        second_half: {
            start: string;
            end: string;
        };
    };
}

export default function LegacyMatchTiming({ matchTiming }: LegacyMatchTimingProps) {
    const formatTime = (time: string) => {
        // Handle different time formats
        if (time.includes(':')) {
            return time;
        }
        return time;
    };

    return (
        <div className="bg-[#0B0D19]/60 border rounded-[2rem] p-6 shadow-2xl border-cyan-500/30">
            <div className="flex items-center gap-3 mb-4">
                <FiClock className="text-cyan-400" size={20} />
                <h3 className="text-cyan-400 font-black text-lg italic uppercase">Match Timing</h3>
            </div>
            <div className="space-y-4">
                <div className="border-b border-white/10 pb-3">
                    <div className="text-white font-semibold text-sm mb-2">First Half</div>
                    <div className="flex items-center justify-between text-gray-400 text-xs">
                        <span>Start: <span className="text-cyan-400 font-semibold">{formatTime(matchTiming.first_half.start)}</span></span>
                        <span>End: <span className="text-cyan-400 font-semibold">{formatTime(matchTiming.first_half.end)}</span></span>
                    </div>
                </div>
                <div>
                    <div className="text-white font-semibold text-sm mb-2">Second Half</div>
                    <div className="flex items-center justify-between text-gray-400 text-xs">
                        <span>Start: <span className="text-cyan-400 font-semibold">{formatTime(matchTiming.second_half.start)}</span></span>
                        <span>End: <span className="text-cyan-400 font-semibold">{formatTime(matchTiming.second_half.end)}</span></span>
                    </div>
                </div>
            </div>
        </div>
    );
}

