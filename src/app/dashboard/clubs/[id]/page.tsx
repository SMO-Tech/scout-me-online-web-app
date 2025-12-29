'use client';

import { useState } from "react";
import { FiArrowLeft, FiMenu } from "react-icons/fi";
import CollapsibleSidebar, { TabType } from "@/components/club/CollapsibleSideBar";
import AnalyticsView from "@/components/club/Views/AnalytisView";
import ProfileView from "@/components/club/Views/ProfileView";
import MatchesView from "@/components/club/Views/MatchView";
import { useRouter } from "next/navigation";
import { DUMMY_METRICS } from "@/staticdata/club";


export default function ClubDetailPage() {
  // 1. Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const router = useRouter()

  // 2. Tab State (Default to 'analytics' since that's what we built)
  const [activeTab, setActiveTab] = useState<TabType>('analytics');

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
            {activeTab === 'profile' && <ProfileView />}
            {activeTab === 'analytics' && <AnalyticsView  />}
            {activeTab === 'events' && <MatchesView />}
          </main>

        </div>
      </div>
    </div>
  );
}