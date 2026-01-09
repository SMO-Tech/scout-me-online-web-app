import React from 'react';

interface LegacyMatchScoreProps {
    score: {
        home_score: number;
        away_score: number;
        winner: string | null;
    };
    teams: {
        my_team: string;
        opponent_team: string;
    };
}

export default function LegacyMatchScore({ score, teams }: LegacyMatchScoreProps) {
    const isDraw = score.home_score === score.away_score;

    return (
        <div className="bg-[#0B0D19]/60 border rounded-[2rem] p-6 shadow-2xl border-cyan-500/30">
            <div className="text-center">
                <div className="text-cyan-400 font-black text-xs uppercase tracking-widest mb-4">Final Score</div>
                <div className="flex items-center justify-center gap-6 mb-4">
                    <div className="text-center">
                        <div className="text-white font-black text-3xl mb-2">{score.home_score}</div>
                        <div className="text-gray-400 text-sm font-semibold">{teams.my_team}</div>
                    </div>
                    <div className="text-cyan-400 font-black text-2xl">-</div>
                    <div className="text-center">
                        <div className="text-white font-black text-3xl mb-2">{score.away_score}</div>
                        <div className="text-gray-400 text-sm font-semibold">{teams.opponent_team}</div>
                    </div>
                </div>
                {!isDraw && score.winner && (
                    <div className="text-cyan-400 font-bold text-sm">
                        Winner: {score.winner}
                    </div>
                )}
                {isDraw && (
                    <div className="text-cyan-400 font-bold text-sm">Draw</div>
                )}
            </div>
        </div>
    );
}

