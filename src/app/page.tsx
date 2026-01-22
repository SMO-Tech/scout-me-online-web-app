'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView, Variants } from 'framer-motion';
import { 
  UploadCloud, 
  Activity, 
  PlayCircle, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  MonitorPlay,
  TrendingUp,
  Users
} from 'lucide-react';
import RoundedNavbar from '@/components/layout/MyNavbar';
import Footer from '@/components/layout/Footer';


// --- ANIMATION VARIANTS ---

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const timelineGrow: Variants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: { 
    scaleX: 1, 
    transition: { duration: 1.5, ease: "circOut" } 
  }
};

// --- COMPONENTS ---

const SectionHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <motion.div 
    variants={fadeInUp}
    className="mb-16 md:mb-24 max-w-3xl"
  >
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">{title}</h2>
    {subtitle && <p className="text-xl text-gray-500 leading-relaxed">{subtitle}</p>}
  </motion.div>
);

export default function LandingPage() {
  return (
    <div className="bg-white min-h-screen overflow-x-hidden selection:bg-orange-100 selection:text-orange-900">
      <RoundedNavbar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      {/* <OutputPreviewSection /> */}
      <TurnaroundSection />
      <PricingSection />
      <WhoItsForSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
}

// --- 1. HERO SECTION ---

function HeroSection() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-6 pt-20 overflow-hidden bg-white bg-mesh-gradient">
      {/* Background Abstract Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>
      {/* Subtle AI scan overlay */}
      <div className="absolute inset-0 z-0 ai-scan-line opacity-60" aria-hidden="true" />

      <div className="container mx-auto max-w-6xl relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Copy */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center space-x-2 bg-orange-50 border border-orange-100 rounded-full px-4 py-1.5">
            <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-orange-900 tracking-wide">Beta Access Open</span>
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight leading-[1.1]">
            Turn Match Footage into <span className="text-orange-600">Structured Data</span>.
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-xl text-gray-500 max-w-lg leading-relaxed">
            Upload a YouTube link. We process the footage and return an interactive timeline of key moments within hours.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg shadow-orange-600/20 hover:shadow-xl hover:shadow-orange-600/30"
            >
              Analyze a Match
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white border border-gray-200 hover:border-orange-200 hover:shadow-md text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <span>View Sample</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </motion.button>
          </motion.div>
          
          <motion.p variants={fadeInUp} className="text-sm text-gray-400">
            1 Free Match Credit • No Credit Card Required
          </motion.p>
        </motion.div>

        {/* Abstract Hero Visualization */}
        <motion.div style={{ y: y1 }} className="relative h-[400px] w-full hidden lg:flex items-center justify-center">
          {/* The "Timeline" Building Animation */}
          <div className="relative w-full h-full bg-gray-50 rounded-2xl border border-gray-200 p-8 shadow-2xl shadow-orange-900/5 flex flex-col justify-center gap-6 ring-1 ring-gray-100/50 hover:shadow-orange-600/5 hover:ring-orange-200/30 transition-all duration-500">
             {/* Fake Video Player */}
             <div className="w-full h-48 bg-gray-200 rounded-lg animate-pulse mb-8 relative overflow-hidden">
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-1/2"
                />
             </div>
             {/* Dynamic Timeline */}
             <div className="relative h-2 bg-gray-200 rounded-full w-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: "70%" }}
                 transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
                 className="absolute top-0 left-0 h-full bg-orange-600"
               />
             </div>
             {/* Event Markers Popping Up */}
             <div className="flex justify-between px-4">
               {[1, 2, 3, 4].map((i) => (
                 <motion.div
                   key={i}
                   initial={{ scale: 0, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   transition={{ delay: 1 + (i * 0.2), type: "spring" }}
                   className="flex flex-col items-center gap-2"
                 >
                   <div className="w-3 h-3 bg-gray-900 rounded-full ring-4 ring-white" />
                   <div className="w-16 h-2 bg-gray-200 rounded-full" />
                 </motion.div>
               ))}
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// --- 2. PROBLEM SECTION ---

function ProblemSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto max-w-5xl px-6">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-16 items-center"
        >
          <div>
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-gray-900 mb-6">
              The 90-Minute Grind
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-gray-500 mb-6">
              Manual analysis is inefficient. Key moments are buried in long footage, forcing coaches and analysts to spend hours scrubbing through dead ball time and midfield stagnation just to find ten relevant clips.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex items-center gap-4 text-gray-400">
               <Clock className="w-5 h-5" />
               <span>Average manual tagging time: 3+ Hours</span>
            </motion.div>
          </div>
          
          <motion.div 
            variants={fadeInUp}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="relative h-64 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 p-6 flex flex-col justify-center transition-all duration-300"
          >
             {/* Visualizing "Messy" Timeline */}
             <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Raw Footage</p>
             <div className="w-full h-4 bg-gray-200 rounded-full mb-2 overflow-hidden flex">
                <div className="w-[10%] h-full bg-gray-300 rounded-l" />
                <div className="w-[30%] h-full bg-gray-200" />
                <div className="w-[5%] h-full bg-gray-300" />
                <div className="w-[40%] h-full bg-gray-200" />
                <div className="w-[15%] h-full bg-gray-300 rounded-r" />
             </div>
             <div className="flex justify-between text-xs text-gray-400 font-mono">
               <span>00:00</span>
               <span>90:00</span>
             </div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="bg-white/80 backdrop-blur px-4 py-2 rounded-lg border border-gray-200 text-gray-500 font-medium">
                   Untagged & Unstructured
                </div>
             </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// --- 3. SOLUTION SECTION ---

function SolutionSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto max-w-5xl px-6">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-16 items-center"
        >
           {/* Order swapped on mobile/desktop via flex/grid order if needed, but standard is fine */}
           <motion.div 
             whileHover={{ y: -4, transition: { duration: 0.2 } }}
             className="relative h-64 bg-white rounded-xl border-2 border-orange-100 shadow-xl shadow-orange-100/50 hover:shadow-2xl hover:shadow-orange-200/30 p-6 flex flex-col justify-center order-2 md:order-1 transition-shadow duration-300"
           >
             <p className="text-xs font-semibold text-orange-600 uppercase tracking-widest mb-4">ScoutAI Processed</p>
             <div className="w-full h-1 bg-gray-100 rounded-full mb-6 flex items-center relative">
                {/* Clean Nodes */}
                <motion.div variants={timelineGrow} className="absolute inset-0 bg-gray-200 origin-left" />
                <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0.5 }} className="absolute left-[10%] w-3 h-3 bg-gray-900 rounded-full ring-4 ring-white shadow-sm" />
                <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0.7 }} className="absolute left-[35%] w-3 h-3 bg-orange-500 rounded-full ring-4 ring-white shadow-sm" />
                <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0.9 }} className="absolute left-[60%] w-3 h-3 bg-gray-900 rounded-full ring-4 ring-white shadow-sm" />
                <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 1.1 }} className="absolute left-[85%] w-3 h-3 bg-gray-900 rounded-full ring-4 ring-white shadow-sm" />
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <motion.div whileHover={{ scale: 1.03 }} className="bg-gray-50 p-3 rounded border border-gray-100 hover:border-orange-200 transition-colors">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mb-2"></div>
                  <div className="text-sm font-bold text-gray-900">Shots</div>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} className="bg-gray-50 p-3 rounded border border-gray-100 hover:border-orange-200 transition-colors">
                  <div className="w-2 h-2 bg-gray-900 rounded-full mb-2"></div>
                  <div className="text-sm font-bold text-gray-900">Passes</div>
                </motion.div>
             </div>
          </motion.div>

          <div className="order-1 md:order-2">
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-gray-900 mb-6">
              Structured Visual Data
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-gray-500 mb-6">
              We act as a rapid preliminary analysis layer. ScoutAI identifies distinct events, organizing chaos into a navigable timeline. It is not a replacement for your expertise—it is a tool to get you to the footage that matters, faster.
            </motion.p>
            <motion.ul variants={fadeInUp} className="space-y-3">
              {['Auto-detection of passes & shots', 'Click-to-play timeline markers', 'Same-day turnaround'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-orange-600" />
                  {item}
                </li>
              ))}
            </motion.ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// --- 4. HOW IT WORKS ---

