'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FiMapPin, FiCalendar, FiUser, FiFilter } from 'react-icons/fi';
import { createPlayerUrl } from '@/lib/utils/slug';

interface ClubMember {
  id: string;
  name: string;
  position: string;
  location: string;
  age: number | null;
  imageUrl: string | null;
  profile?: {
    thumbUrl?: string | null;
    thumbProfileUrl?: string | null;
    thumbNormalUrl?: string | null;
    thumbIconUrl?: string | null;
  };
}

interface MembersViewProps {
  members: ClubMember[];
}

export default function MembersView({ members }: MembersViewProps) {
  const router = useRouter();
  const [selectedPosition, setSelectedPosition] = useState<string>('All');

  // Extract unique positions from members
  const availablePositions = useMemo(() => {
    const positions = members
      .map(m => m.position)
      .filter(pos => pos && pos !== 'Unknown' && pos.trim() !== '')
      .filter((pos, index, self) => self.indexOf(pos) === index)
      .sort();
    return ['All', ...positions];
  }, [members]);

  // Filter members by selected position
  const filteredMembers = useMemo(() => {
    if (selectedPosition === 'All') {
      return members;
    }
    return members.filter(member => 
      member.position && 
      member.position !== 'Unknown' && 
      member.position === selectedPosition
    );
  }, [members, selectedPosition]);

  // Get profile image with fallback priority
  const getProfileImage = (member: ClubMember): string => {
    return (
      member.profile?.thumbProfileUrl ||
      member.profile?.thumbNormalUrl ||
      member.profile?.thumbIconUrl ||
      member.imageUrl ||
      '/images/default/player_default.PNG'
    );
  };

  // Get initials for fallback
  const getInitials = (name: string): string => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (members.length === 0) {
    return (
      <div className="space-y-6 animate-fadeIn pb-10">
        <div className="bg-[#1b1c28] border border-[#3b3e4e] rounded-xl p-12 shadow-lg text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
            <FiUser className="w-10 h-10 text-cyan-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Members Yet</h3>
          <p className="text-gray-400">This club doesn't have any members at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      {/* Header */}
      <div className="bg-[#1b1c28] border border-[#3b3e4e] rounded-xl p-6 shadow-lg">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Club Members</h2>
            <p className="text-gray-400 text-sm">
              Showing {filteredMembers.length} of {members.length} {members.length === 1 ? 'member' : 'members'}
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <FiFilter className="w-4 h-4" />
              <span className="font-medium">Filter by Position:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {availablePositions.map((position) => (
                <button
                  key={position}
                  onClick={() => setSelectedPosition(position)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    selectedPosition === position
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md shadow-purple-500/30'
                      : 'bg-[#252834] border border-[#3b3e4e] text-gray-300 hover:bg-[#2d2f3e] hover:border-purple-500/50'
                  }`}
                >
                  {position}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {filteredMembers.length === 0 ? (
          <div className="col-span-full bg-[#1b1c28] border border-[#3b3e4e] rounded-xl p-12 text-center">
            <FiUser className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No Members Found</h3>
            <p className="text-gray-400">No members found for the selected position filter.</p>
          </div>
        ) : (
          filteredMembers.map((member) => {
          const profileImage = getProfileImage(member);
          const hasId = member.id && member.id.trim() !== '';

          return (
            <div
              key={member.id || Math.random()}
              className={`group bg-gray-900 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 overflow-hidden transform hover:-translate-y-1 border border-gray-800 hover:border-purple-500/50 relative flex h-28 ${
                !hasId ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'
              }`}
              onClick={() => {
                if (hasId) {
                  router.push(`${createPlayerUrl(member.name, member.id)}?tab=profile`);
                }
              }}
            >
              {/* Left Section - Image (30%) */}
              <div className="relative w-[30%] min-w-[100px] flex-shrink-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
                {/* Decorative pattern */}
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                />

                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 via-transparent to-cyan-500/0 group-hover:from-purple-600/10 group-hover:to-cyan-500/10 transition-all duration-500" />

                {/* Member Image */}
                <img
                  src={profileImage}
                  alt={member.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/default/player_default.PNG';
                  }}
                />
              </div>

              {/* Right Section - Info (70%) */}
              <div className="flex-1 flex flex-col p-2 border-l border-gray-800 min-w-0">
                {/* Top Bar - Name */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h4
                      onClick={(e) => {
                        e.stopPropagation();
                        if (hasId) {
                          router.push(`${createPlayerUrl(member.name, member.id)}?tab=profile`);
                        }
                      }}
                      className="text-base text-[8px] text-white mb-1 line-clamp-1 cursor-pointer hover:text-cyan-400 transition-colors"
                    >
                      {member.name || 'Unknown Player'}
                    </h4>
                  </div>
                </div>

                {/* Location and Age Section */}
                {((member.location && member.location !== 'Unknown') || (member.age !== null && member.age !== undefined)) && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-2 text-[8px] text-gray-400 flex-1 min-w-0">
                      {member.location && member.location !== 'Unknown' && (
                        <div className="flex items-center gap-1 min-w-0">
                          <FiMapPin className="w-3 h-3 text-purple-400 flex-shrink-0" />
                          <span className="truncate max-w-[100px]">{member.location}</span>
                        </div>
                      )}
                      {member.age !== null && member.age !== undefined && (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <FiCalendar className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                          <span>{member.age}y</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Position Section */}
                {member.position && member.position !== 'Unknown' ? (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-gray-400 text-[8px]">Position : </span>
                    <div className="inline-block px-1.5 py-0.2 bg-gradient-to-r from-purple-600/20 to-cyan-500/20 border border-purple-500/30 text-purple-300 text-[10px] rounded backdrop-blur-sm">
                      {member.position}
                    </div>
                  </div>
                ) : (
                  <></>
                )}

                {/* Bottom Bar - View More */}
                <div className="flex items-center justify-between mt-auto gap-2">
                  <div className="flex items-center gap-1 justify-end flex-1 min-w-0">
                    {hasId && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`${createPlayerUrl(member.name, member.id)}?tab=profile`);
                        }}
                        className="text-white text-[10px] hover:text-cyan-400 transition-colors"
                      >
                        View More
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })
        )}
      </div>
    </div>
  );
}

