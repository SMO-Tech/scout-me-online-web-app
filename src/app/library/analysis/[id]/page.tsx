import React from 'react'
import DashboardNav from '@/components/layout/DashboardNav'
import ClientPassEventsPage from './ClientPassEventsPage'
import { STATIC_JOB_UUIDS } from '@/lib/staticJobUuids'

export function generateStaticParams() {
  // Return all static job UUIDs for export
  return STATIC_JOB_UUIDS.map((id) => ({ id }))
}

export default function MatchAnalysisPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <DashboardNav />
      <ClientPassEventsPage jobId={params.id} />
    </div>
  )
}
