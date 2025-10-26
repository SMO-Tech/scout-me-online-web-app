'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import DashboardNav from '@/components/layout/DashboardNav'
import FootballPitchPassMap from '@/components/match-analysis/FootballPitchPassMap'
import BallTrackingVisualization from '@/components/match-analysis/BallTrackingVisualization'
import MatchSummaryWidget from '@/components/match-analysis/MatchSummaryWidget'
import PassAnalysisChart from '@/components/match-analysis/PassAnalysisChart'
import PlayerPerformanceMetrics from '@/components/match-analysis/PlayerPerformanceMetrics'
import { useMatchAnalysis } from '@/hooks/useMatchAnalysis'
import ThemeToggle from '@/components/ui/ThemeToggle'

export default function MatchAnalysisPage() {
  const params = useParams()
  const jobId = params.id as string
  const { data, loading, error } = useMatchAnalysis(jobId)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <DashboardNav />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-xl text-gray-600 dark:text-gray-300">Loading match analysis...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <DashboardNav />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-xl text-red-600 dark:text-red-400">{error.message}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <DashboardNav />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-xl text-gray-600 dark:text-gray-300">No match data available</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <DashboardNav />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Match Analysis</h1>
          <ThemeToggle />
        </div>
        
        <div className="space-y-6 mb-8">
          <MatchSummaryWidget data={data} />
          <PlayerPerformanceMetrics data={data} />
        </div>

        <div className="bg-white dark:bg-gray-800 mb-8 rounded-lg">
            <FootballPitchPassMap data={data} />
        </div>

        <div className="space-y-6">
          <div className=" ">
                <BallTrackingVisualization data={data} />
          </div>
          <div className="bg-white dark:bg-gray-800">
               <PassAnalysisChart data={data} />
          </div>
        </div>
      </div>
    </div>
  )
}
