'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiLock, FiShield, FiEye, FiServer, FiGlobe, FiMail } from 'react-icons/fi';


// --- NAVIGATION SECTIONS ---
const sections = [
  { id: 'intro', title: '1. Introduction' },
  { id: 'collection', title: '2. Data We Collect' },
  { id: 'usage', title: '3. How We Use Data' },
  { id: 'sharing', title: '4. Third-Party Sharing' },
  { id: 'videos', title: '5. Video Content' },
  { id: 'rights', title: '6. Your Rights' },
  { id: 'contact', title: '7. Contact Us' },
];

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5 } 
  }
};

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState('intro');

  // Simple scroll spy to highlight active section in sidebar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans selection:bg-orange-100 selection:text-orange-900">
 

      <div className="max-w-7xl mx-auto px-6 py-24">
        
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-1.5 rounded-full mb-6 shadow-sm">
            <FiShield className="text-orange-600 w-4 h-4" />
            <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">
              Legal & Compliance
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-500">
            We value your trust. This document explains exactly how ScoutAI handles your personal data, video uploads, and analytical results.
          </p>
          <p className="text-sm text-gray-400 mt-4 font-mono">
            Last Updated: January 22, 2026
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 relative">
          
          {/* SIDEBAR NAVIGATION (Sticky) */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32 space-y-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 pl-4">
                Contents
              </p>
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollTo(section.id)}
                  className={`w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeSection === section.id 
                      ? 'bg-white text-orange-600 shadow-sm border border-gray-200 translate-x-1' 
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </div>
          </div>

          {/* MAIN CONTENT */}
          <motion.div 
            className="lg:col-span-8 lg:col-start-5 space-y-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* 1. INTRODUCTION */}
            <Section id="intro" icon={<FiLock />}>
              <h2>1. Introduction</h2>
              <p>
                ScoutAI ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy outlines our practices regarding the collection, use, and disclosure of information when you use our automated video analysis services.
              </p>
              <p>
                By using ScoutAI, you agree to the collection and use of information in accordance with this policy. We operate under the laws of the United Kingdom and adhere to the General Data Protection Regulation (GDPR).
              </p>
            </Section>

            {/* 2. DATA WE COLLECT */}
            <Section id="collection" icon={<FiEye />}>
              <h2>2. Data We Collect</h2>
              <div className="space-y-6 mt-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-2">A. Personal Data</h3>
                  <p className="text-gray-500 text-sm">
                    When you register, we collect personally identifiable information such as your <strong>Email Address</strong>, <strong>Full Name</strong>, and <strong>Password</strong> (hashed).
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-2">B. Usage Data</h3>
                  <p className="text-gray-500 text-sm">
                    We collect information on how the Service is accessed, including your computer's IP address, browser type, and the time spent on specific pages (Analytical timelines).
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-2">C. Payment Information</h3>
                  <p className="text-gray-500 text-sm">
                    We do <strong>not</strong> store your credit card details. Payment transactions are handled securely by our third-party payment processors (e.g., Stripe), who adhere to PCI-DSS standards.
                  </p>
                </div>
              </div>
            </Section>

            {/* 3. HOW WE USE DATA */}
            <Section id="usage" icon={<FiServer />}>
              <h2>3. How We Use Your Data</h2>
              <p>
                We use the collected data for the following specific purposes:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-4 text-gray-600">
                <li>To provide and maintain the automated analysis service.</li>
                <li>To notify you about changes to our service (e.g., when your analysis is ready).</li>
                <li>To provide customer support.</li>
                <li>To monitor the usage of our service to detect and prevent technical issues.</li>
                <li>To improve our AI algorithms (anonymized video data only).</li>
              </ul>
            </Section>

            {/* 4. THIRD PARTIES */}
            <Section id="sharing" icon={<FiGlobe />}>
              <h2>4. Third-Party Service Providers</h2>
              <p>
                We may employ third-party companies to facilitate our Service ("Service Providers"), to provide the Service on our behalf, or to perform Service-related services.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="border border-gray-200 p-4 rounded-lg bg-white">
                  <span className="font-bold text-gray-900 block mb-1">Google / Firebase</span>
                  <span className="text-xs text-gray-500">Authentication & Database hosting.</span>
                </div>
                <div className="border border-gray-200 p-4 rounded-lg bg-white">
                  <span className="font-bold text-gray-900 block mb-1">Stripe</span>
                  <span className="text-xs text-gray-500">Payment processing services.</span>
                </div>
                <div className="border border-gray-200 p-4 rounded-lg bg-white">
                  <span className="font-bold text-gray-900 block mb-1">AWS / Vercel</span>
                  <span className="text-xs text-gray-500">Cloud infrastructure and compute.</span>
                </div>
                <div className="border border-gray-200 p-4 rounded-lg bg-white">
                  <span className="font-bold text-gray-900 block mb-1">YouTube API</span>
                  <span className="text-xs text-gray-500">Video source retrieval.</span>
                </div>
              </div>
            </Section>

            {/* 5. VIDEO CONTENT */}
            <Section id="videos" icon={<FiEye />}>
              <h2>5. Video Content & AI Analysis</h2>
              <p>
                <strong>Your Role:</strong> By submitting a video link, you act as the Data Controller regarding any individuals (players, referees) visible in that video.
              </p>
              <p>
                <strong>Our Role:</strong> ScoutAI acts as the Data Processor. We analyze the pixel data to identify sporting events. We do not use facial recognition technology to identify specific individuals for surveillance purposes.
              </p>
            </Section>

            {/* 6. YOUR RIGHTS */}
            <Section id="rights" icon={<FiShield />}>
              <h2>6. Your Data Protection Rights</h2>
              <p>
                Under GDPR and other privacy laws, you have specific rights regarding your personal data:
              </p>
              <ul className="space-y-3 mt-4">
                {[
                  { title: "The Right to Access", desc: "You can request copies of your personal data." },
                  { title: "The Right to Rectification", desc: "You can request that we correct any information you believe is inaccurate." },
                  { title: "The Right to Erasure", desc: "You can request that we delete your personal data ('Right to be forgotten')." },
                  { title: "The Right to Portability", desc: "You can request that we transfer your data to another organization." },
                ].map((right, i) => (
                  <li key={i} className="flex gap-4 items-start bg-white p-4 rounded-lg border border-gray-200">
                    <div className="min-w-[4px] h-full min-h-[40px] bg-orange-500 rounded-full"></div>
                    <div>
                      <strong className="block text-gray-900 text-sm">{right.title}</strong>
                      <span className="text-gray-500 text-xs">{right.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </Section>

            {/* 7. CONTACT */}
            <Section id="contact" icon={<FiMail />}>
              <h2>7. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or wish to exercise your data rights, please contact us:
              </p>
              <div className="mt-6">
                <a 
                  href="mailto:privacy@scoutai.com" 
                  className="inline-flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-gray-900/10"
                >
                  <FiMail /> privacy@scoutmeonline.com
                </a>
              </div>
            </Section>

          </motion.div>
        </div>
      </div>
      

    </div>
  );
}

// --- SUB-COMPONENT: Generic Section Wrapper ---
const Section = ({ id, children, icon }: { id: string, children: React.ReactNode, icon: React.ReactNode }) => (
  <motion.section 
    id={id} 
    variants={itemVariants}
    className="scroll-mt-32"
  >
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 text-xl">
        {icon}
      </div>
      {/* Extracting H2 logic to assure consistent styling */}
      <div className="prose prose-lg prose-headings:m-0 prose-headings:text-2xl prose-headings:font-bold prose-headings:text-gray-900">
        {React.Children.toArray(children)[0]} 
      </div>
    </div>
    
    <div className="prose prose-gray max-w-none text-gray-500 leading-relaxed">
      {React.Children.toArray(children).slice(1)}
    </div>
    
    <div className="h-px bg-gray-200 w-full mt-12"></div>
  </motion.section>
);