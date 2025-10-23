'use client'
import React, { useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import Image from 'next/image'
const RoundedNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navLinks = ['Home', 'About', 'Services', 'Contact', 'Login']

  return (
    <nav className="sticky top-0 z-50">
      <div className="backdrop-blur-md bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Logo"
                width={80}
                height={40}
                style={{ height: 'auto' }}
                className="object-contain brightness-200"
              />
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex space-x-6">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="text-white/80 hover:text-white transition-colors rounded-md px-3 py-2 hover:bg-white/10"
                >
                  {link}
                </a>
              ))}
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white/80 hover:text-white focus:outline-none"
              >
                {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden backdrop-blur-md bg-white/10 border-t border-white/20">
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="block px-3 py-2 rounded-md text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default RoundedNavbar
