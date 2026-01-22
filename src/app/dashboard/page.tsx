'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiUpload, 
  FiArrowRight, 
  FiClock, 
  FiCheckCircle, 
  FiPlay, 
  FiCpu,
  FiMoreVertical,
  FiCalendar,
  FiInfo,
  FiActivity,
  FiZap,     // Added missing import
  FiTarget   // Added missing import
} from 'react-icons/fi';
import { motion, Variants } from 'framer-motion';

// --- MOCK DATA FOR TESTING UI ---
const MOCK_MATCHES = [
  {
    id: 1,
    title: "Arsenal vs Liverpool - U18 Academy",
    date: "22 Jan 2026",
    status: "PROCESSING", 
    progress: 45, 
    thumbnail: null 
  },
  {
    id: 2,
    title: "Sunday League Cup Final",
    date: "14 Jan 2026",
    status: "COMPLETED",
    thumbnail: "/api/placeholder/400/225" 
  }
];

export default function DashboardPage() {
  const [matches, setMatches] = useState<any[]>(MOCK_MATCHES); 
  const [isLoading, setIsLoading] = useState(true);
  const { push } = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <LoadingState />;

  // LOGIC: If no matches, show the "Hero Upload" screen
  if (matches.length !== 0) {
    return <EmptyStateView onUpload={() => push('/dashboard/form')} />;
  }

  // LOGIC: If matches exist, show the "Dashboard Grid"
  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header: Title + New Analysis Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Match Library</h1>
            <p className="text-sm text-gray-500">Manage your reports and analysis.</p>
          </div>
          <button 
            onClick={() => push('/dashboard/form')}
            className="flex items-center gap-2 bg-gray-900 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            <FiUpload />
            <span>New Analysis</span>
          </button>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>

      </div>
    </div>
  );
}

// --- SUB-COMPONENT: The Match Card ---
const MatchCard = ({ match }: { match: any }) => {
  const isProcessing = match.status === 'PROCESSING';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
    >
      {/* Card Header / Thumbnail Area */}
      <div className={`relative h-48 w-full ${isProcessing ? 'bg-gray-50' : 'bg-gray-200'}`}>
        
        {isProcessing ? (
          // PROCESSING STATE UI
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
             <div className="relative">
                <div className="w-12 h-12 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <FiCpu className="text-orange-600 w-4 h-4" />
                </div>
             </div>
             <div className="text-center">
                <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">Scouting...</p>
                <p className="text-[10px] text-gray-400">Est. 2 hours remaining</p>
             </div>
          </div>
        ) : (
          // COMPLETED STATE UI
          <>
             {/* Placeholder for YouTube Thumb */}
             <div className="absolute inset-0 bg-gray-800 flex items-center justify-center group-hover:bg-gray-900 transition-colors">
                <FiPlay className="text-white/50 w-12 h-12 group-hover:text-white group-hover:scale-110 transition-all" />
             </div>
             
             {/* Status Badge */}
             <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1.5 shadow-sm">
                <FiCheckCircle className="text-green-500 w-3 h-3" />
                <span className="text-[10px] font-bold text-gray-700 uppercase">Ready</span>
             </div>
          </>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
           <h3 className="font-bold text-gray-900 line-clamp-1 pr-4">{match.title}</h3>
           <button className="text-gray-400 hover:text-gray-600"><FiMoreVertical /></button>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <FiCalendar />
            <span>{match.date}</span>
        </div>

        {/* Footer Actions */}
        {isProcessing ? (
           <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <motion.div 
                className="bg-orange-500 h-full rounded-full" 
                initial={{ width: 0 }}
                animate={{ width: `${match.progress}%` }}
              />
           </div>
        ) : (
            <button className="w-full py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:border-orange-200 hover:text-orange-600 hover:bg-orange-50 transition-all flex items-center justify-center gap-2">
                View Report <FiArrowRight className="w-4 h-4" />
            </button>
        )}
      </div>
    </motion.div>
  );
};

// --- SUB-COMPONENT: Loading Spinner ---
const LoadingState = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-orange-100 border-t-orange-600 rounded-full animate-spin"></div>
  </div>
);

// --- ANIMATION VARIANTS (Missing in original code) ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

// --- SUB-COMPONENT: Empty State (Renamed to match usage) ---
const EmptyStateView = ({ onUpload }: { onUpload: () => void }) => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <motion.div 
        className="max-w-5xl w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 p-8 md:p-14 border border-gray-100 relative overflow-hidden">
            
            {/* Background Accents */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-orange-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-60 h-60 bg-gray-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

            <div className="max-w-4xl mx-auto relative z-10">
            
            {/* Value Prop */}
            <motion.div className="text-center mb-12" variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold uppercase tracking-wider mb-6 border border-orange-100">
                <FiZap className="w-3 h-3" />
                MVP Access: 1 Free Match Credit
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-[1.1] mb-6">
                Stop scrubbing video. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-500">
                  Start analyzing moments.
                </span>
              </h1>
              
              <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
                ScoutAI generates an <span className="text-gray-900 font-medium">interactive timeline</span> of shots and passes in minutes.
              </p>
            </motion.div>

            {/* Upload Card */}
            <motion.div variants={itemVariants}>
              <div className="border border-gray-200 bg-white rounded-2xl p-2 md:p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-xl py-12 px-6 text-center flex flex-col items-center justify-center gap-8 group hover:border-orange-300 hover:bg-orange-50/30 transition-all duration-300">
                  
                  <div className="w-20 h-20 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:scale-110 group-hover:border-orange-200 transition-all duration-300">
                        <FiUpload className="text-gray-400 group-hover:text-orange-600 transition-colors" size={32} />
                  </div>

                  <div className="space-y-4 flex flex-col items-center w-full max-w-md">
                      <h3 className="text-xl font-semibold text-gray-900">Upload Match Footage</h3>
                      <button
                        onClick={onUpload}
                        className="
                            w-full md:w-auto px-8 py-3.5 mt-2
                            bg-gray-900 text-white font-semibold text-lg
                            rounded-xl 
                            hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-600/20
                            transition-all duration-200 
                            flex items-center justify-center gap-2 transform active:scale-[0.98]
                        "
                      >
                        <span>Use Free Credit</span>
                        <FiArrowRight />
                      </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature Pills */}
            <motion.div 
                className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4"
                variants={itemVariants}
            >
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm transition-transform hover:-translate-y-1">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                        <FiTarget />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900">Shot Detection</p>
                        <p className="text-xs text-gray-500">Key scoring chances</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm transition-transform hover:-translate-y-1">
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                        <FiActivity />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900">Pass Analysis</p>
                        <p className="text-xs text-gray-500">Short & Long balls</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm transition-transform hover:-translate-y-1">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                        <FiClock />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900">Smart Timeline</p>
                        <p className="text-xs text-gray-500">Click-to-play events</p>
                    </div>
                </div>
            </motion.div>

            <motion.div className="mt-10 flex justify-center" variants={itemVariants}>
                 <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-100">
                    <FiInfo className="w-3 h-3 text-gray-400" />
                    <p className="text-xs text-gray-500">
                        ScoutAI is an assistive tool for rapid review. Validation of events is recommended.
                    </p>
                 </div>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </div>
  )
}