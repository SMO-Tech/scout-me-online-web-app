'use client'
import MyNavbar from '@/components/layout/MyNavbar'
import SuccessCard from '@/components/ui/SuccessCard'
import { useRouter } from 'next/navigation'
import React from 'react'

const Page = () => {

  const router = useRouter()
  const handleGetStarted = () => {
    router.push('/auth')
  }
  return (
    <>
      <section 
        className="relative w-screen h-screen bg-center bg-cover bg-no-repeat p-5"
        style={{
          backgroundImage: 'url("/images/view-empty-soccer-stadium-with-fantasy-dreamy-sky.jpg")',
        }}
      >
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/20" />

        {/* Navbar with glassmorphism */}
        <div className="relative z-10">
          <MyNavbar />
        </div>

        {/* Hero Content with glassmorphism */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-8 sm:p-12 max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight text-white mb-6">
              Don't wait to be noticed
              <br />
              <span className="text-purple-400">let AI showcase your talent.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Use advanced AI technology to analyze and highlight your sports performance, 
              making it easier for scouts to discover your potential.
            </p>
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-full text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>
      <section className="relative w-screen min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white px-6 py-20">
        {/* Background with overlay */}
        <div className="absolute inset-0 bg-[url('/hero.jpg')] bg-cover bg-center opacity-30"></div>
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-2xl">
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-6">
            Upload Your Gameplay — <br />
            <span className="text-purple-500">Let AI Analyze Your Skills</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 mb-10">
            Paste your gameplay video link, and our AI breaks down your performance,
            highlights your strengths, and shows where you can improve — instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <input
              type="text"
              placeholder="Enter gameplay video URL..."
              className="w-80 sm:w-96 px-4 py-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold transition">
              Analyze
            </button>
          </div>
        </div>
      </section>
      <SuccessCard />
      <footer className="bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-700 text-white py-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold">Scout Me</h2>
            <p className="text-gray-300 text-sm">AI-powered gameplay insights.</p>
          </div>

          {/* Links */}
          <ul className="flex flex-wrap justify-center sm:justify-end gap-5 text-sm text-gray-300">
            <li><a href="#about" className="hover:text-white transition">About</a></li>
            <li><a href="#features" className="hover:text-white transition">Features</a></li>
            <li><a href="#contact" className="hover:text-white transition">Contact</a></li>
          </ul>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-purple-500 mt-4 pt-3 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Scout Me — All rights reserved.
        </div>
      </footer>

    </>
  )
}

export default Page
