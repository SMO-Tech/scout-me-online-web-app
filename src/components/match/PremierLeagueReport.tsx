"use client";

import React, { useState } from 'react';
import { FiCalendar, FiMapPin, FiUsers, FiVideo, FiBarChart2, FiList, FiArrowDown, FiArrowUp } from 'react-icons/fi';

interface MatchClubData {
    id: string;
    name: string;
    country: string;
    jerseyColor: string | null;
    isUsersTeam: boolean;
    club: {
        id: string;
        logoUrl: string | null;
    } | null;
}

interface MatchResultData {
    homeScore: number;
    awayScore: number;
    homePossession?: number | null;
    awayPossession?: number | null;
    homeShots?: number | null;
    awayShots?: number | null;
}

interface MatchDetail {
    id: string;
    videoUrl: string;
    status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
    level: string;
    matchDate: string | null;
    competitionName: string | null;
    venue: string | null;
    createdAt: string;
    matchClubs: MatchClubData[];
    matchPlayers: any[];
    result: MatchResultData | null;
    user: { name: string };
}

interface PremierLeagueReportProps {
    matchData: MatchDetail | null;
    matchResult?: any;
}

type TabType = 'timeline' | 'lineups' | 'stats' | 'players';

const getTeams = (matchClubs: MatchClubData[]) => {
    return {
        home: matchClubs.find(c => c.isUsersTeam),
        away: matchClubs.find(c => !c.isUsersTeam),
    };
};

const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "TBD";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { 
        weekday: 'short',
        year: "numeric", 
        month: "short", 
        day: "numeric" 
    });
};

const getYouTubeVideoId = (url: string | undefined): string | null => {
    if (!url) return null;
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname.includes('youtube.com')) {
            return urlObj.searchParams.get('v');
        }
        if (urlObj.hostname.includes('youtu.be')) {
            return urlObj.pathname.substring(1);
        }
    } catch (e) {
        const match = url.match(/v=([a-zA-Z0-9_-]+)/) || url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
        if (match) return match[1];
    }
    return null;
};

