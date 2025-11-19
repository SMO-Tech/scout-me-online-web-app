import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | ScoutMe.cloud - Talent Scouting Platform',
    default: 'ScoutMe.cloud - Talent Scouting Platform'
  },
  description: 'Revolutionize your scouting process with AI-driven player discovery. Find top talents efficiently with comprehensive performance analytics.',
  keywords: 'football scouting platform, soccer talent discovery, AI player evaluation, sports recruitment technology, professional talent scouting',
  openGraph: {
    title: 'ScoutMe.cloud - The Future of Sports Talent Scouting',
    description: 'Discover exceptional football talents with cutting-edge AI analytics.',
    images: [{ url: '/og-scouts.jpg' }]
  }
}

export default function ScoutsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
