'use client';

export default function BlockedShotsCard() {
  // Mock Data: Coordinates (0-100% width, 0-100% height of goal)
  const shots = [
    { x: 20, y: 80, color: 'text-red-500', label: 'Saved' },
    { x: 85, y: 90, color: 'text-yellow-500', label: 'Blocked' },
    { x: 50, y: 50, color: 'text-red-500', label: 'Saved' },
    { x: 92, y: 20, color: 'text-gray-500', label: 'Off Target' },
    { x: 10, y: 15, color: 'text-gray-500', label: 'Off Target' },
  ];

  return (
    <div className="bg-gradient-to-br from-[#1b1c28] to-[#252834] p-4 rounded-xl border border-[#3b3e4e] h-64 flex flex-col">
      <h3 className="text-white font-semibold text-sm mb-4">Shot Map (Last Match)</h3>
      
      <div className="flex-1 flex items-center justify-center relative">
        {/* Goal Frame SVG */}
        <svg viewBox="0 0 100 40" className="w-full drop-shadow-2xl">
           {/* Ground Line */}
           <line x1="0" y1="38" x2="100" y2="38" stroke="#4b5563" strokeWidth="0.5" />
           
           {/* Goal Posts */}
           <path 
             d="M 10,38 L 10,5 L 90,5 L 90,38" 
             fill="none" 
             stroke="white" 
             strokeWidth="1"
             className="drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
           />
           
           {/* Net Pattern (Optional detailing) */}
           <pattern id="netPattern" x="0" y="0" width="2" height="2" patternUnits="userSpaceOnUse">
             <path d="M 0,2 L 2,0" stroke="#374151" strokeWidth="0.1" />
           </pattern>
           <rect x="10" y="5" width="80" height="33" fill="url(#netPattern)" opacity="0.3" />
        </svg>

        {/* Shot Dots Overlay */}
        <div className="absolute inset-0 w-[80%] h-[82%] mx-auto mt-[5%] ">
            {shots.map((shot, i) => (
                <div
                    key={i}
                    className={`absolute w-3 h-3 rounded-full border border-[#1b1c28] shadow-lg ${shot.color} bg-current`}
                    style={{ 
                        left: `${shot.x}%`, 
                        bottom: `${shot.y}%`, // Use bottom because 0 is ground in soccer logic
                        transform: 'translate(-50%, 50%)'
                    }}
                    title={shot.label}
                />
            ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 text-[10px] text-gray-400 mt-2">
         <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"/> Saved</span>
         <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"/> Blocked</span>
         <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-500"/> Miss</span>
      </div>
    </div>
  );
}