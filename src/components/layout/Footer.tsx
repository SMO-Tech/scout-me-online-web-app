'use client'

import { motion } from 'framer-motion'
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  FiYoutube,
  FiLinkedin,
  FiInstagram,
  FiTwitter
} from 'react-icons/fi'

const Footer = () => {
  const router = useRouter()

  const socialLinks = {
    youtube: 'https://www.youtube.com',
    linkedin: 'https://www.linkedin.com',
    instagram: 'https://www.instagram.com',
    twitter: 'https://x.com',
  }

  return (
    <motion.footer
      className="relative bg-white border-t border-gray-200"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-7xl mx-auto px-6 ">
        {/* Top row */}
        <div className="flex flex-col md:flex-row items-center justify-between  border-b border-gray-100">
          
          {/* Logo */}
          <div
            onClick={() => router.replace('/dashboard')}
            className="cursor-pointer flex items-center group"
          >
            {/* Using the same logo source, but you can swap this for an SVG icon if you prefer */}
            <Image
              src="/image/logo.png"
              alt="ScoutAI Logo"
              width={160}
              height={35}
              className="object-contain opacity-90 group-hover:opacity-100 transition-opacity"
            />
          </div>

          {/* Socials */}
          <div className="flex items-center gap-5">
            {[
              { Icon: FiYoutube, href: socialLinks.youtube },
              { Icon: FiLinkedin, href: socialLinks.linkedin },
              { Icon: FiInstagram, href: socialLinks.instagram },
              { Icon: FiTwitter, href: socialLinks.twitter },
            ].map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-orange-600 hover:scale-110 transition-all duration-200"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row mb-5 items-center justify-between gap-4 pt-6 text-sm">
          <div className="text-gray-500 font-medium">
            © {new Date().getFullYear()} ScoutAI. All rights reserved.
          </div>

          <div className="flex gap-6">
            <a
              href="/contact"
              className="text-gray-500 hover:text-orange-600 transition-colors"
            >
              Contact
            </a>
            <a
              href="/terms&conditions"
              className="text-gray-500 hover:text-orange-600 transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer