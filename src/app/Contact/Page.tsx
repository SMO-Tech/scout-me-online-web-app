'use client'

import React, { useState, useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { FiMail, FiClock, FiCheck, FiCopy, FiMessageSquare, FiHelpCircle } from 'react-icons/fi'
import Footer from '@/components/layout/Footer' // Ensure this path matches your project structure

const ContactPage = () => {
  // --- 3D TILT LOGIC ---
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // --- COPY TO CLIPBOARD LOGIC ---
  const [copied, setCopied] = useState(false);
  const email = "admin@scoutmeonline.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-hidden font-sans text-gray-900 selection:bg-orange-100 selection:text-orange-900">
      
      {/* --- AMBIENT BACKGROUND ANIMATION --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div 
            animate={{ 
                x: [0, 100, 0], 
                y: [0, -50, 0],
                scale: [1, 1.2, 1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-200/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" 
        />
        <motion.div 
            animate={{ 
                x: [0, -100, 0], 
                y: [0, 100, 0],
                scale: [1, 1.3, 1]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gray-200/60 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" 
        />
      </div>

      <main className="flex-1 flex items-center justify-center relative z-10 py-20 px-6">
        <motion.div
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="max-w-4xl w-full perspective-1000"
        >
            {/* --- MAIN GLASS CARD --- */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl shadow-gray-200/50 rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden">
                
                {/* Decorative sheen */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/80 via-transparent to-transparent pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center text-center">
                    
                    {/* Icon */}
                    <motion.div 
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-lg shadow-orange-500/30 mb-8 rotate-3"
                    >
                        <FiMail className="w-9 h-9 text-white" />
                    </motion.div>

                    {/* Headlines */}
                    <motion.h1 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 mb-6"
                    >
                        Let's Talk.
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg text-gray-500 max-w-2xl leading-relaxed mb-12"
                    >
                        Whether you have a question about features, pricing, or need technical assistance, our team is ready to answer all your questions.
                    </motion.p>

                    {/* --- INTERACTIVE EMAIL BOX --- */}
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="w-full max-w-lg"
                    >
                        <div className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-orange-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            
                            <div className="relative bg-white border border-gray-100 rounded-2xl p-2 flex items-center shadow-sm">
                                <div className="flex-1 px-4 py-3 text-left">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Contact Email</p>
                                    <p className="text-lg md:text-xl font-bold text-gray-900 truncate">{email}</p>
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <button 
                                        onClick={handleCopy}
                                        className="p-3.5 rounded-xl bg-gray-50 text-gray-500 hover:bg-orange-50 hover:text-orange-600 transition-all active:scale-95"
                                        title="Copy to clipboard"
                                    >
                                        {copied ? <FiCheck className="w-5 h-5" /> : <FiCopy className="w-5 h-5" />}
                                    </button>
                                    <a 
                                        href={`mailto:${email}`}
                                        className="p-3.5 rounded-xl bg-gray-900 text-white hover:bg-orange-600 shadow-md shadow-gray-900/10 hover:shadow-orange-600/20 transition-all active:scale-95"
                                        title="Open Mail App"
                                    >
                                        <FiMail className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>
                        </div>
                        
                        {/* Copied Feedback Toast */}
                        <div className={`mt-3 text-sm font-medium text-green-600 transition-opacity duration-300 ${copied ? 'opacity-100' : 'opacity-0'}`}>
                            ✓ Copied to clipboard!
                        </div>
                    </motion.div>

                    {/* --- INFO GRID --- */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-16 pt-10 border-t border-gray-100"
                    >
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <FiMessageSquare />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Technical Support</h3>
                                <p className="text-sm text-gray-500">We troubleshoot fast.</p>
                            </div>
                        </div>
                        
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                                <FiClock />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Response Time</h3>
                                <p className="text-sm text-gray-500">Usually within 24 hours.</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                <FiHelpCircle />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">General Inquiry</h3>
                                <p className="text-sm text-gray-500">Partnerships & Sales.</p>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}

export default ContactPage