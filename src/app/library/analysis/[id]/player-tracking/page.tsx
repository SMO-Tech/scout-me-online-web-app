import React from 'react'
import DashboardNav from '@/components/layout/DashboardNav'
import ClientPlayerTrackingPage from './ClientPlayerTrackingPage'

export function generateStaticParams() {
  // Provide a minimal static path for export
  return [{ id: 'example-job' }]
}

export default function PlayerTrackingPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <DashboardNav />
      <ClientPlayerTrackingPage jobId={params.id} />
    </div>
  )
}
