import { useState, useEffect, useRef } from 'react'
import { FaAngleDoubleRight } from 'react-icons/fa'

const achievements = [
  {
    id: 1,
    image: '/images/achievement-1.png',
    title: 'Born in London 2016',
  },
  {
    id: 2,
    image: '/images/achievement-2.png',
    title: '1,491+ players analysed ',
  },
  {
    id: 3,
    image: '/images/clubs_analysed.png',
    title: '109+ clubs analysed',
  },
  {
    id: 4,
    image: '/images/20Player_in_cyprus.png',
    title: '20+ players found a club in Cyprus',
  },
]

const Achievements = () => {
  const [activeAchievement, setActiveAchievement] = useState(0)
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Auto-play functionality
  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      setActiveAchievement((prevIndex) => (prevIndex + 1) % achievements.length)
    }, 3000) // Change image every 3 seconds

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [])

  const handleNextAchievement = () => {
    setActiveAchievement((prev) => (prev + 1) % achievements.length)
    // Reset auto-play after manual navigation
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
    }
    autoPlayRef.current = setInterval(() => {
      setActiveAchievement((prevIndex) => (prevIndex + 1) % achievements.length)
    }, 3000)
  }

  const handleAchievementClick = (index: number) => {
    setActiveAchievement(index)
    // Reset auto-play after manual selection
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
    }
    autoPlayRef.current = setInterval(() => {
      setActiveAchievement((prevIndex) => (prevIndex + 1) % achievements.length)
    }, 3000)
  }

  return (
    <section className="relative w-full bg-black py-12 sm:py-20 lg:py-20">
      <div className="w-[90%] mx-auto text-center"> 
        <p className="text-sm uppercase tracking-widest text-purple-400">Our Achievements</p>
        <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl mb-6">Celebrating Our Journey</h2>
        
      </div>
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center  lg:gap-12">
        {/* Left column: achievements */}
        <div className="w-full lg:w-1/4 order-2 lg:order-1">
          <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-8 sm:space-y-4 sm:grid-cols-1">
            {achievements.map((achievement, index) => {
              const isActive = index === activeAchievement
              return (
                <button
                  key={achievement.id}
                  type="button"
                  onMouseEnter={() => handleAchievementClick(index)}
                  onFocus={() => handleAchievementClick(index)}
                  onClick={() => handleAchievementClick(index)}
                  className={`w-full rounded-2xl border p-3 text-left transition-all duration-200 sm:p-5 ${
                    isActive
                      ? 'border-purple-400/60 bg-white/10'
                      : 'border-white/10 bg-white/5 hover:border-purple-400/40 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start gap-2 sm:gap-4">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-semibold sm:h-10 sm:w-10 sm:text-lg ${
                        isActive
                          ? 'bg-purple-500 text-white shadow-[0_0_25px_rgba(168,85,247,0.4)]'
                          : 'bg-white/10 text-purple-200'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white sm:text-lg">{achievement.title}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right column: image */}
        <div className="w-full lg:w-3/4 order-1 lg:order-2">
          <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-purple-900/40 via-black to-purple-900/20 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            {achievements.map((achievement, index) => (
              <img
                key={achievement.id}
                src={achievement.image}
                alt={achievement.title}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                  index === activeAchievement ? 'opacity-100' : 'opacity-0'
                }`}
                loading="lazy"
              />
            ))}

            {/* <div className="absolute bottom-4 left-4 rounded-2xl bg-black/60 px-4 py-3 text-white/80 backdrop-blur">
              <p className="text-sm uppercase tracking-wide text-purple-300">Achievement {activeAchievement + 1}</p>
              <p className="text-base font-semibold text-white">{achievements[activeAchievement].title}</p>
            </div> */}

            {/* Mobile Next Button - Purple Double Arrows */}
            <button
              onClick={handleNextAchievement}
              className="lg:hidden absolute top-4 right-4 flex items-center justify-center w-9 h-9 rounded-full bg-purple-500 text-white shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:bg-purple-600 transition-all duration-200"
              aria-label="Next achievement"
            >
              <FaAngleDoubleRight className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Achievements

