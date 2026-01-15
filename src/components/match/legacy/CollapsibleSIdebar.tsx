'use client'

import React, { useState } from 'react'
import { FiMenu, FiHome, FiVideo, FiBarChart2, FiUsers } from 'react-icons/fi'

interface DashboardLayoutProps {
  videoUrl: string
  aside?: React.ReactNode
  children: React.ReactNode
}

const CollapsibleSidebar = ({ videoUrl, aside, children }: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="bg-black min-h-screen flex text-white">

      {/* SIDEBAR */}
      <aside
        className={`
          bg-[#0e0f14] border-r border-white/10
          transition-all duration-300
          ${collapsed ? 'w-16' : 'w-64'}
          hidden md:flex flex-col
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          {!collapsed && <span className="font-bold">Dashboard</span>}
          <button onClick={() => setCollapsed(!collapsed)}>
            <FiMenu />
          </button>
        </div>

        <nav className="p-2 space-y-1">
          <NavItem icon={<FiHome />} label="Overview" collapsed={collapsed} />
          <NavItem icon={<FiVideo />} label="Matches" collapsed={collapsed} />
          <NavItem icon={<FiBarChart2 />} label="Analytics" collapsed={collapsed} />
          <NavItem icon={<FiUsers />} label="Players" collapsed={collapsed} />
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-4 lg:p-6">

        {/* Mobile toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 bg-[#151720] rounded"
          >
            <FiMenu />
          </button>
        </div>

        {/* TOP */}
        <div className="flex flex-col xl:flex-row gap-6">
          <div className="flex-1 bg-[#151720] rounded-xl overflow-hidden aspect-video">
            <iframe
              className="w-full h-full"
              src={videoUrl}
              allowFullScreen
            />
          </div>

          {aside && (
            <aside className="w-full xl:w-80 bg-[#151720] rounded-xl p-5">
              {aside}
            </aside>
          )}
        </div>

        {/* CONTENT */}
        <div className="mt-8">
          {children}
        </div>
      </main>
    </div>
  )
}

export default CollapsibleSidebar

/* helpers */

const NavItem = ({
  icon,
  label,
  collapsed,
}: {
  icon: React.ReactNode
  label: string
  collapsed: boolean
}) => (
  <div className="flex items-center gap-3 p-3 rounded hover:bg-white/5 cursor-pointer">
    <span className="text-lg">{icon}</span>
    {!collapsed && <span className="text-sm">{label}</span>}
  </div>
)
