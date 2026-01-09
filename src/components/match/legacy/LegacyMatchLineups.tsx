import React from 'react';

interface Player {
    position: string;
    player_name: string;
    jersy_number: string;
}

interface LegacyMatchLineupsProps {
    lineups: {
        my_team_starting_lineup: Player[];
        opponent_team_starting_lineup: Player[];
    };
    substitutes: {
        my_team_substitutes: Player[];
        opponent_team_substitutes: Player[];
    };
    teams: {
        my_team: string;
        opponent_team: string;
    };
}

export default function LegacyMatchLineups({ lineups, substitutes, teams }: LegacyMatchLineupsProps) {
    const renderLineup = (players: Player[], teamName: string) => {
        if (!players || players.length === 0) {
            return (
                <div className="text-gray-400 text-sm italic">No lineup data available</div>
            );
        }

        const validPlayers = players.filter(p => p.player_name && p.player_name !== '0');

        if (validPlayers.length === 0) {
            return (
                <div className="text-gray-400 text-sm italic">No lineup data available</div>
            );
        }

        return (
            <div className="space-y-2">
                {validPlayers.map((player, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white/5 rounded-lg p-2">
                        <div className="flex items-center gap-3">
                            <span className="text-cyan-400 font-bold w-8 text-center">
                                {player.jersy_number || '-'}
                            </span>
                            <span className="text-white text-sm">{player.player_name}</span>
                        </div>
                        <span className="text-gray-400 text-xs uppercase">{player.position}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-[#0B0D19]/60 border rounded-[2rem] p-6 shadow-2xl border-cyan-500/30">
            <h3 className="text-cyan-400 font-black text-lg italic uppercase mb-6">Lineups</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* My Team Starting Lineup */}
                <div>
                    <h4 className="text-white font-bold text-sm mb-3 uppercase">{teams.my_team} - Starting XI</h4>
                    {renderLineup(lineups.my_team_starting_lineup, teams.my_team)}
                    
                    {substitutes.my_team_substitutes && substitutes.my_team_substitutes.length > 0 && (
                        <div className="mt-4">
                            <h5 className="text-gray-400 font-semibold text-xs mb-2 uppercase">Substitutes</h5>
                            {renderLineup(substitutes.my_team_substitutes, teams.my_team)}
                        </div>
                    )}
                </div>

                {/* Opponent Team Starting Lineup */}
                <div>
                    <h4 className="text-white font-bold text-sm mb-3 uppercase">{teams.opponent_team} - Starting XI</h4>
                    {renderLineup(lineups.opponent_team_starting_lineup, teams.opponent_team)}
                    
                    {substitutes.opponent_team_substitutes && substitutes.opponent_team_substitutes.length > 0 && (
                        <div className="mt-4">
                            <h5 className="text-gray-400 font-semibold text-xs mb-2 uppercase">Substitutes</h5>
                            {renderLineup(substitutes.opponent_team_substitutes, teams.opponent_team)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

