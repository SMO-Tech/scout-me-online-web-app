import React from 'react';
import { FiClock } from 'react-icons/fi';

interface HalfTiming {
    start?: string;
    end?: string;
}

interface MatchTiming {
    first_half: HalfTiming;
    second_half: HalfTiming;
}

interface LegacyMatchTimingProps {
    matchTiming: MatchTiming;
}

export default function LegacyMatchTiming({ matchTiming }: LegacyMatchTimingProps) {
    const formatTime = (time?: string) => {
        if (!time) return "N/A"; // fallback if time is missing
        // If time already has colon (hh:mm:ss or mm:ss), keep it
        if (time.includes(':')) {
            return time;
        }
        // Otherwise, return as is
        return time;
    };

    return (
        <div className="bg-[#0B0D19]/60 border rounded-[2rem] p-6 shadow-2xl border-cyan-500/30">
            <div className="flex items-center gap-3 mb-4">
                <FiClock className="text-cyan-400" size={20} />
                <h3 className="text-cyan-400 font-black text-lg italic uppercase">Match Timing</h3>
            </div>

            <div className="space-y-4">
                {/* First Half */}
                <div className="border-b border-white/10 pb-3">
                    <div className="text-white font-semibold text-sm mb-2">First Half</div>
                    <div className="flex items-center justify-between text-gray-400 text-xs">
                        <span>Start: <span className="text-cyan-400 font-semibold">{formatTime(matchTiming.first_half.start)}</span></span>
                        <span>End: <span className="text-cyan-400 font-semibold">{formatTime(matchTiming.first_half.end)}</span></span>
                    </div>
                </div>

                {/* Second Half */}
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