function HowItWorksSection() {
  const steps = [
    { icon: <UploadCloud />, title: "Submit Link", desc: "Paste a YouTube URL of the full match footage." },
    { icon: <Activity />, title: "Processing", desc: "Our system scans the match (typically 2-4 hours)." },
    { icon: <MonitorPlay />, title: "Review", desc: "Receive a link to your interactive timeline." }
  ];

  return (
    <section id="how-it-works"  className="py-24 bg-gray-50 border-y border-gray-200">
      <div className="container mx-auto max-w-6xl px-6">
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <SectionHeader title="The Workflow" subtitle="Designed for speed and simplicity." />
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div 
                key={index} 
                variants={fadeInUp}
                whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.25 } }}
                className="bg-white p-8 rounded-xl border border-gray-200 relative group hover:border-orange-200 hover:shadow-lg hover:shadow-orange-100/50 transition-all duration-300"
              >
                <div className="absolute top-8 right-8 text-6xl font-bold text-gray-100 -z-10 group-hover:text-orange-50 transition-colors duration-300">
                  0{index + 1}
                </div>
                <motion.div 
                  className="w-12 h-12 bg-gray-900 text-white rounded-lg flex items-center justify-center mb-6 shadow-lg shadow-gray-900/20 group-hover:bg-orange-600 group-hover:shadow-orange-600/30"
                  whileHover={{ rotate: [0, -8, 8, 0], transition: { duration: 0.5 } }}
                >
                  {step.icon}
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// --- 5. OUTPUT PREVIEW (KEY SECTION) ---

