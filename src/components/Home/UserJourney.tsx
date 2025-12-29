const Badge = ({ label }: { label: string }) => (
  <span className="ml-2 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white/80 backdrop-blur">
    {label}
  </span>
)

const Card = ({
  title,
  bullets,
  rightBadge,
  imageAlt,
  imageSrc,
}: {
  title: string
  accent: 'blue' | 'pink'
  bullets: string[]
  rightBadge?: string
  imageAlt: string
  imageSrc: string
}) => {
  return (
    <div className="group relative rounded-3xl border-2 bg-gradient-to-br from-purple-600/40 via-purple-500/30 to-purple-600/40 group-hover:from-cyan-400/40 group-hover:via-cyan-500/30 group-hover:to-cyan-400/40 backdrop-blur-xl p-6 sm:p-8 transition-all duration-500 ease-out border-purple-400 group-hover:border-cyan-400 shadow-[0_0_30px_rgba(147,51,234,0.8),0_0_60px_rgba(147,51,234,0.6),0_0_90px_rgba(147,51,234,0.4),inset_0_0_25px_rgba(147,51,234,0.2)] group-hover:shadow-[0_0_30px_rgba(34,211,238,0.9),0_0_60px_rgba(34,211,238,0.7),0_0_90px_rgba(34,211,238,0.5),inset_0_0_25px_rgba(34,211,238,0.25)] transform group-hover:scale-[1.02] group-hover:-translate-y-2"
      style={{ minHeight: 380 }}>
      {/* Animated background gradient overlay */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/20 via-transparent to-purple-600/20 group-hover:from-cyan-400/20 group-hover:via-transparent group-hover:to-cyan-500/20 transition-all duration-500 opacity-0 group-hover:opacity-100" />
      
      {/* Purple glow background - default */}
      <div
        className="absolute -inset-1 rounded-3xl opacity-100 group-hover:opacity-0 transition-opacity duration-500 pointer-events-none blur-xl"
        style={{
          background:
            'radial-gradient(200px 200px at center, rgba(147,51,234,0.5), rgba(147,51,234,0.2), rgba(147,51,234,0.0))',
        }}
      />
      {/* Light blue glow background - on hover */}
      <div
        className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-xl"
        style={{
          background:
            'radial-gradient(200px 200px at center, rgba(34,211,238,0.5), rgba(34,211,238,0.2), rgba(34,211,238,0.0))',
        }}
      />

      {/* Animated corner accents */}
      <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-purple-400/30 to-transparent rounded-tl-3xl group-hover:from-cyan-400/30 transition-all duration-500" />
      <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-purple-400/30 to-transparent rounded-br-3xl group-hover:from-cyan-400/30 transition-all duration-500" />

      <div className="flex items-start justify-between relative z-10 mb-4">
        <h4 className="text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-100 transition-colors duration-300">
          {title}
        </h4>
        {rightBadge ? <Badge label={rightBadge} /> : null}
      </div>

      {/* Image container with enhanced effects */}
      <div className="mt-6 relative w-full overflow-hidden rounded-2xl border-2 border-purple-400/70 group-hover:border-cyan-400/90 bg-gradient-to-br from-black/50 to-purple-900/20 group-hover:from-black/50 group-hover:to-cyan-900/20 transition-all duration-500 shadow-[0_8px_32px_rgba(147,51,234,0.4)] group-hover:shadow-[0_8px_32px_rgba(34,211,238,0.6)]">
        {/* Animated gradient overlay on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 via-transparent to-transparent group-hover:from-cyan-900/40 transition-all duration-500 z-20" />
        
        {/* Animated shimmer effect */}
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out z-20" />
        
        {/* Diagonal sheen */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_40%)] z-10" />
        
        <img 
          src={imageSrc} 
          alt={imageAlt} 
          className="h-52 sm:h-60 md:h-72 lg:h-80 w-full object-cover relative z-0 transform group-hover:scale-110 transition-transform duration-700 ease-out" 
        />
      </div>

      {/* Enhanced bullet list */}
      <ul className="mt-6 space-y-3 relative z-10">
        {bullets.map((b: string, index: number) => (
          <li 
            key={b} 
            className="flex items-start gap-3 text-sm sm:text-base text-white/90 group-hover:text-white transition-all duration-300 transform group-hover:translate-x-1"
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <span className="mt-[6px] h-2 w-2 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 group-hover:from-cyan-400 group-hover:to-cyan-600 transition-all duration-300 shadow-[0_0_8px_rgba(147,51,234,0.6)] group-hover:shadow-[0_0_12px_rgba(34,211,238,0.8)] flex-shrink-0" />
            <span className="font-medium">{b}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const UserJourney = () => {
  return (
    <section id="choose-your-path" className="relative w-full bg-gray-950 py-24 sm:py-32 overflow-hidden">
      {/* Enhanced background gradients */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(60% 50% at 50% 0%, rgba(59,130,246,0.15), rgba(59,130,246,0)), radial-gradient(70% 60% at 50% 100%, rgba(147,51,234,0.18), rgba(147,51,234,0))' }} />
      
      {/* Animated grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(147,51,234,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(147,51,234,0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative z-10 mx-auto w-[92%] max-w-7xl">
        {/* Enhanced header */}
        <div className="mb-12 sm:mb-16 text-center">
          <div className="inline-block mb-4">
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-300 to-cyan-400 ">
              Choose your path
            </h3>
               </div>
          <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto">
            Discover how Scout Me Online transforms your football journey
          </p>
        </div>

        {/* Three-column layout on md+, stacked on mobile */}
        <div className="grid grid-cols-1 gap-8 md:gap-10 lg:gap-12 md:grid-cols-3 smofonts">
          <Card
            title="Player"
            accent="blue"
            imageAlt="Player"
            imageSrc="/images/AMATEUR_PLAYER.jpeg"
            bullets={[
              'Share match URL',
              'Get analysed',
              'Get scouted faster',
            ]}
          />

          <Card
            title="Coach / Analyst"
            accent="pink"
            imageAlt="Coach / Analyst"
            imageSrc="/images/coach_guy.png"
            bullets={[
              'Share URL',
              'Improve team performance',
              'Discover top performers',
            ]}
          />

          <Card
            title="Scout"
            accent="blue"
            
            imageAlt="Scout"
            imageSrc="/images/scout.png"
            bullets={[
              'Find players & coaches',
              'Watch full games',
              'View performance per profile',
            ]}
          />
        </div>
      </div>
    </section>
  )
}

export default UserJourney