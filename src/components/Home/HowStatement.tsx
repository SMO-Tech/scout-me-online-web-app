"use client"
import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'

const HowStatement = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [videoError, setVideoError] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    const videoContainer = videoContainerRef.current
    const overlay = overlayRef.current
    const section = sectionRef.current

    if (video && videoContainer && overlay && section && !videoError) {
      // Ensure video plays and loops
      const handleLoadedData = () => {
        video.play().catch(() => {
          setVideoError(true)
        })
      }
      
      const handleEnded = () => {
        // Restart video when it ends to ensure continuous loop
        video.currentTime = 0
        video.play().catch(() => {
          setVideoError(true)
        })
      }
      
      video.addEventListener('loadeddata', handleLoadedData)
      video.addEventListener('ended', handleEnded)
      
      // Try to play immediately
      video.play().catch(() => {
        // If autoplay fails, wait for loaded data
        console.log('Video autoplay prevented, waiting for loaded data')
      })

      // GSAP Animations - video stays fixed, only effects change on scroll
      const handleScroll = () => {
        const scrollY = window.scrollY
        const sectionTop = section.offsetTop
        const sectionHeight = section.offsetHeight
        const windowHeight = window.innerHeight
        
        // Calculate scroll progress within section
        const scrollProgress = Math.max(0, Math.min(1, (scrollY - sectionTop + windowHeight) / sectionHeight))
        
        // Only subtle scale change, NO Y movement to prevent gaps
        gsap.to(videoContainer, {
          scale: 1 + scrollProgress * 0.03, // Very subtle scale only
          duration: 0.3,
          ease: 'power1.out',
        })
        
        // Dynamic overlay opacity - lighter as you scroll
        const overlayOpacity = 0.4 - scrollProgress * 0.15
        gsap.to(overlay, {
          opacity: Math.max(0.25, overlayOpacity),
          duration: 0.3,
          ease: 'power1.out',
        })
        
        // Video brightness increases on scroll
        const brightness = 0.6 + scrollProgress * 0.15
        const blur = 3 - scrollProgress * 1.5
        gsap.to(video, {
          filter: `blur(${Math.max(1.5, blur)}px) brightness(${Math.min(0.75, brightness)}) saturate(1.2)`,
          duration: 0.3,
          ease: 'power1.out',
        })
      }

      // Throttled scroll handler
      let ticking = false
      const scrollHandler = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            handleScroll()
            ticking = false
          })
          ticking = true
        }
      }

      window.addEventListener('scroll', scrollHandler)
      handleScroll() // Initial call

      // Smooth pulsing effect for video visibility
      gsap.to(video, {
        opacity: 1,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      })

      // Subtle zoom pulse effect (very minimal to avoid gaps)
      gsap.to(videoContainer, {
        scale: 1.05, // Reduced from 1.08
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      })

      return () => {
        window.removeEventListener('scroll', scrollHandler)
        gsap.killTweensOf([video, videoContainer, overlay])
        if (video) {
          video.removeEventListener('loadeddata', handleLoadedData)
          video.removeEventListener('ended', handleEnded)
        }
      }
    }
  }, [videoError])

  const handleVideoError = () => {
    setVideoError(true)
  }

  return (
    <section ref={sectionRef} className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Video Background with GSAP effects - stretched upward to eliminate gap */}
      <div 
        ref={videoContainerRef} 
        className="absolute z-0 overflow-hidden" 
        style={{ 
          position: 'absolute', 
          top: '-35vh',  // Extend even more above section
          left: 0, 
          right: 0, 
          bottom: 0,
          height: 'calc(100% + 35vh)',  // Extra height to cover gap
        }}
      >
        {videoError ? (
          <div className="h-full w-full bg-gradient-to-br from-gray-900 via-black to-gray-900" />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onError={handleVideoError}
            className="h-full w-full object-cover"
            style={{
              filter: 'blur(3px) brightness(0.6) saturate(1.1)',
              transform: 'scale(1.25)',  // Slightly more scale for maximum coverage
              transformOrigin: 'center top',  // Scale from top
              transition: 'filter 0.3s ease-out',
              position: 'absolute',
              top: '-18%',  // Push video even higher
              left: 0,
              width: '100%',
              height: '135%',  // More height for stretching
              objectFit: 'cover',
              objectPosition: 'center top',  // Anchor to top
            }}
          >
            <source src="/videos/10 seconds 2nd section.mp4" type="video/mp4" />
          </video>
        )}
        {/* Gradient overlay for better video visibility */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.5) 100%)',
          }}
        />
      </div>

      {/* Dynamic Semi-transparent Overlay - controlled by GSAP */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-10 bg-black/40"
        style={{
          transition: 'opacity 0.3s ease-out',
        }}
      />
      
      {/* Animated scanline effect using GSAP */}
      <div
        className="absolute inset-0 z-10 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(244, 114, 182, 0.3) 2px, rgba(244, 114, 182, 0.3) 4px)',
        }}
      />

      {/* Content Container */}
      <div className="relative z-20 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Side - Headline */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 text-cyan-400">
                How?
              </h2>
              <p className="text-xl sm:text-xl md:text-2xl lg:text-3xl text-white leading-relaxed mb-3 max-w-4xl smofonts">
              From video URL to elite analysis within <span className="bg-gradient-to-r text-transparent bg-clip-text from-pink-600 via-pink-500 to-purple-600 font-bold">one hour !</span>
              </p>
             
            </motion.div>

            {/* Right Side - Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className="w-full"
            >
              <img
                src="/images/how.png"
                alt="How it works"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowStatement

