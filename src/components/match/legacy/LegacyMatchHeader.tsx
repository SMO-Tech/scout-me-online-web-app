import React from 'react';
import { FiVideo, FiCalendar, FiMapPin } from 'react-icons/fi';

interface LegacyMatchHeaderProps {
    teams: {
        my_team: string;
        opponent_team: string;
    };
    matchInfo: {
        match_date_time: string;
        competition_name: string;
        venue: string;
        location: string;
    };
    youtubeLink: string;
    user: {
        name: string;
        email: string;
    };
}

export default function LegacyMatchHeader({ teams, matchInfo, youtubeLink, user }: LegacyMatchHeaderProps) {
    const matchDate = new Date(matchInfo.match_date_time).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return (
        <div className="bg-[#0B0D19]/60 border rounded-[2rem] p-6 shadow-2xl border-cyan-500/30 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1">
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r text-white mb-4">
                        {teams.my_team} <span className="text-[#E860E2]">VS</span> {teams.opponent_team}
                    </h1>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 text-cyan-400 text-sm">
                            <FiCalendar size={18} />
                            <span className="font-semibold">{matchDate}</span>
                        </div>
                        <div className="flex items-center gap-3 text-cyan-400 text-sm">
                            <FiMapPin size={18} />
                            <span className="font-semibold">{matchInfo.venue} • {matchInfo.location}</span>
                        </div>
                        {matchInfo.competition_name && (
                            <div className="text-gray-400 text-sm font-medium">
                                {matchInfo.competition_name}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col items-center gap-4">
                    <a
                        href={youtubeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-black px-6 py-3 rounded-xl font-black italic text-sm uppercase tracking-widest transition-all"
                    >
                        <FiVideo size={20} />
                        Watch Video
                    </a>
                    <div className="text-center">
                        <span className="text-blue-500 font-black text-xs uppercase">Created by</span>
                        <div className="text-cyan-400 font-bold text-sm">{user.name}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

