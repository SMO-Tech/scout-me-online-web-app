'use client';

import { STATIC_METRICS } from "@/staticdata/club";
import React, { useSyncExternalStore } from "react";

interface MetricCardProps {
  metric: typeof STATIC_METRICS[0];
  matchesPlayed?: number;
}

/* ---------- GLOBAL SHARED STATE ---------- */
let focusConversion = false;
let listeners: (() => void)[] = [];

const subscribe = (listener: () => void) => {
  listeners.push(listener);
  return () => listeners = listeners.filter(l => l !== listener);
};

const toggleGlobalFocus = () => {
  focusConversion = !focusConversion;
  listeners.forEach(l => l());
};

const getSnapshot = () => focusConversion;

/* ---------- COMPONENT ---------- */
const CircularMetricCard: React.FC<MetricCardProps> = ({
  metric,
  matchesPlayed = 5
}) => {

  // The third argument () => false tells the server to default focus to 'false'
  const focus = useSyncExternalStore(subscribe, getSnapshot, () => false);

  const parsedValue = Number(
    typeof metric.value === "string"
      ? metric.value.replace(/[^0-9.]/g, "")
      : metric.value
  );

  const actualValue = Number(parsedValue ?? metric.total ?? 0);
  const apg = matchesPlayed > 0 ? (actualValue / matchesPlayed) : 0;

  const hasConversion = metric.title !== "Attempts";
  const percentage = hasConversion && metric.total > 0
    ? (metric.made / metric.total) * 100
    : 0;

  const strokeDashoffset = hasConversion
    ? 188.5 - (188.5 * percentage) / 100
    : 188.5;

  return (
    <div
      onClick={() => hasConversion && toggleGlobalFocus()}
      className={`bg-gradient-to-br from-[#1b1c28] to-[#252834] p-4 rounded-xl shadow-2xl 
      border ${focus && hasConversion ? "border-purple-500" : "border-[#3b3e4e]"}
      flex flex-col items-center space-y-3 hover:border-purple-500/50 
      transition-all group select-none relative ${hasConversion && "cursor-pointer"}`}
    >

      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
        {metric.title}
      </h3>

      <div className="relative w-24 h-24 flex items-center justify-center">

        <svg className="w-full h-full transform -rotate-90">
          <circle cx="50%" cy="50%" r="30" strokeWidth="6" stroke="#2f3142" fill="transparent" />
          <circle
            cx="50%" cy="50%" r="30" strokeWidth="6"
            stroke={metric.color}
            fill="transparent"
            strokeLinecap="round"
            style={{
              strokeDasharray: '188.5',
              strokeDashoffset,
              transition: 'stroke-dashoffset 0.5s ease',
            }}
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center animate-fadeIn text-center px-1">

          {focus && hasConversion ? (
            <>
              <span className="text-lg font-bold text-white leading-tight">
                {percentage.toFixed(0)}%
              </span>
              <span className="text-[8px] uppercase font-bold text-purple-400 tracking-wider">
                Conversion
              </span>
            </>
          ) : (
            <>
              <span className="text-xl font-bold text-white">
                {actualValue}
              </span>
            </>
          )}

        </div>
      </div>

      {/* Bottom */}
      <div className="flex flex-col items-center justify-center h-10">
        <span className="text-sm font-bold text-white">
          {apg.toFixed(1)}
          {hasConversion && (
            <span className="text-[10px] text-gray-400 ml-1">
              ({percentage.toFixed(0)}%)
            </span>
          )}
        </span>

        <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wide">
          Avg / Match
        </span>
      </div>

      {focus && hasConversion && (
        <div className="text-[10px] text-gray-400 text-center">
          Tap any card to switch back
        </div>
      )}

    </div>
  );
};

export default CircularMetricCard;
