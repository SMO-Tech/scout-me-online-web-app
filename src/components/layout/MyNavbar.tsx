'use client'
import React, { useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import Image from 'next/image'
const RoundedNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navLinks = ['Home', 'About', 'Services', 'Contact']

  return (
    <nav className="bg-white shadow-md rounded-b-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Logo"
              width={80}
              height={40}
              className="object-contain"
            />
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-gray-700 hover:text-purple-600 transition-colors rounded-md px-2 py-1 hover:bg-purple-50"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-purple-600 focus:outline-none"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md rounded-b-xl">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="block px-3 py-2 rounded-md text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

export default RoundedNavbar
