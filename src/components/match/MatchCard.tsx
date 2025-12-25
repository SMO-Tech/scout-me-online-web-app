import React from 'react';
import { FiEye, FiCalendar, FiFlag, FiLayers } from "react-icons/fi"; // Added FiLayers for Level
import { useRouter } from "next/navigation";

// Define the interface for the derived Match data
interface MatchCardProps {
    match: {
        id: string;
        teamName: string;
        opponentName: string;
        score: string;
        level: string;
        matchDate: string | null;
        country: string | undefined;
        user: { name: string };
        views: number | undefined;
    };
}

const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { 
        year: "numeric", 
        month: "short", 
        day: "numeric" 
    });
};

const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
    const router = useRouter();

    const handleViewAnalysis = () => {
        router.push(`/dashboard/matches/${match.id}`);
    };

    return (
        <div
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 
                       overflow-hidden cursor-pointer transform hover:-translate-y-1 border border-gray-200"
            onClick={handleViewAnalysis}
        >
            {/* 1. HEADER: METADATA & ACTION */}
            <div className="flex justify-between items-center p-4 border-b bg-gray-50/50">
                <div className="flex items-center text-xs font-medium text-gray-600">
                    <FiLayers className="w-3 h-3 mr-1" />
                    {match.level.replace('_', ' ')}
                </div>
                {/* Views */}
                {match.views !== undefined && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <FiEye className="w-3 h-3" />
                        <span>{match.views || 0} views</span>
                    </div>
                )}
            </div>

            {/* 2. MATCHUP & SCORELINE */}
            <div className="p-6">
                <div className="flex items-center justify-between">
                    {/* Home Team */}
                    <div className="flex-1 text-center pr-2">
                        <h3 className="text-xl font-extrabold text-gray-900 truncate">
                            {match.teamName}
                        </h3>
                    </div>

                    {/* Score */}
                    <div className="flex-shrink-0">
                        <p className="text-4xl font-black text-purple-700 bg-purple-100 px-4 py-2 rounded-lg shadow-inner border border-purple-200">
                            {match.score}
                        </p>
                    </div>

                    {/* Opponent Team */}
                    <div className="flex-1 text-center pl-2">
                        <h3 className="text-xl font-bold text-gray-800 truncate">
                            {match.opponentName}
                        </h3>
                    </div>
                </div>
            </div>

            {/* 3. FOOTER: DETAILS & BUTTON */}
            <div className="p-4 pt-0">
                
                {/* Match Details Grid */}
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-gray-600 border-t border-gray-100 pt-4 mb-4">
                    
                    {/* Date */}
                    <div className="flex items-center gap-2">
                        <FiCalendar className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-700">{formatDate(match.matchDate)}</span>
                    </div>
                    
                    {/* Location/Country */}
                    {match.country && (
                        <div className="flex items-center gap-2">
                            <FiFlag className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-gray-700">{match.country}</span>
                        </div>
                    )}
                    
                    {/* Uploader Name */}
                    <div className="col-span-2 text-center pt-2">
                        <span className="font-medium text-gray-500">Uploaded by: </span>
                        <span className="font-semibold text-gray-700">{match.user.name}</span>
                    </div>
                </div>

                {/* Action Button - Moved out of the main stack */}
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Prevents card click trigger
                        handleViewAnalysis();
                    }}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition-colors shadow-md hover:shadow-lg"
                >
                    View Analysis
                </button>
            </div>
        </div>
    );
};

export default MatchCard;