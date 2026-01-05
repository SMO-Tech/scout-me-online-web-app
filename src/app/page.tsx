'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import { HiSparkles } from 'react-icons/hi'
import dynamic from 'next/dynamic'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import Image from 'next/image'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/Home/Hero'
import HowStatement from '@/components/Home/HowStatement'
import Features from '@/components/Home/Features'
import SectionThree from '@/components/Home/SectionThree'
import SectionFour from '@/components/Home/SectionFour'
import UserJourney from '@/components/Home/UserJourney'
import Achievements from '@/components/Home/Achievements'
import Link from 'next/link'
import { useSEO } from '@/hooks/useSEO'

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

  // SEO metadata
  useSEO({
    title: 'ScoutMe.cloud - AI-Powered Football Scouting & Player Analytics Platform',
    description: 'Discover, analyze, and track football players with AI-powered scouting tools. Advanced player analytics, match analysis, and talent discovery platform for coaches, scouts, and clubs.',
    image: '/images/new-logo.png',
    url: typeof window !== 'undefined' ? window.location.href : '',
    keywords: 'football scouting, player analytics, AI scouting, football analytics, talent discovery, match analysis, player performance, football data, scouting platform',
    type: 'website',
    siteName: 'ScoutMe.cloud'
  })

  // Loading Screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-purple-950 to-black flex items-center justify-center z-50">
        <div className="text-center">
          <div className="relative">

            <video
              className='rounded-2xl mb-10'
              src="/videos/loading.mp4"
              width={200}
              height={200}
              autoPlay
              muted
              loop
              playsInline
            />

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
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-xl border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <div
              onClick={() => router.push('/')}
              className="flex items-center gap-2 cursor-pointer hover:scale-[1.02] transition"
            >
              <Image
                src="/images/new-logo.png"
                alt="ScoutMe.cloud Logo"
                width={70}
                height={60}
                className="rounded-xl"
              />
            </div>

        
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-4 sm:gap-6">
                <a
                  href="/auth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 sm:px-6 font-semibold text-white hover:text-gray-300 transition-colors duration-200 smofonts"
                >
                  Login / Register
                </a>
              </div>

              {/* Mobile Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition"
              >
                {mobileMenuOpen ? <FiX color='#00FCFF' className="text-2xl" /> : <FiMenu color='#00FCFF' className="text-2xl" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`lg:hidden transition-all duration-300 overflow-hidden ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
          >
            <div className="py-4 space-y-3 text-gray-300">
              <div className="flex items-center gap-4 sm:gap-6">
                <a
                  href="/auth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 sm:px-6 font-semibold text-white hover:text-gray-300 transition-colors duration-200 smofonts"
                >
                  Login / Register
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>


      {/* solid - Hero */}
      <Hero />
      <HowStatement />
      <Features />
      <SectionThree />
      <SectionFour />
      <UserJourney />
      <Achievements />
      <Footer />
    </div>
  )
}

export default Page
