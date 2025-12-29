import React from 'react';
import { FiSearch } from "react-icons/fi";

interface Props {
    isExpanded: boolean;
}

const CustomSearch: React.FC<Props> = ({ isExpanded }) => {
    
    // Collapsed View: Just a generic search icon button
    if (!isExpanded) {
        return (
            <div className="mt-4 flex justify-center">
                <button className="p-3 rounded-lg bg-[#252834] text-gray-400 hover:bg-blue-600 hover:text-white transition shadow-lg border border-[#3b3e4e]">
                    <FiSearch size={20} />
                </button>
            </div>
        );
    }

    // Expanded View: Full Form
    return (
        <div className="bg-gradient-to-br from-[#1b1c28] to-[#252834] p-4 rounded-xl shadow-2xl border border-[#3b3e4e] mt-4">
            <h2 className="text-lg font-semibold text-white mb-3 border-b border-gray-700/50 pb-2 whitespace-nowrap">
                Custom Search
            </h2>
            <div className="space-y-3">
                <input
                    type="text"
                    placeholder="Type here..."
                    className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-[#1b1c28] text-white placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition"
                />
                <button className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
                    Search
                </button>
            </div>
        </div>
    );
};

export default CustomSearch;