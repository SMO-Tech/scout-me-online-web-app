'use client';

import React from 'react';
import { FiChevronLeft, FiX, FiUser, FiBarChart2, FiCalendar, FiTrendingUp, FiUsers } from "react-icons/fi";
import ClubHeaderCard from "./ClubHeaderCard";
// 1. Re-import the components
import FormationStats from "./FormationStats";
import CustomSearch from "./CustomeSearch";
import WinLoseStat from './WinLoseStat';

// Define the available tabs
export type TabType = 'profile' | 'analytics' | 'events' | 'statistics' | 'members';

interface SidebarProps {
    isExpanded: boolean;
    toggleSidebar: () => void;
    // Mobile Control
    isMobileOpen: boolean;
    closeMobile: () => void;
    // Tab Control
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
    // Optional: Show members tab (default: false, for clubs: true)
    showMembersTab?: boolean;
}

const ALL_MENU_ITEMS = [
  { id: 'profile', label: 'Profile', icon: <FiUser size={20} /> },
  { id: 'members', label: 'Members', icon: <FiUsers size={20} /> },
  { id: 'analytics', label: 'Analytics', icon: <FiBarChart2 size={20} /> },
  { id: 'statistics', label: 'Statistics', icon: <FiTrendingUp size={20} /> },
  { id: 'events', label: 'Events', icon: <FiCalendar size={20} /> },
];

const CollapsibleSidebar: React.FC<SidebarProps> = ({ 
    isExpanded, 
    toggleSidebar, 
    isMobileOpen, 
    closeMobile,
    activeTab,
    setActiveTab,
    showMembersTab = false
}) => {
    // Filter menu items based on showMembersTab
    const MENU_ITEMS = ALL_MENU_ITEMS.filter(item => {
        if (item.id === 'members') {
            return showMembersTab;
        }
        return true;
    });

    // Helper to handle click (closes mobile menu automatically)
    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId as TabType);
        closeMobile();
    };

    return (
        <>
            {/* Mobile Backdrop */}
            <div 
                className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                onClick={closeMobile}
            />

            <aside 
                className={`
                    fixed top-0 left-0 bottom-0 z-50 w-[280px]
                    bg-[#1b1c28] border-r border-[#3b3e4e] shadow-2xl
                    transform transition-transform duration-300 ease-in-out
                    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}

                    lg:translate-x-0  lg:block lg:shadow-none
                    lg:h-[calc(100vh-2rem)] lg:sticky lg:top-4 
                    lg:border lg:rounded-xl lg:bg-[#1b1c28] 
                    lg:w-auto
                    flex flex-col
                `}
            >
                {/* Desktop Toggle */}
                <div className={`absolute top-6 z-20 transition-all duration-300 ${isExpanded ? 'right-[-12px]' : 'right-[-12px]'} hidden lg:block`}>
                    <button 
                        onClick={toggleSidebar}
                        className="p-1.5 bg-cyan-600 rounded-full shadow-xl text-white hover:bg-cyan-700 transition-transform flex items-center justify-center"
                    >
                        <FiChevronLeft className={`w-4 h-4 transition-transform ${isExpanded ? '' : 'rotate-180'}`} />
                    </button>
                </div>

                {/* Mobile Header */}
                <div className="lg:hidden p-4 flex justify-between items-center border-b border-[#3b3e4e]">
                    <span className="font-bold text-purple-400">MENU</span>
                    <button onClick={closeMobile} className="text-gray-400 hover:text-white">
                        <FiX size={24} />
                    </button>
                </div>

                {/* --- NAVIGATION MENU --- */}
                <div className="flex-1 py-4 px-3 space-y-2 overflow-y-auto no-scrollbar">
                    
                    {/* Club Header (Always Visible) */}
                    {/* <div className="mb-6">
                        <ClubHeaderCard isExpanded={false} />
                    </div> */}

                    {/* Menu Items */}
                    <div className="space-y-1 mb-6">
                        {MENU_ITEMS.map((item) => {
                            const isActive = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleTabClick(item.id)}
                                    className={`
                                        w-full flex items-center p-3 rounded-xl transition-all duration-200 group
                                        ${isActive 
                                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' 
                                            : 'text-gray-400 hover:bg-[#252834] hover:text-white'
                                        }
                                        ${!isExpanded ? 'lg:justify-center' : ''}
                                    `}
                                    title={!isExpanded ? item.label : ''}
                                >
                                    {/* Icon */}
                                    <span className={`${isActive ? 'text-white' : 'group-hover:text-white'} shrink-0`}>
                                        {item.icon}
                                    </span>

                                    {/* Label */}
                                    <span 
                                        className={`
                                            ml-3 font-medium whitespace-nowrap overflow-hidden transition-all duration-300
                                            ${isExpanded ? 'opacity-100 w-auto' : 'lg:opacity-0 lg:w-0'}
                                        `}
                                    >
                                        {item.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* 2. ANALYTICS WIDGETS (Formation & Win/Lose/Search)
                        Conditionally rendered ONLY when 'analytics' tab is active 
                    */}
                    {activeTab === 'analytics' && (
                        <div className={`space-y-4 pt-4 border-t border-[#3b3e4e] animate-fadeIn`}>
                             {/* We pass isExpanded so they can switch to mini-view if sidebar is collapsed */}
                             <WinLoseStat isExpanded={isExpanded} />
                             <FormationStats isExpanded={isExpanded} />
                        </div>
                    )}

                </div>
            </aside>
        </>
    );
};

export default CollapsibleSidebar;