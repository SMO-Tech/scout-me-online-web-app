'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FiArrowLeft, FiMenu } from "react-icons/fi";
import CollapsibleSidebar, { TabType } from "@/components/club/CollapsibleSideBar";
import AnalyticsView from "@/components/club/Views/AnalytisView";
import ProfileView from "@/components/club/Views/ProfileView";
import MatchesView from "@/components/club/Views/MatchView";
import MembersView from "@/components/club/Views/MembersView";
import { useRouter } from "next/navigation";
import { DUMMY_METRICS } from "@/staticdata/club";
import { getClient } from "@/lib/api/client";
import { extractClubId } from "@/lib/utils/slug";
import { useSEO } from "@/hooks/useSEO";

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
  members?: ClubMember[];
  playerCount?: number;
}

export default function ClubDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slugOrId = params.id as string;
  const clubId = extractClubId(slugOrId);
  
  // 1. Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // 2. Tab State (Default to 'profile')
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  
  // 3. Club Data State
  const [club, setClub] = useState<ClubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch club data
  useEffect(() => {
    const fetchClubData = async () => {
      if (!clubId) {
        setLoading(false);
        setError('Club ID is required');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const client = await getClient();
        const response = await client.get(`/club/${clubId}`);
        
        if (response.data?.status === 'success' && response.data?.data) {
          const data = response.data.data;
          
          // Normalize logo URL
          const logoUrl =
            data.profile?.logoUrl ||
            data.imageUrl ||
            data.profile?.thumbNormalUrl ||
            data.profile?.thumbProfileUrl ||
            data.profile?.thumbIconUrl ||
            null;

          setClub({
            ...data,
            logoUrl: logoUrl,
          });
        } else if (response.data?.data) {
          // Handle case where data is directly in response.data
          const data = response.data.data;
          const logoUrl =
            data.profile?.logoUrl ||
            data.imageUrl ||
            data.profile?.thumbNormalUrl ||
            data.profile?.thumbProfileUrl ||
            data.profile?.thumbIconUrl ||
            null;

          setClub({
            ...data,
            logoUrl: logoUrl,
          });
        } else {
          setError('Failed to fetch club details');
        }
      } catch (err: any) {
        console.error("Failed to fetch club details:", err);
        const errorMessage = err?.response?.data?.message || err.message || "Failed to load club details";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchClubData();
  }, [clubId]);

  // SEO metadata
  useSEO({
    title: club 
      ? `${club.name} - Football Club Profile | ScoutMe.cloud`
      : 'Football Club Profile | ScoutMe.cloud',
    description: club
      ? `View detailed profile of ${club.name}${club.country ? ` from ${club.country}` : ''}. Club stats, analytics, matches, and squad information on ScoutMe.cloud.`
      : 'View football club profile, stats, analytics, and matches on ScoutMe.cloud',
    image: club?.logoUrl || '/images/default/club_default.PNG',
    url: typeof window !== 'undefined' ? window.location.href : '',
    keywords: club 
      ? `${club.name}, football club, soccer club, ${club.country || ''}, club profile, football analytics, club stats`
      : 'football club, soccer club, club profile, football analytics',
    type: 'website',
    siteName: 'ScoutMe.cloud'
  });

  return (
    <div className="min-h-screen bg-[#14151b] text-white p-4 sm:p-8">
      <div className="max-w-[1920px] mx-auto">
        {/* Back */}
        <button
          onClick={() => router.push("/dashboard/clubs")}
          className="flex bg-gray-700 p-2 rounded-lg items-center gap-2 text-gray-200 mb-6"
        >
          <FiArrowLeft /> Back to Clubs
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

          {/* SIDEBAR CONTROLLER */}
          <CollapsibleSidebar
            isExpanded={isSidebarOpen}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isMobileOpen={isMobileOpen}
            closeMobile={() => setIsMobileOpen(false)}
            // Pass tab props
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {/* DYNAMIC CONTENT AREA */}
          <main className="min-w-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-40 gap-4">
                <div className="w-12 h-12 border-2 border-purple-700 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400">Loading club details...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-40 gap-4">
                <p className="text-red-400 text-lg font-semibold">{error}</p>
                <button
                  onClick={() => router.push("/dashboard/clubs")}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  Back to Clubs
                </button>
              </div>
            ) : (
              <>
                {activeTab === 'profile' && club && <ProfileView club={club} />}
                {activeTab === 'analytics' && <AnalyticsView />}
                {activeTab === 'events' && <MatchesView />}
                {activeTab === 'members' && club && <MembersView members={club.members || []} />}
              </>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}