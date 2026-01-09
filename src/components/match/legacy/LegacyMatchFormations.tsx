import React from 'react';

interface LegacyMatchFormationsProps {
    teams: {
        my_team: string;
        opponent_team: string;
        my_team_formation: string;
        opponent_team_formation: string | null;
    };
}

export default function LegacyMatchFormations({ teams }: LegacyMatchFormationsProps) {
    return (
        <div className="bg-[#0B0D19]/60 border rounded-[2rem] p-6 shadow-2xl border-cyan-500/30">
            <h3 className="text-cyan-400 font-black text-lg italic uppercase mb-4">Formations</h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-white font-semibold">{teams.my_team}</span>
                    <span className="text-cyan-400 font-black text-xl">{teams.my_team_formation}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-white font-semibold">{teams.opponent_team}</span>
                    <span className="text-cyan-400 font-black text-xl">
                        {teams.opponent_team_formation || 'N/A'}
                    </span>
                </div>
            </div>
        </div>
    );
}

