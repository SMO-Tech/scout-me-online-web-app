'use client'
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { MatchAnalysisData } from '@/types/matchAnalysis';

interface MatchSummaryWidgetProps {
  data: MatchAnalysisData;
}

const MatchSummaryWidget: React.FC<MatchSummaryWidgetProps> = ({ data }) => {
  const passSuccessData = [
    { name: 'Successful Passes', value: data.analysisResult.successfulPasses, color: '#2ECC71' },
    { name: 'Failed Passes', value: data.analysisResult.totalPasses - data.analysisResult.successfulPasses, color: '#E74C3C' }
  ];

  const possessionData = [
    { team: data.matchMetadata.homeTeam.split(' ')[0], possession: data.homeTeamStats.possession, fill: '#6CABDD' },
    { team: data.matchMetadata.awayTeam.split(' ')[0], possession: data.awayTeamStats.possession, fill: '#C8102E' }
  ];

  const radarData = [
    {
      metric: 'Pass Accuracy',
      home: data.homeTeamStats.passAccuracy,
      away: data.awayTeamStats.passAccuracy,
    },
    {
      metric: 'Possession',
      home: data.homeTeamStats.possession,
      away: data.awayTeamStats.possession,
    },
    {
      metric: 'Shots',
      home: data.homeTeamStats.shotsOnTarget * 10,
      away: data.awayTeamStats.shotsOnTarget * 10,
    },
    {
      metric: 'Defense',
      home: data.homeTeamStats.defensiveActions,
      away: data.awayTeamStats.defensiveActions,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Match Header */}
      <div className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
        <div className="flex justify-between items-center">
          <div className="text-center flex-1">
            <h3 className="text-2xl font-bold text-cyan-300">{data.matchMetadata.homeTeam}</h3>
            <p className="text-gray-400 text-sm mt-1">Home</p>
          </div>
          <div className="text-center px-8">
            <div className="text-4xl font-extrabold text-purple-300">{data.matchMetadata.score}</div>
            <p className="text-gray-400 text-xs mt-2">{new Date(data.matchMetadata.date).toLocaleDateString()}</p>
          </div>
          <div className="text-center flex-1">
            <h3 className="text-2xl font-bold text-cyan-300">{data.matchMetadata.awayTeam}</h3>
            <p className="text-gray-400 text-sm mt-1">Away</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pass Success Rate Pie Chart */}
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-600/30 rounded-xl p-6">
          <h4 className="text-xl font-bold text-cyan-300 mb-4 text-center">Pass Success Rate</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={passSuccessData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {passSuccessData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center mt-4">
            <p className="text-3xl font-bold text-green-400">{data.analysisResult.passAccuracy.toFixed(1)}%</p>
            <p className="text-gray-400 text-sm">Overall Accuracy</p>
          </div>
        </div>

        {/* Team Possession Bar Chart */}
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-600/30 rounded-xl p-6">
          <h4 className="text-xl font-bold text-cyan-300 mb-4 text-center">Team Possession</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={possessionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="team" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Bar dataKey="possession" radius={[8, 8, 0, 0]}>
                {possessionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">{data.homeTeamStats.possession}%</p>
              <p className="text-gray-400 text-xs">Home</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">{data.awayTeamStats.possession}%</p>
              <p className="text-gray-400 text-xs">Away</p>
            </div>
          </div>
        </div>

        {/* Team Performance Radar */}
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-600/30 rounded-xl p-6">
          <h4 className="text-xl font-bold text-cyan-300 mb-4 text-center">Team Performance</h4>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="metric" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <PolarRadiusAxis stroke="#9CA3AF" />
              <Radar name={data.matchMetadata.homeTeam.split(' ')[0]} dataKey="home" stroke="#6CABDD" fill="#6CABDD" fillOpacity={0.6} />
              <Radar name={data.matchMetadata.awayTeam.split(' ')[0]} dataKey="away" stroke="#C8102E" fill="#C8102E" fillOpacity={0.6} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MatchSummaryWidget;

