'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiClock, FiInfo } from 'react-icons/fi'
import Footer from '@/components/layout/Footer'

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-[#0d1117] via-purple-900/20 to-[#0d1117]
                       rounded-3xl p-8 md:p-14 border border-white/10 shadow-2xl"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="text-center mb-14"
            >
              <div className="inline-flex items-center justify-center w-20 h-20
                              bg-gradient-to-br from-purple-600 to-blue-600
                              rounded-full mb-6 shadow-lg">
                <FiMail className="w-10 h-10 text-white" />
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                Get in Touch
              </h1>

              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Questions, partnerships, or platform support — reach out and we’ll respond
                with clarity and speed.
              </p>
            </motion.div>

            {/* Main Contact Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="bg-[#0a0b0f]/70 backdrop-blur rounded-2xl
                         border border-white/10 p-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                {/* Email */}
                <div className="md:col-span-2 text-center md:text-left">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                    Email
                  </p>
                  <a
                    href="mailto:admin@scoutmeonline.com"
                    className="text-2xl md:text-3xl font-black
                               text-transparent bg-clip-text
                               bg-gradient-to-r from-purple-400 to-blue-400
                               hover:from-purple-300 hover:to-blue-300
                               transition-all"
                  >
                    admin@scoutmeonline.com
                  </a>

                  <p className="mt-4 text-gray-400 leading-relaxed max-w-xl">
                    For general enquiries, technical support, or collaboration
                    opportunities, email is the fastest and most reliable way to reach us.
                  </p>
                </div>

                {/* Meta Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-400">
                    <FiClock className="text-purple-400" />
                    <span className="text-sm">
                      Response time: <strong className="text-white">24–48 hours</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-400">
                    <FiInfo className="text-blue-400" />
                    <span className="text-sm">
                      Support handled by the core team
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Bottom Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="mt-10 text-center"
            >
              <p className="text-gray-500 text-sm">
                Please include relevant details in your message so we can help you faster.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ContactPage
