import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | ScoutMe.cloud - Coaching & Club Analytics',
    default: 'ScoutMe.cloud - Coaching & Club Analytics'
  },
  description: 'Discover and develop talent with AI-powered performance analytics. Streamline scouting, player development, and strategic decision-making.',
  keywords: 'football coaching analytics, soccer talent scouting, AI player performance, club management technology, sports data analysis',
  openGraph: {
    title: 'ScoutMe.cloud - Elevate Your Team\'s Performance',
    description: 'AI-driven analytics to transform your coaching and scouting strategies.',
    images: [{ url: '/og-coaches.jpg' }]
  }
}

export default function CoachesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
