'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Page = () => {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-black">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/30 backdrop-blur-lg border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">SM</span>
              </div>
              <span className="text-white font-bold text-xl">ScoutMe.cloud</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8 text-gray-300">
              <a href="#home" className="hover:text-purple-400 transition-colors duration-300">Home</a>
              <a href="#how-it-works" className="hover:text-purple-400 transition-colors duration-300">How It Works</a>
              <a href="#for-players" className="hover:text-purple-400 transition-colors duration-300">For Players</a>
              <a href="#for-coaches" className="hover:text-purple-400 transition-colors duration-300">For Coaches & Clubs</a>
              <a href="#for-scouts" className="hover:text-purple-400 transition-colors duration-300">For Scouts</a>
              <a href="#blog" className="hover:text-purple-400 transition-colors duration-300">Blog</a>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.push('/auth')}
                className="text-gray-300 hover:text-white transition-colors duration-300"
              >
                Sign In
              </button>
              <button 
                onClick={() => router.push('/auth')}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30"
              >
                🚀 Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute w-64 h-64 bg-cyan-600/20 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-purple-500 rounded-full opacity-50"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            ></div>
          ))}
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          {/* Main Headline */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
              Go Beyond Match Analysis.
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent animate-gradient">
                Get Discovered.
              </span>
            </h1>
          </div>

          {/* Sub-headline */}
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              ScoutMe.cloud is the first platform that uses AI to analyze your match video, 
              build your professional player profile, and put you directly in front of scouts.
            </p>
          </div>

          {/* Key Benefits Grid */}
          <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Benefit 1 */}
            <div className="group bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 hover:border-purple-400/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-white mb-3">AI-Powered Analysis</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Upload any match video (phone, camera, URL) and get detailed player stats in hours.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="group bg-gradient-to-br from-blue-900/40 to-blue-800/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 hover:border-blue-400/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl mb-4">✂️</div>
              <h3 className="text-xl font-bold text-white mb-3">Automated Highlights</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Our AI finds and clips your key moments—no editing, no tagging, no hassle.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="group bg-gradient-to-br from-cyan-900/40 to-cyan-800/20 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-400/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/30" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl mb-4">👤</div>
              <h3 className="text-xl font-bold text-white mb-3">Scout-Ready Profile</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                We host your verified stats, highlights, and data on a profile built for recruiters.
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="group bg-gradient-to-br from-pink-900/40 to-pink-800/20 backdrop-blur-sm border border-pink-500/30 rounded-2xl p-6 hover:border-pink-400/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/30" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-white mb-3">Get Found</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Our platform is a dedicated network where scouts actively find and filter players based on your skills.
              </p>
            </div>

            {/* Benefit 5 */}
            <div className="group bg-gradient-to-br from-indigo-900/40 to-indigo-800/20 backdrop-blur-sm border border-indigo-500/30 rounded-2xl p-6 hover:border-indigo-400/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/30 md:col-span-2 lg:col-span-1" style={{ animationDelay: '0.4s' }}>
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-white mb-3">Instant AI Feedback</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Use our AI Coach to understand your performance, benchmark your skills, and learn exactly how to improve.
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-6 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <button 
              onClick={() => router.push('/auth')}
              className="group relative px-10 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white text-lg font-bold rounded-full overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50"
            >
              <span className="relative z-10 flex items-center gap-2">
                Create Your Player Profile
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            <button 
              onClick={() => router.push('/auth')}
              className="group px-10 py-5 bg-transparent border-2 border-purple-500 text-white text-lg font-bold rounded-full hover:bg-purple-600/20 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/30"
            >
              <span className="flex items-center gap-2">
                I&apos;m a Scout / Club
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className={`mt-16 transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-gray-500 text-sm mb-6">Trusted by players worldwide</p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-400 text-sm">AI-Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <span className="text-gray-400 text-sm">Scout Network</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <span className="text-gray-400 text-sm">Instant Analysis</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Add custom animations */}
      <style jsx>{`
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

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  )
}

export default Page
