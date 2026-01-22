'use client'

import { motion } from 'framer-motion'
import React from 'react'
import Image from "next/image"
import { useRouter } from "next/navigation"
import { SITE_LOGO } from "@/lib/constant"
import {
  FiYoutube,
  FiLinkedin,
  FiInstagram,
  FiTwitter
} from 'react-icons/fi'

const footerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

const Footer = () => {
  const router = useRouter()

  const socialLinks = {
    youtube: 'https://www.youtube.com',
    linkedin: 'https://www.linkedin.com',
    instagram: 'https://www.instagram.com',
    twitter: 'https://x.com',
  }

  const socials = [
    { Icon: FiYoutube, href: socialLinks.youtube },
    { Icon: FiLinkedin, href: socialLinks.linkedin },
    { Icon: FiInstagram, href: socialLinks.instagram },
    { Icon: FiTwitter, href: socialLinks.twitter },
  ]

  return (
    <motion.footer
      className="relative bg-white border-t border-gray-200"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="max-w-7xl mx-auto px-6 py-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={footerVariants}
      >
        {/* Top row */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-100"
        >
          {/* Logo */}
          <div
            onClick={() => router.replace("/dashboard")}
            className="cursor-pointer flex items-center gap-3 group"
          >
            <Image
              src={SITE_LOGO.src}
              alt={SITE_LOGO.alt}
              width={110}
              height={38}
              className="object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300"
            />
            <span className="text-gray-900 font-bold tracking-tight text-lg group-hover:text-orange-600 transition-colors duration-300">
              ScoutAI
            </span>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-5">
            {socials.map(({ Icon, href }, i) => (
              <motion.a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-400 hover:text-orange-600 transition-colors duration-200"
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Bottom row */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 text-sm"
        >
          <div className="text-gray-500 font-medium">
            © {new Date().getFullYear()} ScoutAI. All rights reserved.
          </div>

          <div className="flex gap-6">
            <motion.a
              href="/contact"
              whileHover={{ x: 2 }}
              className="text-gray-500 hover:text-orange-600 transition-colors duration-200"
            >
              Contact
            </motion.a>
            <motion.a
              href="/terms&conditions"
              whileHover={{ x: 2 }}
              className="text-gray-500 hover:text-orange-600 transition-colors duration-200"
            >
              Terms of Service
            </motion.a>
          </div>
        </motion.div>
      </motion.div>
    </motion.footer>
  )
}

export default Footer