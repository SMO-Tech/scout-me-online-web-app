'use client'
import { useRouter } from 'next/navigation'
import React from 'react'
import { motion } from 'framer-motion'
import { FiUser, FiVideo, FiTrendingUp, FiAward } from 'react-icons/fi'

const PlayersPage = () => {
  const router = useRouter()

  const features = [
    {
      icon: FiVideo,
      title: 'Instant Video Analysis',
      description: 'Upload any match video and get comprehensive performance insights in just 1 hour.'
    },
    {
      icon: FiTrendingUp,
      title: 'Performance Tracking',
      description: 'Track 100+ key performance metrics and see your progress over time.'
    },
    {
      icon: FiAward,
      title: 'Scout Score™',
      description: 'Get a unique AI-generated score that compares you to players in your position and age group.'
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-gradient-to-b from-black via-purple-950/30 to-black"
      >
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <motion.h1 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-7xl font-extrabold mb-6"
          >
            Your Performance, 
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              Amplified by AI
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12"
          >
            Transform your football journey with AI-powered match analysis. Get scouted faster, understand your strengths, and elevate your game.
          </motion.p>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center space-x-6"
          >
            <button 
              onClick={() => router.push('/auth')}
              className="px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-full hover:scale-105 transition-transform"
            >
              Create Your Profile
            </button>
            <button 
              onClick={() => router.push('/demo')}
              className="px-10 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-colors"
            >
              Watch Demo
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-black via-purple-950/30 to-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-sm border border-purple-500/30 rounded-3xl p-8 text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-purple-600/30 rounded-xl flex items-center justify-center">
                  <feature.icon className="text-4xl text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default PlayersPage
