"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getClient } from '@/lib/api/client';
import { 
    FiLoader, FiAlertTriangle, FiCalendar, FiMapPin, FiLayers, 
    FiVideo, FiList, FiTrendingUp, FiSettings, // FiSettings is now correctly used from here
    FiArrowLeft
} from 'react-icons/fi';
import { useRouter } from "next/navigation";

// ============================================================================
// 1. INTERFACES (Matching the full Prisma query response)
// ============================================================================
interface CanonicalClub { id: string; logoUrl: string | null; }

export interface MatchPlayerStats {
    goals: number; assists: number; shots: number; shotsOnTarget: number;
    passes: number; passAccuracy: number | null; tackles: number;
    yellowCards: number; redCards: number; minutesPlayed: number | null;
}
interface PlayerProfile {
    firstName: string; lastName: string; country: string;
    primaryPosition: string; avatar: string | null;
}
export interface MatchPlayer {
    id: string; jerseyNumber: number; position: string;
    playerProfile: PlayerProfile; stats: MatchPlayerStats | null;
}
export interface MatchResultData {
    homeScore: number; awayScore: number; homePossession: number | null; 
    awayPossession: number | null; homeShots: number | null; awayShots: number | null;
}
export interface MatchClubData {
    id: string; name: string; country: string; jerseyColor: string | null;
    isUsersTeam: boolean; club: CanonicalClub | null;
}
interface Uploader { name: string; }

export interface MatchDetail {
    id: string; videoUrl: string; status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED"; 
    level: string; matchDate: string | null; competitionName: string | null; venue: string | null;
    createdAt: string; 
    matchClubs: MatchClubData[]; matchPlayers: MatchPlayer[];
    result: MatchResultData | null; user: Uploader;
}

// ============================================================================
// 2. UTILITY FUNCTIONS
// ============================================================================

const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "TBD";
    return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const getTeams = (matchClubs: MatchClubData[]) => {
    return {
        home: matchClubs.find(c => c.isUsersTeam),
        away: matchClubs.find(c => !c.isUsersTeam),
    };
};

const getInitials = (name: string): string => {
    const parts = name.split(' ').filter(p => p.length > 0);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    if (parts.length === 1) {
        return parts[0].substring(0, 2).toUpperCase();
    }
    return 'CL'; // Default fallback
};

/**
 * Extracts YouTube video ID from various YouTube URLs.
 * @param url The full YouTube URL.
 * @returns The video ID or null.
 */
const getYouTubeId = (url: string | undefined): string | null => {
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
        // If URL parsing fails, check for common ID patterns
        const match = url.match(/v=([a-zA-Z0-9_-]+)/) || url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
        if (match) return match[1];
    }
    return null;
};

// ============================================================================
// 3. CORE COMPONENTS
// ============================================================================

// Match Score Header (Unchanged Logic)
interface MatchScoreHeaderProps {
    homeTeam: MatchClubData | undefined;
    awayTeam: MatchClubData | undefined;
    result: MatchResultData | null;
    matchData: MatchDetail;
}

