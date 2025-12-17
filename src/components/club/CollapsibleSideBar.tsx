'use client'

import { FiChevronLeft } from "react-icons/fi";
import ClubHeaderCard from "./ClubHeaderCard";
import FormationStats from "./FormationStats";
import CustomSearch from "./CustomeSearch";
import WinLoseStat from "./WinLoseStat";

// 1. Define the props expected from the parent (ClubDetailPage)
interface SidebarProps {
    isExpanded: boolean;
    toggleSidebar: () => void;
}

const CollapsibleSidebar: React.FC<SidebarProps> = ({ isExpanded, toggleSidebar }) => {
    
    // Note: We removed the explicit 'w-[250px]' vs 'w-20' width classes here.
    // Why? Because the parent 'ClubDetailPage' grid now controls the column width 
    // (250px vs 80px). We just want this container to fill that space.

    return (
        <aside 
            className={`
                w-full 
                lg:sticky lg:top-4 
                self-start h-[calc(100vh-2rem)] 
                transition-all duration-300 ease-in-out 
                flex flex-col
                bg-[#1b1c28] 
                rounded-xl   
                border border-[#3b3e4e]
                relative
            `}
        >
            {/* Toggle Button Container */}
            {/* We position this relative to the sidebar so it sticks to the edge */}
            <div 
                className={`
                    absolute top-6 
                    z-20 
                    transition-all duration-300 ease-in-out
                    ${isExpanded ? 'right-[-12px]' : 'right-[-12px]'} 
                `}
            >
                <button 
                    onClick={toggleSidebar}
                    className="
                        p-1.5 
                        bg-purple-600 
                        rounded-full 
                        shadow-xl 
                        text-white 
                        hover:bg-purple-700 
                        transition-transform 
                        duration-300
                        flex items-center justify-center
                    "
                    aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
                >
                    <FiChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? '' : 'rotate-180'}`} />
                </button>
            </div>

            {/* Content Area */}
            {/* We hide the scrollbar but keep functionality if needed */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-4 no-scrollbar">
                
                {/* We pass the prop down to children so they can hide text/change layout */}
                <ClubHeaderCard isExpanded={isExpanded} />
                <WinLoseStat isExpanded={isExpanded} />
                <FormationStats isExpanded={isExpanded} />
                <CustomSearch isExpanded={isExpanded} />
                
            </div>
        </aside>
    );
};

export default CollapsibleSidebar;