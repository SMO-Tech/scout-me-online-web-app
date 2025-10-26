'use client'
import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { MatchAnalysisData } from '@/types/matchAnalysis';

interface PassAnalysisChartProps {
  data: MatchAnalysisData;
}

const PassAnalysisChart: React.FC<PassAnalysisChartProps> = ({ data }) => {
  return (
    <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-600/30 rounded-xl p-6">
      <h4 className="text-2xl font-bold text-cyan-300 mb-6">Pass Accuracy Trends</h4>
      
      {/* Pass Accuracy Over Time */}
      <div className="mb-8">
        <h5 className="text-lg font-semibold text-purple-300 mb-4">Match Timeline Analysis</h5>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data.timeSeriesData}>
            <defs>
              <linearGradient id="colorHome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6CABDD" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#6CABDD" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorAway" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C8102E" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#C8102E" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
              stroke="#9CA3AF"
              label={{ value: 'Match Time (minutes)', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }}
            />
            <YAxis 
              stroke="#9CA3AF"
              label={{ value: 'Pass Accuracy (%)', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
              domain={[70, 100]}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
              labelStyle={{ color: '#F3F4F6' }}
              formatter={(value: number) => [`${value.toFixed(1)}%`, '']}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Area 
              type="monotone" 
              dataKey="homePassAccuracy" 
              stroke="#6CABDD" 
              fillOpacity={1} 
              fill="url(#colorHome)"
              name={data.matchMetadata.homeTeam.split(' ')[0]}
            />
            <Area 
              type="monotone" 
              dataKey="awayPassAccuracy" 
              stroke="#C8102E" 
              fillOpacity={1} 
              fill="url(#colorAway)"
              name={data.matchMetadata.awayTeam.split(' ')[0]}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Pass Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Passes</p>
              <p className="text-3xl font-bold text-blue-300 mt-1">{data.analysisResult.totalPasses}</p>
            </div>
            <div className="text-blue-400 text-4xl">⚽</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Successful</p>
              <p className="text-3xl font-bold text-green-300 mt-1">{data.analysisResult.successfulPasses}</p>
            </div>
            <div className="text-green-400 text-4xl">✓</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Failed</p>
              <p className="text-3xl font-bold text-red-300 mt-1">
                {data.analysisResult.totalPasses - data.analysisResult.successfulPasses}
              </p>
            </div>
            <div className="text-red-400 text-4xl">✗</div>
          </div>
        </div>
      </div>

      {/* Pass Distribution */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-purple-600/10 to-purple-800/10 border border-purple-500/20 rounded-lg p-4">
          <h6 className="text-sm font-semibold text-gray-400 mb-2">Home Team Passes</h6>
          <div className="flex items-end gap-2">
            <p className="text-4xl font-bold text-blue-300">{data.analysisResult.homeTeamPasses}</p>
            <p className="text-lg text-gray-400 mb-1">
              ({((data.analysisResult.homeTeamPasses / data.analysisResult.totalPasses) * 100).toFixed(1)}%)
            </p>
          </div>
          <div className="mt-2 bg-blue-500/20 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(data.analysisResult.homeTeamPasses / data.analysisResult.totalPasses) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-600/10 to-purple-800/10 border border-purple-500/20 rounded-lg p-4">
          <h6 className="text-sm font-semibold text-gray-400 mb-2">Away Team Passes</h6>
          <div className="flex items-end gap-2">
            <p className="text-4xl font-bold text-red-300">{data.analysisResult.awayTeamPasses}</p>
            <p className="text-lg text-gray-400 mb-1">
              ({((data.analysisResult.awayTeamPasses / data.analysisResult.totalPasses) * 100).toFixed(1)}%)
            </p>
          </div>
          <div className="mt-2 bg-red-500/20 rounded-full h-2">
            <div 
              className="bg-red-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(data.analysisResult.awayTeamPasses / data.analysisResult.totalPasses) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassAnalysisChart;

