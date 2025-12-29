'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState, Suspense, useRef } from 'react'
import { FiCpu, FiVideo, FiUser, FiSearch, FiMessageCircle, FiMenu, FiX } from 'react-icons/fi'
import { HiSparkles } from 'react-icons/hi'
import dynamic from 'next/dynamic'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import Image from 'next/image'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/Home/Hero'
import HowStatement from '@/components/Home/HowStatement'
import Features from '@/components/Home/Features'

// Dynamically import Three.js component to avoid SSR issues
const ThreeBackground = dynamic(() => import('@/components/ThreeBackground').catch(() => {
  // Fallback component if Three.js fails to load
  return { default: () => <div className="absolute inset-0" /> }
}), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20" />
})

const Page = () => {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const section2Ref = useRef<HTMLElement>(null)

  // Use window scroll instead of container ref to avoid issues
  const { scrollYProgress } = useScroll()

  // Smooth spring animation for scroll - faster response
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 300, // Increased from 100 for faster response
    damping: 40,    // Increased from 30 for less bounce
    restDelta: 0.001
  })

  // Define all transforms at the top level (before any returns)
  const backgroundGradient = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    [
      'radial-gradient(ellipse at top, rgba(147, 51, 234, 0.3) 0%, rgba(0, 0, 0, 1) 50%)',
      'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.3) 0%, rgba(0, 0, 0, 1) 50%)',
      'radial-gradient(ellipse at bottom, rgba(6, 182, 212, 0.3) 0%, rgba(0, 0, 0, 1) 50%)'
    ]
  )
  const heroY = useTransform(smoothProgress, [0, 0.3], [0, -100])
  const heroOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0])
  const heroOverlayY = useTransform(smoothProgress, [0, 0.3], [0, 150])
  const heroContentY = useTransform(smoothProgress, [0, 0.3], [0, -50])
  const heroContentOpacity = useTransform(smoothProgress, [0, 0.2, 0.3], [1, 0.8, 0])
  const section2Opacity = useTransform(smoothProgress, [0.2, 0.4, 0.6], [0, 1, 0.8])
  const section2GridY = useTransform(smoothProgress, [0.3, 0.6], [50, -50])

  useEffect(() => {
    // Loading animation - faster
    const timer = setTimeout(() => {
      setIsLoading(false)
      setTimeout(() => setIsVisible(true), 50)
    }, 800) // Reduced from 2000ms to 800ms

    return () => clearTimeout(timer)
  }, [])

  // Loading Screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-purple-950 to-black flex items-center justify-center z-50">
        <div className="text-center">
          <div className="relative">
            {/* Animated Logo */}
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl animate-spin-slow"></div>
              <div className="absolute inset-2 bg-gradient-to-br from-gray-950 to-black rounded-xl flex items-center justify-center">
                <HiSparkles className="text-4xl text-purple-400 animate-pulse" />
              </div>
            </div>

            {/* Loading Text */}
            <h2 className="text-2xl font-bold text-white mb-2 animate-pulse">ScoutMe.cloud</h2>
            <p className="text-gray-400 text-sm">Loading your experience...</p>

            {/* Progress Bar */}
            <div className="w-48 h-1 bg-gray-800 rounded-full mx-auto mt-6 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-black overflow-x-hidden">
      {/* Animated Background Gradient that changes on scroll */}
      <motion.div
        className="fixed inset-0 z-0"
        style={{ background: backgroundGradient }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/30 backdrop-blur-lg border-b border-purple-500/20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform duration-300" onClick={() => router.push('/')}>
              <Image
                src="/logo.png"
                alt="ScoutMe.cloud Logo"
                width={100}
                height={80}
                className="rounded-lg  "
              />
              {/* <span className="text-white font-bold text-xl">ScoutMe.cloud</span> */}
            </div>

            {/* Navigation Links - Desktop */}
            <div className="hidden lg:flex items-center gap-8 text-gray-300">
              <a href="#home" className="hover:text-purple-400 transition-colors duration-300">Home</a>
              <a href="/players" className="hover:text-purple-400 transition-colors duration-300">For Players</a>
              <a href="/coaches" className="hover:text-purple-400 transition-colors duration-300">For Coaches & Clubs</a>
              <a href="/scouts" className="hover:text-purple-400 transition-colors duration-300">For Scouts</a>
              <a href="#how-it-works" className="hover:text-purple-400 transition-colors duration-300">How It Works</a>
              <a href="#blog" className="hover:text-purple-400 transition-colors duration-300">Blog</a>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/auth')}
                className="hidden md:block text-gray-300 hover:text-white transition-colors duration-300 font-medium"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push('/auth')}
                className="hidden md:flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30"
              >
                <HiSparkles className="text-lg" />
                Sign Up
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-white p-2 hover:bg-purple-600/20 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="py-4 space-y-3">
              <a href="#home" className="block py-2 text-gray-300 hover:text-purple-400 transition-colors" onClick={() => setMobileMenuOpen(false)}>Home</a>
              <a href="/players" className="block py-2 text-gray-300 hover:text-purple-400 transition-colors" onClick={() => setMobileMenuOpen(false)}>For Players</a>
              <a href="/coaches" className="block py-2 text-gray-300 hover:text-purple-400 transition-colors" onClick={() => setMobileMenuOpen(false)}>For Coaches & Clubs</a>
              <a href="/scouts" className="block py-2 text-gray-300 hover:text-purple-400 transition-colors" onClick={() => setMobileMenuOpen(false)}>For Scouts</a>
              <a href="#how-it-works" className="block py-2 text-gray-300 hover:text-purple-400 transition-colors" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
              <a href="#blog" className="block py-2 text-gray-300 hover:text-purple-400 transition-colors" onClick={() => setMobileMenuOpen(false)}>Blog</a>
              <div className="pt-4 space-y-2">
                <button onClick={() => router.push('/auth')} className="w-full py-2 text-center text-gray-300 hover:text-white transition-colors">Sign In</button>
                <button onClick={() => router.push('/auth')} className="w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold">Sign Up</button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* solid - Hero */}
      <Hero />
      <HowStatement />
      <Features />
  

      {/* Section 4: The AI Technology */}
      <motion.section
        id="ai-technology"
        className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 bg-gradient-to-b from-black via-purple-950/30 to-black"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated Neural Network Background */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="neural-grid" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="2" fill="#9333ea" opacity="0.5">
                  <animate attributeName="r" values="1;3;1" dur="3s" repeatCount="indefinite" />
                </circle>
                <line x1="50" y1="50" x2="100" y2="50" stroke="#9333ea" strokeWidth="0.5" opacity="0.3" />
                <line x1="50" y1="50" x2="50" y2="100" stroke="#3b82f6" strokeWidth="0.5" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#neural-grid)" />
          </svg>
        </div>

        {/* Floating AI Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Main Headline with Glitch Effect */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="inline-block mb-4"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="px-6 py-2 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-full border border-purple-500/50">
                <span className="text-purple-300 text-sm font-bold tracking-wider">⚡ NEXT-GEN AI TECHNOLOGY</span>
              </div>
            </motion.div>

            <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
              Meet Your{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-purple-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
                  AI Analyst
                </span>
                <motion.span
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                />
              </span>
              <br />& Coach
            </h2>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We measure what others <span className="text-red-400 line-through">can&apos;t</span>{' '}
              <span className="text-cyan-400 font-bold">won&apos;t</span> to prove what you&apos;re worth.
            </p>
          </motion.div>

          {/* AI Features Grid */}
          <motion.div
            className="grid md:grid-cols-3 gap-6 mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {[
              { icon: '🧠', title: 'Spatial Awareness', desc: 'Track positioning & movement intelligence', color: 'from-purple-600 to-purple-800' },
              { icon: '🛡️', title: 'Defensive Analysis', desc: 'Measure tackles, blocks & pressure', color: 'from-blue-600 to-blue-800' },
              { icon: '⚡', title: 'Work Rate', desc: 'Quantify effort & distance covered', color: 'from-cyan-600 to-cyan-800' },
              { icon: '👻', title: 'Off-Ball Movement', desc: 'Analyze runs & space creation', color: 'from-indigo-600 to-indigo-800' },
              { icon: '🎯', title: 'Tactical Execution', desc: 'Evaluate decision-making patterns', color: 'from-pink-600 to-pink-800' },
              { icon: '📊', title: 'Complete Picture', desc: 'Beyond just passes & shots', color: 'from-purple-600 to-blue-600' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.color} rounded-2xl blur opacity-0 group-hover:opacity-60 transition duration-500`}></div>
                <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 h-full">
                  <motion.div
                    className="text-4xl mb-3"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Scout Score Feature - BIG Highlight */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Glowing Border Animation */}
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-3xl blur-lg"
              animate={{
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            <div className="relative bg-gradient-to-br from-gray-900 via-purple-950/50 to-gray-900 backdrop-blur-xl border-2 border-purple-500/30 rounded-3xl p-8 md:p-12 overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle, #9333ea 1px, transparent 1px)',
                  backgroundSize: '30px 30px'
                }}></div>
              </div>

              <div className="relative grid md:grid-cols-2 gap-12 items-center">
                {/* Left: Animated Score Display */}
                <motion.div
                  className="text-center md:text-left"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    className="inline-block mb-6"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <div className="relative w-48 h-48 mx-auto md:mx-0">
                      {/* Circular Progress */}
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="96"
                          cy="96"
                          r="88"
                          stroke="#1f2937"
                          strokeWidth="12"
                          fill="none"
                        />
                        <motion.circle
                          cx="96"
                          cy="96"
                          r="88"
                          stroke="url(#scoreGradient)"
                          strokeWidth="12"
                          fill="none"
                          strokeLinecap="round"
                          initial={{ strokeDasharray: '0 552' }}
                          whileInView={{ strokeDasharray: '463 552' }}
                          viewport={{ once: false }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                        <defs>
                          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#9333ea" />
                            <stop offset="50%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#06b6d4" />
                          </linearGradient>
                        </defs>
                      </svg>

                      {/* Score Number */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.div
                          className="text-6xl font-bold bg-gradient-to-br from-purple-400 to-cyan-400 bg-clip-text text-transparent"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: false }}
                        >
                          84
                        </motion.div>
                        <div className="text-sm text-gray-400 mt-1">out of 100</div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: false }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-full border border-green-500/30 mb-4">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span className="text-green-400 text-sm font-semibold">+12 points this week</span>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Right: Feature Description */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <HiSparkles className="text-4xl text-purple-400" />
                    </motion.div>
                    <h3 className="text-3xl md:text-4xl font-bold text-white">
                      Introducing Your{' '}
                      <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                        Scout Score™
                      </span>
                    </h3>
                  </div>

                  <p className="text-lg text-gray-300 leading-relaxed mb-6">
                    Your <span className="text-purple-400 font-semibold">Scout Score™</span> is a dynamic, AI-generated metric that benchmarks your performance against{' '}
                    <span className="text-cyan-400 font-semibold">thousands of other players</span> in your position and age group.
                  </p>

                  <p className="text-base text-gray-400 leading-relaxed mb-8">
                    It&apos;s the <span className="text-purple-400 font-semibold">first data-driven rating</span> designed to show recruiters your true potential and impact on the game.
                    Use our AI Coach to get personalized feedback on how to improve your score and elevate your game.
                  </p>

                  {/* Key Features Pills */}
                  <div className="flex flex-wrap gap-3">
                    {['Real-time Updates', 'Position-Specific', 'Age-Adjusted', 'Globally Ranked'].map((pill, i) => (
                      <motion.div
                        key={i}
                        className="px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-full text-sm text-purple-300 font-medium"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: false }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        whileHover={{ scale: 1.05, borderColor: 'rgba(168, 85, 247, 0.6)' }}
                      >
                        {pill}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Bottom Stats Bar */}
              <motion.div
                className="mt-12 pt-8 border-t border-gray-700/50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: 0.5 }}
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { value: '100+', label: 'Data Points', icon: '📊' },
                    { value: '10K+', label: 'Players Analyzed', icon: '👥' },
                    { value: '99.2%', label: 'Accuracy Rate', icon: '✓' },
                    { value: '24/7', label: 'AI Coach Access', icon: '🤖' },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      className="text-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: false }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="text-2xl mb-1">{stat.icon}</div>
                      <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Competition Comparison */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: 0.4 }}
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-full">
              <span className="text-gray-400 text-sm">Why settle for basic stats when you can have</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-bold text-sm">
                intelligent insights?
              </span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Section 5: Social Proof & Final CTA */}
      <motion.section
        id="social-proof"
        className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 bg-gradient-to-b from-black via-blue-950/20 to-purple-950/30"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated Success Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -50, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          {/* Main Headline */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="inline-block mb-6"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="px-8 py-3 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-full border border-green-500/50">
                <span className="text-green-300 text-sm font-bold tracking-wider">🏆 SUCCESS STORIES</span>
              </div>
            </motion.div>

            <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
              The Smartest Path from{' '}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                the Pitch
              </span>
              <br />to the{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Pros
              </span>
            </h2>
          </motion.div>

          {/* Testimonial Card */}
          <motion.div
            className="relative mb-16"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Glowing Quote Background */}
            <motion.div
              className="absolute -inset-2 bg-gradient-to-r from-green-600/30 via-blue-600/30 to-purple-600/30 rounded-3xl blur-xl"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            <div className="relative bg-gradient-to-br from-gray-900/90 via-blue-950/30 to-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 md:p-12 overflow-hidden">
              {/* Quote Icon */}
              <motion.div
                className="absolute top-6 left-6 text-6xl text-green-400/20"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                "
              </motion.div>

              <div className="relative z-10">
                {/* Testimonial Text */}
                <motion.blockquote
                  className="text-xl md:text-2xl text-gray-200 leading-relaxed mb-8 italic"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-green-400 font-semibold">ScoutMe.cloud</span> did more than just cut our team&apos;s film.
                  It built a profile for every player that we could send directly to college coaches.{' '}
                  <span className="text-blue-400 font-semibold">Three of our players received offers</span> specifically because a scout found their verified stats on the platform.{' '}
                  <span className="text-purple-400 font-semibold">It&apos;s a game-changer for visibility.</span>
                </motion.blockquote>

                {/* Author */}
                <motion.div
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">C</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-lg">Coach</div>
                    <div className="text-gray-400">U18 Academy Team</div>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-4 h-4 text-yellow-400"
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: false }}
                          transition={{ delay: 0.6 + i * 0.1 }}
                        >
                          ⭐
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Success Stats */}
              <motion.div
                className="mt-8 pt-6 border-t border-gray-700/50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: 0.7 }}
              >
                <div className="grid grid-cols-3 gap-6 text-center">
                  {[
                    { value: '3', label: 'Players Got Offers', icon: '🎯' },
                    { value: '100%', label: 'Verified Stats', icon: '✅' },
                    { value: '24hrs', label: 'Profile Ready', icon: '⚡' },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      className="group"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: false }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-2xl mb-2">{stat.icon}</div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Final CTA Section */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* CTA Headlines */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-4xl md:text-6xl font-bold text-white mb-4">
                You Have the{' '}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Talent
                </span>
                .
              </h3>
              <h3 className="text-4xl md:text-6xl font-bold text-white mb-6">
                We Have the{' '}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Technology
                </span>
                .
              </h3>
            </motion.div>

            <motion.p
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.5 }}
            >
              Stop waiting for your opportunity.{' '}
              <span className="text-cyan-400 font-bold">Create it.</span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.6 }}
            >
              <motion.button
                className="group relative px-12 py-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-xl rounded-2xl shadow-2xl overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(147, 51, 234, 0.5)',
                    '0 0 40px rgba(59, 130, 246, 0.8)',
                    '0 0 20px rgba(147, 51, 234, 0.5)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <span className="relative z-10">Sign Up and Start Your Analysis Today</span>
                <motion.div
                  className="absolute top-2 right-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  🚀
                </motion.div>
              </motion.button>

              <motion.button
                className="px-8 py-6 border-2 border-gray-600 text-gray-300 font-semibold text-lg rounded-2xl hover:border-purple-500 hover:text-purple-300 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Watch Demo
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="flex flex-wrap justify-center items-center gap-8 text-gray-400 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center gap-2">
                <span className="text-green-400">🔒</span>
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-400">⚡</span>
                <span>Instant Results</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-400">🎯</span>
                <span>Proven Success</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <Footer />

      {/* Add custom animations */}
      <style jsx global>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          33% {
            transform: translateY(-20px) translateX(10px);
          }
          66% {
            transform: translateY(-10px) translateX(-10px);
          }
        }

        @keyframes loading-bar {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
          }
          33% {
            transform: translateY(-30px) translateX(20px) scale(1.05);
          }
          66% {
            transform: translateY(-15px) translateX(-20px) scale(0.95);
          }
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        /* 3D Transform Utilities */
        .perspective-1000 {
          perspective: 1000px;
        }

        .transform-style-3d {
          transform-style: preserve-3d;
        }

        .rotate-y-5:hover {
          transform: rotateY(5deg);
        }

        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: #0a0a0a;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #9333ea, #3b82f6);
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #a855f7, #60a5fa);
        }
      `}</style>
    </div>
  )
}

export default Page
