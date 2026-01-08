import { motion } from 'framer-motion'
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FiYoutube, FiLinkedin, FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi'

const Footer = () => {
  const router = useRouter()
  
  // Social media links - Update these with your actual links
  const socialLinks = {
    youtube: 'https://www.youtube.com/@scoutmeonline1', // Replace with your YouTube link
    linkedin: 'https://www.linkedin.com/company/scout-me-online/posts/?feedView=all', // Replace with your LinkedIn link
    instagram: 'https://www.instagram.com/scoutmeonline/',
    facebook: 'https://www.facebook.com/ScoutMeOnline/', // Replace with your Facebook link
    twitter: 'https://x.com/ScoutMeOnline', // Replace with your Twitter link
  }

  return (
    <motion.footer
      className="relative bg-black border-t border-gray-800 py-12"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* First Row: Logo and Social Media */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-2 pb-2 border-b border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.2 }}
        >
          {/* Left: ScoutMe Logo */}
          <div 
            onClick={() => router.replace('/dashboard/')} 
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
          >
            <Image
              src="/images/new-logo.png"
              alt="ScoutMe.cloud Logo"
              width={120}
              height={60}
              className="rounded-lg"
            />
          </div>

          {/* Right: Social Media Links */}
          <div className="flex items-center justify-end gap-4 md:gap-6 flex-wrap">
            <a
              href={socialLinks.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-red-500 transition-colors"
              aria-label="YouTube"
            >
              <FiYoutube className="w-8 h-8" />
            </a>
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-500 transition-colors"
              aria-label="LinkedIn"
            >
              <FiLinkedin className="w-8 h-8" />
            </a>
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-pink-500 transition-colors"
              aria-label="Instagram"
            >
              <FiInstagram className="w-8 h-8" />
            </a>
            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-600 transition-colors"
              aria-label="Facebook"
            >
              <FiFacebook className="w-8 h-8" />
            </a>
            <a
              href={socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition-colors"
              aria-label="Twitter"
            >
              <FiTwitter className="w-8 h-8" />
            </a>
          </div>
        </motion.div>

        {/* Second Row: Copyright and Links */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ delay: 0.3 }}
        >
          {/* Left: Copyright and Powered By */}
          <div className="text-gray-400 text-sm space-y-1">
            <div>© {new Date().getFullYear()} ScoutMe.cloud — All Rights Reserved</div>
           /* <div className="text-gray-500 text-xs">Powered by BIT</div> */
          </div>

          {/* Right: Privacy Policy and Terms */}
          <div className="flex flex-wrap justify-end gap-6">
            {/* <a 
              href="/privacy-policy" 
              className="text-gray-400 hover:text-purple-400 text-sm transition-colors"
            >
              Privacy Policy
            </a> */}
            <a 
              href="/terms&conditions" 
              className="text-gray-400 hover:text-purple-400 text-sm transition-colors"
            >
              Terms & Conditions
            </a>
            <a href="/Contact" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">
              Contact Us
            </a>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  )
}

export default Footer
