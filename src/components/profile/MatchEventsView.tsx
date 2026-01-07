'use client';

import { useState, useEffect } from 'react';
import { FiVideo, FiCalendar, FiExternalLink, FiClock, FiAlertCircle, FiRefreshCw, FiLayers } from 'react-icons/fi';
import { getClient } from '@/lib/api/client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Match {
  id: string;
  userId: string;
  videoUrl: string | null;
  lineUpImage: string | null;
  status: string;
  level: string;
  matchDate: string | null;
  competitionName: string | null;
  venue: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function MatchEventsView() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);

    try {
      const client = await getClient();
      const response = await client.get('/match/my-matches');

      if (response.data?.status === 'success' && response.data?.data) {
        setMatches(response.data.data || []);
      } else {
        setError('Failed to fetch matches');
      }
    } catch (err: any) {
      console.error('Failed to fetch matches:', err);
      const errorMessage = err?.response?.data?.message || err.message || 'Failed to load matches';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  const formatLevel = (level: string) => {
    return level.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
      case 'PROCESSING':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      case 'COMPLETED':
        return 'bg-green-500/10 border-green-500/30 text-green-400';
      case 'FAILED':
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      default:
        return 'bg-gray-500/10 border-gray-500/30 text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="w-12 h-12 border-2 border-purple-700 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400">Loading matches...</p>
      </div>
    );
  }

  if (error && matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <FiAlertCircle className="text-red-400" size={48} />
        <p className="text-red-400 text-lg font-semibold">{error}</p>
        <button
          onClick={fetchMatches}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <FiRefreshCw size={18} />
          Retry
        </button>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <FiVideo className="text-gray-500" size={64} />
        <h3 className="text-xl font-bold text-white">No Matches Found</h3>
        <p className="text-gray-400 text-center max-w-md">
          You haven't uploaded any matches yet. Start by uploading your first match video!
        </p>
        <button
          onClick={() => router.push('/dashboard/form')}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white rounded-lg transition-all"
        >
          Upload Match
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">My Match Events</h2>
          <p className="text-gray-400 text-sm mt-1">View and manage all your uploaded matches</p>
        </div>
        <button
          onClick={fetchMatches}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors flex items-center gap-2"
        >
          <FiRefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map((match) => (
          <div
            key={match.id}
            className="bg-gradient-to-br from-[#0d1117] to-[#161b22] border border-purple-500/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all cursor-pointer group"
            onClick={() => router.push(`/dashboard/matches/${match.id}`)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <FiVideo className="text-purple-400" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Match #{match.id.slice(0, 8)}</h3>
                  <p className="text-gray-500 text-xs">{formatDate(match.createdAt)}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(match.status)}`}>
                {match.status}
              </span>
            </div>

            {/* Level Badge */}
            {match.level && (
              <div className="mb-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-lg text-xs font-semibold">
                  <FiLayers size={12} />
                  {formatLevel(match.level)}
                </span>
              </div>
            )}

            {/* Match Details */}
            <div className="space-y-3">
              {match.matchDate && (
                <div className="flex items-center gap-2 text-sm">
                  <FiCalendar className="text-gray-500" size={16} />
                  <span className="text-gray-400">Match Date:</span>
                  <span className="text-white">{formatDate(match.matchDate)}</span>
                </div>
              )}

              {match.competitionName && (
                <div className="flex items-center gap-2 text-sm">
                  <FiLayers className="text-gray-500" size={16} />
                  <span className="text-gray-400">Competition:</span>
                  <span className="text-white truncate">{match.competitionName}</span>
                </div>
              )}

              {match.venue && (
                <div className="flex items-center gap-2 text-sm">
                  <FiCalendar className="text-gray-500" size={16} />
                  <span className="text-gray-400">Venue:</span>
                  <span className="text-white">{match.venue}</span>
                </div>
              )}

              {match.videoUrl && (
                <div className="flex items-center gap-2 text-sm">
                  <FiVideo className="text-gray-500" size={16} />
                  <a
                    href={match.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
                  >
                    View Video
                    <FiExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Created {formatDate(match.createdAt)}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/dashboard/matches/${match.id}`);
                }}
                className="text-purple-400 hover:text-purple-300 text-sm font-semibold transition-colors flex items-center gap-1"
              >
                View Details
                <FiExternalLink size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Total Matches</p>
            <p className="text-white text-2xl font-bold">{matches.length}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm">Pending</p>
            <p className="text-yellow-400 text-2xl font-bold">
              {matches.filter(m => m.status === 'PENDING').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

