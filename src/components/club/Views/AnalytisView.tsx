'use client';

import CircularMetricCard from "@/components/club/CircularMetricCard";
import GoalDistributionCard from "@/components/club/GoalDistributionCard";
import ZoneHeatmap from "@/components/club/Heatmap/HeatMapCard";
import ShootingChart from "@/components/club/ShootingChart";
import ShotTrajectoryCard from "@/components/club/ShotTrajectory";
import { STATIC_METRICS } from "@/staticdata/club";
import Image from "next/image";
import DetailedStatTables from "../DetailedStatTables";
import { useState } from "react";
import ShootingBarChart from "../ShootingBarChar";

export default function AnalyticsView() {
  const [isBarChart, setIsBarChart] = useState(false)
  return (
    <div className="space-y-6 animate-fadeIn"> {/* Added animation class */}

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_350px] gap-6">
        <div className="space-y-6">
          {/* D. CIRCULAR METRICS ROW */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATIC_METRICS.map((metric) => (
              <CircularMetricCard
                key={metric.title}
                metric={metric}
                matchesPlayed={5} // <--- Pass the number of matches here
              />
            ))}
          </div>

          {/* Shooting Chart */}
          <div className="bg-gradient-to-br from-[#1b1c28] to-[#252834] p-6 rounded-xl border border-[#3b3e4e] shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Data: Shooting from last 5 matches</h2>
              <button
                onClick={() => setIsBarChart(prev => !prev)}
                className="bg-gray-500 p-2 rounded-md text-white hover:bg-gray-600 transition-colors"
              >
                Switch to {isBarChart ? "Line Graph" : "Bar Chart"}
              </button>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Image src="/images/new-logo.png" alt="logo" width={80} height={24} className="opacity-90" />
              </div>
            </div>
            <div className="h-96 w-full">
              {isBarChart ? <ShootingBarChart /> :<ShootingChart />}
            </div>
          </div>

          {/* Detailed Tables */}
          <div className="mt-6">
            <DetailedStatTables />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <ZoneHeatmap />
          <GoalDistributionCard />
          <ShotTrajectoryCard />
        </div>
      </div>
    </div>
  );
}