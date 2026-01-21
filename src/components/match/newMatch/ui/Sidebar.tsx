"use client";
import React, { useState } from "react";
import { FiMenu, FiX, FiHome, FiBarChart2, FiList } from "react-icons/fi";
import NavItem from "./Navitems";
import { View } from "@/app/dashboard/matches/[id]/page";

interface SidebarProps {
  activeView: View;
  onViewChange: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
      className={`
        h-screen sticky top-0 flex flex-col border-2 border-gray-800 bg-black rounded-md m-1 shadow-sm z-50 transition-all duration-300
        ${isOpen ? "w-64" : "w-20"}
      `}
    >
      {/* Toggle */}
      <div className="flex items-center justify-end p-4 h-20">
        <button
          onClick={() => setIsOpen(prev => !prev)}
          className="p-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white"
        >
          {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-2">
        <div onClick={() => onViewChange("Analysis")}>
          <NavItem
            icon={<FiHome size={20} />}
            label="Analyst Report"
            isOpen={isOpen}
            active={activeView === "Analysis"}
          />
        </div>

        <div onClick={() => onViewChange("MatchAnalyticsReport")}>
          <NavItem
            icon={<FiBarChart2 size={20} />}
            label="Match Analysis Report"
            isOpen={isOpen}
            active={activeView === "MatchAnalyticsReport"}
          />
        </div>

        <div onClick={() => onViewChange("MatchStats")}>
          <NavItem
            icon={<FiList size={20} />}
            label="Match Stats"
            isOpen={isOpen}
            active={activeView === "MatchStats"}
          />
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
