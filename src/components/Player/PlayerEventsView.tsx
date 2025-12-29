import React from 'react'
import { FiCalendar, FiActivity, FiLock, FiClock } from 'react-icons/fi'

const PlayerEventsView = () => {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
      
      {/* Visual Placeholder Icon */}
      <div className="relative">
        <div className="w-24 h-24 bg-purple-500/10 rounded-full flex items-center justify-center border border-purple-500/20">
          <FiCalendar size={40} className="text-purple-500 opacity-50" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#1b1c28] border border-[#3b3e4e] rounded-xl flex items-center justify-center text-orange-400 shadow-xl">
          <FiLock size={20} />
        </div>
      </div>

      {/* Content */}
      <div className="text-center max-w-md px-6">
        <h2 className="text-2xl font-bold text-white mb-2">Match Events & Timeline</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          We are currently integrating live match data. Soon you will be able to track every appearance, 
          goal, and tactical event for this player in real-time.
        </p>

        {/* Feature Preview Badges */}
        <div className="flex flex-wrap justify-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1b1c28] border border-[#3b3e4e] rounded-lg text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            <FiActivity size={14} /> Performance Logs
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1b1c28] border border-[#3b3e4e] rounded-lg text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            <FiClock size={14} /> Match Minutes
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg text-[10px] font-bold text-purple-400 uppercase tracking-wider">
            Coming Soon
          </div>
        </div>
      </div>

      {/* Static Mockup Background Elements */}
      <div className="w-full max-w-2xl mt-8 opacity-20 pointer-events-none select-none">
        <div className="space-y-3">
          <div className="h-12 w-full bg-[#1b1c28] border border-[#3b3e4e] rounded-xl" />
          <div className="h-12 w-full bg-[#1b1c28] border border-[#3b3e4e] rounded-xl" />
          <div className="h-12 w-full bg-[#1b1c28] border border-[#3b3e4e] rounded-xl" />
        </div>
      </div>
      
    </div>
  )
}

export default PlayerEventsView