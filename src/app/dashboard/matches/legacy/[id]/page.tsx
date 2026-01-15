'use client'

import Lineup from '@/components/match/legacy/Lineup'
import MatchStatsView from '@/components/match/legacy/MatchStatsView'
import Overview from '@/components/match/Overview'
import { getYouTubeId } from '@/lib/utils/youtubeIdExtractor'
import React, { useState } from 'react'
import {
    FiMenu,
    FiChevronLeft,
    FiHome,
    FiVideo,
    FiBarChart,
} from 'react-icons/fi'

type View = 'Overview' | 'Lineup' | 'Stats'


const page = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [collapsed, setCollapsed] = useState(false)
    const [view, setView] = useState<View>('Overview')
    // delete later why API intigrated
    const youtubeId = getYouTubeId(
        "https://www.youtube.com/watch?v=IobYjhdAlH0"
    )


    return (
        <div className="bg-black min-h-screen text-white flex relative">

            {/* SIDEBAR */}
            <aside
                className={`
          fixed md:static z-40 top-0 left-0 h-full
          bg-[#0e0f14] border-r border-white/10
          transition-all duration-300
          ${collapsed ? 'w-16' : 'w-64'}
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    {!collapsed && <span className="font-semibold">Dashboard</span>}

                    <button
                        className="hidden md:block"
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        <FiChevronLeft
                            className={`transition-transform ${collapsed ? 'rotate-180' : ''}`}
                        />
                    </button>

                    <button
                        className="md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    >
                        ✕
                    </button>
                </div>

                {/* NAV */}
                <nav className="p-2 space-y-1">
                    <NavItem
                        icon={<FiHome />}
                        label="Overview"
                        collapsed={collapsed}
                        active={view === 'Overview'}
                        onClick={() => setView('Overview')}
                    />
                    <NavItem
                        icon={<FiVideo />}
                        label="Lineup"
                        collapsed={collapsed}
                        active={view === 'Lineup'}
                        onClick={() => setView('Lineup')}
                    />
                    <NavItem
                        icon={<FiBarChart />}
                        label="Match Stats"
                        collapsed={collapsed}
                        active={view === 'Stats'}
                        onClick={() => setView('Stats')}
                    />
                </nav>
            </aside>

            {/* MOBILE OVERLAY */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* MAIN */}
            <main className="flex-1 p-4 md:p-6">

                {/* MOBILE TOP BAR */}
                <div className="flex items-center gap-3 mb-4 md:hidden">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 bg-[#151720] rounded"
                    >
                        <FiMenu />
                    </button>
                    <span className="font-semibold">Match Analysis</span>
                </div>

                {/* OVERVIEW */}
                {view === 'Overview' && (
                    <Overview />
                )}

                {/* LINEUP */}
                {view === 'Lineup' && (
                    <Lineup />
                )}

                {/* STATS */}
                {/* dummy video putting now delete it later  */}


                {view === 'Stats' && (
                    <div className="p-6 bg-black min-h-screen flex justify-center">
                        <div className="w-full max-w-[1700px]">
                            <MatchStatsView />
                        </div>
                    </div>

                )}

            </main>
        </div>
    )
}

export default page

/* ---------------- NAV ITEM ---------------- */

const NavItem = ({
    icon,
    label,
    collapsed,
    active,
    onClick,
}: {
    icon: React.ReactNode
    label: string
    collapsed: boolean
    active: boolean
    onClick: () => void
}) => (
    <button
        onClick={onClick}
        className={`
      w-full flex items-center gap-3 p-3 rounded
      transition
      ${active ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'}
    `}
    >
        <span className="text-lg">{icon}</span>
        {!collapsed && <span className="text-sm">{label}</span>}
    </button>
)

