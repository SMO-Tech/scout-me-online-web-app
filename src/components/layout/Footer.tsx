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
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Top row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-100">
          
          {/* Logo */}
          <div
            onClick={() => router.replace('/dashboard')}
            className="cursor-pointer flex items-center gap-3 group"
          >
            {/* NOTE: Ensure this logo image is suitable for a WHITE background.
               If your current logo is white text, you need to swap the src 
               to a dark version here.
            */}
            <Image
              src="/images/new-logo.png"
              alt="Touchline"
              width={100}
              height={35}
              className="object-contain opacity-90 group-hover:opacity-100 transition-opacity"
            />
            <span className="text-gray-900 font-bold tracking-tight text-lg group-hover:text-orange-600 transition-colors">
              Touchline
            </span>
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
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 text-sm">
          <div className="text-gray-500 font-medium">
            © {new Date().getFullYear()} Touchline. All rights reserved.
          </div>

          <div className="flex gap-6">
            <a
              href="/terms&conditions"
              className="text-gray-500 hover:text-gray-900 transition-colors"
            >
              Terms
            </a>
            <a
              href="/contact"
              className="text-gray-500 hover:text-gray-900 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer