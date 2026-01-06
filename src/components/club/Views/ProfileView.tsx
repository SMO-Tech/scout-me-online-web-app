'use client';

import React, { useState } from 'react';
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
  FiEye,
  FiCopy,
  FiX,
  FiFacebook
} from "react-icons/fi";
import toast from 'react-hot-toast';
import { createClubUrl } from '@/lib/utils/slug';

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
  const [showShareModal, setShowShareModal] = useState(false);

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
  
  // Get current URL
  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return '';
  };

  const getShareText = () => {
    return `Check out ${club.name}${club.country ? ` from ${club.country}` : ''} on ScoutMe.cloud!`;
  };

  // Copy URL to clipboard
  const copyToClipboard = async () => {
    try {
      const url = getShareUrl();
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
      setShowShareModal(false);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  // Web Share API (mobile)
  const shareNative = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${club.name} - Football Club`,
          text: getShareText(),
          url: getShareUrl(),
        });
        setShowShareModal(false);
      } else {
        // Fallback to copy if Web Share API not available
        copyToClipboard();
      }
    } catch (err) {
      // User cancelled or error occurred
      if ((err as Error).name !== 'AbortError') {
        toast.error('Failed to share');
      }
    }
  };

  // Share on Twitter
  const shareTwitter = () => {
    const text = encodeURIComponent(getShareText());
    const url = encodeURIComponent(getShareUrl());
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    setShowShareModal(false);
  };

  // Share on Facebook
  const shareFacebook = () => {
    const url = encodeURIComponent(getShareUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    setShowShareModal(false);
  };

  // Share on LinkedIn
  const shareLinkedIn = () => {
    const url = encodeURIComponent(getShareUrl());
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    setShowShareModal(false);
  };

  // Share via Email
  const shareEmail = () => {
    const subject = encodeURIComponent(`${club.name} - Football Club Profile`);
    const body = encodeURIComponent(`${getShareText()}\n\n${getShareUrl()}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setShowShareModal(false);
  };
  return (
    <div className="space-y-6 animate-fadeIn pb-10">

      {/* 1. PUBLIC HEADER CARD */}
      <div className="relative overflow-hidden bg-[#1b1c28] border border-[#3b3e4e] rounded-xl shadow-2xl">
        {/* Banner Image */}
        <div className="h-32 bg-gradient-to-r from-purple-900 to-blue-900 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#1b1c28] to-transparent"></div>
        </div>
        
        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 gap-6">
            <div>
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
                  {/* Club Name */}
                  
            </div>


            {/* Club Info */}
            <div className="flex-1 pt-2 w-full">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                  <h1 className="text-4xl font-extrabold text-white mb-2 mt-4 pt-4">{club.name}</h1>
                  
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
                  <button 
                    onClick={() => setShowShareModal(true)}
                    className="px-5 py-2.5 bg-[#252834] border border-[#3b3e4e] text-gray-300 rounded-lg hover:text-white hover:border-gray-500 transition text-sm font-bold flex items-center gap-2"
                  >
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

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1b1c28] border border-[#3b3e4e] rounded-2xl shadow-2xl max-w-md w-full">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#3b3e4e] flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Share Club Profile</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Share Options */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Native Share (Mobile) */}
                {typeof navigator !== 'undefined' && 'share' in navigator && (
                  <button
                    onClick={shareNative}
                    className="flex flex-col items-center gap-2 p-4 bg-[#252834] border border-[#3b3e4e] rounded-xl hover:bg-[#2d2f3e] hover:border-purple-500/50 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FiShare2 className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-white">Share</span>
                  </button>
                )}

                {/* Copy Link */}
                <button
                  onClick={copyToClipboard}
                  className="flex flex-col items-center gap-2 p-4 bg-[#252834] border border-[#3b3e4e] rounded-xl hover:bg-[#2d2f3e] hover:border-purple-500/50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FiCopy className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-white">Copy Link</span>
                </button>

                {/* Twitter */}
                <button
                  onClick={shareTwitter}
                  className="flex flex-col items-center gap-2 p-4 bg-[#252834] border border-[#3b3e4e] rounded-xl hover:bg-[#2d2f3e] hover:border-blue-400/50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FiTwitter className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-white">Twitter</span>
                </button>

                {/* Facebook */}
                <button
                  onClick={shareFacebook}
                  className="flex flex-col items-center gap-2 p-4 bg-[#252834] border border-[#3b3e4e] rounded-xl hover:bg-[#2d2f3e] hover:border-blue-600/50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FiFacebook className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-white">Facebook</span>
                </button>

                {/* LinkedIn */}
                <button
                  onClick={shareLinkedIn}
                  className="flex flex-col items-center gap-2 p-4 bg-[#252834] border border-[#3b3e4e] rounded-xl hover:bg-[#2d2f3e] hover:border-blue-500/50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-white">LinkedIn</span>
                </button>

                {/* Email */}
                <button
                  onClick={shareEmail}
                  className="flex flex-col items-center gap-2 p-4 bg-[#252834] border border-[#3b3e4e] rounded-xl hover:bg-[#2d2f3e] hover:border-gray-500/50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FiMail className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-white">Email</span>
                </button>
              </div>

              {/* Share URL Display */}
              <div className="mt-6 p-4 bg-[#252834] border border-[#3b3e4e] rounded-xl">
                <p className="text-xs text-gray-400 mb-2">Share URL:</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={getShareUrl()}
                    className="flex-1 px-3 py-2 bg-[#1b1c28] border border-[#3b3e4e] rounded-lg text-white text-sm"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition text-sm font-semibold flex items-center gap-2"
                  >
                    <FiCopy className="w-4 h-4" />
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
