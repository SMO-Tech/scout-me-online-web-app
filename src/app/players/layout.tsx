import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | ScoutMe.cloud - Player Performance Analytics',
    default: 'ScoutMe.cloud - Player Performance Analytics'
  },
  description: 'Transform your football career with AI-driven match analysis. Get scouted faster, improve your skills, and create a professional digital profile.',
  keywords: 'football player analytics, soccer performance tracking, AI sports analysis, player scouting, football talent development',
  openGraph: {
    title: 'ScoutMe.cloud - Your Path to Professional Football',
    description: 'AI-powered performance analytics that helps football players get discovered and improve their game.',
    images: [{ url: '/og-players.jpg' }]
  }
}

export default function PlayersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
