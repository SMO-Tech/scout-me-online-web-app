'use client'
import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BallTrackingPoint } from '@/types/matchAnalysis';

interface BallTrackingVisualizationProps {
  data: import('@/types/matchAnalysis').MatchAnalysisData;
}

const BallTrackingVisualization: React.FC<BallTrackingVisualizationProps> = ({ data }) => {
  const { ballTracking } = data;
  const homePoints = ballTracking.filter(p => p.possession === 'home');
  const awayPoints = ballTracking.filter(p => p.possession === 'away');
  const neutralPoints = ballTracking.filter(p => p.possession === 'neutral');

  // Calculate heatmap zones
  const zones = {
    defense: ballTracking.filter(p => p.y < 20).length,
    midfield: ballTracking.filter(p => p.y >= 20 && p.y < 40).length,
    attack: ballTracking.filter(p => p.y >= 40).length,
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-600/30 rounded-xl p-6">
      <h4 className="text-2xl font-bold text-cyan-300 mb-6">Ball Tracking & Movement</h4>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Field Visualization */}
        <div className="lg:col-span-2">
          <div className="bg-green-900/20 border-2 border-white/20 rounded-lg p-4" style={{ aspectRatio: '100/60' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  domain={[0, 100]} 
                  stroke="#9CA3AF"
                  label={{ value: 'Field Width', position: 'insideBottom', offset: -10, fill: '#9CA3AF' }}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  domain={[0, 60]} 
                  stroke="#9CA3AF"
                  label={{ value: 'Field Length', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#F3F4F6' }}
                  formatter={(value: number, name: string) => [value.toFixed(1), name === 'x' ? 'X Position' : 'Y Position']}
                />
                <Scatter name="Home Possession" data={homePoints} fill="#6CABDD" opacity={0.6} />
                <Scatter name="Away Possession" data={awayPoints} fill="#C8102E" opacity={0.6} />
                <Scatter name="Neutral" data={neutralPoints} fill="#FFD700" opacity={0.4} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span className="text-gray-300 text-sm">Home Possession</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-gray-300 text-sm">Away Possession</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span className="text-gray-300 text-sm">Neutral</span>
            </div>
          </div>
        </div>

        {/* Zone Statistics */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 border border-red-500/30 rounded-lg p-4">
            <h5 className="text-sm font-semibold text-gray-400 mb-2">Attack Zone</h5>
            <div className="flex items-end gap-2">
              <p className="text-4xl font-bold text-red-300">{zones.attack}</p>
              <p className="text-lg text-gray-400 mb-1">touches</p>
            </div>
            <div className="mt-3 bg-red-500/20 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(zones.attack / ballTracking.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {((zones.attack / ballTracking.length) * 100).toFixed(1)}% of total
            </p>
          </div>

          <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border border-yellow-500/30 rounded-lg p-4">
            <h5 className="text-sm font-semibold text-gray-400 mb-2">Midfield Zone</h5>
            <div className="flex items-end gap-2">
              <p className="text-4xl font-bold text-yellow-300">{zones.midfield}</p>
              <p className="text-lg text-gray-400 mb-1">touches</p>
            </div>
            <div className="mt-3 bg-yellow-500/20 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(zones.midfield / ballTracking.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {((zones.midfield / ballTracking.length) * 100).toFixed(1)}% of total
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-lg p-4">
            <h5 className="text-sm font-semibold text-gray-400 mb-2">Defense Zone</h5>
            <div className="flex items-end gap-2">
              <p className="text-4xl font-bold text-blue-300">{zones.defense}</p>
              <p className="text-lg text-gray-400 mb-1">touches</p>
            </div>
            <div className="mt-3 bg-blue-500/20 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(zones.defense / ballTracking.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {((zones.defense / ballTracking.length) * 100).toFixed(1)}% of total
            </p>
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-lg p-4">
            <h5 className="text-sm font-semibold text-gray-400 mb-3">Possession Summary</h5>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Home</span>
                <span className="text-blue-300 font-bold">{homePoints.length} touches</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Away</span>
                <span className="text-red-300 font-bold">{awayPoints.length} touches</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Transitions</span>
                <span className="text-yellow-300 font-bold">{neutralPoints.length} touches</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BallTrackingVisualization;

