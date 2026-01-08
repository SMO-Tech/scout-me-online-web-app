'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { FiMail } from 'react-icons/fi'
import Footer from '@/components/layout/Footer'

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 rounded-3xl p-8 md:p-12 border border-gray-800 shadow-2xl"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mb-6">
              <FiMail className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Contact Us
            </h1>
            <p className="text-gray-400 text-lg">
              We're here to help! Drop us a message and we'll get back to you.
            </p>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800"
          >
            <div className="text-center space-y-6">
              <div>
                <p className="text-gray-400 text-sm mb-2">Email us at:</p>
                <a
                  href="mailto:admin@scoutmeonline.com"
                  className="text-2xl md:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 hover:from-purple-300 hover:to-blue-300 transition-all inline-block"
                >
                  admin@scoutmeonline.com
                </a>
              </div>

              <div className="pt-6 border-t border-gray-800">
                <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                  Drop us your message over there and we will sort it out.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-500 text-sm">
              We typically respond within 24-48 hours
            </p>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}

export default ContactPage
