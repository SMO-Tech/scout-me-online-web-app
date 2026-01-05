"use client"

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { 
  FiUser, FiCalendar, FiMapPin, FiShield, 
  FiClock, FiAlertCircle, FiLock, FiLoader,
  FiHash, FiTarget, FiAward, FiGlobe, FiDollarSign,
  FiFileText, FiUsers, FiActivity, FiZap
} from 'react-icons/fi'
import { getClient } from '@/lib/api/client'

interface PlayerData {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  gender: string | null;
  dateOfBirth: string | null;
  age: number | null;
  position: string | null;
  strongFoot: string | null;
  height: number | null;
  weight: number | null;
  country: string | null;
  location: string | null;
  city: string | null;
  state: string | null;
  nationality: string | null;
  club: string | null;
  league: string | null;
  monthSalary: number | null;
  contractExpiry: string | null;
  agentName: string | null;
  language: string | null;
  status: string;
  createdAt: string | null;
  avatar: string | null;
  ownerId: string | null;
}

const PlayerProfileView = () => {
  const params = useParams()
  const playerId = params.id as string
  const [player, setPlayer] = useState<PlayerData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch player data
  useEffect(() => {
    const fetchPlayerData = async () => {
      if (!playerId) {
        setError('Player ID is required')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        // Get the authenticated client (includes Bearer token from localStorage)
        const client = await getClient()
        
        // Check if token exists
        const token = typeof window !== 'undefined' ? localStorage.getItem("authToken") : null
        if (!token) {
          console.warn("No auth token found in localStorage")
        }
        
        const response = await client.get(`/player/${playerId}`)

        if (response.data?.status === 'success' && response.data?.data) {
          const data = response.data.data
          
          // Helper function to filter out "Unknown" values
          const filterUnknown = (value: any): any => {
            if (value === null || value === undefined) return null;
            if (typeof value === 'string') {
              const lowerVal = value.toLowerCase().trim();
              if (lowerVal === 'unknown' || lowerVal === 'n/a' || lowerVal === '') return null;
            }
            return value;
          };
          
          setPlayer({
            id: data.id || playerId,
            firstName: filterUnknown(data.firstName) || '',
            lastName: filterUnknown(data.lastName) || '',
            name: filterUnknown(data.name) || `${filterUnknown(data.firstName) || ''} ${filterUnknown(data.lastName) || ''}`,
            gender: filterUnknown(data.gender),
            dateOfBirth: filterUnknown(data.dateOfBirth),
            age: filterUnknown(data.age),
            position: filterUnknown(data.position),
            strongFoot: filterUnknown(data.strongFoot),
            height: filterUnknown(data.height),
            weight: filterUnknown(data.weight),
            country: filterUnknown(data.country),
            location: filterUnknown(data.location),
            city: filterUnknown(data.city),
            state: filterUnknown(data.state),
            nationality: filterUnknown(data.nationality),
            club: filterUnknown(data.club?.name || data.club),
            league: filterUnknown(data.league?.name || data.league),
            monthSalary: filterUnknown(data.monthSalary),
            contractExpiry: filterUnknown(data.contractExpiry),
            agentName: filterUnknown(data.agentName),
            language: filterUnknown(data.language),
            status: data.status || 'UNCLAIMED',
            createdAt: filterUnknown(data.createdAt),
            avatar: data.profile?.thumbUrl || 
                   data.profile?.thumbProfileUrl || 
                   data.profile?.thumbNormalUrl || 
                   data.profile?.thumbIconUrl || 
                   data.imageUrl || 
                   null,
            ownerId: filterUnknown(data.ownerId),
          })
        } else {
          setError('Failed to fetch player details')
          setPlayer(null)
        }
      } catch (err: any) {
        console.error("Failed to fetch player details:", err)
        
        // Handle specific error cases
        if (err.response?.status === 401) {
          setError('Authentication required. Please log in again.')
        } else if (err.response?.status === 403) {
          setError('Access denied. You do not have permission to view this profile.')
        } else {
          const errorMessage = err.response?.data?.message || err.message || "Failed to load player details"
          setError(errorMessage)
        }
        setPlayer(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlayerData()
  }, [playerId])

  const formatDate = (dob?: string | null) => {
    if (!dob || dob === "01-01-1900") return null;
    try {
      const [day, month, year] = dob.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) { return null; }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-[#0a0b0f] to-[#1a1b23] rounded-3xl border border-emerald-500/10">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <FiActivity className="text-emerald-500" size={20} />
            </div>
          </div>
          <p className="text-gray-400 font-medium">Loading player profile...</p>
        </div>
      </div>
    )
  }
  
  // Error State
  if (error || !player) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-[#0a0b0f] to-[#1a1b23] rounded-3xl border border-red-500/20">
        <div className="text-center">
          <FiAlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <p className="text-gray-400 text-lg">{error || "Player profile not found."}</p>
        </div>
      </div>
    )
  }

  // Detail Row Component - filters out null, undefined, empty, and "Unknown" values
  const DetailRow = ({ label, value, icon }: { label: string; value: string | number | null | undefined; icon?: React.ReactNode }) => {
    // Don't render if value is null, undefined, or "Unknown"
    if (value === null || value === undefined) return null;
    if (typeof value === 'string') {
      const lowerVal = value.toLowerCase().trim();
      if (lowerVal === 'unknown' || lowerVal === 'n/a' || lowerVal === '') return null;
    }
    
    return (
      <div className="flex justify-between items-center py-3 border-b border-white/5 last:border-0 group hover:bg-white/[0.02] px-2 -mx-2 rounded transition-colors">
        <span className="text-gray-500 text-sm flex items-center gap-2">
          {icon && <span className="text-emerald-500">{icon}</span>}
          {label}
        </span>
        <span className="text-white font-medium text-sm">{value}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* HERO CARD - Player Identity */}
      <div className="relative bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#0d1117] rounded-3xl overflow-hidden border border-emerald-500/20">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/20 rounded-full blur-[100px] -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-[80px] -ml-32 -mb-32" />
        </div>
        
        {/* Football Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M30 30l15-15v30l-15-15zm-15 0l15 15H0l15-15zm30 0l-15-15h30l-15 15zm-15 15l-15-15 15-15 15 15-15 15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="relative p-8 md:p-10">
          <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
            
            {/* Player Avatar */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500" />
              <div className="relative w-44 h-44 bg-[#0a0b0f] rounded-2xl flex items-center justify-center border-2 border-emerald-500/30 overflow-hidden shadow-2xl">
                {player.avatar ? (
                  <img 
                    src={player.avatar} 
                    alt={player.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/default/player_default.PNG';
                    }}
                  />
                ) : (
                  <div className="text-emerald-500/50 flex flex-col items-center">
                    <FiUser size={60} />
                  </div>
                )}
              </div>
             
            </div>

            {/* Player Info */}
            <div className="flex-1 text-center lg:text-left">

              {/* Name */}
              <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-2">
                {player.firstName} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">{player.lastName}</span>
              </h1>

              {/* User Type Badge
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                <span className="px-4 py-1.5 bg-[#0a0b0f] border border-white/10 rounded-lg text-sm font-bold text-gray-300 flex items-center gap-2">
                  <FiTarget className="text-emerald-400" /> Football Player
                </span>
                <span className={`px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 ${
                  player.status === 'UNCLAIMED' 
                    ? 'bg-orange-500/10 border border-orange-500/30 text-orange-400' 
                    : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                }`}>
                  <FiShield /> {player.status}
                </span>
              </div> */}

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {player.nationality && player.nationality.toLowerCase() !== 'unknown' && (
                  <div className="bg-[#0a0b0f]/60 backdrop-blur border border-white/5 rounded-xl p-4 text-center">
                    <FiGlobe className="mx-auto text-emerald-400 mb-2" size={20} />
                    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">Nationality</p>
                    <p className="text-white font-semibold text-sm">{player.nationality}</p>
                  </div>
                )}
                {player.age && (
                  <div className="bg-[#0a0b0f]/60 backdrop-blur border border-white/5 rounded-xl p-4 text-center">
                    <FiCalendar className="mx-auto text-cyan-400 mb-2" size={20} />
                    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">Age</p>
                    <p className="text-white font-semibold text-sm">{player.age} Years</p>
                  </div>
                )}
                {player.club && player.club.toLowerCase() !== 'unknown' && (
                  <div className="bg-[#0a0b0f]/60 backdrop-blur border border-white/5 rounded-xl p-4 text-center">
                    <FiShield className="mx-auto text-purple-400 mb-2" size={20} />
                    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">Club</p>
                    <p className="text-white font-semibold text-sm truncate">{player.club}</p>
                  </div>
                )}
                {player.strongFoot && player.strongFoot.toLowerCase() !== 'unknown' && (
                  <div className="bg-[#0a0b0f]/60 backdrop-blur border border-white/5 rounded-xl p-4 text-center">
                    <FiZap className="mx-auto text-yellow-400 mb-2" size={20} />
                    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">Strong Foot</p>
                    <p className="text-white font-semibold text-sm">{player.strongFoot}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* UNCLAIMED NOTICE */}
      {player.status === "UNCLAIMED" && (
        <div className="bg-gradient-to-r from-orange-500/5 to-yellow-500/5 border border-orange-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-yellow-500/20 flex items-center justify-center text-orange-500 shrink-0">
              <FiAlertCircle size={28} />
            </div>
            <div>
              <h4 className="text-white font-bold text-lg flex items-center justify-center md:justify-start gap-2">
                Unverified Profile
                <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded uppercase tracking-tighter">Pending</span>
              </h4>
              <p className="text-gray-400 text-sm">This profile hasn't been claimed by the player. Identity verification coming soon.</p>
            </div>
          </div>
          <button 
            disabled 
            className="px-6 py-3 bg-[#1a1b23] text-gray-500 font-bold rounded-xl flex items-center gap-2 cursor-not-allowed border border-gray-700/50 whitespace-nowrap hover:bg-[#1a1b23]/80 transition-colors"
          >
            <FiLock size={14} /> Claim Profile
          </button>
        </div>
      )}

      {/* DETAILS GRID - Grouped by Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Personal Information */}
        <div className="bg-gradient-to-br from-[#0d1117] to-[#161b22] border border-emerald-500/10 rounded-2xl p-6 hover:border-emerald-500/30 transition-colors">
          <h3 className="text-sm font-black uppercase text-emerald-400 mb-5 flex items-center gap-2 tracking-widest">
            <FiUser className="text-emerald-500" /> Personal Info
          </h3>
          <div className="space-y-1">
            <DetailRow label="First Name" value={player.firstName} />
            <DetailRow label="Last Name" value={player.lastName} />
            <DetailRow label="Gender" value={player.gender} />
            <DetailRow label="Birthday" value={formatDate(player.dateOfBirth)} />
            <DetailRow label="Age" value={player.age ? `${player.age} years` : null} />
          </div>
        </div>

        {/* Physical Attributes */}
        <div className="bg-gradient-to-br from-[#0d1117] to-[#161b22] border border-cyan-500/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-colors">
          <h3 className="text-sm font-black uppercase text-cyan-400 mb-5 flex items-center gap-2 tracking-widest">
            <FiActivity className="text-cyan-500" /> Physical Attributes
          </h3>
          <div className="space-y-1">
            <DetailRow label="Height (cm)" value={player.height} />
            <DetailRow label="Weight (kg)" value={player.weight} />
            <DetailRow label="Strong Foot" value={player.strongFoot} />
            <DetailRow label="Position" value={player.position} />
          </div>
          {!player.height && !player.weight && !player.strongFoot && (
            <p className="text-gray-600 text-sm italic">No physical data available</p>
          )}
        </div>

        {/* Location & Nationality */}
        <div className="bg-gradient-to-br from-[#0d1117] to-[#161b22] border border-purple-500/10 rounded-2xl p-6 hover:border-purple-500/30 transition-colors">
          <h3 className="text-sm font-black uppercase text-purple-400 mb-5 flex items-center gap-2 tracking-widest">
            <FiMapPin className="text-purple-500" /> Location
          </h3>
          <div className="space-y-1">
            <DetailRow label="Nationality" value={player.nationality} />
            <DetailRow label="Country" value={player.country} />
            <DetailRow label="Location" value={player.location} />
            <DetailRow label="City / State" value={player.city || player.state ? `${player.city || ''}${player.city && player.state ? ', ' : ''}${player.state || ''}` : null} />
            <DetailRow label="Language" value={player.language} />
          </div>
        </div>

        {/* Club & Career */}
        <div className="bg-gradient-to-br from-[#0d1117] to-[#161b22] border border-yellow-500/10 rounded-2xl p-6 hover:border-yellow-500/30 transition-colors">
          <h3 className="text-sm font-black uppercase text-yellow-400 mb-5 flex items-center gap-2 tracking-widest">
            <FiAward className="text-yellow-500" /> Club & Career
          </h3>
          <div className="space-y-1">
            <DetailRow label="Club" value={player.club} />
            <DetailRow label="League" value={player.league} />
            <DetailRow label="Position" value={player.position} />
          </div>
          {!player.club && !player.league && (
            <p className="text-gray-600 text-sm italic">No club information available</p>
          )}
        </div>

        {/* Contract & Financials */}
        <div className="bg-gradient-to-br from-[#0d1117] to-[#161b22] border border-pink-500/10 rounded-2xl p-6 hover:border-pink-500/30 transition-colors">
          <h3 className="text-sm font-black uppercase text-pink-400 mb-5 flex items-center gap-2 tracking-widest">
            <FiDollarSign className="text-pink-500" /> Contract
          </h3>
          <div className="space-y-1">
            <DetailRow label="Monthly Salary (£)" value={player.monthSalary ? `£${player.monthSalary.toLocaleString()}` : null} />
            <DetailRow label="Contract Expiry" value={player.contractExpiry} />
            <DetailRow label="Agent Name" value={player.agentName} />
          </div>
          {!player.monthSalary && !player.contractExpiry && !player.agentName && (
            <p className="text-gray-600 text-sm italic">No contract details available</p>
          )}
        </div>

        {/* Registry & System */}
        <div className="bg-gradient-to-br from-[#0d1117] to-[#161b22] border border-gray-500/10 rounded-2xl p-6 hover:border-gray-500/30 transition-colors">
          <h3 className="text-sm font-black uppercase text-gray-400 mb-5 flex items-center gap-2 tracking-widest">
            <FiFileText className="text-gray-500" /> Registry Info
          </h3>
          <div className="space-y-1">
            <DetailRow label="Player ID" value={player.id.slice(0, 8) + '...'} icon={<FiHash size={14} />} />
            <DetailRow label="User Type" value="Football Player" icon={<FiUsers size={14} />} />
            <DetailRow label="Status" value={player.status} icon={<FiShield size={14} />} />
            <DetailRow label="Registered" value={player.createdAt ? new Date(player.createdAt).toLocaleDateString() : null} icon={<FiClock size={14} />} />
            <DetailRow label="Ownership" value={player.ownerId ? 'Assigned' : 'Open Access'} />
          </div>
        </div>

      </div>

      {/* Tags Section */}
      {/* <div className="bg-gradient-to-br from-[#0d1117] to-[#161b22] border border-white/5 rounded-2xl p-6">
        <h3 className="text-sm font-black uppercase text-gray-400 mb-4 tracking-widest">Tags & Categories</h3>
        <div className="flex flex-wrap gap-2">
          {[player.position, player.country, player.nationality, player.club, player.status, player.strongFoot]
            .filter((tag): tag is string => Boolean(tag))
            .map(tag => (
              <span key={tag} className="bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-xs font-bold border border-emerald-500/20 uppercase tracking-wider hover:bg-emerald-500/20 transition-colors cursor-default">
                #{tag.replace(/\s+/g, '')}
              </span>
            ))}
        </div>
      </div> */}
    </div>
  )
}

export default PlayerProfileView
