import React from 'react';
import { FiActivity } from "react-icons/fi";

interface Props {
    isExpanded: boolean;
}

const FormationStats: React.FC<Props> = ({ isExpanded }) => {
    const formations = [
        { name: '4-3-3', usage: '64%', record: '12W / 2D / 1L' },
        { name: '4-4-2', usage: '20%', record: '3W / 5D / 4L' },
        { name: '3-5-2', usage: '16%', record: '2W / 1D / 2L' },
    ];

    // Mini view when collapsed (optional, helps keep sidebar clean)
    if (!isExpanded) {
        return (
            <div className="mt-4 flex flex-col items-center justify-center p-2 text-gray-500 hover:text-purple-400 transition cursor-pointer" title="Formation Stats">
                <FiActivity size={24} />
                <span className="text-[10px] mt-1 font-bold">64%</span>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-[#1b1c28] to-[#252834] p-4 rounded-xl shadow-2xl border border-[#3b3e4e] mt-4">
            <h2 className="text-lg font-semibold text-white mb-3 border-b border-gray-700/50 pb-2 whitespace-nowrap">
                Top 3 Formations
            </h2>
            <div className="space-y-3">
                {formations.map((f) => (
                    <div key={f.name} className="py-2 border-b border-gray-700/30 last:border-b-0">
                        <div className="flex justify-between items-center">
                            <span className="text-md font-bold text-purple-400">{f.name}</span>
                            <span className="text-sm font-semibold text-green-400">{f.usage}</span>
                        </div>
                        <p className="text-xs text-gray-400">{f.record}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FormationStats;