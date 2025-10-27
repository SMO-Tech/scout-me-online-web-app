'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BallTrackingResponse, BallTrackingPoint, getBallTracking } from '@/services/api/matchAnalysis.service'

interface ClientBallTrackingPageProps {
  jobId: string;
}

export default function ClientBallTrackingPage({ jobId }: ClientBallTrackingPageProps) {
  const router = useRouter()
  const [ballTrackingData, setBallTrackingData] = useState<BallTrackingResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const fetchBallTracking = async () => {
      if (!jobId) {
        setError('Job ID is required')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const data = await getBallTracking(jobId)
        setBallTrackingData(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load ball tracking data'
        setError(errorMessage)
        console.error('Error fetching ball tracking data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBallTracking()
  }, [jobId])

  // Auto-play animation
  useEffect(() => {
    if (ballTrackingData && isPlaying && currentFrame < ballTrackingData.data.tracking_data.length - 1) {
      const timer = setTimeout(() => {
        setCurrentFrame(prev => prev + 1)
      }, 100) // 100ms delay between frames
      return () => clearTimeout(timer)
    } else if (ballTrackingData && currentFrame >= ballTrackingData.data.tracking_data.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, currentFrame, ballTrackingData])

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false)
    } else {
      if (ballTrackingData && currentFrame >= ballTrackingData.data.tracking_data.length - 1) {
        setCurrentFrame(0)
      }
      setIsPlaying(true)
    }
  }

  const handleFrameChange = (frame: number) => {
    setCurrentFrame(frame)
    setIsPlaying(false)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-xl text-gray-600 dark:text-gray-300">Loading ball tracking data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-xl text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  if (!ballTrackingData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-xl text-gray-600 dark:text-gray-300">No ball tracking data available</p>
        </div>
      </div>
    )
  }

  const { data } = ballTrackingData
  const currentBallPosition = data.tracking_data[currentFrame]
  const maxFrame = data.tracking_data.length - 1

  // Get trajectory points (last 20 frames for visualization)
  const trajectoryPoints = data.tracking_data
    .slice(Math.max(0, currentFrame - 20), currentFrame + 1)
    .map((point: BallTrackingPoint) => ({
      x: (point.position.x1 / 1920) * 100,
      y: (point.position.y1 / 1080) * 100,
    }))

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            ← Back
          </button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Ball Tracking Analysis
        </h1>
        <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span>{data.match_info.team_home} vs {data.match_info.team_away}</span>
          <span>•</span>
          <span>{data.match_info.match_date}</span>
          <span>•</span>
          <span>{data.match_info.league}</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Frames</div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {data.ball_statistics.total_frames}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average Speed</div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {data.ball_statistics.average_speed.toFixed(2)} m/s
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Max Speed</div>
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            {data.ball_statistics.max_speed.toFixed(2)} m/s
          </div>
        </div>
      </div>

      {/* Current Ball Metrics */}
      {currentBallPosition && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Current Ball Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Speed</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentBallPosition.metrics.speed.toFixed(2)} m/s
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Direction</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentBallPosition.metrics.direction.toFixed(1)}°
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Confidence</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {(currentBallPosition.metrics.confidence * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Football Pitch Visualization */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Ball Movement Visualization
        </h2>
        <div className="space-y-4">
          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={handlePlayPause}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <input
              type="range"
              min={0}
              max={maxFrame}
              value={currentFrame}
              onChange={(e) => handleFrameChange(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Frame: {currentFrame + 1} / {maxFrame + 1} | Time: {currentBallPosition?.time_seconds.toFixed(2)}s
            </span>
          </div>

          {/* Pitch */}
          <div className="relative bg-green-600 rounded-lg overflow-hidden" style={{ aspectRatio: '16/10' }}>
            {/* Pitch markings */}
            <div className="absolute inset-0 border-4 border-white">
              {/* Center line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white transform -translate-y-0.5"></div>
              {/* Center circle */}
              <div className="absolute top-1/2 left-1/2 w-16 h-16 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
              {/* Goals */}
              <div className="absolute top-1/2 left-0 w-4 h-16 border-2 border-white transform -translate-y-1/2"></div>
              <div className="absolute top-1/2 right-0 w-4 h-16 border-2 border-white transform -translate-y-1/2"></div>
            </div>

            {/* Ball trajectory */}
            {trajectoryPoints.map((pos, index) => (
              <div
                key={index}
                className="absolute w-1 h-1 bg-yellow-300 rounded-full opacity-60 transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  opacity: Math.min(0.9, 0.4 + (index / trajectoryPoints.length) * 0.5),
                }}
              />
            ))}

            {/* Current ball position */}
            {currentBallPosition && (
              <div
                className="absolute w-5 h-5 bg-white border-2 border-gray-800 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg animate-pulse"
                style={{
                  left: `${(currentBallPosition.position.x1 / 1920) * 100}%`,
                  top: `${(currentBallPosition.position.y1 / 1080) * 100}%`,
                }}
                title={`Speed: ${currentBallPosition.metrics.speed.toFixed(2)} m/s, Confidence: ${(currentBallPosition.metrics.confidence * 100).toFixed(0)}%`}
              >
                <div className="w-full h-full bg-gradient-to-br from-white to-gray-300 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                </div>
              </div>
            )}

            {/* Ball position indicator */}
            {currentBallPosition && (
              <div 
                className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-md text-sm"
                style={{
                  left: `${(currentBallPosition.position.x1 / 1920) * 100}%`,
                  top: `${((currentBallPosition.position.y1 / 1080) * 100) - 5}%`,
                }}
              >
                Ball
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-white border-2 border-gray-800 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">Ball Position (Current)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-yellow-300 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">Ball Trajectory (Last 20 frames)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ball Tracking Data Table */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Ball Tracking Data
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Frame</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Time</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">X Position</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Y Position</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Speed</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Direction</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {data.tracking_data.slice(0, 50).map((trackingPoint: BallTrackingPoint) => (
                <tr 
                  key={trackingPoint.frame_number} 
                  className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    trackingPoint.frame_number === currentFrame + 1 ? 'bg-blue-50 dark:bg-blue-900' : ''
                  }`}
                  onClick={() => handleFrameChange(trackingPoint.frame_number - 1)}
                >
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">#{trackingPoint.frame_number}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{trackingPoint.time_seconds.toFixed(2)}s</td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{trackingPoint.position.x1.toFixed(1)}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{trackingPoint.position.y1.toFixed(1)}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{trackingPoint.metrics.speed.toFixed(2)} m/s</td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{trackingPoint.metrics.direction.toFixed(1)}°</td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{(trackingPoint.metrics.confidence * 100).toFixed(0)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.tracking_data.length > 50 && (
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
              Showing first 50 of {data.tracking_data.length} tracking points
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