function OutputPreviewSection() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto max-w-6xl px-6">
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <SectionHeader title="The Dashboard" subtitle="Clean, distraction-free analysis environment." />
        </motion.div>

        {/* The Mockup Interface */}
        <motion.div 
          initial={{ y: 100, opacity: 0, rotateX: 10 }}
          whileInView={{ y: 0, opacity: 1, rotateX: 0 }}
          transition={{ duration: 1, type: "spring" }}
          viewport={{ once: true }}
          className="relative mx-auto bg-white rounded-t-2xl border-x border-t border-gray-200 shadow-2xl max-w-5xl aspect-[16/9] overflow-hidden"
        >
            {/* Header Mock */}
            <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-gray-50/50">
               <div className="flex items-center gap-4">
                 <div className="w-8 h-8 bg-orange-600 rounded-md"></div>
                 <div className="h-4 w-32 bg-gray-200 rounded"></div>
               </div>
               <div className="h-8 w-24 bg-white border border-gray-200 rounded text-xs flex items-center justify-center text-gray-500">
                 Export Data
               </div>
            </div>

            {/* Video Area Mock */}
            <div className="flex h-[calc(100%-4rem)]">
               {/* Sidebar */}
               <div className="w-64 border-r border-gray-200 bg-gray-50 p-4 hidden md:block">
                  <div className="space-y-3">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="h-12 bg-white border border-gray-200 rounded p-2 flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded"></div>
                        <div className="space-y-1">
                          <div className="h-2 w-16 bg-gray-200 rounded"></div>
                          <div className="h-2 w-10 bg-gray-100 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>

               {/* Main Player */}
               <div className="flex-1 bg-gray-900 relative flex items-center justify-center">
                  <PlayCircle className="w-20 h-20 text-white/20" />
                  
                  {/* Floating Event Tag Overlay */}
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute bottom-8 left-8 bg-black/80 backdrop-blur text-white px-4 py-2 rounded-lg border border-white/10 flex items-center gap-3"
                  >
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <span className="font-mono text-sm">23:14 • Key Pass</span>
                  </motion.div>
               </div>
            </div>
        </motion.div>
      </div>
    </section>
  );
}

// --- 6. TURNAROUND & RELIABILITY ---

