'use client'
import React, { useState, useEffect } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const RoundedNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()

  // Standard navigation links
  const navLinks = [
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
  ]

  // Add scroll shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-sm' : ''}`}>
      {/* THEME UPDATE: White background with blur, Gray border */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-gray-200 supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            {/* Logo */}
            <div 
              className="flex-shrink-0 cursor-pointer" 
              onClick={() => router.push('/')}
            >
              <Image
                src="/image/logo.png" // Ensure this path matches your file structure
                alt="ScoutAI Logo"
                width={160}
                height={80}
                className="object-contain" // Removed brightness-200 so it shows clearly on white
                priority
              />
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors"
                >
                  {link.name}
                </a>
              ))}

              {/* THEME UPDATE: Primary Action Button for Login */}
              <button
                onClick={() => router.push('/auth')}
                className="bg-gray-900 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-gray-900/10 hover:shadow-orange-600/20"
              >
                Login
              </button>
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-900 hover:text-orange-600 focus:outline-none transition-colors"
              >
                {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-xl">
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-3 rounded-lg text-base font-medium text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  {link.name}
                </a>
              ))}
              
              <div className="pt-4 mt-4 border-t border-gray-100">
                <button
                    onClick={() => {
                        setIsOpen(false);
                        router.push('/auth');
                    }}
                    className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors"
                >
                    Login / Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default RoundedNavbar