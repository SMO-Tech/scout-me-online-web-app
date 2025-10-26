'use client'
import React, { useState } from 'react';
import { PassEvent } from '@/types/matchAnalysis';

interface FootballPitchPassMapProps {
  passEvents: PassEvent[];
}

type FilterMode = 'all' | 'successful' | 'failed';

const FootballPitchPassMap: React.FC<FootballPitchPassMapProps> = ({ passEvents }) => {
  const [filterMode, setFilterMode] = useState<FilterMode>('all');

  // Filter passes based on selected mode
  const filteredPasses = passEvents.filter(pass => {
    if (filterMode === 'successful') return pass.success;
    if (filterMode === 'failed') return !pass.success;
    return true; // all
  });

  const successfulPasses = passEvents.filter(p => p.success);
  const failedPasses = passEvents.filter(p => !p.success);

  return (
    <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-600/30 rounded-xl p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h4 className="text-2xl font-bold text-cyan-300">Pass Map - Interactive Pitch View</h4>
          <p className="text-gray-400 text-sm mt-1">Visualize pass connections and success rates across the pitch</p>
        </div>
        
        {/* Toggle Buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              filterMode === 'all'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
            }`}
          >
            All Passes ({passEvents.length})
          </button>
          <button
            onClick={() => setFilterMode('successful')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              filterMode === 'successful'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
            }`}
          >
            Successful ({successfulPasses.length})
          </button>
          <button
            onClick={() => setFilterMode('failed')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              filterMode === 'failed'
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
            }`}
          >
            Failed ({failedPasses.length})
          </button>
        </div>
      </div>

      {/* Football Pitch */}
      <div className="relative w-full max-w-5xl mx-auto bg-gradient-to-br from-purple-950 to-purple-900 rounded-lg overflow-hidden shadow-2xl shadow-purple-500/20" style={{ aspectRatio: '105/68' }}>
        {/* SVG for pitch markings and passes */}
        <svg className="w-full h-full" viewBox="0 0 105 68" preserveAspectRatio="xMidYMid meet">
          {/* Pitch background - Dark Neon Purple */}
          <rect x="0" y="0" width="105" height="68" fill="#1a0a2e" opacity="0.95" />
          <rect x="0" y="0" width="105" height="68" fill="url(#purpleGradient)" opacity="0.6" />
          
          {/* Define gradients */}
          <defs>
            <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#4c1d95', stopOpacity: 0.8 }} />
              <stop offset="50%" style={{ stopColor: '#6b21a8', stopOpacity: 0.6 }} />
              <stop offset="100%" style={{ stopColor: '#581c87', stopOpacity: 0.8 }} />
            </linearGradient>
          </defs>
          
          {/* Pitch markings - White outline */}
          {/* Outer boundary */}
          <rect x="2" y="2" width="101" height="64" fill="none" stroke="white" strokeWidth="0.4" opacity="0.95" />
          
          {/* Center line */}
          <line x1="52.5" y1="2" x2="52.5" y2="66" stroke="white" strokeWidth="0.35" opacity="0.8" />
          
          {/* Center circle */}
          <circle cx="52.5" cy="34" r="9" fill="none" stroke="white" strokeWidth="0.35" opacity="0.8" />
          <circle cx="52.5" cy="34" r="0.5" fill="white" opacity="0.9" />
          
          {/* Glow effect filter */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Left penalty area */}
          <rect x="2" y="13.5" width="16.5" height="41" fill="none" stroke="white" strokeWidth="0.35" opacity="0.8" />
          <rect x="2" y="24.5" width="5.5" height="19" fill="none" stroke="white" strokeWidth="0.35" opacity="0.8" />
          {/* Arc facing outside (left side) */}
          <path d="M 18.5 25 a 9 9 0 0 1 0 18" stroke="white" strokeWidth="0.35" fill="none" opacity="0.8" />
          
          {/* Right penalty area */}
          <rect x="86.5" y="13.5" width="16.5" height="41" fill="none" stroke="white" strokeWidth="0.35" opacity="0.8" />
          <rect x="97.5" y="24.5" width="5.5" height="19" fill="none" stroke="white" strokeWidth="0.35" opacity="0.8" />
          {/* Arc facing outside (right side) */}
          <path d="M 86.5 25 a 9 9 0 0 0 0 18" stroke="white" strokeWidth="0.35" fill="none" opacity="0.8" />
          
          {/* Goals */}
          <rect x="0" y="29" width="2" height="10" fill="none" stroke="white" strokeWidth="0.3" opacity="0.7" />
          <rect x="103" y="29" width="2" height="10" fill="none" stroke="white" strokeWidth="0.3" opacity="0.7" />
          
          {/* Penalty spots */}
          <circle cx="11" cy="34" r="0.4" fill="white" opacity="0.9" />
          <circle cx="94" cy="34" r="0.4" fill="white" opacity="0.9" />

          {/* Zone dividers (subtle) */}
          <line x1="35" y1="2" x2="35" y2="66" stroke="white" strokeWidth="0.2" opacity="0.3" strokeDasharray="2,2" />
          <line x1="70" y1="2" x2="70" y2="66" stroke="white" strokeWidth="0.2" opacity="0.3" strokeDasharray="2,2" />
          
          {/* Pass Lines - Draw them behind dots */}
          {filteredPasses.map((pass) => {
            const color = pass.success ? '#4169e1' : '#8b5cf6'; // Dark blue for success, Dark purple for failed
            const opacity = filterMode === 'all' ? (pass.success ? 0.75 : 0.65) : 0.85;
            
            return (
              <g key={pass.id}>
                {/* Pass line with arrow */}
                <defs>
                  <marker
                    id={`arrowhead-${pass.id}`}
                    markerWidth="10"
                    markerHeight="10"
                    refX="8"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3, 0 6" fill={color} opacity={opacity} />
                  </marker>
                </defs>
                
                <line
                  x1={pass.fromX}
                  y1={pass.fromY}
                  x2={pass.toX}
                  y2={pass.toY}
                  stroke={color}
                  strokeWidth="0.6"
                  opacity={opacity}
                  markerEnd={`url(#arrowhead-${pass.id})`}
                  filter="url(#glow)"
                  className="transition-opacity duration-300 hover:opacity-100"
                />
              </g>
            );
          })}
          
          {/* Pass Start/End Points */}
          {filteredPasses.map((pass) => {
            const color = '#ff006e'; // Hot neon pink for all passes
            
            return (
              <g key={`dots-${pass.id}`}>
                {/* Starting point */}
                <circle
                  cx={pass.fromX}
                  cy={pass.fromY}
                  r="1.2"
                  fill={color}
                  opacity="0.95"
                  filter="url(#glow)"
                />
                
                {/* Ending point */}
                <circle
                  cx={pass.toX}
                  cy={pass.toY}
                  r="1.5"
                  fill={color}
                  opacity="1"
                  filter="url(#glow)"
                />
              </g>
            );
          })}
        </svg>

        {/* Legend overlay */}
        <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-xs border border-white/20">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full shadow-lg shadow-blue-500/40" style={{ backgroundColor: '#4169e1' }}></div>
              <span className="text-gray-100 font-medium">Successful Pass</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full shadow-lg shadow-purple-500/40" style={{ backgroundColor: '#8b5cf6' }}></div>
              <span className="text-gray-100 font-medium">Failed Pass</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Total Passes</p>
          <p className="text-3xl font-bold text-purple-300 mt-1">{filteredPasses.length}</p>
          <p className="text-xs text-gray-400 mt-1">Displayed on pitch</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Successful</p>
          <p className="text-3xl font-bold text-green-300 mt-1">
            {filterMode === 'all' || filterMode === 'successful' ? successfulPasses.length : '-'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {((successfulPasses.length / passEvents.length) * 100).toFixed(1)}% success
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 border border-red-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Failed</p>
          <p className="text-3xl font-bold text-red-300 mt-1">
            {filterMode === 'all' || filterMode === 'failed' ? failedPasses.length : '-'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {((failedPasses.length / passEvents.length) * 100).toFixed(1)}% failed
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 border border-cyan-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Avg Distance</p>
          <p className="text-3xl font-bold text-cyan-300 mt-1">
            {(filteredPasses.reduce((sum, p) => sum + p.distance, 0) / filteredPasses.length).toFixed(1)}m
          </p>
          <p className="text-xs text-gray-400 mt-1">Per pass shown</p>
        </div>
      </div>
    </div>
  );
};

export default FootballPitchPassMap;

