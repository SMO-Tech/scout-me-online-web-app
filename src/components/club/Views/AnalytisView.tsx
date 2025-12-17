'use client';

import CircularMetricCard from "@/components/club/CircularMetricCard";
import GoalDistributionCard from "@/components/club/GoalDistributionCard";
import ZoneHeatmap from "@/components/club/Heatmap/HeatMapCard";
import ShootingChart from "@/components/club/ShootingChart";
import ShotTrajectoryCard from "@/components/club/ShotTrajectory";
import { STATIC_METRICS } from "@/staticdata/club";
import Image from "next/image";
import DetailedStatTables from "../DetailedStatTables";
import ClubHeaderCard from "../ClubHeaderCard";
import WinLoseStat from "../WinLoseStat";
import FormationStats from "../FormationStats";

export default function AnalyticsView() {
  return (
    <div className="space-y-6 animate-fadeIn"> {/* Added animation class */}
      
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_350px] gap-6">
        <div className="space-y-6">
          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATIC_METRICS.map((metric) => (
              <CircularMetricCard key={metric.title} metric={metric} />
            ))}
          </div>

          {/* Shooting Chart */}
          <div className="bg-gradient-to-br from-[#1b1c28] to-[#252834] p-6 rounded-xl border border-[#3b3e4e] shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Data: Shooting from last 5 matches</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Image src="/images/new-logo.png" alt="logo" width={80} height={24} className="opacity-90" />
              </div>
            </div>
            <div className="h-96 w-full">
              <ShootingChart />
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