'use client'

import CircularMetricCard from "@/components/club/CircularMetricCard";
import CollapsibleSidebar from "@/components/club/CollapsibleSideBar";
import { STATIC_METRICS } from "@/staticdata/club";
import { useState } from "react";

// ============================================================================
// CLUB DETAIL PAGE (MAIN COMPONENT)
// ============================================================================

export default function ClubDetailPage() {
  // 1. Lifted State: Controls sidebar width for the entire grid
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#14151b] text-white p-6 sm:p-8">
      <div className="max-w-[1920px] mx-auto">

        {/* 2. Dynamic Grid Layout:
                   - We use inline styles for the grid-template-columns to handle the transition smoothly.
                   - If open: 250px sidebar. If closed: 80px sidebar.
                   - The rest (1fr) takes remaining space.
                */}
        <div
          className="grid grid-cols-1 transition-[grid-template-columns] duration-300 ease-in-out gap-6"
          style={{
            gridTemplateColumns: isSidebarOpen
              ? "250px minmax(0, 1fr)"
              : "80px minmax(0, 1fr)"
          }}
        >


          <CollapsibleSidebar
            isExpanded={isSidebarOpen}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />

          {/* -------------------- MAIN CONTENT AREA -------------------- */}
          {/* Removed 'lg:col-span-2' constraint since we simplified the outer grid to 2 columns */}
          <div className="space-y-6">

            {/* Inner Layout: Main Data (Left) + Tactical Sidebar (Right) */}
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_350px] gap-6">

              {/* MAIN CHART AREA (Left Side) */}
              <div className="space-y-6">

                {/* D. CIRCULAR METRICS ROW */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {STATIC_METRICS.map((metric) => (
                    <CircularMetricCard key={metric.title} metric={metric} />
                  ))}
                </div>

                {/* E. SHOOTING LINE CHART PLACEHOLDER */}
                <div className="bg-gradient-to-br from-[#1b1c28] to-[#252834] p-6 rounded-xl border border-[#3b3e4e]">
                  <h2 className="text-lg font-semibold text-white mb-4">
                    Data: Shooting from last 5 matches
                    <span className="text-sm font-normal text-gray-500 ml-2">Analyzed by SCOUT.AI</span>
                  </h2>
                  <div className="h-96 flex items-center justify-center border border-dashed border-gray-700 rounded-lg">
                    <span className="text-gray-400">Line Chart Integration (Using Recharts/D3)</span>
                  </div>
                </div>

                {/* H. DETAILED MATCH TABLES PLACEHOLDER */}
                <div className="bg-gradient-to-br from-[#1b1c28] to-[#252834] p-6 rounded-xl border border-[#3b3e4e] h-72">
                  <span className="text-gray-400">Detailed Match Tables (Bottom)</span>
                </div>

              </div>

              {/* RIGHT COLUMN TACTICAL GRAPHICS (Right Side) */}
              <div className="space-y-6">
                {/* F. HALF MAP */}
                <div className="bg-gradient-to-br from-[#1b1c28] to-[#252834] p-4 rounded-xl border border-[#3b3e4e] h-96 flex flex-col justify-center items-center">
                  <span className="text-gray-400">Attacking/Defensive Half Map</span>
                </div>
                {/* G. BLOCKED SHOTS */}
                <div className="bg-gradient-to-br from-[#1b1c28] to-[#252834] p-4 rounded-xl border border-[#3b3e4e] h-64 flex flex-col justify-center items-center">
                  <span className="text-gray-400">Blocked Shots Visual</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}