function TurnaroundSection() {
  return (
    <section className="relative py-24 bg-gray-900 text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-orange-950/10 via-transparent to-orange-950/10 pointer-events-none" aria-hidden="true" />
      <div className="container relative mx-auto max-w-4xl px-6 text-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Built for Speed, Not Perfection.</h2>
          <p className="text-xl text-gray-400 leading-relaxed mb-12">
            We prioritize delivery speed to fit into your weekly cycle. 
            While our detection accuracy is high and improving daily, we position ScoutAI as a 
            <span className="text-white font-semibold"> rapid review tool</span> rather than a definitive statistical record.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-orange-600/50 hover:shadow-lg hover:shadow-orange-600/10 transition-all duration-300"
            >
               <h4 className="text-lg font-bold text-orange-500 mb-2">Same-Day Delivery</h4>
               <p className="text-gray-400">Submit in the morning, review in the afternoon. We work on a rolling queue system.</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-orange-600/50 hover:shadow-lg hover:shadow-orange-600/10 transition-all duration-300"
            >
               <h4 className="text-lg font-bold text-orange-500 mb-2">Replay Friendly</h4>
               <p className="text-gray-400">Jump instantly to events. No more scrubbing through dead ball time.</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// --- 7. PRICING SECTION ---

function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="container mx-auto max-w-5xl px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
        >
          <SectionHeader title="Simple Pricing" subtitle="No subscriptions. Pay as you analyze." />
        
        <div className="grid md:grid-cols-2 gap-8">
           {/* Free Tier */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             whileHover={{ y: -6, transition: { duration: 0.2 } }}
             className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-300"
           >
             <h3 className="text-2xl font-bold text-gray-900 mb-2">Trial</h3>
             <div className="text-4xl font-bold text-gray-900 mb-6">Free<span className="text-lg font-normal text-gray-500"> / 1 Match</span></div>
             <p className="text-gray-500 mb-8">Test the output quality with your own footage.</p>
             <ul className="space-y-4 mb-8">
               <li className="flex gap-3 text-gray-700"><CheckCircle2 className="w-5 h-5 text-gray-400" /> Full Match Analysis</li>
               <li className="flex gap-3 text-gray-700"><CheckCircle2 className="w-5 h-5 text-gray-400" /> Interactive Timeline</li>
               <li className="flex gap-3 text-gray-700"><CheckCircle2 className="w-5 h-5 text-gray-400" /> 24hr Turnaround</li>
             </ul>
             <motion.button
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               className="w-full py-4 rounded-lg border-2 border-gray-200 hover:border-gray-900 text-gray-900 font-bold transition-colors duration-300"
             >
               Start Free Trial
             </motion.button>
           </motion.div>

           {/* Paid Tier */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             viewport={{ once: true }}
             whileHover={{ y: -6, transition: { duration: 0.2 } }}
             className="bg-white p-8 rounded-2xl border-2 border-orange-600 shadow-xl hover:shadow-2xl hover:shadow-orange-600/20 relative overflow-hidden transition-shadow duration-300"
           >
             <div className="absolute top-0 right-0 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg animate-glow-pulse-soft">POPULAR</div>
             <h3 className="text-2xl font-bold text-gray-900 mb-2">Standard</h3>
             <div className="text-4xl font-bold text-gray-900 mb-6">£5<span className="text-lg font-normal text-gray-500"> / Match</span></div>
             <p className="text-gray-500 mb-8">Flexible credits for busy periods.</p>
             <ul className="space-y-4 mb-8">
               <li className="flex gap-3 text-gray-900 font-medium"><CheckCircle2 className="w-5 h-5 text-orange-600" /> Priority Queue</li>
               <li className="flex gap-3 text-gray-900 font-medium"><CheckCircle2 className="w-5 h-5 text-orange-600" /> Permanent Hosting</li>
               <li className="flex gap-3 text-gray-900 font-medium"><CheckCircle2 className="w-5 h-5 text-orange-600" /> Bulk Discounts Available</li>
             </ul>
             <motion.button
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               className="w-full py-4 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold transition-colors duration-300 shadow-lg shadow-orange-600/20"
             >
               Buy Credits
             </motion.button>
           </motion.div>
        </div>
        </motion.div>
      </div>
    </section>
  );
}

// --- 8. WHO IT'S FOR ---

function WhoItsForSection() {
  const profiles = [
    { icon: <TrendingUp />, title: "Analysts", desc: "Reduce tactical coding time by 80%." },
    { icon: <Users />, title: "Coaches", desc: "Prepare post-match review sessions instantly." },
    { icon: <MonitorPlay />, title: "Content Teams", desc: "Find highlights for social media packages." },
    { icon: <Activity />, title: "Semi-Pro Clubs", desc: "Elite level tooling on a grassroots budget." },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto max-w-6xl px-6">
        <SectionHeader title="Built for the Football Ecosystem" />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {profiles.map((p, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6, scale: 1.03, transition: { duration: 0.2 } }}
              className="p-6 rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-100/40 transition-all duration-300 group cursor-default"
            >
              <motion.div 
                className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-900 mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300"
                whileHover={{ rotate: 5, scale: 1.1 }}
              >
                {p.icon}
              </motion.div>
              <h4 className="font-bold text-gray-900 mb-2">{p.title}</h4>
              <p className="text-sm text-gray-500">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- 9. FINAL CTA ---

function FinalCTASection() {
  return (
    <section className="relative py-32 bg-white bg-mesh-gradient flex justify-center overflow-hidden">
      <div className="container mx-auto px-6 text-center relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-8">
            Stop scrubbing. <br />Start analyzing.
          </h2>
          <p className="text-xl text-gray-500 mb-10">
            Join the analysts saving hours every matchday. <br/>Your first match is on us.
          </p>
          <motion.button
            whileHover={{ scale: 1.04, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-5 rounded-xl font-bold text-xl transition-all duration-300 shadow-xl shadow-orange-600/30 hover:shadow-2xl hover:shadow-orange-600/40"
          >
            Analyze Your First Match
          </motion.button>
          <p className="mt-6 text-sm text-gray-400">No credit card required for trial.</p>
        </motion.div>
      </div>
    </section>
  );
}