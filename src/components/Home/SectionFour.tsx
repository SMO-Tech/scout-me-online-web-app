"use client"
import { useEffect, useMemo, useRef } from 'react'
import { gsap } from 'gsap'

const SectionFour = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  // Custom name mapping for logos
  const logoNames: Record<string, string> = {
    // Row 1
    '/images/fiorentina.png': 'Fiorentina U15 (Italy)',
    '/images/apea.png': 'APEA FC (Cyprus)',
    '/images/brescia.png': 'Brescia Calcio Femminile (Italy)',
    '/images/pascani.png': 'CSM Pascani (Romania)',
    '/images/dynamo.png': 'Dynamo Kyiv (Ukraine)',
    // Row 2
    '/images/gulf-united.png': 'Gulf United FC (UAE)',
    '/images/hashtag-fc.png': 'Hashtag United (England)',
    '/images/pfc-lokomotiv.png': 'Lokomotiv Plovdiv U13 & U17 (Bulgaria)',
    // Row 3
    '/images/pfc-ludogorets.png': 'Ludogorets Razgrad U17 (Bulgaria)',
    '/images/real-madrid-femenino.png': 'Real Madrid Femenino (Spain)',
    '/images/sg-sacavenense.png': 'SG Sacavenense (Portugal)',
    '/images/TOP-OSS-FC-Netherlands.png': 'TOP OSS FC (Netherlands)',
  }

  const images = useMemo(
    () => [
      '/images/fiorentina.png',
      '/images/apea.png',
      '/images/brescia.png',
      '/images/pascani.png',
      '/images/dynamo.png',
      '/images/gulf-united.png',
      '/images/hashtag-fc.png',
      '/images/pfc-lokomotiv.png',
      '/images/pfc-ludogorets.png',
      '/images/real-madrid-femenino.png',
      '/images/sg-sacavenense.png',
      '/images/TOP-OSS-FC-Netherlands.png',
    ],
    [],
  )

  useEffect(() => {
    const section = sectionRef.current
    const grid = gridRef.current
    if (!section || !grid) return

    // Basic fade-in for placeholders; replace when images are added
    gsap.fromTo(
      grid.children,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.08,
      },
    )
  }, [])

  return (
    <section ref={sectionRef} className="relative w-full bg-gray-950 py-20 sm:py-24 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyan-400">Trusted by clubs worldwide</h3>
          <p className="mt-2 text-sm sm:text-base text-white/70">From grassroots to elite organizations</p>
        </div>
        <div
          ref={gridRef}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12"
        >
          {images.map((src) => {
            // Use custom name if available, otherwise generate from filename
            const name = logoNames[src] || src
              .split('/')
              .pop()
              ?.replace(/\.(png|jpg|jpeg|webp)$/i, '')
              ?.replace(/[-_]/g, ' ')
            return (
              <div key={src} className="group relative">
                {/* Card with enhanced effects */}
                <div
                  className="relative aspect-square rounded-xl border-2 bg-gradient-to-br from-purple-600/40 via-purple-500/30 to-purple-600/40 group-hover:from-cyan-400/40 group-hover:via-cyan-500/30 group-hover:to-cyan-400/40 backdrop-blur-xl flex items-center justify-center overflow-hidden transition-all duration-500 ease-out border-purple-400 group-hover:border-cyan-400 shadow-[0_0_30px_rgba(147,51,234,0.8),0_0_60px_rgba(147,51,234,0.6),0_0_90px_rgba(147,51,234,0.4),inset_0_0_25px_rgba(147,51,234,0.2)] group-hover:shadow-[0_0_30px_rgba(34,211,238,0.9),0_0_60px_rgba(34,211,238,0.7),0_0_90px_rgba(34,211,238,0.5),inset_0_0_25px_rgba(34,211,238,0.25)] transform group-hover:scale-[1.02] group-hover:-translate-y-2"
                >
                  {/* Animated background gradient overlay */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/20 via-transparent to-purple-600/20 group-hover:from-cyan-400/20 group-hover:via-transparent group-hover:to-cyan-500/20 transition-all duration-500 opacity-0 group-hover:opacity-100" />
                  
                  {/* Purple glow background - default */}
                  <div
                    className="absolute -inset-1 rounded-xl opacity-100 group-hover:opacity-0 transition-opacity duration-500 pointer-events-none blur-xl"
                    style={{
                      background:
                        'radial-gradient(200px 200px at center, rgba(147,51,234,0.5), rgba(147,51,234,0.2), rgba(147,51,234,0.0))',
                    }}
                  />
                  {/* Light blue glow background - on hover */}
                  <div
                    className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-xl"
                    style={{
                      background:
                        'radial-gradient(200px 200px at center, rgba(34,211,238,0.5), rgba(34,211,238,0.2), rgba(34,211,238,0.0))',
                    }}
                  />

                  {/* Animated corner accents */}
                  <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-purple-400/30 to-transparent rounded-tl-xl group-hover:from-cyan-400/30 transition-all duration-500" />
                  <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-purple-400/30 to-transparent rounded-br-xl group-hover:from-cyan-400/30 transition-all duration-500" />

                  {/* Logo image container with enhanced effects */}
                  <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
                    {/* Animated shimmer effect */}
                    <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out z-20 rounded-xl" />
                    
                    {/* Diagonal sheen */}
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_40%)] z-10 rounded-xl" />
                    
                    <img
                      src={src}
                      alt={name || 'Club logo'}
                      loading="lazy"
                      className="max-h-[70%] max-w-[70%] object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 relative z-0 transform group-hover:scale-110 drop-shadow-[0_0_12px_rgba(255,255,255,0.35)]"
                    />
                  </div>
                </div>

                {/* Label */}
                <div className="mt-2 text-center relative z-10">
                  <span className="text-xs sm:text-sm text-white/80 group-hover:text-cyan-100 transition-colors duration-300 line-clamp-2">
                    {name}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default SectionFour
