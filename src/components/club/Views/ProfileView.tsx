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
  FiTwitter
} from "react-icons/fi";

// --- MOCK DATA (Public Info) ---
const CLUB_PROFILE = {
  name: "Scouting United FC",
  tagline: "Developing the future of football through data.",
  founded: "2018",
  location: "London, UK",
  stadium: "The Data Arena",
  manager: "Alex Ferguson AI",
  website: "www.scoutingunited.com",
  description: "Scouting United FC is a premier academy focused on technical excellence and tactical intelligence. Founded in 2018, we have quickly established ourselves as a regional powerhouse, utilizing advanced analytics to develop the next generation of talent.",
  email: "contact@scoutingunited.com",
  phone: "+44 20 7123 4567",
  stats: {
    members: 24,
    matches: 142,
    trophies: 3,
    ranking: "#4 Regional"
  }
};

const SQUAD_MEMBERS = [
  { id: 1, name: "Kleanthus Pieri", role: "Forward", number: 10 },
  { id: 2, name: "Panagiotis C.", role: "Midfielder", number: 8 },
  { id: 3, name: "Kylian Mbappé", role: "Winger", number: 7 },
  { id: 4, name: "Pelé", role: "Legend", number: 10 },
  { id: 5, name: "Diego", role: "Midfielder", number: 6 },
  { id: 6, name: "Zinedine Zidane", role: "Coach", number: null },
];

export default function ProfileView() {
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
               <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-blue-400 tracking-tighter">
                  SU
               </div>
            </div>

            {/* Club Info */}
            <div className="flex-1 pt-2 w-full">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-white mb-2">{CLUB_PROFILE.name}</h1>
                    <p className="text-gray-400 text-sm mb-3">{CLUB_PROFILE.tagline}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-400">
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#252834] border border-[#3b3e4e]">
                            <FiMapPin className="text-purple-400" /> {CLUB_PROFILE.location}
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#252834] border border-[#3b3e4e]">
                            <FiCalendar className="text-blue-400" /> Est. {CLUB_PROFILE.founded}
                        </span>
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
                      {CLUB_PROFILE.description}
                  </p>
                  
                  {/* Key Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-[#252834]/50 rounded-xl border border-[#3b3e4e] flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                             <FiUsers size={20} />
                          </div>
                          <div>
                              <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Manager</span>
                              <p className="text-white font-bold">{CLUB_PROFILE.manager}</p>
                          </div>
                      </div>
                      <div className="p-4 bg-[#252834]/50 rounded-xl border border-[#3b3e4e] flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                             <FiMapPin size={20} />
                          </div>
                          <div>
                              <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Home Ground</span>
                              <p className="text-white font-bold">{CLUB_PROFILE.stadium}</p>
                          </div>
                      </div>
                  </div>
              </div>

              {/* 3. SQUAD ROSTER (Read Only) */}
              <div className="bg-[#1b1c28] border border-[#3b3e4e] rounded-xl p-8 shadow-lg">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-white">First Team Squad</h3>
                      <span className="text-xs font-bold text-gray-500 bg-[#252834] px-2 py-1 rounded">2024/25 Season</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {SQUAD_MEMBERS.map((member) => (
                          <div key={member.id} className="flex items-center p-3 rounded-lg bg-[#252834]/50 border border-[#3b3e4e] hover:bg-[#252834] transition cursor-default">
                              {/* Avatar Placeholder */}
                              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-xs text-gray-400 font-bold mr-4 border border-gray-700">
                                  {getInitials(member.name)}
                              </div>
                              
                              <div className="flex-1">
                                  <h4 className="text-sm font-bold text-gray-200">{member.name}</h4>
                                  <p className="text-[10px] text-gray-500 uppercase font-semibold">{member.role}</p>
                              </div>

                              {member.number && (
                                  <div className="text-lg font-black text-[#3b3e4e]">
                                      {member.number}
                                  </div>
                              )}
                          </div>
                      ))}
                  </div>
              </div>

          </div>

          {/* RIGHT COLUMN: STATS & CONTACT */}
          <div className="space-y-6">
              
              {/* 4. CLUB HONORS / STATS */}
              <div className="bg-[#1b1c28] border border-[#3b3e4e] rounded-xl p-6 shadow-lg">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Club Achievements</h3>
                  
                  <div className="space-y-4">
                      {/* Ranking */}
                      <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                                <FiAward />
                              </div>
                              <span className="text-sm text-gray-300 font-medium">League Rank</span>
                          </div>
                          <span className="font-bold text-white">{CLUB_PROFILE.stats.ranking}</span>
                      </div>
                      
                      {/* Trophies */}
                      <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-purple-500/10 flex items-center justify-center text-purple-500">
                                <FiAward />
                              </div>
                              <span className="text-sm text-gray-300 font-medium">Trophies Won</span>
                          </div>
                          <span className="font-bold text-white">{CLUB_PROFILE.stats.trophies}</span>
                      </div>

                      {/* Matches */}
                      <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <FiCalendar />
                              </div>
                              <span className="text-sm text-gray-300 font-medium">Matches Played</span>
                          </div>
                          <span className="font-bold text-white">{CLUB_PROFILE.stats.matches}</span>
                      </div>
                  </div>
              </div>

              {/* 5. CONTACT & SOCIALS */}
              <div className="bg-[#1b1c28] border border-[#3b3e4e] rounded-xl p-6 shadow-lg">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Contact Us</h3>
                  
                  <div className="space-y-4 mb-6">
                      <a href="#" className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition">
                          <FiGlobe className="text-purple-500" /> {CLUB_PROFILE.website}
                      </a>
                      <a href="#" className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition">
                          <FiMail className="text-blue-500" /> {CLUB_PROFILE.email}
                      </a>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                          <FiPhone className="text-green-500" /> {CLUB_PROFILE.phone}
                      </div>
                  </div>

                  <div className="border-t border-[#3b3e4e] pt-4 flex gap-4 justify-center">
                      <button className="p-2 bg-[#252834] rounded-lg text-gray-400 hover:text-white hover:bg-blue-600 transition">
                        <FiTwitter size={18}/>
                      </button>
                      <button className="p-2 bg-[#252834] rounded-lg text-gray-400 hover:text-white hover:bg-pink-600 transition">
                        <FiInstagram size={18}/>
                      </button>
                      <button className="p-2 bg-[#252834] rounded-lg text-gray-400 hover:text-white hover:bg-blue-800 transition">
                        <FiGlobe size={18}/>
                      </button>
                  </div>
              </div>

          </div>
      </div>
    </div>
  );
}

// Small helper for initials
const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2);