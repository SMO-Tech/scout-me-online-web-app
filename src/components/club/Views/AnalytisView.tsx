'use client';

import CircularMetricCard from "@/components/club/CircularMetricCard";
import GoalDistributionCard from "@/components/club/GoalDistributionCard";
import ZoneHeatmap from "@/components/club/Heatmap/HeatMapCard";
import ShootingChart from "@/components/club/ShootingChart";
import ShotTrajectoryCard from "@/components/club/ShotTrajectory";
import { STATIC_METRICS } from "@/staticdata/club";
import Image from "next/image";
import DetailedStatTables from "../DetailedStatTables";
import { useState, useEffect } from "react";
import ShootingBarChart from "../ShootingBarChar";
import { getClient } from "@/lib/api/client";
import { FiChevronDown, FiX, FiBarChart2 } from "react-icons/fi";
import {
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

interface AnalyticsViewProps {
  clubId?: string;
}

type ActionType = 'all_matches' | 'last_1_match' | 'last_5_matches' | 'last_12_matches';

interface ClubStatisticsData {
  action_type: string;
  donut_chart_data?: {
    attacking?: { total: number; failed: number; successful: number };
    defensive?: { total: number; failed: number; successful: number };
  };
  goalpost_statistics_data?: Record<string, number>;
  statistics_data?: {
    attacking?: Record<string, number>;
    defensive?: Record<string, number>;
    goalkeeper?: Record<string, number>;
  };
  heatmap_data?: {
    All?: Record<string, { Percentage: number; TotalAction: number }>;
    Total?: { All: number; Attacking: number; Defensive: number };
    Attacking?: Record<string, { Percentage: number; TotalAction: number }>;
    Defensive?: Record<string, { Percentage: number; TotalAction: number }>;
  };
}

export default function AnalyticsView({ clubId }: AnalyticsViewProps) {
  const [isBarChart, setIsBarChart] = useState(false);
  const [selectedActionType, setSelectedActionType] = useState<ActionType>('all_matches');
  const [showActionDropdown, setShowActionDropdown] = useState(false);
  const [showSpiderModal, setShowSpiderModal] = useState(false);
  const [showDonutModal, setShowDonutModal] = useState(false);
  
  const [statisticsData, setStatisticsData] = useState<ClubStatisticsData | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  // Fetch statistics data when clubId or selectedActionType changes
  useEffect(() => {
    const fetchStatisticsData = async () => {
      if (!clubId) {
        return;
      }

      setLoadingData(true);
      setDataError(null);

      try {
        const client = await getClient();
        const response = await client.get(`/statics/club/${clubId}`);

        if (response.data?.status === 'success' && response.data?.data) {
          // Find the selected action type (or use the first one if not found)
          const selectedData = response.data.data.find(
            (item: any) => item.action_type === selectedActionType
          ) || response.data.data.find(
            (item: any) => item.action_type === 'all_matches'
          ) || response.data.data[0];

          if (selectedData) {
            setStatisticsData(selectedData);
          } else {
            setDataError('No data found for selected period');
            setStatisticsData(null);
          }
        } else {
          setDataError('Failed to fetch statistics data');
          setStatisticsData(null);
        }
      } catch (err: any) {
        console.error('Failed to fetch statistics data:', err);
        setDataError(err?.response?.data?.message || 'Failed to load statistics data');
        setStatisticsData(null);
      } finally {
        setLoadingData(false);
      }
    };

    fetchStatisticsData();
  }, [clubId, selectedActionType]);

  // Convert heatmap data to component format
  const heatmapData: Record<string, number> | null = statisticsData?.heatmap_data?.All
    ? (() => {
        const converted: Record<string, number> = {};
        Object.entries(statisticsData.heatmap_data.All).forEach(([letter, data]: [string, any]) => {
          if (data && typeof data === 'object' && 'Percentage' in data) {
            converted[letter] = data.Percentage;
          }
        });
        return Object.keys(converted).length > 0 ? converted : null;
      })()
    : null;
  const actionTypeOptions: { value: ActionType; label: string }[] = [
    { value: 'all_matches', label: 'All Matches' },
    { value: 'last_12_matches', label: 'Last 12 Matches' },
    { value: 'last_5_matches', label: 'Last 5 Matches' },
    { value: 'last_1_match', label: 'Last Match' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Action Type Dropdown and Diagram Buttons */}
      {clubId && (
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSpiderModal(true)}
              disabled={!statisticsData?.statistics_data}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-purple-500/20"
            >
              <FiBarChart2 className="w-4 h-4" />
              Spider Diagram
            </button>
            <button
              onClick={() => setShowDonutModal(true)}
              disabled={!statisticsData?.donut_chart_data}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-purple-500/20"
            >
              <FiBarChart2 className="w-4 h-4" />
              Donut Diagram
            </button>
          </div>
          <div className="flex items-center justify-end gap-3">
            <span className="text-sm text-gray-400">
              Statistics Data below is from:
            </span>
            <div className="relative">
              <button
                onClick={() => setShowActionDropdown(!showActionDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-700 transition-colors"
              >
                <span>{actionTypeOptions.find(opt => opt.value === selectedActionType)?.label || 'All Matches'}</span>
                <FiChevronDown className={`w-4 h-4 transition-transform ${showActionDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showActionDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowActionDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl py-1 z-20 border border-gray-700">
                    {actionTypeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedActionType(option.value);
                          setShowActionDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors ${
                          selectedActionType === option.value ? 'bg-purple-600/20 text-purple-400' : 'text-gray-300'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_350px] gap-6">
        <div className="space-y-6">
          

          {/* Shooting Chart */}
          <div className="bg-gradient-to-br from-[#1b1c28] to-[#252834] p-6 rounded-xl border border-[#3b3e4e] shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg text-white"> 
                <span className="text-cyan-300">Data:</span> Shooting from {actionTypeOptions.find(opt => opt.value === selectedActionType)?.label.toLowerCase() || 'all matches'}
              </h2>
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

          {/* Detailed Tables */}
          <div className="mt-6">
            <DetailedStatTables />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {loadingData ? (
            <div className="w-full max-w-md mx-auto bg-gray-900 rounded-xl p-8 flex flex-col items-center justify-center min-h-[500px]">
              <div className="w-12 h-12 border-2 border-purple-700 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400 text-sm">Loading data...</p>
            </div>
          ) : dataError ? (
            <div className="w-full max-w-md mx-auto bg-gray-900 rounded-xl p-8 flex flex-col items-center justify-center min-h-[500px]">
              <p className="text-red-400 text-sm text-center">{dataError}</p>
            </div>
          ) : heatmapData ? (
            <ZoneHeatmap heatmapData={heatmapData} />
          ) : (
            <div className="w-full max-w-md mx-auto">
              <ZoneHeatmap heatmapData={undefined} />
              <div className="mt-2 text-center">
                <p className="text-gray-400 text-sm">No data available</p>
              </div>
            </div>
          )}
          <GoalDistributionCard 
            goalpostData={statisticsData?.goalpost_statistics_data || undefined}
            hasData={!!statisticsData?.goalpost_statistics_data}
          />
          <ShotTrajectoryCard 
            donutData={statisticsData?.donut_chart_data || undefined}
            hasData={!!statisticsData?.donut_chart_data}
          />
        </div>
      </div>

      {/* Spider Diagram Modal */}
      {showSpiderModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#0d1117] to-[#161b22] rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/20">
            <div className="sticky top-0 bg-gradient-to-br from-[#0d1117] to-[#161b22] border-b border-purple-500/20 p-6 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <FiBarChart2 className="text-purple-400" />
                Spider Diagrams
              </h2>
              <button
                onClick={() => setShowSpiderModal(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-6">
              {statisticsData?.statistics_data ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Attacking Spider Chart */}
                  {statisticsData.statistics_data?.attacking && (() => {
                    const attackingStats = statisticsData.statistics_data.attacking;
                    const attackingData = Object.entries(attackingStats).map(([key, value]) => ({
                      subject: key,
                      value: typeof value === 'number' ? value : 0,
                      fullMark: Math.max(...Object.values(attackingStats).map(v => typeof v === 'number' ? v : 0)) * 1.2 || 2
                    }));

                    return (
                      <div className="bg-[#0a0b0f]/60 backdrop-blur border border-purple-500/20 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-purple-400 mb-4">Attacking Metrics</h3>
                        <div className="w-full h-[350px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={attackingData}>
                              <PolarGrid stroke="#374151" />
                              <PolarAngleAxis
                                dataKey="subject"
                                tick={{ fill: '#9ca3af', fontSize: 10 }}
                                tickFormatter={(value) => value.length > 8 ? value.substring(0, 8) + '...' : value}
                              />
                              <PolarRadiusAxis
                                angle={90}
                                domain={[0, 'dataMax']}
                                tick={{ fill: '#6b7280', fontSize: 9 }}
                                axisLine={false}
                              />
                              <Radar
                                name="Attacking"
                                dataKey="value"
                                stroke="#a855f7"
                                fill="#a855f7"
                                fillOpacity={0.3}
                                strokeWidth={2}
                              />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: '#0d1117',
                                  border: '1px solid #374151',
                                  borderRadius: '8px',
                                  color: '#fff'
                                }}
                                formatter={(value: number | undefined) => value !== undefined ? value.toFixed(2) : '0.00'}
                              />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Defensive Spider Chart */}
                  {statisticsData.statistics_data?.defensive && (() => {
                    const defensiveStats = statisticsData.statistics_data.defensive;
                    const defensiveData = Object.entries(defensiveStats).map(([key, value]) => ({
                      subject: key,
                      value: typeof value === 'number' ? value : 0,
                      fullMark: Math.max(...Object.values(defensiveStats).map(v => typeof v === 'number' ? v : 0)) * 1.2 || 2
                    }));

                    return (
                      <div className="bg-[#0a0b0f]/60 backdrop-blur border border-cyan-500/20 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-cyan-400 mb-4">Defensive Metrics</h3>
                        <div className="w-full h-[350px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={defensiveData}>
                              <PolarGrid stroke="#374151" />
                              <PolarAngleAxis
                                dataKey="subject"
                                tick={{ fill: '#9ca3af', fontSize: 10 }}
                                tickFormatter={(value) => value.length > 8 ? value.substring(0, 8) + '...' : value}
                              />
                              <PolarRadiusAxis
                                angle={90}
                                domain={[0, 'dataMax']}
                                tick={{ fill: '#6b7280', fontSize: 9 }}
                                axisLine={false}
                              />
                              <Radar
                                name="Defensive"
                                dataKey="value"
                                stroke="#06b6d4"
                                fill="#06b6d4"
                                fillOpacity={0.3}
                                strokeWidth={2}
                              />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: '#0d1117',
                                  border: '1px solid #374151',
                                  borderRadius: '8px',
                                  color: '#fff'
                                }}
                                formatter={(value: number | undefined) => value !== undefined ? value.toFixed(2) : '0.00'}
                              />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Goalkeeper Spider Chart */}
                  {statisticsData.statistics_data?.goalkeeper && (() => {
                    const goalkeeperStats = statisticsData.statistics_data.goalkeeper;
                    const goalkeeperData = Object.entries(goalkeeperStats).map(([key, value]) => ({
                      subject: key,
                      value: typeof value === 'number' ? value : 0,
                      fullMark: Math.max(...Object.values(goalkeeperStats).map(v => typeof v === 'number' ? v : 0)) * 1.2 || 2
                    }));

                    return (
                      <div className="bg-[#0a0b0f]/60 backdrop-blur border border-yellow-500/20 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-yellow-400 mb-4">Goalkeeper Metrics</h3>
                        <div className="w-full h-[350px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={goalkeeperData}>
                              <PolarGrid stroke="#374151" />
                              <PolarAngleAxis
                                dataKey="subject"
                                tick={{ fill: '#9ca3af', fontSize: 10 }}
                                tickFormatter={(value) => value.length > 8 ? value.substring(0, 8) + '...' : value}
                              />
                              <PolarRadiusAxis
                                angle={90}
                                domain={[0, 'dataMax']}
                                tick={{ fill: '#6b7280', fontSize: 9 }}
                                axisLine={false}
                              />
                              <Radar
                                name="Goalkeeper"
                                dataKey="value"
                                stroke="#eab308"
                                fill="#eab308"
                                fillOpacity={0.3}
                                strokeWidth={2}
                              />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: '#0d1117',
                                  border: '1px solid #374151',
                                  borderRadius: '8px',
                                  color: '#fff'
                                }}
                                formatter={(value: number | undefined) => value !== undefined ? value.toFixed(2) : '0.00'}
                              />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">No statistics data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Donut Diagram Modal */}
      {showDonutModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#0d1117] to-[#161b22] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/20">
            <div className="sticky top-0 bg-gradient-to-br from-[#0d1117] to-[#161b22] border-b border-purple-500/20 p-6 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <FiBarChart2 className="text-purple-400" />
                Donut Diagrams
              </h2>
              <button
                onClick={() => setShowDonutModal(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-6">
              {statisticsData?.donut_chart_data ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Attacking Donut Chart */}
                  {statisticsData.donut_chart_data.attacking && (
                    <div className="bg-[#0a0b0f]/60 backdrop-blur border border-purple-500/20 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-purple-400 mb-4">Attacking Actions</h3>
                      <div className="flex flex-col items-center">
                        <div className="w-full max-w-[300px] h-[250px] mb-4">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: 'Successful', value: statisticsData.donut_chart_data.attacking.successful },
                                  { name: 'Failed', value: statisticsData.donut_chart_data.attacking.failed }
                                ]}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={2}
                                dataKey="value"
                              >
                                <Cell fill="#a855f7" />
                                <Cell fill="#ef4444" />
                              </Pie>
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: '#0d1117',
                                  border: '1px solid #374151',
                                  borderRadius: '8px',
                                  color: '#fff'
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="space-y-2 w-full">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Total</span>
                            <span className="text-white font-bold">{statisticsData.donut_chart_data.attacking.total}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-purple-400">Successful</span>
                            <span className="text-purple-400 font-bold">{statisticsData.donut_chart_data.attacking.successful}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-red-400">Failed</span>
                            <span className="text-red-400 font-bold">{statisticsData.donut_chart_data.attacking.failed}</span>
                          </div>
                          <div className="mt-4 pt-4 border-t border-white/5">
                            <div className="text-sm text-gray-500">
                              Success Rate: {statisticsData.donut_chart_data.attacking.total > 0 
                                ? ((statisticsData.donut_chart_data.attacking.successful / statisticsData.donut_chart_data.attacking.total) * 100).toFixed(1)
                                : 0}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Defensive Donut Chart */}
                  {statisticsData.donut_chart_data.defensive && (
                    <div className="bg-[#0a0b0f]/60 backdrop-blur border border-cyan-500/20 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-cyan-400 mb-4">Defensive Actions</h3>
                      <div className="flex flex-col items-center">
                        <div className="w-full max-w-[300px] h-[250px] mb-4">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: 'Successful', value: statisticsData.donut_chart_data.defensive.successful },
                                  { name: 'Failed', value: statisticsData.donut_chart_data.defensive.failed }
                                ]}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={2}
                                dataKey="value"
                              >
                                <Cell fill="#06b6d4" />
                                <Cell fill="#ef4444" />
                              </Pie>
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: '#0d1117',
                                  border: '1px solid #374151',
                                  borderRadius: '8px',
                                  color: '#fff'
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="space-y-2 w-full">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Total</span>
                            <span className="text-white font-bold">{statisticsData.donut_chart_data.defensive.total}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-cyan-400">Successful</span>
                            <span className="text-cyan-400 font-bold">{statisticsData.donut_chart_data.defensive.successful}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-red-400">Failed</span>
                            <span className="text-red-400 font-bold">{statisticsData.donut_chart_data.defensive.failed}</span>
                          </div>
                          <div className="mt-4 pt-4 border-t border-white/5">
                            <div className="text-sm text-gray-500">
                              Success Rate: {statisticsData.donut_chart_data.defensive.total > 0 
                                ? ((statisticsData.donut_chart_data.defensive.successful / statisticsData.donut_chart_data.defensive.total) * 100).toFixed(1)
                                : 0}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">No donut chart data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}