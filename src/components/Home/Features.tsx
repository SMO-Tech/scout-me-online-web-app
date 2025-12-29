"use client"
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaMinus } from 'react-icons/fa'
import { 
  FaChartLine, 
  FaSearch, 
  FaFutbol,
  FaTags,
  FaMap,
  FaCheckCircle,
  FaTrophy,
  FaVideo
} from 'react-icons/fa'

interface Feature {
  id: string
  title: string
  description: string
  details: string[]
  icon: React.ReactNode
  video?: string
  image?: string
}

const features: Feature[] = [
  {
    id: 'performance',
    title: 'Performance Analytics',
    description: 'Advanced AI-powered analysis of player performance metrics with real-time insights and comprehensive statistical breakdowns.',
    details: [
     
    ],
    icon: <FaChartLine />,
    image: '/images/dashboard-2.jpeg'
  },
  {
    id: 'scouting',
    title: 'Player Scouting',
    description: 'Discover and evaluate talent with precision using AI-powered recommendations and comprehensive player profiling.',
    details: [
    
    ],
    icon: <FaSearch />,
    image: '/images/dashboard-2.jpeg'
  },
  {
    id: 'ai-action-tagging',
    title: 'AI Action Tagging',
    description: 'Every action. Every location. Every outcome tagged by AI.',
    details: [
     
    ],
    icon: <FaTags />,
    video: '/videos/features/video 1.mp4'
  },
  {
    id: 'intelligent-heat-map',
    title: 'Intelligent Heat Map',
    description: 'An Intelligent Heat Map that learns where you create the most impact.',
    details: [
      
    ],
    icon: <FaMap />,
    video: '/videos/features/video 2.mp4'
  },
  {
    id: 'clarity-certainty',
    title: 'Get clarity & certainty',
    description: 'Instant clarity and certainty on where player or the team succeed and where they don\'t.',
    details: [
     
    ],
    icon: <FaCheckCircle />,
    video: '/videos/features/video 3.mp4'
  },
  {
    id: 'intelligent-goal-post',
    title: 'Intelligent Goal Post',
    description: 'Intelligent goal post for shot at goal or defending your goal.',
    details: [
     
    ],
    icon: <FaFutbol />,
    video: '/videos/features/video 4.mp4'
  },
  {
    id: 'line-of-graph',
    title: 'Line of Graph',
    description: 'Track your progress. Prove your progression.',
    details: [
      
    ],
    icon: <FaChartLine />,
    video: '/videos/features/video 5.mp4'
  },
  {
    id: 'instant-rankings',
    title: 'Instant Performance Rankings',
    description: 'Instantly see the top performer for every metric, per team.',
    details: [
    
    ],
    icon: <FaTrophy />,
    video: '/videos/features/video 6.mp4'
  },
  {
    id: 'tagged-replays',
    title: 'Tagged Action Replays',
    description: 'Replay every action and see exactly why it worked or didn\'t',
    details: [
    
    ],
    icon: <FaVideo />,
    video: '/videos/features/7.mp4'
  }
  
]

const Features = () => {
  const [expandedFeature, setExpandedFeature] = useState<string | null>(features[0]?.id || null)

  const toggleFeature = (featureId: string) => {
    setExpandedFeature(expandedFeature === featureId ? null : featureId)
  }

  return (
    <section className="relative w-full bg-gray-950 py-20 sm:py-24 lg:py-32 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 pointer-events-none" 
        style={{ 
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.02) 0%, transparent 70%)' 
        }} 
      />

      <div className="relative z-10 mx-auto w-[92%] max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white mb-1 tracking-tight">
            Powerful Features
          </h2>
          <p className="text-lg sm:text-2xl text-white/60 max-w-2xl mx-auto font-light">
            Everything you need to elevate your football analysis.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[22%_78%] gap-8 lg:gap-12 items-start">
          {/* Left Side - Feature Menu (Apple Style) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-2 order-2 lg:order-1"
          >
            {features.map((feature, index) => {
              const isExpanded = expandedFeature === feature.id
              
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="overflow-hidden"
                >
                  {/* Feature Button */}
                  <button
                    onClick={() => toggleFeature(feature.id)}
                    className={`w-full text-left rounded-xl p-3 transition-all duration-300 ${
                      isExpanded
                        ? 'bg-white/10 backdrop-blur-sm'
                        : 'bg-white/5 hover:bg-white/8'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`text-base text-white/80 transition-colors ${
                          isExpanded ? 'text-white' : ''
                        }`}>
                          {feature.icon}
                        </div>
                        <h3 className="text-sm font-medium text-white leading-tight">
                          {feature.title}
                        </h3>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 45 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-shrink-0 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center"
                      >
                        {isExpanded ? (
                          <FaMinus className="text-white text-[10px]" />
                        ) : (
                          <FaPlus className="text-white text-[10px]" />
                        )}
                      </motion.div>
                    </div>
                  </button>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 px-5 pb-5">
                          <p className="text-base text-white/70 leading-relaxed mb-4">
                            {feature.description}
                          </p>
                          <div className="space-y-2">
                            {feature.details.map((detail, idx) => (
                              <div key={idx} className="flex items-start gap-3 text-sm text-white/60">
                                <div className="w-1 h-1 rounded-full bg-white/40 mt-2 flex-shrink-0" />
                                <span>{detail}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Right Side - Device Showcase (Apple Style) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative lg:sticky lg:top-24 order-1 lg:order-2 flex items-center justify-center"
          >
            {/* Laptop Frame - Apple Style */}
            <div className="relative mx-auto w-full max-w-5xl">
              {/* Laptop Screen */}
              <div className="relative bg-gray-800/50 rounded-t-2xl p-1.5 shadow-2xl backdrop-blur-sm">
                {/* Screen Bezel */}
                <div className="bg-black rounded-xl overflow-hidden aspect-video relative flex items-center justify-center">
                  {/* Screen Content - Video or Image */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={expandedFeature || 'default'}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      {(() => {
                        const activeFeature = features.find(f => f.id === expandedFeature) || features[0]
                        if (activeFeature?.video) {
                          return (
                            <video
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="w-full h-full object-contain"
                            >
                              <source src={activeFeature.video} type="video/mp4" />
                            </video>
                          )
                        }
                        return (
                          <img
                            src={activeFeature?.image || '/assets/images/dashboard-2.jpeg'}
                            alt={activeFeature?.title || 'Dashboard'}
                            className="w-full h-full object-contain"
                          />
                        )
                      })()}
                      {/* Subtle overlay for better text readability if needed */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    </motion.div>
                  </AnimatePresence>
                  
                  {/* Camera Notch */}
                  <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-800 rounded-full"></div>
                </div>
              </div>
              
              {/* Laptop Base */}
              <div className="bg-gray-800/30 h-3 rounded-b-2xl shadow-xl backdrop-blur-sm"></div>
              
              {/* Laptop Hinge */}
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-40 h-1 bg-gray-700/50 rounded-full"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Features

