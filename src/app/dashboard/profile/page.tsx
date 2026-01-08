'use client';

import { useState, useEffect } from "react";
import { FiArrowLeft, FiMenu, FiEdit2, FiSave, FiX, FiUpload, FiUser, FiCalendar, FiMapPin, FiShield, FiHash, FiTarget, FiAward, FiGlobe, FiDollarSign, FiFileText, FiUsers, FiActivity, FiZap, FiAlertCircle } from "react-icons/fi";
import CollapsibleSidebar, { TabType } from "@/components/club/CollapsibleSideBar";
import { useRouter } from "next/navigation";
import { getClient } from "@/lib/api/client";
import { useAuth } from "@/lib/AuthContext";
import { uploadImageToS3 } from "@/lib/utils/imageUpload";
import toast from "react-hot-toast";
import MatchEventsView from "@/components/profile/MatchEventsView";

interface PlayerData {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  country: string | null;
  avatar: string | null;
  primaryPosition: string | null;
  city: string | null;
  state: string | null;
  nationality: string | null;
  height: number | null;
  weight: number | null;
  strongFoot: string | null;
  gender: string | null;
  club: string | null;
  league: string | null;
  contractExpiry: string | null;
  monthSalary: string | null;
  agentName: string | null;
  language: string | null;
  status: string;
  profileType: string | null;
  thumbIconUrl: string | null;
  thumbNormalUrl: string | null;
  thumbProfileUrl: string | null;
  thumbUrl: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  
  const [player, setPlayer] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState<PlayerData>({
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: null,
    country: null,
    avatar: null,
    primaryPosition: null,
    city: null,
    state: null,
    nationality: null,
    height: null,
    weight: null,
    strongFoot: null,
    gender: null,
    club: null,
    league: null,
    contractExpiry: null,
    monthSalary: null,
    agentName: null,
    language: null,
    status: 'UNCLAIMED',
    profileType: null,
    thumbIconUrl: null,
    thumbNormalUrl: null,
    thumbProfileUrl: null,
    thumbUrl: null,
  });

  // Fetch current user's player profile
  useEffect(() => {
    const fetchPlayerProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const client = await getClient();
        const response = await client.get('/player/me');
        
        if (response.data?.status === 'success' && response.data?.data) {
          const data = response.data.data;
          
          // Helper function to convert ISO date to DD-MM-YYYY format
          const convertISOToDDMMYYYY = (isoDate: string | null | undefined): string | null => {
            if (!isoDate) return null;
            try {
              const date = new Date(isoDate);
              const day = String(date.getDate()).padStart(2, '0');
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const year = date.getFullYear();
              return `${day}-${month}-${year}`;
            } catch (e) {
              // If already in DD-MM-YYYY format, return as is
              if (typeof isoDate === 'string' && isoDate.includes('-') && isoDate.length === 10) {
                return isoDate;
              }
              return null;
            }
          };
          
          const normalized: PlayerData = {
            id: data.id || '',
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            dateOfBirth: convertISOToDDMMYYYY(data.dateOfBirth),
            country: data.country || null,
            avatar: data.thumbUrl || 
                   data.thumbProfileUrl || 
                   data.thumbNormalUrl || 
                   data.thumbIconUrl || 
                   data.avatar || 
                   null,
            primaryPosition: data.primaryPosition || null,
            city: data.city || null,
            state: data.state || null,
            nationality: data.nationality || null,
            height: data.height ? (typeof data.height === 'string' ? Number(data.height) : data.height) : null,
            weight: data.weight ? (typeof data.weight === 'string' ? Number(data.weight) : data.weight) : null,
            strongFoot: data.strongFoot || null,
            gender: data.gender || null,
            club: data.club || null,
            league: data.league || null,
            contractExpiry: convertISOToDDMMYYYY(data.contractExpiry),
            monthSalary: data.monthSalary ? String(data.monthSalary) : null,
            agentName: data.agentName || null,
            language: data.language || null,
            status: data.status || 'UNCLAIMED',
            profileType: data.profileType || null,
            thumbIconUrl: data.thumbIconUrl || null,
            thumbNormalUrl: data.thumbNormalUrl || null,
            thumbProfileUrl: data.thumbProfileUrl || null,
            thumbUrl: data.thumbUrl || null,
          };
          
          setPlayer(normalized);
          setFormData(normalized);
        } else {
          setError('Failed to fetch player profile');
        }
      } catch (err: any) {
        console.error("Failed to fetch player profile:", err);
        const errorMessage = err?.response?.data?.message || err.message || "Failed to load profile";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerProfile();
  }, [user]);

