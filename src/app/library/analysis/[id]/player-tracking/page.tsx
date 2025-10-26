'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import DashboardNav from '@/components/layout/DashboardNav'
import { getPlayerTracking, PlayerTrackingResponse, PlayerTrackingData, PlayerTrackingPoint } from '@/services/api/matchAnalysis.service'

export default function PlayerTrackingPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.id as string

  const [playerTrackingData, setPlayerTrackingData] = useState<PlayerTrackingResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null)
  const [selectedTeam, setSelectedTeam] = useState<string>('all')
  const [showHeatmap, setShowHeatmap] = useState(false)

  useEffect(() => {
    const fetchPlayerTracking = async () => {
      if (!jobId) {
        setError('Job ID is required')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const data = await getPlayerTracking(jobId)
        setPlayerTrackingData(data)
        // Set first player as default selection
        if (data.data.players.length > 0) {
          setSelectedPlayer(data.data.players[0].player_id)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load player tracking data'
        setError(errorMessage)
        console.error('Error fetching player tracking data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPlayerTracking()
  }, [jobId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <DashboardNav />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-xl text-gray-600 dark:text-gray-300">Loading player tracking data...</p>
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
            <p className="text-xl text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!playerTrackingData) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <DashboardNav />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-xl text-gray-600 dark:text-gray-300">No player tracking data available</p>
          </div>
        </div>
      </div>
    )
  }

  const { data } = playerTrackingData
  const filteredPlayers = selectedTeam === 'all' 
    ? data.players 
    : data.players.filter(player => player.team === selectedTeam)

  const selectedPlayerData = selectedPlayer 
    ? data.players.find(player => player.player_id === selectedPlayer)
    : null

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <DashboardNav />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              ← Back to Pass Events
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Player Tracking Analysis
          </h1>
          <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>{data.match_info.team_home} vs {data.match_info.team_away}</span>
            <span>•</span>
            <span>{data.match_info.match_date}</span>
            <span>•</span>
            <span>{data.match_info.league}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Team Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by Team
              </label>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Teams</option>
                <option value="1">Team 1</option>
                <option value="2">Team 2</option>
              </select>
            </div>

            {/* Player Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Player
              </label>
              <select
                value={selectedPlayer || ''}
                onChange={(e) => setSelectedPlayer(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select a player</option>
                {filteredPlayers.map((player) => (
                  <option key={player.player_id} value={player.player_id}>
                    Player {player.player_id} (Team {player.team})
                  </option>
                ))}
              </select>
            </div>

            {/* View Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                View Options
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    showHeatmap
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Player Statistics */}
        {selectedPlayerData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Frames</div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {selectedPlayerData.statistics.total_frames}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ball Possession</div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {selectedPlayerData.statistics.possession_percentage.toFixed(1)}%
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Speed</div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {selectedPlayerData.statistics.average_speed.toFixed(1)} m/s
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Max Speed</div>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {selectedPlayerData.statistics.max_speed.toFixed(1)} m/s
              </div>
            </div>
          </div>
        )}

        {/* Football Pitch Visualization */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Player Movement Visualization
          </h2>
          <FootballPitch 
            players={filteredPlayers}
            selectedPlayer={selectedPlayer}
            showHeatmap={showHeatmap}
          />
        </div>

        {/* Player List */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            All Players
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Player ID</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Team</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Total Frames</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Ball Possession</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Avg Speed</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Max Speed</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.map((player) => (
                  <tr 
                    key={player.player_id} 
                    className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                      selectedPlayer === player.player_id ? 'bg-blue-50 dark:bg-blue-900' : ''
                    }`}
                    onClick={() => setSelectedPlayer(player.player_id)}
                  >
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">Player {player.player_id}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">Team {player.team}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{player.statistics.total_frames}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{player.statistics.possession_percentage.toFixed(1)}%</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{player.statistics.average_speed.toFixed(1)} m/s</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{player.statistics.max_speed.toFixed(1)} m/s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

// Football Pitch Component
const FootballPitch: React.FC<{
  players: PlayerTrackingData[];
  selectedPlayer: number | null;
  showHeatmap: boolean;
}> = ({ players, selectedPlayer, showHeatmap }) => {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  // Get all unique frame numbers
  const allFrames = Array.from(new Set(
    players.flatMap(player => player.tracking_points.map((point: PlayerTrackingPoint) => point.frame_number))
  )).sort((a, b) => a - b)

  const maxFrame = Math.max(...allFrames)
  const minFrame = Math.min(...allFrames)

  // Auto-play animation
  useEffect(() => {
    if (isPlaying && currentFrame < maxFrame) {
      const timer = setTimeout(() => {
        setCurrentFrame(prev => prev + 1)
      }, 100) // 100ms delay between frames
      return () => clearTimeout(timer)
    } else if (currentFrame >= maxFrame) {
      setIsPlaying(false)
    }
  }, [isPlaying, currentFrame, maxFrame])

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false)
    } else {
      if (currentFrame >= maxFrame) {
        setCurrentFrame(minFrame)
      }
      setIsPlaying(true)
    }
  }

  const handleFrameChange = (frame: number) => {
    setCurrentFrame(frame)
    setIsPlaying(false)
  }

  // Get current positions for all players
  const getCurrentPositions = () => {
    return players.map(player => {
      const currentPoint = player.tracking_points.find(
        (point: PlayerTrackingPoint) => point.frame_number === currentFrame
      )
      return currentPoint ? {
        ...player,
        currentPosition: currentPoint
      } : null
    }).filter(Boolean)
  }

  const currentPositions = getCurrentPositions()

  return (
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
          min={minFrame}
          max={maxFrame}
          value={currentFrame}
          onChange={(e) => handleFrameChange(Number(e.target.value))}
          className="flex-1"
        />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Frame: {currentFrame} / {maxFrame}
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

        {/* Players */}
        {currentPositions.map((playerData) => {
          if (!playerData) return null
          
          const { player_id, team, currentPosition } = playerData
          const isSelected = selectedPlayer === player_id
          
          // Convert coordinates to percentage (assuming field is 1920x1080)
          const x = (currentPosition.position.x1 / 1920) * 100
          const y = (currentPosition.position.y1 / 1080) * 100
          
          return (
            <div
              key={player_id}
              className={`absolute w-4 h-4 rounded-full border-2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-100 ${
                team === '1' 
                  ? 'bg-blue-500 border-blue-700' 
                  : 'bg-red-500 border-red-700'
              } ${isSelected ? 'ring-4 ring-yellow-400 ring-opacity-50' : ''}`}
              style={{
                left: `${x}%`,
                top: `${y}%`,
              }}
              title={`Player ${player_id} - Team ${team} - Speed: ${currentPosition.speed.toFixed(1)} m/s`}
            >
              <div className="text-xs text-white font-bold text-center leading-4">
                {player_id}
              </div>
            </div>
          )
        })}

        {/* Heatmap overlay */}
        {showHeatmap && selectedPlayer && (
          <HeatmapOverlay 
            players={players} 
            selectedPlayer={selectedPlayer}
            currentFrame={currentFrame}
          />
        )}
      </div>

      {/* Legend */}
      <div className="flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 border-2 border-blue-700 rounded-full"></div>
          <span className="text-gray-600 dark:text-gray-400">Team 1</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 border-2 border-red-700 rounded-full"></div>
          <span className="text-gray-600 dark:text-gray-400">Team 2</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-400 border-2 border-yellow-600 rounded-full"></div>
          <span className="text-gray-600 dark:text-gray-400">Selected Player</span>
        </div>
      </div>
    </div>
  )
}

// Heatmap Overlay Component
const HeatmapOverlay: React.FC<{
  players: PlayerTrackingData[];
  selectedPlayer: number;
  currentFrame: number;
}> = ({ players, selectedPlayer, currentFrame }) => {
  const selectedPlayerData = players.find(player => player.player_id === selectedPlayer)
  
  if (!selectedPlayerData) return null

  // Get positions up to current frame for heatmap
  const positions = selectedPlayerData.tracking_points
    .filter((point: PlayerTrackingPoint) => point.frame_number <= currentFrame)
    .map((point: PlayerTrackingPoint) => ({
      x: (point.position.x1 / 1920) * 100,
      y: (point.position.y1 / 1080) * 100,
    }))

  return (
    <div className="absolute inset-0 pointer-events-none">
      {positions.map((pos: { x: number; y: number }, index: number) => (
        <div
          key={index}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-30 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
          }}
        />
      ))}
    </div>
  )
}