const MatchScoreHeader: React.FC<MatchScoreHeaderProps> = ({ homeTeam, awayTeam, result, matchData }) => {
    const homeName = homeTeam?.name || 'Home Team';
    const awayName = awayTeam?.name || 'Opponent';
    const homeInitials = getInitials(homeName);
    const awayInitials = getInitials(awayName);
    
    const homeScore = result?.homeScore ?? '-';
    const awayScore = result?.awayScore ?? '-';

    const renderTeamBadge = (team: MatchClubData | undefined, name: string, initials: string) => (
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full mb-1 sm:mb-2 flex items-center justify-center text-purple-700 font-bold overflow-hidden border-2 border-purple-300">
            {team?.club?.logoUrl ? (
                <img src={team.club.logoUrl} alt={name} className="w-full h-full object-cover" /> 
            ) : (
                <span className="text-sm sm:text-lg">{initials}</span>
            )}
        </div>
    );

    return (
        <header className="mb-8 p-4 sm:p-6 bg-white rounded-xl shadow-2xl border-b-4 border-purple-600">
            
            {/* Row 1: Competition and Level */}
            <div className="flex justify-between items-start mb-3 border-b pb-2 sm:pb-3">
                <p className="text-xs sm:text-sm font-semibold uppercase text-purple-600">
                    {matchData.competitionName || 'Match Analysis'}
                </p>
                <div className="text-right flex items-center gap-2">
                     <FiLayers className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                    <p className="text-xs sm:text-sm font-medium text-gray-700">{matchData.level.replace('_', ' ')}</p>
                </div>
            </div>

            {/* Row 2: Matchup and Score (Responsive) */}
            <div className="flex flex-col sm:flex-row items-center justify-between my-4 sm:my-6">
                
                {/* Home Team */}
                <div className="flex flex-col items-center flex-1 text-center pr-0 sm:pr-4 order-1 sm:order-none mb-4 sm:mb-0">
                    {renderTeamBadge(homeTeam, homeName, homeInitials)}
                    <h1 className="text-lg sm:text-2xl font-extrabold text-gray-900 truncate max-w-full">{homeName}</h1>
                    <p className="text-xs sm:text-sm text-gray-500">{homeTeam?.country}</p> 
                </div>

                {/* Score Block */}
                <div className="flex-shrink-0 text-center mx-0 sm:mx-6 order-2 sm:order-none">
                    <p className="text-5xl sm:text-7xl font-black text-purple-700">
                        {homeScore} - {awayScore}
                    </p>
                </div>

                {/* Away Team */}
                <div className="flex flex-col items-center flex-1 text-center pl-0 sm:pl-4 order-3 sm:order-none mt-4 sm:mt-0">
                    {renderTeamBadge(awayTeam, awayName, awayInitials)}
                    <h1 className="text-lg sm:text-2xl font-extrabold text-gray-900 truncate max-w-full">{awayName}</h1>
                    <p className="text-xs sm:text-sm text-gray-500">{awayTeam?.country}</p> 
                </div>
            </div>

            {/* Row 3: Metadata (Responsive Wrap) */}
            <div className="flex flex-wrap justify-center gap-y-2 gap-x-6 sm:gap-10 mt-6 text-xs sm:text-sm text-gray-700 border-t pt-3">
                <div className="flex items-center gap-2">
                    <FiCalendar className="w-4 h-4 text-purple-600" />
                    <span>{formatDate(matchData.matchDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                    <FiMapPin className="w-4 h-4 text-purple-600" />
                    <span>{matchData.venue || 'Venue TBD'}</span>
                </div>
                 <div className="text-xs text-gray-500 flex items-center gap-1">
                    <span>Uploaded by:</span>
                    <span className="font-semibold text-gray-700">{matchData.user?.name || 'N/A'}</span> 
                </div>
            </div>
        </header>
    );
};

// YouTube Iframe Component
const YouTubeIframe: React.FC<{ videoId: string }> = ({ videoId }) => (
    <iframe
        className="w-full h-full rounded-lg shadow-xl"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=0`}
        title="Match Video Analysis"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
    />
);


// Coming Soon Stats (Simplified UI)
interface ComingSoonProps {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
}

const ComingSoonStats: React.FC<ComingSoonProps> = ({ title, icon: Icon }) => (
    <div className="bg-white p-6 rounded-xl shadow border-2 border-gray-100">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-purple-700 flex items-center gap-2">
            <Icon className="w-5 h-5 text-purple-600" /> {title}
        </h2>
        <div className="text-center py-8">
            <FiSettings className="w-10 h-10 text-gray-400 mx-auto animate-spin mb-4" />
            <p className="text-lg font-medium text-gray-700">Stats Analysis Commencing Soon</p>
            <p className="text-sm text-gray-500 mt-1">Full detailed metrics will appear here once processing is complete.</p>
        </div>
    </div>
);


// ============================================================================
// 5. MAIN PAGE COMPONENT
// ============================================================================

const MatchDetailPage = () => {
  const params = useParams();
  const matchId = params.id as string; 

  const [matchData, setMatchData] = useState<MatchDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!matchId) return;

    const fetchMatchDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Ensure getClient is awaited if it returns a promise
        const client = await getClient(); 
        const response = await client.get(`/match/${matchId}`);
        console.log(response.data)
        
        setMatchData(response.data.data as MatchDetail);

      } catch (err: any) {
        console.error("Failed to fetch match details:", err);
        const errorMessage = err.response?.data?.error || err.message || "Unknown error occurred.";
        setError(errorMessage);
        setMatchData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchDetails();
  }, [matchId]);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <FiLoader className="w-8 h-8 animate-spin text-purple-600" />
        <p className="ml-3 text-lg text-gray-600">Loading match analysis...</p>
      </div>
    );
  }

  if (error || !matchData) {
    return (
        <div className="p-8 text-center bg-white rounded-lg shadow-md border-l-4 border-red-500 max-w-lg mx-auto mt-20">
            <FiAlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <h1 className="text-xl font-bold text-gray-800 mb-2">Error Loading Match Analysis</h1>
            <p className="text-gray-600">{error || "Match analysis data not found."}</p>
        </div>
    );
  }
  
  // Data Preprocessing: Separate teams
  const { home: homeTeam, away: awayTeam } = getTeams(matchData.matchClubs);
  const youtubeId = getYouTubeId(matchData.videoUrl);

  const router = useRouter()

  // --- Display Content ---
  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Back */}
                <button
                  onClick={() => router.push("/dashboard/matches")}
                  className="flex items-center gap-2 text-purple-600 mb-6"
                >
                  <FiArrowLeft /> Back to Matches
                </button>
        
        {/* 1. Match Score Header */}
        <MatchScoreHeader 
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            result={matchData.result}
            matchData={matchData}
        />

        {/* 2. Detailed Content Blocks */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                
                {/* A. Match Video Player */}
                <div className="bg-white p-4 rounded-xl shadow">
                    <h2 className="text-2xl font-semibold mb-4 text-purple-700 flex items-center gap-2">
                        <FiVideo className="w-6 h-6" /> Match Video
                    </h2>
                    <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                        {youtubeId ? (
                             <YouTubeIframe videoId={youtubeId} />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-white/70">
                                <FiVideo className="w-10 h-10 mb-2" />
                                <p>Video player unavailable or invalid URL.</p>
                                <p className="text-xs mt-1">Source: {matchData.videoUrl}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* B. Team Summary Metrics (Placeholder) */}
                <ComingSoonStats 
                    title="Team Summary Metrics"
                    icon={FiTrendingUp}
                />

                 {/* C. Player Detailed Stats Table (Placeholder) */}
                <ComingSoonStats 
                    title="Player Performance Table"
                    icon={FiList}
                />
            </div>

            {/* D. Roster Sidebar */}
          <aside className="lg:col-span-1 bg-white p-6 rounded-xl shadow h-fit lg:sticky top-8">
                <h2 className="text-2xl font-semibold mb-4 border-b pb-2 text-purple-700">
                    {homeTeam?.name || 'Home Team'} Roster
                </h2>
                <ul className="divide-y divide-gray-100">
                    {/* Fallback check for empty roster */}
                    {matchData.matchPlayers.length === 0 && (
                        <li className="py-4 text-center text-gray-500 text-sm">
                            No player roster data available for this match.
                        </li>
                    )}
                    
                    {matchData.matchPlayers.map((player) => (
                        // Ensure key is safe
                        <li key={player.id || `${player.jerseyNumber}-${player.playerProfile?.firstName || ''}`} className="py-3 flex justify-between items-center text-gray-700">
                           <div className="flex items-center">
                                <span className="font-bold text-lg text-purple-600 mr-3 w-6 text-right">#{player.jerseyNumber}</span>
                                <div>
                                    {/* FIX: Use optional chaining for safe access */}
                                    <p className="font-semibold">
                                        {player.playerProfile?.firstName} {player.playerProfile?.lastName}
                                    </p>
                                    <p className="text-xs text-gray-500">{player.position}</p>
                                </div>
                           </div>
                           {/* Display quick stats if available */}
                           {player.stats && (
                                <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded-full">
                                    {player.stats.goals}G / {player.stats.assists}A
                                </span>
                           )}
                        </li>
                    ))}
                </ul>
            </aside>
        </section>

      </div>
    </div>
  )
}

export default MatchDetailPage;