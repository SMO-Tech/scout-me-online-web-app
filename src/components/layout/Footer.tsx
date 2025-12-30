import { motion } from 'framer-motion'
import React from 'react'
import Image from 'next/image'
import Router from 'next/router'
import { useRouter } from 'next/navigation'

const Footer = () => {
  const router = useRouter()
  return (
    <motion.footer
      className="relative bg-black border-t border-gray-800 py-12"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto px-6">

        {/* Links Row */}
        <motion.div
          className="flex flex-wrap justify-center gap-10 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.2 }}
        >
          <a href="/privacy-policy" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">
            Privacy Policy
          </a>

          <a href="/terms&conditions" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">
            Terms & Conditions
          </a>

          <a href="/contact" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">
            Contact
          </a>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ delay: 0.3 }}
        >
          <div onClick={()=>router.replace('/dashboard/')} className="flex items-center gap-4">
            <Image
              src="/images/new-logo.png"
              alt="ScoutMe.cloud Logo"
              width={100}
              height={50}
              className="rounded-lg"
            />
            <div className="text-gray-400 text-sm">
              © 2025 ScoutMe.cloud — All Rights Reserved
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  )
}

export default Footer
