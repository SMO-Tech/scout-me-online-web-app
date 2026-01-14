"use client"

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import {
  FiBarChart2, FiTrendingUp, FiAlertCircle, FiActivity
} from 'react-icons/fi'
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
} from 'recharts'
import { getClient } from '@/lib/api/client'
import { extractPlayerId } from '@/lib/utils/slug'
import PlayerHeatmap from './PlayerHeatmap'

interface PlayerStatistics {
  cache_type: string;
  player_id: string;
  action_type: string;
  attacking_spider: Record<string, number>;
  defensive_spider: Record<string, number>;
  attacking_donut: {
    total: number;
    failed: number;
    successful: number;
  };
  defensive_donut: {
    total: number;
    failed: number;
    successful: number;
  };
  attacking_heatmap: Record<string, number>;
  defensive_heatmap: Record<string, number>;
  goalpost_statistics_data: Record<string, number>;
  summary_table: Record<string, any>;
}

const PlayerStatisticsView = () => {
  const params = useParams()
  const slugOrId = params.id as string
  const playerId = extractPlayerId(slugOrId)
  const [statistics, setStatistics] = useState<PlayerStatistics[]>([])
  const [isLoadingStats, setIsLoadingStats] = useState(false)
  const [statsError, setStatsError] = useState<string | null>(null)
  const [selectedActionType, setSelectedActionType] = useState<string>('all_matches')
  const [playerIdForStats, setPlayerIdForStats] = useState<string | null>(null)

  // First fetch player data to get playerId
  useEffect(() => {
    const fetchPlayerData = async () => {
      if (!playerId) {
        setStatsError('Player ID is required')
        setIsLoadingStats(false)
        return
      }

      try {
        const client = await getClient()
        const response = await client.get(`/player/${playerId}`)

        if (response.data?.status === 'success' && response.data?.data) {
          const data = response.data.data
          const statPlayerId = data.playerId || data.id || playerId
          setPlayerIdForStats(statPlayerId.toString())
        } else {
          setStatsError('Failed to fetch player details')
        }
      } catch (err: any) {
        console.error("Failed to fetch player details:", err)
        setStatsError('Failed to load player information')
      }
    }

    fetchPlayerData()
  }, [playerId])

  // Fetch statistics when playerIdForStats is available
  useEffect(() => {
    if (!playerIdForStats) return

    const fetchPlayerStatistics = async () => {
      setIsLoadingStats(true)
      setStatsError(null)

      try {
        const client = await getClient()
        const response = await client.get(`/statics/player?player_id=${playerIdForStats}`)

        if (response.data?.status === 'success' && response.data?.data) {
          setStatistics(response.data.data)
          // Set default action type to first available or 'all_matches'
          if (response.data.data.length > 0) {
            const allMatches = response.data.data.find((s: PlayerStatistics) => s.action_type === 'all_matches')
            if (allMatches) {
              setSelectedActionType('all_matches')
            } else {
              setSelectedActionType(response.data.data[0].action_type)
            }
          }
        } else {
          setStatsError('Failed to fetch player statistics')
          setStatistics([])
        }
      } catch (err: any) {
        console.error("Failed to fetch player statistics:", err)
        setStatsError(err.response?.data?.message || err.message || "Failed to load statistics")
        setStatistics([])
      } finally {
        setIsLoadingStats(false)
      }
    }

    fetchPlayerStatistics()
  }, [playerIdForStats])

  if (isLoadingStats) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-[#0a0b0f] to-[#1a1b23] rounded-3xl border border-emerald-500/10">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <FiActivity className="text-emerald-500" size={20} />
            </div>
          </div>
          <p className="text-gray-400 font-medium">Loading player statistics...</p>
        </div>
      </div>
    )
  }

  if (statsError && statistics.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-[#0a0b0f] to-[#1a1b23] rounded-3xl border border-red-500/20">
        <div className="text-center">
          <FiAlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <p className="text-gray-400 text-lg">{statsError}</p>
        </div>
      </div>
    )
  }

  if (statistics.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-[#0a0b0f] to-[#1a1b23] rounded-3xl border border-gray-500/20">
        <div className="text-center">
          <FiBarChart2 className="mx-auto mb-4 text-gray-500" size={48} />
          <p className="text-gray-400 text-lg">No statistics available for this player.</p>
        </div>
      </div>
    )
  }

  const selectedStat = statistics.find(s => s.action_type === selectedActionType)
  if (!selectedStat) return null

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Action Type Selector */}
      <div className="bg-gradient-to-br from-[#0d1117] to-[#161b22] border border-emerald-500/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <FiBarChart2 className="text-emerald-400" /> Player Statistics
          </h2>
          <div className="flex gap-2 flex-wrap">
            {statistics.map((stat) => (
              <button
                key={stat.action_type}
                onClick={() => setSelectedActionType(stat.action_type)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${selectedActionType === stat.action_type
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-[#0a0b0f] text-gray-400 border border-white/5 hover:border-emerald-500/30 hover:text-emerald-400'
                  }`}
              >
                {stat.action_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {/* Summary Table */}
          {selectedStat.summary_table && (
            <div className="bg-[#0a0b0f]/60 backdrop-blur border border-white/5 rounded-xl p-6 overflow-x-auto">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FiTrendingUp className="text-emerald-400" /> Summary Statistics
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Action</th>
                      <th className="text-right py-3 px-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Total</th>
                      <th className="text-right py-3 px-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Conversion (%)</th>
                      <th className="text-right py-3 px-4 text-sm font-bold text-gray-400 uppercase tracking-wider">APG</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(selectedStat.summary_table).map(([key, value]: [string, any], index) => {
                      if (typeof value === 'object' && value !== null) {
                        // Format the action name
                        const formatActionName = (key: string): string => {
                          // Handle special cases
                          const nameMap: Record<string, string> = {
                            'overall_passes': 'Overall passes\n(incl free-kicks, Corners, Goal Kicks & throw in etc.)',
                            'successful_passes': 'Successful Passes\n(incl free-kicks, Corners, Goal Kicks & throw in etc.)',
                            'created_chances': 'Created Chances\n(incl free-kicks, Corners, Goal Kicks & throw in etc.)',
                            'assists': 'Assists\n(incl free-kicks, Corners, Goal Kicks & throw in etc.)',
                            'dribbling': 'Dribbling',
                            'successful_dribbling': 'Successful dribbling',
                            'key_dribbling': 'Key Dribbling',
                            'shots': 'Shots\n(includes from free-kicks & corners etc.)',
                            'shots_on_target': 'Shots on target\n(includes from free-kicks & corners etc.)',
                            'goals_excl_penalties': 'Goals\n(excluding penalties)',
                            'penalties_attempts': 'Penalties\n(attempts)',
                            'goals_from_penalties': 'Goals\n(from penalties)',
                            'total_goals': 'Total Goals\n(from all shots & penalties)',
                            'tackles': 'Tackles',
                            'tackles_completion': 'Tackles completion',
                            'key_tackle': 'Key Tackle',
                            'interception': 'Interception',
                            'interception_completion': 'Interception completion',
                            'key_intercept': 'Key Intercept',
                            'clearance': 'Clearance',
                            'clearance_completion': 'Clearance completion',
                            'key_clearance': 'Key Clearance',
                            'aerial_duel': 'Aerial Duel',
                            'aerial_duel_completion': 'Aerial Duel Completion',
                            'key_aerial_duel': 'Key Aerial Duel',
                            'ball_recovery': 'Ball Recovery',
                            'successful_ball_recovery': 'Successful Ball Recovery',
                            'key_ball_recovery': 'Key Ball Recovery',
                            'committed_foul': 'Got Fouled',
                            'sent_off': 'Sent Off',
                            'attempt_save_penalty': 'Attempt to save (Penalty)',
                            'save_completion_penalty': 'Save completion (Penalty)',
                            'goal_conceded_penalty': 'Goal Conceded (Penalty)',
                            'attempt_save_shot_stoppers': 'Attempt to save (Shot Stoppers)',
                            'save_completion_shot_stoppers': 'Save completion (Shot Stoppers)',
                            'goal_conceded_shot_stoppers': 'Goal Conceded (Shot Stoppers)',
                            'total_attempt_to_save': 'Total Attempt to save',
                            'total_save_completion': 'Total Save completion',
                            'total_goal_conceded': 'Total Goal Conceded',
                          };

                          if (nameMap[key]) {
                            return nameMap[key];
                          }

                          // Default formatting
                          return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                        };

                        const actionName = formatActionName(key);
                        const hasConversion = value.conversion_pct !== undefined;

                        return (
                          <tr
                            key={key}
                            className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${index % 2 === 0 ? 'bg-white/[0.01]' : ''
                              }`}
                          >
                            <td className="py-3 px-4">
                              <div className="text-white text-sm font-medium whitespace-pre-line">
                                {actionName}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right">
                              {value.total !== undefined ? (
                                <span className="text-white text-sm font-medium">{value.total}</span>
                              ) : (
                                <span className="text-gray-600 text-sm">-</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              {hasConversion ? (
                                <span className="text-emerald-400 text-sm font-medium">
                                  {value.conversion_pct.toFixed(2)}%
                                </span>
                              ) : (
                                <span className="text-gray-600 text-sm">-</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              {value.apg !== undefined ? (
                                <span className="text-white text-sm font-medium">{value.apg.toFixed(2)}</span>
                              ) : (
                                <span className="text-gray-600 text-sm">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      }
                      return null;
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Attacking & Defensive Donuts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedStat.attacking_donut && (
              <div className="bg-[#0a0b0f]/60 backdrop-blur border border-emerald-500/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-emerald-400 mb-4">Attacking Actions</h3>
                <div className="flex flex-col items-center">
                  <div className="w-full max-w-[300px] h-[250px] mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Successful', value: selectedStat.attacking_donut.successful },
                            { name: 'Failed', value: selectedStat.attacking_donut.failed }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          <Cell fill="#10b981" />
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
                      <span className="text-white font-bold">{selectedStat.attacking_donut.total}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-400">Successful</span>
                      <span className="text-emerald-400 font-bold">{selectedStat.attacking_donut.successful}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-red-400">Failed</span>
                      <span className="text-red-400 font-bold">{selectedStat.attacking_donut.failed}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <div className="text-sm text-gray-500">
                        Success Rate: {selectedStat.attacking_donut.total > 0
                          ? ((selectedStat.attacking_donut.successful / selectedStat.attacking_donut.total) * 100).toFixed(1)
                          : 0}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedStat.defensive_donut && (
              <div className="bg-[#0a0b0f]/60 backdrop-blur border border-cyan-500/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-cyan-400 mb-4">Defensive Actions</h3>
                <div className="flex flex-col items-center">
                  <div className="w-full max-w-[300px] h-[250px] mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Successful', value: selectedStat.defensive_donut.successful },
                            { name: 'Failed', value: selectedStat.defensive_donut.failed }
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
                      <span className="text-white font-bold">{selectedStat.defensive_donut.total}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-cyan-400">Successful</span>
                      <span className="text-cyan-400 font-bold">{selectedStat.defensive_donut.successful}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-red-400">Failed</span>
                      <span className="text-red-400 font-bold">{selectedStat.defensive_donut.failed}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <div className="text-sm text-gray-500">
                        Success Rate: {selectedStat.defensive_donut.total > 0
                          ? ((selectedStat.defensive_donut.successful / selectedStat.defensive_donut.total) * 100).toFixed(1)
                          : 0}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Spider Charts (Radar Charts) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedStat.attacking_spider && (() => {
              const attackingData = Object.entries(selectedStat.attacking_spider).map(([key, value]) => ({
                subject: key,
                value: value,
                fullMark: Math.max(...Object.values(selectedStat.attacking_spider)) * 1.2 || 2
              }));

              return (
                <div className="bg-[#0a0b0f]/60 backdrop-blur border border-emerald-500/20 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-emerald-400 mb-4">Attacking Metrics</h3>
                  <div className="w-full h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={attackingData}>
                        <PolarGrid stroke="#374151" />
                        <PolarAngleAxis
                          dataKey="subject"
                          tick={{ fill: '#9ca3af', fontSize: 11 }}
                          tickFormatter={(value) => {
                            const entry = attackingData.find(d => d.subject === value);
                            return entry ? `${value}: ${entry.value.toFixed(2)}` : value;
                          }}
                        />
                        <PolarRadiusAxis
                          angle={90}
                          domain={[0, 'dataMax']}
                          tick={{ fill: '#6b7280', fontSize: 10 }}
                          axisLine={false}
                        />
                        <Radar
                          name="Attacking"
                          dataKey="value"
                          stroke="#10b981"
                          fill="#10b981"
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

            {selectedStat.defensive_spider && (() => {
              const defensiveData = Object.entries(selectedStat.defensive_spider).map(([key, value]) => ({
                subject: key,
                value: value,
                fullMark: Math.max(...Object.values(selectedStat.defensive_spider)) * 1.2 || 2
              }));

              return (
                <div className="bg-[#0a0b0f]/60 backdrop-blur border border-cyan-500/20 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-cyan-400 mb-4">Defensive Metrics</h3>
                  <div className="w-full h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={defensiveData}>
                        <PolarGrid stroke="#374151" />
                        <PolarAngleAxis
                          dataKey="subject"
                          tick={{ fill: '#9ca3af', fontSize: 11 }}
                          tickFormatter={(value) => {
                            const entry = defensiveData.find(d => d.subject === value);
                            return entry ? `${value}: ${entry.value.toFixed(2)}` : value;
                          }}
                        />
                        <PolarRadiusAxis
                          angle={90}
                          domain={[0, 'dataMax']}
                          tick={{ fill: '#6b7280', fontSize: 10 }}
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
          </div>

          {/* Heatmaps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedStat.attacking_heatmap && Object.keys(selectedStat.attacking_heatmap).length > 0 && (
              <div className="bg-[#0a0b0f]/60 backdrop-blur border border-purple-500/20 rounded-xl p-6">
                <PlayerHeatmap
                  heatmapData={selectedStat.attacking_heatmap}
                  title="Attacking Heatmap"
                  color="#a855f7"
                />
              </div>
            )}

            {selectedStat.defensive_heatmap && Object.keys(selectedStat.defensive_heatmap).length > 0 && (
              <div className="bg-[#0a0b0f]/60 backdrop-blur border border-yellow-500/20 rounded-xl p-6">
                <PlayerHeatmap
                  heatmapData={selectedStat.defensive_heatmap}
                  title="Defensive Heatmap"
                  color="#eab308"
                />
              </div>
            )}
          </div>

          {/* Goalpost Statistics */}
          {selectedStat.goalpost_statistics_data && Object.keys(selectedStat.goalpost_statistics_data).length > 0 && (
            <div className="bg-[#0a0b0f]/60 backdrop-blur border border-pink-500/20 rounded-xl p-6">
              <h3 className="text-lg font-bold text-pink-400 mb-4">Goalpost Statistics</h3>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {Object.entries(selectedStat.goalpost_statistics_data).map(([zone, value]) => (
                  <div key={zone} className="bg-[#0d1117] border border-white/5 rounded-lg p-3 text-center">
                    <p className="text-gray-500 text-xs font-bold mb-1">Zone {zone}</p>
                    <p className="text-pink-400 font-bold">
                      {Number.isFinite(Number(value)) ? Number(value).toFixed(1) : "0.0"}%
                    </p>

                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PlayerStatisticsView