  const handleImageUpload = async (file: File) => {
    if (!user) {
      toast.error('Please log in to upload images');
      return;
    }

    setUploadingImage(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const imageUrl = await uploadImageToS3(file, token);
      
      // Update all thumb URLs with the same image (or you can handle different sizes separately)
      setFormData(prev => ({
        ...prev,
        avatar: imageUrl,
        thumbUrl: imageUrl,
        thumbNormalUrl: imageUrl,
        thumbProfileUrl: imageUrl,
        thumbIconUrl: imageUrl,
      }));
      
      toast.success('Image uploaded successfully');
    } catch (err: any) {
      console.error("Image upload failed:", err);
      toast.error(err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!player?.id) {
      toast.error('Player ID not found');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const client = await getClient();
      
      // Prepare payload according to API spec
      const payload: any = {
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        dateOfBirth: formData.dateOfBirth || null,
        country: formData.country || null,
        avatar: formData.avatar || null,
        primaryPosition: formData.primaryPosition || null,
        city: formData.city || null,
        state: formData.state || null,
        nationality: formData.nationality || null,
        height: formData.height ? Number(formData.height) : null,
        weight: formData.weight ? Number(formData.weight) : null,
        strongFoot: formData.strongFoot || null,
        gender: formData.gender || null,
        club: formData.club || null,
        league: formData.league || null,
        contractExpiry: formData.contractExpiry || null,
        monthSalary: formData.monthSalary || null,
        agentName: formData.agentName || null,
        language: formData.language || null,
        status: formData.status || 'UNCLAIMED',
        profileType: formData.profileType || null,
        thumbIconUrl: formData.thumbIconUrl || null,
        thumbNormalUrl: formData.thumbNormalUrl || null,
        thumbProfileUrl: formData.thumbProfileUrl || null,
        thumbUrl: formData.thumbUrl || null,
      };

      // Remove null/empty values to clean up payload
      Object.keys(payload).forEach(key => {
        if (payload[key] === null || payload[key] === '' || payload[key] === undefined) {
          delete payload[key];
        }
      });

      const response = await client.put(`/player/${player.id}`, payload);
      
      if (response.data?.status === 'success') {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        // Refresh player data
        setPlayer({ ...formData });
      } else {
        throw new Error(response.data?.message || 'Failed to update profile');
      }
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      const errorMessage = err?.response?.data?.message || err.message || "Failed to update profile";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dob: string | null) => {
    if (!dob) return '';
    // Convert DD-MM-YYYY to YYYY-MM-DD for input[type="date"]
    const parts = dob.split('-');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dob;
  };

  const parseDate = (dateStr: string) => {
    if (!dateStr) return null;
    // Convert YYYY-MM-DD to DD-MM-YYYY
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#14151b] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#14151b] text-white p-4 sm:p-8">
      <div className="max-w-[1920px] mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="flex bg-gray-700 p-1 rounded-lg items-center gap-2 text-gray-100 text-xs mb-3 hover:bg-gray-600 transition"
        >
          <FiArrowLeft /> Back to Dashboard
        </button>

        {/* Mobile Trigger */}
        <div className="lg:hidden mb-6 flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 bg-[#1b1c28] border border-[#3b3e4e] rounded-lg text-white hover:bg-[#252834] transition flex items-center gap-2"
          >
            <FiMenu size={20} />
            <span className="text-sm font-semibold">Menu</span>
          </button>
          <span className="text-gray-500 text-sm">|</span>
          <span className="text-purple-400 font-bold uppercase tracking-wide text-sm">
            {activeTab}
          </span>
        </div>

        {/* Main Grid Layout */}
        <div
          className="lg:grid transition-[grid-template-columns] duration-300 ease-in-out gap-6"
          style={{
            gridTemplateColumns: isSidebarOpen
              ? "250px minmax(0, 1fr)"
              : "80px minmax(0, 1fr)",
          }}
        >
          {/* SIDEBAR */}
          <CollapsibleSidebar
            isExpanded={isSidebarOpen}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isMobileOpen={isMobileOpen}
            closeMobile={() => setIsMobileOpen(false)}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            showMembersTab={false}
            showMatchEventsTab={true}
          />

          {/* MAIN CONTENT */}
          <main className="min-w-0">
            {activeTab === 'matchEvents' ? (
              <MatchEventsView />
            ) : loading ? (
              <div className="flex flex-col items-center justify-center py-40 gap-4">
                <div className="w-12 h-12 border-2 border-purple-700 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400">Loading profile...</p>
              </div>
            ) : error && !player ? (
              <div className="flex flex-col items-center justify-center py-40 gap-4">
                <FiAlertCircle className="text-red-400" size={48} />
                <p className="text-red-400 text-lg font-semibold">{error}</p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in duration-500">
                {/* Header with Edit Button */}
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
                  <button
                    onClick={() => {
                      if (isEditing) {
                        setFormData(player || formData);
                        setIsEditing(false);
                      } else {
                        setIsEditing(true);
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                  >
                    {isEditing ? (
                      <>
                        <FiX size={18} /> Cancel
                      </>
                    ) : (
                      <>
                        <FiEdit2 size={18} /> Edit Profile
                      </>
                    )}
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* HERO CARD - Player Identity */}
                  <div className="relative bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#0d1117] rounded-3xl overflow-hidden border border-emerald-500/20 mb-6">
                    <div className="absolute inset-0 opacity-30">
                      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/20 rounded-full blur-[100px] -mr-48 -mt-48" />
                      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-[80px] -ml-32 -mb-32" />
                    </div>

                    <div className="relative p-8 md:p-10">
                      <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
                        {/* Player Avatar */}
                        <div className="relative group">
                          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500" />
                          <div className="relative w-44 h-44 bg-[#0a0b0f] rounded-2xl flex items-center justify-center border-2 border-emerald-500/30 overflow-hidden shadow-2xl">
                            {formData.avatar ? (
                              <img 
                                src={formData.avatar} 
                                alt={`${formData.firstName} ${formData.lastName}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/images/default/player_default.PNG';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                <FiUser size={48} className="text-gray-600" />
                              </div>
                            )}
                          </div>
                          {isEditing && (
                            <label className="absolute bottom-2 right-2 bg-purple-600 hover:bg-purple-700 rounded-lg p-2 cursor-pointer transition-colors">
                              <FiUpload size={20} />
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleImageUpload(file);
                                  }
                                }}
                                disabled={uploadingImage}
                              />
                            </label>
                          )}
                          {uploadingImage && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
                              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          )}
                        </div>

                        {/* Player Info */}
                        <div className="flex-1 text-center lg:text-left w-full">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                              <label className="block text-gray-400 text-sm mb-2">First Name</label>
                              <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                disabled={!isEditing}
                                className="w-full px-4 py-2 bg-[#0a0b0f]/60 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-800/50 disabled:text-gray-500"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-400 text-sm mb-2">Last Name</label>
                              <input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                disabled={!isEditing}
                                className="w-full px-4 py-2 bg-[#0a0b0f]/60 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-800/50 disabled:text-gray-500"
                              />
                            </div>
                          </div>

                          {/* Quick Stats Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-[#0a0b0f]/60 backdrop-blur border border-white/5 rounded-xl p-4 text-center">
                              <FiGlobe className="mx-auto text-emerald-400 mb-2" size={20} />
                              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">Nationality</p>
                              <input
                                type="text"
                                value={formData.nationality || ''}
                                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                                disabled={!isEditing}
                                className="w-full bg-transparent text-white font-semibold text-sm text-center focus:outline-none disabled:text-gray-500"
                                placeholder="N/A"
                              />
                            </div>
                            <div className="bg-[#0a0b0f]/60 backdrop-blur border border-white/5 rounded-xl p-4 text-center">
                              <FiCalendar className="mx-auto text-cyan-400 mb-2" size={20} />
                              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">Date of Birth</p>
                              <input
                                type="date"
                                value={formatDate(formData.dateOfBirth)}
                                onChange={(e) => setFormData({ ...formData, dateOfBirth: parseDate(e.target.value) })}
                                disabled={!isEditing}
                                className="w-full bg-transparent text-white font-semibold text-sm text-center focus:outline-none disabled:text-gray-500"
                              />
                            </div>
                            <div className="bg-[#0a0b0f]/60 backdrop-blur border border-white/5 rounded-xl p-4 text-center">
                              <FiShield className="mx-auto text-purple-400 mb-2" size={20} />
                              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">Club</p>
                              <input
                                type="text"
                                value={formData.club || ''}
                                onChange={(e) => setFormData({ ...formData, club: e.target.value })}
                                disabled={!isEditing}
                                className="w-full bg-transparent text-white font-semibold text-sm text-center focus:outline-none disabled:text-gray-500 truncate"
                                placeholder="N/A"
                              />
                            </div>
                            <div className="bg-[#0a0b0f]/60 backdrop-blur border border-white/5 rounded-xl p-4 text-center">
                              <FiZap className="mx-auto text-yellow-400 mb-2" size={20} />
                              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">Strong Foot</p>
                              <select
                                value={formData.strongFoot || ''}
                                onChange={(e) => setFormData({ ...formData, strongFoot: e.target.value })}
                                disabled={!isEditing}
                                className="w-full bg-transparent text-white font-semibold text-sm text-center focus:outline-none disabled:text-gray-500"
                              >
                                <option value="">N/A</option>
                                <option value="Left">Left</option>
                                <option value="Right">Right</option>
                                <option value="Both">Both</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DETAILS GRID - Grouped by Category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* Personal Information */}
                    <div className="bg-gradient-to-br from-[#0d1117] to-[#161b22] border border-emerald-500/10 rounded-2xl p-6">
                      <h3 className="text-sm font-black uppercase text-emerald-400 mb-5 flex items-center gap-2 tracking-widest">
                        <FiUser className="text-emerald-500" /> Personal Info
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-400 text-xs mb-1">Gender</label>
                          <select
                            value={formData.gender || ''}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 bg-[#0a0b0f]/60 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-800/50 disabled:text-gray-500"
                          >
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1">Date of Birth (DD-MM-YYYY)</label>
                          <input
                            type="text"
                            value={formData.dateOfBirth || ''}
                            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                            disabled={!isEditing}
                            placeholder="DD-MM-YYYY"
                            className="w-full px-3 py-2 bg-[#0a0b0f]/60 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-800/50 disabled:text-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1">Profile Type</label>
                          <select
                            value={formData.profileType || ''}
                            onChange={(e) => setFormData({ ...formData, profileType: e.target.value })}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 bg-[#0a0b0f]/60 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-800/50 disabled:text-gray-500"
                          >
                            <option value="">Select</option>
                            <option value="Football Player">Football Player</option>
                            <option value="Scout">Scout</option>
                            <option value="Agent">Agent</option>
                            <option value="Coach">Coach</option>
                            <option value="Analyst">Analyst</option>
                            <option value="PROFESSIONAL">Professional</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Physical Attributes */}
                    <div className="bg-gradient-to-br from-[#0d1117] to-[#161b22] border border-cyan-500/10 rounded-2xl p-6">
                      <h3 className="text-sm font-black uppercase text-cyan-400 mb-5 flex items-center gap-2 tracking-widest">
                        <FiActivity className="text-cyan-500" /> Physical Attributes
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-400 text-xs mb-1">Height (cm)</label>
                          <input
                            type="number"
                            value={formData.height || ''}
                            onChange={(e) => setFormData({ ...formData, height: e.target.value ? Number(e.target.value) : null })}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 bg-[#0a0b0f]/60 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-800/50 disabled:text-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1">Weight (kg)</label>
                          <input
                            type="number"
                            value={formData.weight || ''}
                            onChange={(e) => setFormData({ ...formData, weight: e.target.value ? Number(e.target.value) : null })}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 bg-[#0a0b0f]/60 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-800/50 disabled:text-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1">Strong Foot</label>
                          <select
                            value={formData.strongFoot || ''}
                            onChange={(e) => setFormData({ ...formData, strongFoot: e.target.value })}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 bg-[#0a0b0f]/60 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-800/50 disabled:text-gray-500"
                          >
                            <option value="">Select</option>
                            <option value="Left">Left</option>
                            <option value="Right">Right</option>
                            <option value="Both">Both</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1">Primary Position</label>
                          <input
                            type="text"
                            value={formData.primaryPosition || ''}
                            onChange={(e) => setFormData({ ...formData, primaryPosition: e.target.value })}
                            disabled={!isEditing}
                            placeholder="e.g., Forward, Midfielder"
                            className="w-full px-3 py-2 bg-[#0a0b0f]/60 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-800/50 disabled:text-gray-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Location & Nationality */}
                    <div className="bg-gradient-to-br from-[#0d1117] to-[#161b22] border border-purple-500/10 rounded-2xl p-6">
                      <h3 className="text-sm font-black uppercase text-purple-400 mb-5 flex items-center gap-2 tracking-widest">
                        <FiMapPin className="text-purple-500" /> Location
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-400 text-xs mb-1">Nationality</label>
                          <input
                            type="text"
                            value={formData.nationality || ''}
                            onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 bg-[#0a0b0f]/60 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-800/50 disabled:text-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1">Country</label>
                          <input
                            type="text"
                            value={formData.country || ''}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 bg-[#0a0b0f]/60 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-800/50 disabled:text-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1">City</label>
                          <input
                            type="text"
                            value={formData.city || ''}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 bg-[#0a0b0f]/60 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-800/50 disabled:text-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1">State</label>
                          <input
                            type="text"
                            value={formData.state || ''}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 bg-[#0a0b0f]/60 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-800/50 disabled:text-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1">Language</label>
                          <input
                            type="text"
                            value={formData.language || ''}
                            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                            disabled={!isEditing}
                            placeholder="e.g., English, Spanish"
                            className="w-full px-3 py-2 bg-[#0a0b0f]/60 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-800/50 disabled:text-gray-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Club & Career */}
                    <div className="bg-gradient-to-br from-[#0d1117] to-[#161b22] border border-yellow-500/10 rounded-2xl p-6">
                      <h3 className="text-sm font-black uppercase text-yellow-400 mb-5 flex items-center gap-2 tracking-widest">
                        <FiAward className="text-yellow-500" /> Club & Career
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-400 text-xs mb-1">Club</label>
                          <input
                            type="text"
                            value={formData.club || ''}
                            onChange={(e) => setFormData({ ...formData, club: e.target.value })}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 bg-[#0a0b0f]/60 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-800/50 disabled:text-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1">League</label>
                          <input
                            type="text"
                            value={formData.league || ''}
                            onChange={(e) => setFormData({ ...formData, league: e.target.value })}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 bg-[#0a0b0f]/60 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-800/50 disabled:text-gray-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Contract & Financials */}
                    <div className="bg-gradient-to-br from-[#0d1117] to-[#161b22] border border-pink-500/10 rounded-2xl p-6">
                      <h3 className="text-sm font-black uppercase text-pink-400 mb-5 flex items-center gap-2 tracking-widest">
                        <FiDollarSign className="text-pink-500" /> Contract
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-400 text-xs mb-1">Monthly Salary</label>
                          <input
                            type="text"
                            value={formData.monthSalary || ''}
                            onChange={(e) => setFormData({ ...formData, monthSalary: e.target.value })}
                            disabled={!isEditing}
                            placeholder="e.g., 50000"
                            className="w-full px-3 py-2 bg-[#0a0b0f]/60 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-800/50 disabled:text-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1">Contract Expiry (DD-MM-YYYY)</label>
                          <input
                            type="text"
                            value={formData.contractExpiry || ''}
                            onChange={(e) => setFormData({ ...formData, contractExpiry: e.target.value })}
                            disabled={!isEditing}
                            placeholder="DD-MM-YYYY"
                            className="w-full px-3 py-2 bg-[#0a0b0f]/60 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-800/50 disabled:text-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1">Agent Name</label>
                          <input
                            type="text"
                            value={formData.agentName || ''}
                            onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 bg-[#0a0b0f]/60 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-800/50 disabled:text-gray-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Registry & System */}
                    <div className="bg-gradient-to-br from-[#0d1117] to-[#161b22] border border-gray-500/10 rounded-2xl p-6">
                      <h3 className="text-sm font-black uppercase text-gray-400 mb-5 flex items-center gap-2 tracking-widest">
                        <FiFileText className="text-gray-500" /> Registry Info
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-400 text-xs mb-1">Player ID</label>
                          <input
                            type="text"
                            value={formData.id || ''}
                            disabled
                            className="w-full px-3 py-2 bg-gray-800/50 border border-white/10 rounded-lg text-gray-500 text-sm cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1">Status</label>
                          <input
                            type="text"
                            value={formData.status || ''}
                            disabled
                            className="w-full px-3 py-2 bg-gray-800/50 border border-white/10 rounded-lg text-gray-500 text-sm cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  {isEditing && (
                    <div className="mt-6 flex justify-end gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(player || formData);
                          setIsEditing(false);
                        }}
                        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {saving ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <FiSave size={18} />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {error && (
                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}
                </form>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
