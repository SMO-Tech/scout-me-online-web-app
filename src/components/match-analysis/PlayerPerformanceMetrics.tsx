'use client'
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PlayerStats } from '@/types/matchAnalysis';

interface PlayerPerformanceMetricsProps {
  players: PlayerStats[];
}

type MetricType = 'passAccuracy' | 'totalPasses' | 'distanceCovered' | 'possessionTime';

const PlayerPerformanceMetrics: React.FC<PlayerPerformanceMetricsProps> = ({ players }) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('passAccuracy');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const metrics = {
    passAccuracy: { label: 'Pass Accuracy (%)', key: 'passAccuracy' },
    totalPasses: { label: 'Total Passes', key: 'totalPasses' },
    distanceCovered: { label: 'Distance Covered (km)', key: 'distanceCovered' },
    possessionTime: { label: 'Possession Time (min)', key: 'possessionTime' }
  };

  const sortedPlayers = [...players].sort((a, b) => {
    const aValue = a[selectedMetric];
    const bValue = b[selectedMetric];
    return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
  });

  const chartData = sortedPlayers.map(player => ({
    name: player.playerName.split(' ').pop(),
    value: player[selectedMetric],
    fullName: player.playerName,
    color: player.teamColor
  }));

  const toggleSort = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-600/30 rounded-xl p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h4 className="text-2xl font-bold text-cyan-300">Player Performance</h4>
        
        <div className="flex gap-2 flex-wrap">
          {Object.entries(metrics).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => setSelectedMetric(key as MetricType)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                selectedMetric === key
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
              }`}
            >
              {label.split('(')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis type="number" stroke="#9CA3AF" />
          <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={90} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
            labelStyle={{ color: '#F3F4F6' }}
            formatter={(value: number) => [`${value.toFixed(1)} ${selectedMetric === 'passAccuracy' ? '%' : ''}`, '']}
          />
          <Bar dataKey="value" radius={[0, 8, 8, 0]}>
            {chartData.map((entry) => (
              <Cell key={`cell-${entry.fullName}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Player Stats Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="text-left py-3 px-4 text-gray-300 font-semibold">Player</th>
              <th className="text-center py-3 px-4 text-gray-300 font-semibold cursor-pointer hover:text-cyan-300" onClick={toggleSort}>
                {metrics[selectedMetric].label} {sortOrder === 'desc' ? '↓' : '↑'}
              </th>
              <th className="text-center py-3 px-4 text-gray-300 font-semibold">Passes</th>
              <th className="text-center py-3 px-4 text-gray-300 font-semibold">Success Rate</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player) => (
              <tr key={player.playerName} className="border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: player.teamColor }}></div>
                    <span className="text-gray-200 font-medium">{player.playerName}</span>
                  </div>
                </td>
                <td className="text-center py-3 px-4 text-cyan-300 font-bold">
                  {player[selectedMetric].toFixed(1)}{selectedMetric === 'passAccuracy' ? '%' : ''}
                </td>
                <td className="text-center py-3 px-4 text-gray-300">
                  {player.successfulPasses}/{player.totalPasses}
                </td>
                <td className="text-center py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    player.passAccuracy >= 90 ? 'bg-green-500/20 text-green-400' :
                    player.passAccuracy >= 80 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {player.passAccuracy.toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlayerPerformanceMetrics;

