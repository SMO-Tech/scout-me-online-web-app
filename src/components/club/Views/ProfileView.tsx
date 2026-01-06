'use client';

import React from 'react';
import { 
  FiMapPin, 
  FiCalendar, 
  FiUsers, 
  FiAward, 
  FiShare2, 
  FiMessageCircle,
  FiMail, 
  FiPhone,
  FiGlobe,
  FiInstagram,
  FiTwitter,
  FiEye
} from "react-icons/fi";

interface ClubData {
  id: string;
  name: string;
  country: string;
  description?: string;
  memberCount?: number;
  viewCount?: number;
  clubId?: number;
  status?: string;
  imageUrl?: string;
  logoUrl?: string;
  profile?: {
    logoUrl?: string;
    thumbUrl?: string | null;
    thumbProfileUrl?: string;
    thumbNormalUrl?: string;
    thumbIconUrl?: string;
  };
  createdAt?: string;
  playerCount?: number;
}

interface ProfileViewProps {
  club: ClubData;
}

export default function ProfileView({ club }: ProfileViewProps) {
  // Format date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      // Handle DD-MM-YYYY format
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const logoUrl = club.logoUrl || club.imageUrl || '/images/default/club_default.PNG';
  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      
      {/* 1. PUBLIC HEADER CARD */}
      <div className="relative overflow-hidden bg-[#1b1c28] border border-[#3b3e4e] rounded-xl shadow-2xl">
        {/* Banner Image */}
        <div className="h-40 bg-gradient-to-r from-purple-900 to-blue-900 relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#1b1c28] to-transparent"></div>
        </div>
        
        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 gap-6">
            
            {/* Club Logo */}
            <div className="w-32 h-32 rounded-2xl bg-[#151720] border-4 border-[#1b1c28] shadow-2xl flex items-center justify-center relative overflow-hidden shrink-0">
              <img
                src={logoUrl}
                alt={club.name}
                className="w-full h-full object-contain p-2"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/default/club_default.PNG';
                }}
              />
            </div>

            {/* Club Info */}
            <div className="flex-1 pt-2 w-full">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-white mb-2">{club.name}</h1>
                    {club.status && (
                      <p className="text-gray-400 text-sm mb-3">
                        Status: <span className={`font-semibold ${club.status === 'CLAIMED' ? 'text-green-400' : 'text-yellow-400'}`}>
                          {club.status}
                        </span>
                      </p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-400">
                        {club.country && (
                          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#252834] border border-[#3b3e4e]">
                            <FiMapPin className="text-purple-400" /> {club.country}
                          </span>
                        )}
                        {club.createdAt && (
                          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#252834] border border-[#3b3e4e]">
                            <FiCalendar className="text-blue-400" /> Est. {formatDate(club.createdAt)}
                          </span>
                        )}
                        {club.memberCount !== undefined && (
                          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#252834] border border-[#3b3e4e]">
                            <FiUsers className="text-cyan-400" /> {club.memberCount} Members
                          </span>
                        )}
                        {club.viewCount !== undefined && (
                          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#252834] border border-[#3b3e4e]">
                            <FiEye className="text-green-400" /> {club.viewCount} Views
                          </span>
                        )}
                    </div>
                </div>
                
                {/* Public Actions (Contact/Share) */}
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-[#252834] border border-[#3b3e4e] text-gray-300 rounded-lg hover:text-white hover:border-gray-500 transition text-sm font-bold flex items-center gap-2">
                        <FiShare2 /> Share
                    </button>
                    <button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-bold shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center gap-2">
                        <FiMessageCircle /> Contact Club
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          
          {/* LEFT COLUMN: ABOUT & SQUAD */}
          <div className="space-y-6">
              
              {/* 2. ABOUT US (Public Description) */}
              <div className="bg-[#1b1c28] border border-[#3b3e4e] rounded-xl p-8 shadow-lg">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      About Us
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-base mb-8">
                      {club.description || 'No description available for this club.'}
                  </p>
                  
                  {/* Key Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {club.country && (
                        <div className="p-4 bg-[#252834]/50 rounded-xl border border-[#3b3e4e] flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                               <FiMapPin size={20} />
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Country</span>
                                <p className="text-white font-bold">{club.country}</p>
                            </div>
                        </div>
                      )}
                      {club.memberCount !== undefined && (
                        <div className="p-4 bg-[#252834]/50 rounded-xl border border-[#3b3e4e] flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                               <FiUsers size={20} />
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Members</span>
                                <p className="text-white font-bold">{club.memberCount}</p>
                            </div>
                        </div>
                      )}
                  </div>
              </div>

          </div>

          {/* RIGHT COLUMN: STATS & CONTACT */}
          <div className="space-y-6">
              
              {/* 4. CLUB HONORS / STATS */}
              <div className="bg-[#1b1c28] border border-[#3b3e4e] rounded-xl p-6 shadow-lg">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Club Achievements</h3>
                  
                  <div className="space-y-4">
                      {/* Club ID */}
                      {club.clubId && (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                                  <FiAward />
                                </div>
                                <span className="text-sm text-gray-300 font-medium">Club ID</span>
                            </div>
                            <span className="font-bold text-white">#{club.clubId}</span>
                        </div>
                      )}

                      {/* Members */}
                      {club.memberCount !== undefined && (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center text-blue-500">
                                  <FiUsers />
                                </div>
                                <span className="text-sm text-gray-300 font-medium">Total Members</span>
                            </div>
                            <span className="font-bold text-white">{club.memberCount}</span>
                        </div>
                      )}

                      {/* Views */}
                      {club.viewCount !== undefined && (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-green-500/10 flex items-center justify-center text-green-500">
                                  <FiEye />
                                </div>
                                <span className="text-sm text-gray-300 font-medium">Total Views</span>
                            </div>
                            <span className="font-bold text-white">{club.viewCount}</span>
                        </div>
                      )}
                  </div>
              </div>

              {/* 5. CLUB INFO */}
              <div className="bg-[#1b1c28] border border-[#3b3e4e] rounded-xl p-6 shadow-lg">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Club Information</h3>
                  
                  <div className="space-y-4 mb-6">
                      {club.country && (
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                            <FiMapPin className="text-purple-500" /> {club.country}
                        </div>
                      )}
                      {club.createdAt && (
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                            <FiCalendar className="text-blue-500" /> Founded: {formatDate(club.createdAt)}
                        </div>
                      )}
                      {club.status && (
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                            <FiAward className="text-yellow-500" /> Status: <span className={`font-semibold ${club.status === 'CLAIMED' ? 'text-green-400' : 'text-yellow-400'}`}>{club.status}</span>
                        </div>
                      )}
                  </div>
              </div>

          </div>
      </div>
    </div>
  );
}