const PremierLeagueReport: React.FC<PremierLeagueReportProps> = ({ matchData, matchResult }) => {
    const [activeTab, setActiveTab] = useState<TabType>('stats');
    const [activeStatsTab, setActiveStatsTab] = useState<'key' | 'discipline'>('key');

    if (!matchData) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-gray-500">No match data available</p>
            </div>
        );
    }

    const { home: homeTeam, away: awayTeam } = getTeams(matchData.matchClubs);
    const youtubeVideoId = getYouTubeVideoId(matchData.videoUrl);
    const matchStatus = matchData.status === 'COMPLETED' ? 'Full-time' : matchData.status;
    const matchDateDisplay = matchData.matchDate ? formatDate(matchData.matchDate) : formatDate(matchData.createdAt);

    // Calculate stats from match data
    const homeStats = {
        shots: matchData.result?.homeShots || 0,
        shotsOnTarget: Math.floor((matchData.result?.homeShots || 0) * 0.5), // Estimate
        possession: matchData.result?.homePossession || 50,
        passes: Math.floor((matchData.result?.homePossession || 50) * 10), // Estimate
        passAccuracy: 90, // Default
        fouls: 10, // Default
        yellowCards: 2, // Default
        redCards: 0,
        offsides: 1,
        corners: 3,
    };

    const awayStats = {
        shots: matchData.result?.awayShots || 0,
        shotsOnTarget: Math.floor((matchData.result?.awayShots || 0) * 0.5), // Estimate
        possession: matchData.result?.awayPossession || 50,
        passes: Math.floor((matchData.result?.awayPossession || 50) * 10), // Estimate
        passAccuracy: 89, // Default
        fouls: 9, // Default
        yellowCards: 2, // Default
        redCards: 0,
        offsides: 1,
        corners: 0,
    };

    const keyStats = [
        { label: 'Shots', home: homeStats.shots, away: awayStats.shots },
        { label: 'Shots on target', home: homeStats.shotsOnTarget, away: awayStats.shotsOnTarget },
        { label: 'Possession', home: homeStats.possession, away: awayStats.possession, isPercentage: true },
        { label: 'Passes', home: homeStats.passes, away: awayStats.passes },
        { label: 'Pass accuracy', home: homeStats.passAccuracy, away: awayStats.passAccuracy, isPercentage: true },
        { label: 'Fouls', home: homeStats.fouls, away: awayStats.fouls },
        { label: 'Yellow cards', home: homeStats.yellowCards, away: awayStats.yellowCards },
        { label: 'Red cards', home: homeStats.redCards, away: awayStats.redCards },
        { label: 'Offsides', home: homeStats.offsides, away: awayStats.offsides },
        { label: 'Corners', home: homeStats.corners, away: awayStats.corners },
    ];

    const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
        { id: 'timeline', label: 'Timeline', icon: <FiList size={16} /> },
        { id: 'lineups', label: 'Lineups', icon: <FiUsers size={16} /> },
        { id: 'stats', label: 'Stats', icon: <FiBarChart2 size={16} /> },
        { id: 'players', label: 'Players', icon: <FiUsers size={16} /> },
    ];

    const statsTabs = [
        { id: 'key' as const, label: 'Key stats' },
        { id: 'discipline' as const, label: 'Discipline' },
    ];

    // Static Timeline Events
    const timelineEvents = [
        { time: "0'", type: 'kickoff', team: 'home', description: 'Match started' },
        { time: "12'", type: 'goal', team: 'home', player: 'Player Name', description: 'Goal scored', score: '1-0' },
        { time: "23'", type: 'yellow', team: 'away', player: 'Player Name', description: 'Yellow card' },
        { time: "34'", type: 'substitution', team: 'home', playerOut: 'Player Out', playerIn: 'Player In', description: 'Substitution' },
        { time: "45+2'", type: 'goal', team: 'away', player: 'Player Name', description: 'Goal scored', score: '1-1' },
        { time: "46'", type: 'kickoff', team: 'home', description: 'Second half started' },
        { time: "58'", type: 'substitution', team: 'away', playerOut: 'Player Out', playerIn: 'Player In', description: 'Substitution' },
        { time: "67'", type: 'goal', team: 'home', player: 'Player Name', description: 'Goal scored', score: '2-1' },
        { time: "78'", type: 'yellow', team: 'home', player: 'Player Name', description: 'Yellow card' },
        { time: "82'", type: 'substitution', team: 'home', playerOut: 'Player Out', playerIn: 'Player In', description: 'Substitution' },
        { time: "90+3'", type: 'whistle', team: 'home', description: 'Full time' },
    ];

    // Static Lineups
    const homeLineup = [
        { number: 1, name: 'Goalkeeper', position: 'GK' },
        { number: 2, name: 'Defender 1', position: 'RB' },
        { number: 4, name: 'Defender 2', position: 'CB' },
        { number: 5, name: 'Defender 3', position: 'CB' },
        { number: 3, name: 'Defender 4', position: 'LB' },
        { number: 6, name: 'Midfielder 1', position: 'CM' },
        { number: 8, name: 'Midfielder 2', position: 'CM' },
        { number: 10, name: 'Midfielder 3', position: 'CAM' },
        { number: 7, name: 'Forward 1', position: 'RW' },
        { number: 9, name: 'Forward 2', position: 'ST' },
        { number: 11, name: 'Forward 3', position: 'LW' },
    ];

    const homeSubstitutes = [
        { number: 12, name: 'Substitute 1', position: 'GK' },
        { number: 13, name: 'Substitute 2', position: 'DEF' },
        { number: 14, name: 'Substitute 3', position: 'MID' },
        { number: 15, name: 'Substitute 4', position: 'FWD' },
        { number: 16, name: 'Substitute 5', position: 'MID' },
    ];

    const awayLineup = [
        { number: 1, name: 'Goalkeeper', position: 'GK' },
        { number: 2, name: 'Defender 1', position: 'RB' },
        { number: 4, name: 'Defender 2', position: 'CB' },
        { number: 5, name: 'Defender 3', position: 'CB' },
        { number: 3, name: 'Defender 4', position: 'LB' },
        { number: 6, name: 'Midfielder 1', position: 'CDM' },
        { number: 8, name: 'Midfielder 2', position: 'CM' },
        { number: 10, name: 'Midfielder 3', position: 'CM' },
        { number: 7, name: 'Forward 1', position: 'RW' },
        { number: 9, name: 'Forward 2', position: 'ST' },
        { number: 11, name: 'Forward 3', position: 'LW' },
    ];

    const awaySubstitutes = [
        { number: 12, name: 'Substitute 1', position: 'GK' },
        { number: 13, name: 'Substitute 2', position: 'DEF' },
        { number: 14, name: 'Substitute 3', position: 'MID' },
        { number: 15, name: 'Substitute 4', position: 'FWD' },
    ];

    // Static Player Stats
    const playerStats = [
        { name: 'Player 1', position: 'ST', goals: 2, assists: 1, shots: 5, passes: 32, passAccuracy: 87, tackles: 0, rating: 9.2 },
        { name: 'Player 2', position: 'CM', goals: 0, assists: 2, shots: 2, passes: 68, passAccuracy: 92, tackles: 3, rating: 8.5 },
        { name: 'Player 3', position: 'CB', goals: 0, assists: 0, shots: 1, passes: 45, passAccuracy: 89, tackles: 7, rating: 8.1 },
        { name: 'Player 4', position: 'LW', goals: 1, assists: 0, shots: 4, passes: 28, passAccuracy: 85, tackles: 1, rating: 7.8 },
        { name: 'Player 5', position: 'RB', goals: 0, assists: 1, shots: 0, passes: 52, passAccuracy: 88, tackles: 5, rating: 7.6 },
    ];

    return (
        <div className="min-h-screen bg-black">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Match Header */}
                <div className="mb-6">
                    {/* Competition & Follow Button */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-gray-200 font-medium">
                            {matchData.competitionName || 'Match'} {matchData.competitionName && '>'}
                        </div>
                        <button className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition">
                            Follow
                        </button>
                    </div>

                    {/* Teams & Score */}
                    <div className="flex items-center justify-between bg-black border-b border-gray-200 pb-6">
                        {/* Home Team */}
                        <div className="flex items-center gap-4 flex-1">
                            <div className="flex flex-col items-center gap-2">
                                {homeTeam?.club?.logoUrl ? (
                                    <img 
                                        src={homeTeam.club.logoUrl} 
                                        alt={homeTeam.name}
                                        className="w-16 h-16 object-contain"
                                    />
                                ) : (
                                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                                        <span className="text-gray-400 text-xs font-bold">{homeTeam?.name?.[0] || 'H'}</span>
                                    </div>
                                )}
                                <span className="text-sm font-semibold text-gray-900">{homeTeam?.name || 'Home'}</span>
                            </div>
                            <div className="text-4xl font-bold text-gray-900">
                                {matchData.result?.homeScore ?? 0}
                            </div>
                        </div>

                        {/* Match Status & Date */}
                        <div className="flex flex-col items-center gap-1 mx-8">
                            <span className="text-sm font-medium text-gray-200">{matchStatus}</span>
                            <span className="text-xs text-gray-300">{matchDateDisplay}</span>
                        </div>

                        {/* Away Team */}
                        <div className="flex items-center gap-4 flex-1 justify-end">
                            <div className="text-4xl font-bold text-gray-900">
                                {matchData.result?.awayScore ?? 0}
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                {awayTeam?.club?.logoUrl ? (
                                    <img 
                                        src={awayTeam.club.logoUrl} 
                                        alt={awayTeam.name}
                                        className="w-16 h-16 object-contain"
                                    />
                                ) : (
                                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                                        <span className="text-gray-400 text-xs font-bold">{awayTeam?.name?.[0] || 'A'}</span>
                                    </div>
                                )}
                                <span className="text-sm font-semibold text-gray-900">{awayTeam?.name || 'Away'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex items-center gap-1 border-b border-gray-200 mb-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                                activeTab === tab.id
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                    {activeTab === 'stats' && (
                        <div>
                            {/* Stats Sub-tabs */}
                            <div className="flex items-center gap-1 border-b border-gray-200 mb-6">
                                {statsTabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveStatsTab(tab.id)}
                                        className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                                            activeStatsTab === tab.id
                                                ? 'border-blue-600 text-blue-600'
                                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Key Stats Table */}
                            {activeStatsTab === 'key' && (
                                <div className="bg-black">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Match stats</h3>
                                        <span className="text-xs text-gray-500 italic bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                                            Note: Static data - Work in progress
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        {keyStats.map((stat) => {
                                            const homeWins = stat.home > stat.away;
                                            const awayWins = stat.away > stat.home;

                                            return (
                                                <div key={stat.label} className="flex items-center justify-between py-3 hover:bg-gray-700 transition-colors rounded-lg px-2">
                                                    {/* Home Team Value */}
                                                    <div className="flex items-center gap-3 flex-1 justify-end">
                                                        <span className={`inline-flex items-center justify-center min-w-[3rem] h-10 rounded-full text-base font-bold shadow-sm transition-all ${
                                                            homeWins 
                                                                ? 'bg-red-500 text-white shadow-red-200' 
                                                                : 'bg-gray-100 text-gray-700'
                                                        }`}>
                                                            {stat.home}{stat.isPercentage ? '%' : ''}
                                                        </span>
                                                    </div>
                                                    
                                                    {/* Stat Label (Center) */}
                                                    <div className="flex-1 text-center px-6">
                                                        <span className="text-sm text-gray-300 font-medium">{stat.label}</span>
                                                    </div>
                                                    
                                                    {/* Away Team Value */}
                                                    <div className="flex items-center gap-3 flex-1 justify-start">
                                                        <span className={`inline-flex items-center justify-center min-w-[3rem] h-10 rounded-full text-base font-bold shadow-sm transition-all ${
                                                            awayWins 
                                                                ? 'bg-red-500 text-white shadow-red-200' 
                                                                : 'bg-gray-100 text-gray-700'
                                                        }`}>
                                                            {stat.away}{stat.isPercentage ? '%' : ''}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Other stats tabs - placeholder */}
                            {activeStatsTab !== 'key' && (
                                <div className="text-center py-12 text-gray-500">
                                    <p className="text-sm">Coming soon</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'lineups' && (
                        <div className="bg-white">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Starting Lineups</h3>
                                <span className="text-xs text-gray-500 italic bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                                    Note: Static data - Work in progress
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                {/* Home Team Lineup */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
                                        {homeTeam?.club?.logoUrl && (
                                            <img src={homeTeam.club.logoUrl} alt={homeTeam.name} className="w-6 h-6" />
                                        )}
                                        <h4 className="font-semibold text-gray-900">{homeTeam?.name || 'Home'}</h4>
                                    </div>
                                    <div className="space-y-2">
                                        {homeLineup.map((player, idx) => (
                                            <div key={idx} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                                                <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-sm font-bold text-gray-700">
                                                    {player.number}
                                                </span>
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium text-gray-900">{player.name}</div>
                                                    <div className="text-xs text-gray-500">{player.position}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <h5 className="text-sm font-semibold text-gray-700 mb-2">Substitutes</h5>
                                        <div className="space-y-1">
                                            {homeSubstitutes.map((sub, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                                    <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded text-xs font-medium">
                                                        {sub.number}
                                                    </span>
                                                    <span>{sub.name}</span>
                                                    <span className="text-xs text-gray-400">({sub.position})</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Away Team Lineup */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
                                        {awayTeam?.club?.logoUrl && (
                                            <img src={awayTeam.club.logoUrl} alt={awayTeam.name} className="w-6 h-6" />
                                        )}
                                        <h4 className="font-semibold text-gray-900">{awayTeam?.name || 'Away'}</h4>
                                    </div>
                                    <div className="space-y-2">
                                        {awayLineup.map((player, idx) => (
                                            <div key={idx} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                                                <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-sm font-bold text-gray-700">
                                                    {player.number}
                                                </span>
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium text-gray-900">{player.name}</div>
                                                    <div className="text-xs text-gray-500">{player.position}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <h5 className="text-sm font-semibold text-gray-700 mb-2">Substitutes</h5>
                                        <div className="space-y-1">
                                            {awaySubstitutes.map((sub, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                                    <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded text-xs font-medium">
                                                        {sub.number}
                                                    </span>
                                                    <span>{sub.name}</span>
                                                    <span className="text-xs text-gray-400">({sub.position})</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'timeline' && (
                        <div className="bg-white">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Match Timeline</h3>
                                <span className="text-xs text-gray-500 italic bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                                    Note: Static data - Work in progress
                                </span>
                            </div>
                            <div className="relative">
                                <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-200"></div>
                                <div className="space-y-4">
                                    {timelineEvents.map((event, idx) => {
                                        const isHome = event.team === 'home';
                                        const getEventIcon = () => {
                                            switch (event.type) {
                                                case 'goal':
                                                    return <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">⚽</div>;
                                                case 'yellow':
                                                    return <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-white text-xs font-bold">🟨</div>;
                                                case 'substitution':
                                                    return <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white"><FiArrowDown size={14} /></div>;
                                                case 'kickoff':
                                                    return <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs">⚪</div>;
                                                default:
                                                    return <div className="w-6 h-6 rounded-full bg-gray-300"></div>;
                                            }
                                        };

                                        return (
                                            <div key={idx} className={`flex items-center gap-4 ${isHome ? 'flex-row' : 'flex-row-reverse'}`}>
                                                <div className={`flex-1 ${isHome ? 'text-right pr-4' : 'text-left pl-4'}`}>
                                                    <div className="text-sm font-medium text-gray-900">{event.description}</div>
                                                    {event.player && <div className="text-xs text-gray-600">{event.player}</div>}
                                                    {event.playerOut && (
                                                        <div className="text-xs text-gray-600">
                                                            <FiArrowDown className="inline mr-1" size={12} />
                                                            {event.playerOut} <FiArrowUp className="inline mx-1" size={12} /> {event.playerIn}
                                                        </div>
                                                    )}
                                                    {event.score && <div className="text-xs font-semibold text-green-600 mt-1">{event.score}</div>}
                                                </div>
                                                <div className="relative z-10">
                                                    {getEventIcon()}
                                                </div>
                                                <div className={`flex-1 ${isHome ? 'text-left pl-4' : 'text-right pr-4'}`}>
                                                    <div className="text-sm font-semibold text-gray-700">{event.time}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'players' && (
                        <div className="bg-white">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Player Statistics</h3>
                                <span className="text-xs text-gray-500 italic bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                                    Note: Static data - Work in progress
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Player</th>
                                            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Position</th>
                                            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Goals</th>
                                            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Assists</th>
                                            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Shots</th>
                                            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Passes</th>
                                            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Pass %</th>
                                            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Tackles</th>
                                            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Rating</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {playerStats.map((player, idx) => (
                                            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                <td className="py-3 px-4">
                                                    <div className="font-medium text-gray-900">{player.name}</div>
                                                </td>
                                                <td className="py-3 px-4 text-center text-sm text-gray-600">{player.position}</td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className="font-semibold text-gray-900">{player.goals}</span>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className="font-semibold text-gray-900">{player.assists}</span>
                                                </td>
                                                <td className="py-3 px-4 text-center text-sm text-gray-600">{player.shots}</td>
                                                <td className="py-3 px-4 text-center text-sm text-gray-600">{player.passes}</td>
                                                <td className="py-3 px-4 text-center text-sm text-gray-600">{player.passAccuracy}%</td>
                                                <td className="py-3 px-4 text-center text-sm text-gray-600">{player.tackles}</td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className="inline-flex items-center justify-center w-12 h-8 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                                                        {player.rating}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    
                </div>

                {/* Match Info Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                        {matchData.venue && (
                            <div className="flex items-center gap-2">
                                <FiMapPin size={16} />
                                <span>{matchData.venue}</span>
                            </div>
                        )}
                        {matchData.matchDate && (
                            <div className="flex items-center gap-2">
                                <FiCalendar size={16} />
                                <span>{formatDate(matchData.matchDate)}</span>
                            </div>
                        )}
                        {matchData.level && (
                            <div className="flex items-center gap-2">
                                <FiBarChart2 size={16} />
                                <span>{matchData.level}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PremierLeagueReport;

