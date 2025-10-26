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

export default function MatchAnalysisPage() {
  const params = useParams()
  const jobId = params.id as string
  const { matchData, isLoading, error } = useMatchAnalysis(jobId)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <DashboardNav />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-xl text-gray-600">Loading match analysis...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <DashboardNav />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-xl text-red-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNav />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Match Analysis</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <MatchSummaryWidget matchData={matchData} />
          <PlayerPerformanceMetrics matchData={matchData} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Pass Map Analysis</h2>
          <FootballPitchPassMap matchData={matchData} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Ball Tracking</h2>
            <BallTrackingVisualization matchData={matchData} />
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Pass Analysis</h2>
            <PassAnalysisChart matchData={matchData} />
          </div>
        </div>
      </div>
    </div>
  )
}
