'use client';

import React, { useState, useEffect } from 'react'
import { FiArrowLeft, FiMenu } from "react-icons/fi"
import { useRouter, useSearchParams } from "next/navigation"

// Reusing existing components
import CollapsibleSidebar from "@/components/club/CollapsibleSideBar"
import dynamic from "next/dynamic";

const PlayerProfileView = dynamic(() => import('@/components/Player/PlayerProfileView'), {
  loading: () => <div className="text-gray-400">Loading profile…</div>,
});

const AnalyticsView = dynamic(() => import('@/components/club/Views/AnalytisView'), {
  loading: () => <div className="text-gray-400">Loading analytics…</div>,
});

const PlayerStatisticsView = dynamic(() => import('@/components/Player/PlayerStatisticsView'), {
  loading: () => <div className="text-gray-400">Loading statistics…</div>,
});

const PlayerEventsView = dynamic(() => import('@/components/Player/PlayerEventsView'), {
  loading: () => <div className="text-gray-400">Loading events…</div>,
});


const PlayerDetailPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  
  // Get initial tab from URL query parameter, default to 'analytics'
  // Valid tabs for player profiles (no 'members' tab)
  const validTabs = ['profile', 'analytics', 'statistics', 'events']
  const initialTab = searchParams.get('tab') || 'analytics'
  const [activeTab, setActiveTab] = useState(
    validTabs.includes(initialTab) ? initialTab : 'analytics'
  )

  // Update activeTab when query parameter changes
  // Also ensure 'members' tab is never set for player profiles
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && validTabs.includes(tab)) {
      setActiveTab(tab)
    } else if (tab === 'members') {
      // Redirect to profile if someone tries to access members tab
      setActiveTab('profile')
    } else if (!tab) {
      setActiveTab('analytics')
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-[#14151b] text-white p-4 sm:p-8">
      <div className="max-w-[1920px] mx-auto">
        
        {/* Back Button */}
        <button
          onClick={() => router.push("/dashboard/scouting-profiles")}
          className="flex bg-gray-700 p-2 rounded-lg items-center gap-2 text-gray-200 mb-6 hover:bg-gray-600 transition"
        >
          <FiArrowLeft /> Back to Scouting
        </button>

        {/* Mobile Trigger */}
        <div className="lg:hidden mb-6 flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 bg-[#1b1c28] border border-[#3b3e4e] rounded-lg text-white"
          >
            <FiMenu size={20} />
          </button>
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

          {/* SIDEBAR - Reused from Club */}
          <CollapsibleSidebar
            isExpanded={isSidebarOpen}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isMobileOpen={isMobileOpen}
            closeMobile={() => setIsMobileOpen(false)}
            activeTab={activeTab as any} 
            setActiveTab={setActiveTab as any}
            // Hide members tab for player profiles
            showMembersTab={false}
          />

          {/* DYNAMIC CONTENT - Profile, Analytics, Statistics, or Events */}
          <main className="min-w-0">
            {activeTab === 'profile' && <PlayerProfileView />}
            {activeTab === 'analytics' && <AnalyticsView />}
            {activeTab === 'statistics' && <PlayerStatisticsView />}
            {activeTab === 'events' && <PlayerEventsView />}
          </main>

        </div>
      </div>
    </div>
  )
}

export default PlayerDetailPage