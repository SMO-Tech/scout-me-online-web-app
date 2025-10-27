import React from 'react'
import DashboardNav from '@/components/layout/DashboardNav'
import ClientBallTrackingPage from './ClientBallTrackingPage'

export function generateStaticParams() {
  // Provide a minimal static path for export
  return [{ id: 'example-job' }]
}

export default function BallTrackingPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <DashboardNav />
      <ClientBallTrackingPage jobId={params.id} />
    </div>
  )
}

