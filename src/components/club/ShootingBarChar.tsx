import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

// Mock data
const data = [
  { date: '10th Jan', attempts: 320, offTarget: 140, onTarget: 10, goals: 5 },
  { date: '10th Feb', attempts: 410, offTarget: 250, onTarget: 120, goals: 5 },
  { date: '10th Mar', attempts: 400, offTarget: 350, onTarget: 210, goals: 8 },
  { date: '10th Apr', attempts: 440, offTarget: 390, onTarget: 190, goals: 10 },
  { date: '10th May', attempts: 360, offTarget: 240, onTarget: 160, goals: 25 },
  { date: '10th Jun', attempts: 460, offTarget: 390, onTarget: 200, goals: 60 },
  { date: '10th Jul', attempts: 440, offTarget: 380, onTarget: 210, goals: 65 },
  { date: '10th Aug', attempts: 490, offTarget: 360, onTarget: 280, goals: 140 },
]

// Custom tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1b1c28] border border-gray-700 p-3 rounded-lg shadow-xl">
        <p className="text-gray-300 text-sm mb-2">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-400 capitalize">{entry.name}:</span>
            <span className="text-white font-bold">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

const ShootingBarChart = () => {
  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-end px-4 mb-2">
        <div className="text-left">
          <h3 className="text-gray-200 font-medium">Shooting</h3>
          <p className="text-xs text-green-400">(+5) more in December</p>
        </div>
        <div className="flex gap-4 text-xs font-semibold tracking-wide">
          <span className="text-gray-400">Attempts</span>
          <span className="text-cyan-400">On Target</span>
          <span className="text-fuchsia-400">Off Target</span>
          <span className="text-green-500">Goal</span>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />

            {/* Stacked bars */}
            <Bar dataKey="offTarget" stackId="a" fill="#d946ef" />
            <Bar dataKey="onTarget" stackId="a" fill="#06b6d4" />
            <Bar dataKey="goals" stackId="a" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default ShootingBarChart
