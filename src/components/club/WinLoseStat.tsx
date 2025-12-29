import React from "react";
import { FiActivity } from "react-icons/fi";

interface Props {
  isExpanded: boolean;
}

const stats = [
  { name: "Game", num: "20" },
  { name: "Win", percentage: "20%", num: "10" },
  { name: "Lose", percentage: "16%", num: "8" },
  { name: "Draw", percentage: "16%", num: "2" },
];

const colorMap: Record<string, string> = {
  Win: "text-green-400 shadow-green-500/40",
  Lose: "text-red-400 shadow-red-500/40",
  Draw: "text-yellow-400 shadow-yellow-500/40",
  Game: "text-purple-400 shadow-purple-500/40",
};

const WinLoseStat: React.FC<Props> = ({ isExpanded }) => {
  if (!isExpanded) {
    return (
      null
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#1b1c28] to-[#252834] p-4 rounded-xl shadow-2xl border border-[#3b3e4e] mt-4">
      <div className="space-y-3">
        {stats.map((s) => {
          const color = colorMap[s.name] || "text-gray-300";

          return (
            <div
              key={s.name}
              className={`py-2 border-b border-gray-700/30 last:border-b-0`}
            >
              <div className="flex justify-between items-center">
                <span className={`text-md font-bold ${color}`}>
                  {s.name}
                </span>

                <span
                  className={`text-sm font-semibold px-2 py-0.5 rounded-md shadow ${color}`}
                >
                  {s.num}
                </span>

                {s.percentage && (
                  <span
                    className={`text-sm font-semibold px-2 py-0.5 rounded-md shadow ${color}`}
                  >
                    {s.percentage}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WinLoseStat;
