"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getClient } from '@/lib/api/client';
import { FiLoader, FiAlertTriangle, FiArrowLeft } from 'react-icons/fi';
import LegacyMatchHeader from '@/components/match/legacy/LegacyMatchHeader';
import LegacyMatchScore from '@/components/match/legacy/LegacyMatchScore';
import LegacyMatchFormations from '@/components/match/legacy/LegacyMatchFormations';
import LegacyMatchLineups from '@/components/match/legacy/LegacyMatchLineups';
import LegacyMatchTiming from '@/components/match/legacy/LegacyMatchTiming';

interface LegacyMatchAnalysis {
    match_id: number;
    id: number;
    youtube_link: string;
    user: {
        name: string;
        email: string;
    };
    match_info: {
        match_date_time: string;
        competition_name: string;
        venue: string;
        location: string;
    };
    teams: {
        my_team: string;
        opponent_team: string;
        my_team_formation: string;
        opponent_team_formation: string | null;
    };
    score: {
        home_score: number;
        away_score: number;
        winner: string | null;
    };
    lineups: {
        my_team_starting_lineup: Array<{
            position: string;
            player_name: string;
            jersy_number: string;
        }>;
        opponent_team_starting_lineup: Array<{
            position: string;
            player_name: string;
            jersy_number: string;
        }>;
    };
    substitutes: {
        my_team_substitutes: Array<{
            position: string;
            player_name: string;
            jersy_number: string;
        }>;
        opponent_team_substitutes: Array<{
            position: string;
            player_name: string;
            jersy_number: string;
        }>;
    };
    match_timing: {
        first_half: {
            start: string;
            end: string;
        };
        second_half: {
            start: string;
            end: string;
        };
    };
    metadata: any;
}

export default function LegacyMatchDetailPage() {
    const params = useParams();
    const router = useRouter();
    const matchId = params.id as string;

    const [matchData, setMatchData] = useState<LegacyMatchAnalysis | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMatchAnalysis = async () => {
            if (!matchId) return;

            setLoading(true);
            setError(null);

            try {
                const client = await getClient();
                const response = await client.get(`/match/legacy-match-analysis/${matchId}`);
                
                if (response.data.status === 'success' && response.data.data) {
                    setMatchData(response.data.data);
                } else {
                    setError('Failed to load match data');
                }
            } catch (err: any) {
                console.error('Failed to fetch legacy match analysis:', err);
                const errorMessage = err.response?.data?.message || err.message || 'Unknown error occurred.';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchMatchAnalysis();
    }, [matchId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#05060B] text-white p-4 sm:p-10">
                <div className="max-w-7xl mx-auto flex flex-col items-center justify-center py-40 gap-4">
                    <FiLoader className="animate-spin text-cyan-400" size={48} />
                    <p className="text-cyan-400 font-semibold">Loading match analysis...</p>
                </div>
            </div>
        );
    }

    if (error || !matchData) {
        return (
            <div className="min-h-screen bg-[#05060B] text-white p-4 sm:p-10">
                <div className="max-w-7xl mx-auto">
                    <button
                        onClick={() => router.push('/dashboard/matches')}
                        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-6 transition-colors"
                    >
                        <FiArrowLeft size={20} />
                        <span className="font-semibold">Back to Matches</span>
                    </button>
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <FiAlertTriangle className="text-red-500" size={48} />
                        <p className="text-red-400 font-semibold">{error || 'Match data not found'}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#05060B] text-white p-4 sm:p-10 selection:bg-cyan-500/30">
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => router.push('/dashboard/matches')}
                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-6 transition-colors"
                >
                    <FiArrowLeft size={20} />
                    <span className="font-semibold">Back to Matches</span>
                </button>

                {/* Match Header */}
                <LegacyMatchHeader
                    teams={matchData.teams}
                    matchInfo={matchData.match_info}
                    youtubeLink={matchData.youtube_link}
                    user={matchData.user}
                />

                {/* Match Score */}
                <LegacyMatchScore
                    score={matchData.score}
                    teams={matchData.teams}
                />

                {/* Grid Layout for Formations, Lineups, and Timing */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <LegacyMatchFormations teams={matchData.teams} />
                    <LegacyMatchTiming matchTiming={matchData.match_timing} />
                </div>

                {/* Lineups - Full Width */}
                <div className="mt-6">
                    <LegacyMatchLineups
                        lineups={matchData.lineups}
                        substitutes={matchData.substitutes}
                        teams={matchData.teams}
                    />
                </div>
            </div>
        </div>
    );
}

