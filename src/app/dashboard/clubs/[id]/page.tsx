'use client';

import { useState } from "react";
import Image from "next/image";

// Component Imports
import CircularMetricCard from "@/components/club/CircularMetricCard";
import CollapsibleSidebar from "@/components/club/CollapsibleSideBar";
import GoalDistributionCard from "@/components/club/GoalDistributionCard";
import ZoneHeatmap from "@/components/club/Heatmap/HeatMapCard";
import ShootingChart from "@/components/club/ShootingChart";
import ShotTrajectoryCard from "@/components/club/ShotTrajectory";

// Data Imports
import { STATIC_METRICS } from "@/staticdata/club";
import DetailedStatTables from "@/components/club/DetailedStatTables";

export default function ClubDetailPage() {
  // 1. Lifted State: Controls sidebar width for the entire grid
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#14151b] text-white p-6 sm:p-8">
      
      <div className="max-w-[1920px] mx-auto">
        
        {/* 2. Dynamic Grid Layout:
            - Uses inline styles for grid-template-columns to handle transition smoothly.
            - Open: 250px sidebar. Closed: 80px sidebar.
            - The rest (1fr) takes remaining space.
        */}
        <div
          className="grid grid-cols-1 transition-[grid-template-columns] duration-300 ease-in-out gap-6"
          style={{
            gridTemplateColumns: isSidebarOpen
              ? "250px minmax(0, 1fr)"
              : "80px minmax(0, 1fr)",
          }}
        >
          {/* Sidebar Component */}
          <CollapsibleSidebar
            isExpanded={isSidebarOpen}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />

          {/* Main Content Area */}
          <div className="space-y-6">
            
            {/* Inner Layout: Main Data (Left) + Tactical Sidebar (Right) */}
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_350px] gap-6">
              
              {/* --- LEFT COLUMN: Charts & Metrics --- */}
              <div className="space-y-6">
                
                {/* D. Circular Metrics Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {STATIC_METRICS.map((metric) => (
                    <CircularMetricCard key={metric.title} metric={metric} />
                  ))}
                </div>

                {/* E. Shooting Line Chart */}
                <div className="bg-gradient-to-br from-[#1b1c28] to-[#252834] p-6 rounded-xl border border-[#3b3e4e] shadow-2xl">
                  
                  {/* Chart Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white">
                      Data: Shooting from last 5 matches
                    </h2>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.8)]">
                        Analyzed by
                      </span>
                      <Image
                        src="/images/new-logo.png"
                        alt="Analyzer logo"
                        width={80}
                        height={24}
                        className="opacity-90"
                      />
                    </div>
                  </div>

                  {/* Chart Component Container */}
                  <div className="h-96 w-full">
                    <ShootingChart />
                  </div>
                </div>

                {/* H. Detailed Match Tables Placeholder */}
                <div className="mt-6">
    <DetailedStatTables />
</div>
              </div>

              {/* --- RIGHT COLUMN: Tactical Graphics --- */}
              <div className="space-y-6">
                
                {/* F. Heatmap (Top Green) */}
                <ZoneHeatmap />

                {/* G. Goal Distribution (Middle Purple) */}
                <GoalDistributionCard />

                {/* H. Trajectories (Bottom Blue) */}
                <ShotTrajectoryCard />
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}