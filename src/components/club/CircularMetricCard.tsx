import { STATIC_METRICS } from "@/staticdata/club";

interface MetricCardProps {
    metric: typeof STATIC_METRICS[0];
}

const CircularMetricCard: React.FC<MetricCardProps> = ({ metric }) => {
    // Calculate percentage for styling the stroke-dasharray
    const percentage = (metric.made / metric.total) * 100;
    const strokeDashoffset = 188.5 - (188.5 * percentage) / 100; // 188.5 is approx. circumference (2 * pi * 30)

    return (
        <div className="bg-gradient-to-br from-[#1b1c28] to-[#252834] p-4 rounded-xl shadow-2xl border border-[#3b3e4e] flex flex-col items-center space-y-2">
            
            {/* Title */}
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">{metric.title}</h3>

            {/* Circular Progress (Using SVG for accurate look) */}
            <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    {/* Background Circle */}
                    <circle
                        cx="50%"
                        cy="50%"
                        r="30" // Radius 30 (circumference 188.5)
                        strokeWidth="8"
                        stroke="#2f3142" // Darker background
                        fill="transparent"
                    />
                    {/* Foreground Arc */}
                    <circle
                        cx="50%"
                        cy="50%"
                        r="30"
                        strokeWidth="8"
                        stroke={metric.color}
                        fill="transparent"
                        strokeLinecap="round"
                        style={{
                            strokeDasharray: '188.5', // Full circumference
                            strokeDashoffset: strokeDashoffset,
                            transition: 'stroke-dashoffset 0.5s ease',
                        }}
                    />
                </svg>
                
                {/* Value in Center */}
                <span className="absolute text-xl font-bold text-white">
                    {metric.value}
                </span>
            </div>

            {/* Breakdown & Percentage */}
            <p className="text-xs text-center text-gray-400">
                <span className="text-green-400">{metric.breakdown}</span> / {metric.total} / {percentage.toFixed(1)}%
            </p>
        </div>
    );
};

export default CircularMetricCard