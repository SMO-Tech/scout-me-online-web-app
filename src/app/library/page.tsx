'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardNav from '@/components/layout/DashboardNav'
import { fetchUserJobs } from '@/services/api/jobs.service'
import { JobSummary } from '@/types/jobs'
import { STORAGE_KEYS } from '@/services/config'
import authService from '@/services/api/auth.service'
import { FiEye, FiVideo } from 'react-icons/fi'

export default function LibraryPage() {
  const [jobs, setJobs] = useState<JobSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuthentication = () => {
      // Only check localStorage on the client side
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
        const userId = localStorage.getItem(STORAGE_KEYS.USER_ID)
        const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA)
        const isAuthenticated = authService.isAuthenticated()

        console.log('Comprehensive Authentication Check:', {
          token: token ? 'Token present' : 'No token',
          userId: userId,
          userData: userData ? 'User data present' : 'No user data',
          isAuthenticated: isAuthenticated
        })

        // More comprehensive authentication check
        if (!token || !userId || !userData || !isAuthenticated) {
          console.warn('Authentication failed. Redirecting to login.')
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
          localStorage.removeItem(STORAGE_KEYS.USER_ID)
          localStorage.removeItem(STORAGE_KEYS.USER_DATA)
          router.replace('/auth')
          return false
        }
      }
      return true
    }

    const loadJobs = async () => {
      if (!checkAuthentication()) return

      try {
        setIsLoading(true)
        const jobsData = await fetchUserJobs()
        
        console.log('Jobs Fetched:', {
          totalJobs: jobsData.data.recent_jobs.length,
          jobs: jobsData.data.recent_jobs
        })

        setJobs(jobsData.data.recent_jobs)
      } catch (err: any) {
        console.error('Error fetching jobs:', err)
        
        // More detailed error handling
        if (err.response) {
          // The request was made and the server responded with a status code
          if (err.response.status === 401) {
            // Token is invalid or expired
            if (typeof window !== 'undefined') {
              localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
              localStorage.removeItem(STORAGE_KEYS.USER_ID)
              localStorage.removeItem(STORAGE_KEYS.USER_DATA)
            }
            router.replace('/auth')
            setError('Your session has expired. Please log in again.')
          } else {
            setError(err.response.data.message || 'Failed to load jobs. Please try again.')
          }
        } else if (err.request) {
          // The request was made but no response was received
          setError('No response from server. Please check your internet connection.')
        } else {
          // Something happened in setting up the request
          setError('An unexpected error occurred. Please try again.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadJobs()
  }, [router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleViewResults = (jobId: number) => {
    router.push(`/library/job/${jobId}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <DashboardNav />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-xl text-gray-600">Loading your analysis jobs...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <DashboardNav />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-xl text-red-600">{error}</p>
          <button 
            onClick={() => router.replace('/auth')}
            className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Login Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNav />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Your Analysis Library</h1>
        
        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No analysis jobs found. Start your first analysis!</p>
            <button 
              onClick={() => router.push('/dashboard/form')}
              className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              New Analysis
            </button>
          </div>
        ) : (
          <>
            {/* Web View - Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">League</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {job.team_home} vs {job.team_away}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{job.league}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{job.match_date}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span 
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(job.status)}`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <a 
                            href={job.video_path} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                            title="View Source Video"
                          >
                            <FiVideo className="mr-1" /> Video
                          </a>
                          <button 
                            onClick={() => handleViewResults(job.id)}
                            disabled={job.status !== 'completed'}
                            className={`
                              flex items-center
                              ${job.status === 'completed' 
                                ? 'text-purple-600 hover:text-purple-900' 
                                : 'text-gray-400 cursor-not-allowed'
                              }
                            `}
                            title="View Results"
                          >
                            <FiEye className="mr-1" /> Results
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View - Cards */}
            <div className="md:hidden grid gap-4">
              {jobs.map((job) => (
                <div 
                  key={job.id} 
                  className="bg-white shadow-md rounded-lg overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-lg font-semibold">
                        {job.team_home} vs {job.team_away}
                      </h2>
                      <span 
                        className={`px-3 py-1 rounded-full text-xs uppercase ${getStatusColor(job.status)}`}
                      >
                        {job.status}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1 mb-4">
                      <p><strong>League:</strong> {job.league}</p>
                      <p><strong>Match Date:</strong> {job.match_date}</p>
                      <p><strong>Submitted:</strong> {new Date(job.created_at).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <a 
                        href={job.video_path} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <FiVideo className="mr-1" /> View Video
                      </a>
                      <button 
                        onClick={() => handleViewResults(job.id)}
                        disabled={job.status !== 'completed'}
                        className={`
                          px-4 py-2 rounded-lg text-white font-semibold transition flex items-center
                          ${job.status === 'completed' 
                            ? 'bg-purple-600 hover:bg-purple-700' 
                            : 'bg-gray-400 cursor-not-allowed'
                          }
                        `}
                      >
                        <FiEye className="mr-1" /> View Results
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
