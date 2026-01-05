"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getClient } from "@/lib/api/client";
import {
  FiSearch,
  FiMapPin,
  FiCalendar,
  FiX,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";

/* =========================
   Types
========================= */
interface PlayerProfile {
  id: string;
  name: string;
  age?: number;
  position?: string;
  location?: string;
  profileImage?: string;
  createdAt?: string;
  status?: string;
}

/* =========================
   Page
========================= */
export default function ScoutingProfilesPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<PlayerProfile[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const toggleCompare = (id: string) => {
    setCompareList((prev) => {
      if (prev.includes(id)) {
        return prev.filter((pid) => pid !== id);
      }
      if (prev.length === 2) {
        return prev; // hard stop at 2
      }
      return [...prev, id];
    });
  };



  const fetchProfiles = async (cursor?: string | null) => {
    if (cursor) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setError(null); // Clear error on new fetch
    }

    try {
      const client = await getClient();
      const url = cursor
        ? `player?limit=20&cursor=${cursor}`
        : `player?limit=20`;

      const res = await client.get(url);

      // Check if API returned an error status
      if (res.data?.status === 'error' || res.data?.status === 'failed') {
        const errorMessage = res.data?.message || 'Internal Server Error';
        if (!cursor) {
          setError(errorMessage);
          setProfiles([]);
        } else {
          setLoadingMore(false);
        }
        return;
      }

      // Check if response has data
      if (!res.data || (!res.data.data && res.data.status !== 'success')) {
        if (!cursor) {
          setError('Internal Server Error');
          setProfiles([]);
        } else {
          setLoadingMore(false);
        }
        return;
      }

      const normalized: PlayerProfile[] = (res.data?.data || []).map(
        (p: any) => {
          // Get profile image with fallback priority: thumbUrl -> thumbProfileUrl -> thumbNormalUrl -> thumbIconUrl
          const profileImage =
            p.profile?.thumbUrl ||
            p.profile?.thumbProfileUrl ||
            p.profile?.thumbNormalUrl ||
            p.profile?.thumbIconUrl ||
            null;

          return {
            id: p.id,
            name: p.name || "",
            age: p.age,
            position: p.position,
            location: p.location,
            profileImage: profileImage,
            createdAt: p.createdAt,
            status: p.status,
          };
        }
      );

      if (cursor) {
        // Append to existing profiles
        setProfiles(prev => [...prev, ...normalized]);
      } else {
        // Replace profiles on initial load
        setProfiles(normalized);
        setError(null); // Clear error on success
      }

      // Set next cursor from pagination
      setNextCursor(res.data?.pagination?.nextCursor || null);
    } catch (err: any) {
      // Handle network errors and other exceptions
      const errorMessage = err?.response?.data?.message ||
        err?.message ||
        'Internal Server Error - Unable to fetch player profiles';

      if (!cursor) {
        setError(errorMessage);
        setProfiles([]);
      } else {
        // Don't show error for load more, just stop loading
        console.error('Failed to load more profiles', err);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = useCallback(async () => {
    if (loadingMore || !nextCursor) return;
    setLoadingMore(true);
    try {
      const client = await getClient();
      const res = await client.get(`player?limit=20&cursor=${nextCursor}`);

      // Check if API returned an error status
      if (res.data?.status === 'error' || res.data?.status === 'failed') {
        console.error('API returned error status:', res.data?.message);
        setLoadingMore(false);
        return;
      }

      const normalized: PlayerProfile[] = (res.data?.data || []).map(
        (p: any) => {
          const profileImage =
            p.profile?.thumbUrl ||
            p.profile?.thumbProfileUrl ||
            p.profile?.thumbNormalUrl ||
            p.profile?.thumbIconUrl ||
            null;

          return {
            id: p.id,
            name: p.name || "",
            age: p.age,
            position: p.position,
            location: p.location,
            profileImage: profileImage,
            createdAt: p.createdAt,
            status: p.status,
          };
        }
      );

      setProfiles(prev => [...prev, ...normalized]);
      setNextCursor(res.data?.pagination?.nextCursor || null);
    } catch (error: any) {
      console.error('Failed to load more profiles', error);
      // Don't show error for load more, just stop loading
    } finally {
      setLoadingMore(false);
    }
  }, [nextCursor, loadingMore]);

  useEffect(() => {
    fetchProfiles();
  }, []);

  // Reset profiles and cursor when search query changes
  useEffect(() => {
    if (searchQuery) {
      // Filter is handled by filteredProfiles, but we might want to reset pagination
      // For now, we'll keep the current implementation where search filters client-side
    }
  }, [searchQuery]);

  // Infinite scroll handler
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      // Throttle scroll events
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        // Check if user has scrolled near the bottom (within 200px)
        if (
          window.innerHeight + window.scrollY >=
          document.documentElement.offsetHeight - 200
        ) {
          loadMore();
        }
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [loadMore]);

  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) =>
      searchQuery
        ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.position?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location?.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    );
  }, [profiles, searchQuery]);

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 pb-28 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Scouting Profiles ⚽
          </h1>
          <p className="text-base text-gray-400 mt-2">
            Discover and scout talented football players
          </p>
        </div>

        {/* Search */}
        
          <div className="relative py-2 mb-3">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, position, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>
       

        {/* Content */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-24">
            <div className="w-16 h-16 border-4 border-gray-700 border-t-cyan-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-400 font-medium">Loading players...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center py-24">
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 max-w-md w-full">
              <div className="flex items-center justify-center mb-4">
                <FiAlertCircle className="w-16 h-16 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white text-center mb-2">
                Internal Server Error
              </h3>
              <p className="text-gray-400 text-center mb-6">
                {error}
              </p>
              <button
                onClick={() => {
                  setError(null);
                  fetchProfiles();
                }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30 transform hover:scale-105"
              >
                <FiRefreshCw className="w-5 h-5" />
                Retry
              </button>
            </div>
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-24">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full text-center">
              <FiAlertCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                No Players Found
              </h3>
              <p className="text-gray-400">
                {searchQuery
                  ? "No players match your search criteria. Try a different search term."
                  : "No player profiles available at the moment."}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {filteredProfiles.map((profile) => (
              <div
                key={profile.id}
                className="group bg-gray-900 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 overflow-hidden transform hover:-translate-y-1 border border-gray-800 hover:border-purple-500/50 relative flex h-28"
              >
                {/* UNCLAIMED BADGE */}
                {profile.status === "UNCLAIMED" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowClaimModal(true);
                    }}
                    className="absolute top-2 right-2 z-20 px-2 py-0.5 text-xs font-bold rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30 backdrop-blur-sm"
                  >
                    Unclaimed
                  </button>
                )}

                {/* Left Section - Image (30%) */}
                <div className="relative w-[30%] min-w-[100px] flex-shrink-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
                  {/* Decorative pattern */}
                  <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }} />

                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 via-transparent to-cyan-500/0 group-hover:from-purple-600/10 group-hover:to-cyan-500/10 transition-all duration-500" />

                  {/* Player Image */}
                  <img
                    src={profile.profileImage || '/images/default/player_default.PNG'}
                    alt={profile.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/default/player_default.PNG';
                    }}
                  />
                </div>

                {/* Right Section - Info (70%) */}
                <div className="flex-1 flex flex-col p-2 border-l border-gray-800 min-w-0">
                  {/* Top Bar - Name and Position */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0 ">
                      <h4
                        onClick={() => router.push(`/dashboard/scouting-profiles/${profile.id}?tab=profile`)}
                        className="text-base  text-[8px] text-white mb-1 line-clamp-1 cursor-pointer hover:text-cyan-400 transition-colors"
                      >
                        {profile.name}
                      </h4>
                      
                    </div>
                  </div>

                  {/* Location and Age Section - Only show if at least one has data */}
                  {((profile.location && typeof profile.location === 'string' && profile.location.trim() !== '') || (profile.age !== undefined && profile.age !== null)) && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-2 text-[8px] text-gray-400 flex-1 min-w-0">
                        {profile.location && typeof profile.location === 'string' && profile.location.trim() !== '' && (
                          <div className="flex items-center gap-1 min-w-0">
                            <FiMapPin className="w-3 h-3 text-purple-400 flex-shrink-0" />
                            <span className="truncate max-w-[100px]">{profile.location}</span>
                          </div>
                        )}
                        {profile.age !== undefined && profile.age !== null && (
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <FiCalendar className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                            <span>{profile.age}y</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Position Section */}
                  {profile.position && typeof profile.position === 'string' && profile.position.trim() !== 'Unknown' ? (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-gray-400 text-[8px]">Position : </span>
                      <div className="inline-block px-1.5 py-0.2 bg-gradient-to-r from-purple-600/20 to-cyan-500/20 border border-purple-500/30 text-purple-300 text-[10px] rounded backdrop-blur-sm">
                        {profile.position}
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                  {/* Bottom Bar - Compare */}
                  <div className="flex items-center justify-between mt-auto gap-2  ">
                
                    {/* Compare Checkbox */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {/* Compare Checkbox */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCompare(profile.id);
                        }}
                        disabled={
                          compareList.length === 2 &&
                          !compareList.includes(profile.id)
                        }
                        className={`w-3 h-3 rounded border-2 flex items-center justify-center text-[8px] font-bold transition-all flex-shrink-0 backdrop-blur-sm
                          ${compareList.includes(profile.id)
                            ? "bg-gradient-to-r from-purple-600 to-cyan-500 border-transparent text-white shadow-md shadow-purple-500/50"
                            : compareList.length === 2
                              ? "bg-gray-800/50 border-gray-600 text-transparent cursor-not-allowed opacity-50"
                              : "bg-gray-800/50 border-gray-600 text-transparent hover:border-purple-400 hover:bg-gray-700/50"
                          } 
                        `}
                      >
                        ✓
                      </button>
                      <span
                        className={`text-[8px] font-medium transition-colors duration-200 hidden md:block
                          ${compareList.includes(profile.id)
                            ? "text-cyan-400"
                            : compareList.length === 2
                              ? "text-gray-500 cursor-not-allowed"
                              : "text-gray-400 hover:text-purple-400"
                          }
                        `}
                      >
                        Compare
                      </span>
                    </div>
                    <div className="flex items-center gap-1 justify-end flex-1 min-w-0">
                     
                     <button
                       onClick={(e) => {
                         e.stopPropagation();
                         router.push(`/dashboard/scouting-profiles/${profile.id}?tab=profile`);
                       }}
                       className="text-white text-[10px] "
                     >
                       View More
                     </button>
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loading More Indicator */}
        {loadingMore && (
          <div className="flex justify-center items-center py-8 mt-6">
            <div className="w-12 h-12 border-4 border-gray-700 border-t-cyan-500 rounded-full animate-spin"></div>
            <span className="ml-4 text-gray-400 font-medium">Loading more players...</span>
          </div>
        )}

        {/* End of Results Indicator */}
        {!loading && !loadingMore && !nextCursor && filteredProfiles.length > 0 && (
          <div className="text-center py-8 mt-6">
            <p className="text-gray-500 text-sm">No more players to load</p>
          </div>
        )}
      </div>

      {/* CLAIM MODAL */}
      {showClaimModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl shadow-2xl shadow-purple-500/10 max-w-md w-full p-6 relative border border-gray-800">
            <button
              onClick={() => setShowClaimModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <FiX size={20} />
            </button>

            <h2 className="text-2xl font-bold text-white mb-3">
              Claim a Player Profile
            </h2>

            <p className="text-sm text-gray-400 mb-4">
              This player profile has not yet been claimed by the player
              or their official representative.
            </p>

            <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
              <li>Create or log into your account</li>
              <li>Open the player's profile page</li>
              <li>Click <strong className="text-cyan-400">"Claim Profile"</strong></li>
              <li>Complete identity verification</li>
            </ol>

            <p className="mt-4 text-xs text-gray-500">
              False claims will result in permanent suspension.
            </p>
          </div>
        </div>
      )}
      {/* STICKY COMPARE BAR */}
      {compareList.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-purple-900/95 to-cyan-900/95 backdrop-blur-xl border-t border-purple-500/30 shadow-2xl shadow-purple-500/20">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

            {/* Selected players */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-bold text-white">
                Compare:
              </span>

              {compareList.map((id) => {
                const player = profiles.find((p) => p.id === id);
                return (
                  <div
                    key={id}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800/80 rounded-full text-sm font-semibold text-white border border-gray-700 backdrop-blur-sm"
                  >
                    {player?.name}
                    <button
                      onClick={() => toggleCompare(id)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                );
              })}

              {compareList.length === 1 && (
                <span className="text-sm text-gray-300 italic">
                  Select one more player
                </span>
              )}
            </div>

            {/* Compare CTA */}
            <button
              disabled={compareList.length !== 2}
              onClick={() =>
                router.push(
                  `/dashboard/compare?players=${compareList.join(",")}`
                )
              }
              className={`px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg
                ${compareList.length === 2
                  ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white hover:from-purple-700 hover:to-cyan-600 transform hover:scale-105 shadow-purple-500/50"
                  : "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                }
              `}
            >
              Compare Players
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
