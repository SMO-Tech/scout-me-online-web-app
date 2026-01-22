'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiUpload, 
  FiArrowRight, 
  FiActivity, 
  FiClock, 
  FiTarget, 
  FiZap,
  FiInfo
} from 'react-icons/fi';
import { motion, Variants } from 'framer-motion';

// PRODUCTION NOTE: Explicitly typed variants to prevent build errors
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 40, damping: 10 }
  }
}

export default function DashboardPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { replace } = useRouter()

  useEffect(() => {
    // Simulate initial data/auth check
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center'>
        <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-orange-100 border-t-orange-600 rounded-full animate-spin"></div>
            <span className="text-gray-400 text-xs font-mono font-medium tracking-widest">LOADING SCOUT AI...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <motion.div 
        className="max-w-5xl w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 p-8 md:p-14 border border-gray-100 relative overflow-hidden">
            
            {/* Background Accents (Subtle Orange) */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-orange-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-60 h-60 bg-gray-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

            <div className="max-w-4xl mx-auto relative z-10">
            
            {/* HERO SECTION: Value Prop (Speed + Timeline) */}
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
                ScoutAI generates an <span className="text-gray-900 font-medium">interactive timeline</span> of shots and passes in minutes, so you can review key events without watching the full 90 minutes.
              </p>
            </motion.div>

            {/* ACTION CARD */}
            <motion.div variants={itemVariants}>
              <div className="border border-gray-200 bg-white rounded-2xl p-2 md:p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-xl py-12 px-6 text-center flex flex-col items-center justify-center gap-8 group hover:border-orange-300 hover:bg-orange-50/30 transition-all duration-300">
                  
                  {/* Upload Icon */}
                  <div className="w-20 h-20 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:scale-110 group-hover:border-orange-200 transition-all duration-300">
                       <FiUpload className="text-gray-400 group-hover:text-orange-600 transition-colors" size={32} />
                  </div>

                  <div className="space-y-4 flex flex-col items-center w-full max-w-md">
                      <h3 className="text-xl font-semibold text-gray-900">Upload Match Footage</h3>
                      <p className="text-sm text-gray-500">
                        Paste a YouTube link to begin processing. <br/>
                        <span className="text-xs text-gray-400">Supported: Shots, Short Passes, Long Passes</span>
                      </p>

                      <button
                        onClick={() => replace('/dashboard/form')}
                        disabled={isUploading}
                        className="
                            w-full md:w-auto px-8 py-3.5 mt-2
                            bg-gray-900 text-white font-semibold text-lg
                            rounded-xl 
                            hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-600/20
                            transition-all duration-200 
                            disabled:opacity-50 disabled:cursor-not-allowed
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

            {/* FEATURE PILLS (Aligned with MVP Scope) */}
            <motion.div 
                className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4"
                variants={itemVariants}
            >
                {/* Feature 1 */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm transition-transform hover:-translate-y-1">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                        <FiTarget />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900">Shot Detection</p>
                        <p className="text-xs text-gray-500">Key scoring chances</p>
                    </div>
                </div>

                {/* Feature 2 */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm transition-transform hover:-translate-y-1">
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                        <FiActivity />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900">Pass Analysis</p>
                        <p className="text-xs text-gray-500">Short & Long balls</p>
                    </div>
                </div>

                {/* Feature 3 */}
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

            {/* Disclaimer Footer */}
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
  );
}