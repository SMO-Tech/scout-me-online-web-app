'use client';

import React, { useState } from 'react'
import { FiArrowLeft, FiMenu } from "react-icons/fi"
import { useRouter } from "next/navigation"

// Reusing existing components
import CollapsibleSidebar from "@/components/club/CollapsibleSideBar"
import AnalyticsView from "@/components/club/Views/AnalytisView" // The analytics logic
import PlayerProfileView from '@/components/Player/PlayerProfileView';
import PlayerEventsView from '@/components/Player/PlayerEventsView';


const PlayerDetailPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('analytics') // Default to analytics as requested
  const router = useRouter()

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
          />

          {/* DYNAMIC CONTENT - Analytics or Profile */}
          <main className="min-w-0">
            {activeTab === 'profile' && <PlayerProfileView />}
            {activeTab === 'analytics' && <AnalyticsView />}
            {activeTab === 'events' && <PlayerEventsView />}
          </main>

        </div>
      </div>
    </div>
  )
}

export default PlayerDetailPage