import { STATIC_CLUB_DATA } from '@/staticdata/club';
import React from 'react';

interface Props {
    isExpanded: boolean;
}

const ClubHeaderCard: React.FC<Props> = ({ isExpanded }) => {
    const club = STATIC_CLUB_DATA;

    const getInitials = (name: string): string => {
        const parts = name.split(' ').filter(p => p.length > 0);
        return parts.map(p => p[0]).join('').toUpperCase().substring(0, 2);
    };

    const logoContent = club.logoUrl ? (
        <img
            src={club.logoUrl}
            alt={club.name}
            className="w-full h-full object-contain p-2 rounded-full"
        />
    ) : (
        <span className={`font-bold text-white ${isExpanded ? 'text-3xl' : 'text-xl'}`}>
            {getInitials(club.name)}
        </span>
    );

    return (
        <div 
            className={`
                bg-gradient-to-br from-[#1b1c28] to-[#252834] 
                rounded-xl shadow-2xl border border-[#3b3e4e]
                transition-all duration-300 ease-in-out
                flex flex-col items-center justify-center
                ${isExpanded ? 'p-4' : 'p-2 py-4'}
            `}
        >
            {/* Logo Container - Resizes based on state */}
            <div 
                className={`
                    rounded-2xl flex items-center justify-center 
                    border-2 border-purple-500/50 shadow-inner 
                    bg-[#1b1c28]
                    transition-all duration-300
                    ${isExpanded ? 'w-24 h-24 mb-4' : 'w-12 h-12 mb-0'}
                `}
            >
                <div 
                    className={`
                        rounded-full bg-purple-600/20 flex items-center justify-center
                        transition-all duration-300
                        ${isExpanded ? 'w-20 h-20' : 'w-10 h-10'}
                    `}
                >
                    {logoContent}
                </div>
            </div>

            {/* Text Content - Hides when collapsed */}
            <div 
                className={`
                    text-center overflow-hidden transition-all duration-300
                    ${isExpanded ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0'}
                `}
            >
                <h1 className="text-2xl font-extrabold text-white whitespace-nowrap">{club.name}</h1>
                <p className="text-sm text-gray-400 mt-1 whitespace-nowrap">#ScoutingUnitedFC</p>
            </div>
        </div>
    );
};

export default ClubHeaderCard;