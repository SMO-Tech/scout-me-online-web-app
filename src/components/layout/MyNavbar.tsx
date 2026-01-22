'use client'
import React, { useState, useEffect } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { SITE_LOGO } from "@/lib/constant"

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
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-md shadow-gray-200/50' : ''}`}
    >
      {/* THEME UPDATE: White background with blur, Gray border */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-gray-200 supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="flex-shrink-0 cursor-pointer flex items-center"
              onClick={() => router.push("/")}
            >
              <Image
                src={SITE_LOGO.src}
                alt={SITE_LOGO.alt}
                width={140}
                height={44}
                className="object-contain object-left"
                priority
              />
            </motion.div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="relative text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors duration-200 py-1 group/link"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 group-hover/link:w-full transition-all duration-300" />
                </motion.a>
              ))}

              {/* Primary Action Button for Login */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/auth')}
                className="bg-gray-900 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 shadow-lg shadow-gray-900/10 hover:shadow-orange-600/25"
              >
                Login
              </motion.button>
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-900 hover:text-orange-600 focus:outline-none transition-colors p-1"
              >
                {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden overflow-hidden bg-white border-t border-gray-100 shadow-xl"
            >
              <div className="px-4 pt-4 pb-6 space-y-2">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05 }}
                    className="block px-3 py-3 rounded-lg text-base font-medium text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    {link.name}
                  </motion.a>
                ))}
              
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <motion.button
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    onClick={() => {
                      setIsOpen(false)
                      router.push('/auth')
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors duration-300"
                  >
                    Login / Sign Up
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default RoundedNavbar