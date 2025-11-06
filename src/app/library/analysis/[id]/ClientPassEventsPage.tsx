// 'use client'

// import React, { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'


// interface ClientPassEventsPageProps {
//   jobId: string;
// }

// export default function ClientPassEventsPage({ jobId }: ClientPassEventsPageProps) {
//   const router = useRouter()
//   const [passEventsData, setPassEventsData] = useState<PassEventsResponse | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [activeTab, setActiveTab] = useState<'pass-events' | 'player-tracking' | 'ball-tracking'>('pass-events')

//   useEffect(() => {
//     const fetchPassEvents = async () => {
//       if (!jobId) {
//         setError('Job ID is required')
//         setLoading(false)
//         return
//       }

//       try {
//         setLoading(true)
//         setError(null)
//         const data = await getPassEvents(jobId)
//         setPassEventsData(data)
//       } catch (err) {
//         const errorMessage = err instanceof Error ? err.message : 'Failed to load pass events'
//         setError(errorMessage)
//         console.error('Error fetching pass events:', err)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchPassEvents()
//   }, [jobId])

//   const handleTabChange = (tab: 'pass-events' | 'player-tracking' | 'ball-tracking') => {
//     setActiveTab(tab)
//     if (tab === 'player-tracking') {
//       router.push(`/library/analysis/${jobId}/player-tracking`)
//     } else if (tab === 'ball-tracking') {
//       router.push(`/library/analysis/${jobId}/ball-tracking`)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="text-center">
//           <p className="text-xl text-gray-600 dark:text-gray-300">Loading pass events...</p>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="text-center">
//           <p className="text-xl text-red-600 dark:text-red-400">{error}</p>
//         </div>
//       </div>
//     )
//   }

//   if (!passEventsData) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="text-center">
//           <p className="text-xl text-gray-600 dark:text-gray-300">No pass events data available</p>
//         </div>
//       </div>
//     )
//   }

//   const { data } = passEventsData

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
//           Match Analysis
//         </h1>
//         <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
//           <span>{data.match_info.team_home} vs {data.match_info.team_away}</span>
//           <span>•</span>
//           <span>{data.match_info.match_date}</span>
//           <span>•</span>
//           <span>{data.match_info.league}</span>
//         </div>
        
//         {/* Tab Navigation */}
//         <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
//           <button
//             onClick={() => handleTabChange('pass-events')}
//             className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
//               activeTab === 'pass-events'
//                 ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
//                 : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
//             }`}
//           >
//             Pass Events
//           </button>
//           <button
//             onClick={() => handleTabChange('player-tracking')}
//             className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
//               activeTab === 'player-tracking'
//                 ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
//                 : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
//             }`}
//           >
//             Player Tracking
//           </button>
//           <button
//             onClick={() => handleTabChange('ball-tracking')}
//             className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
//               activeTab === 'ball-tracking'
//                 ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
//                 : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
//             }`}
//           >
//             Ball Tracking
//           </button>
//         </div>
//       </div>

//       {/* Summary Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
//           <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Passes</div>
//           <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{data.summary.total_passes}</div>
//         </div>
//         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
//           <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Successful Passes</div>
//           <div className="text-3xl font-bold text-green-600 dark:text-green-400">{data.summary.successful_passes}</div>
//         </div>
//         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
//           <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pass Accuracy</div>
//           <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{data.summary.pass_accuracy.toFixed(1)}%</div>
//         </div>
//       </div>

//       {/* Pass Type Breakdown */}
//       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
//         <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Pass Type Breakdown</h2>
//         <PassTypeBreakdown passEvents={data.pass_events} />
//       </div>

//       {/* Pass Events Table */}
//       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
//         <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Detailed Pass Events</h2>
//         <PassEventsTable passEvents={data.pass_events} />
//       </div>
//     </div>
//   )
// }

// // Pass Type Breakdown Component
// const PassTypeBreakdown: React.FC<{ passEvents: PassEvent[] }> = ({ passEvents }) => {
//   const passTypeCount = passEvents.reduce((acc, event) => {
//     const type = event.pass_type
//     acc[type] = (acc[type] || 0) + 1
//     return acc
//   }, {} as Record<string, number>)

//   const total = Object.values(passTypeCount).reduce((sum, count) => (sum as number) + (count as number), 0)

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       {Object.entries(passTypeCount).map(([type, count]) => {
//         const percentage = ((count as number / (total as number)) * 100).toFixed(1)
//         return (
//           <div key={type} className="relative">
//             <div className="flex justify-between mb-2">
//               <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
//                 {type.replace('_', ' ')}
//               </span>
//               <span className="text-sm text-gray-600 dark:text-gray-400">
//                 {count as number} ({percentage}%)
//               </span>
//             </div>
//             <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
//               <div
//                 className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-300"
//                 style={{ width: `${percentage}%` }}
//               />
//             </div>
//           </div>
//         )
//       })}
//     </div>
//   )
// }

// // Pass Events Table Component
// const PassEventsTable: React.FC<{ passEvents: PassEvent[] }> = ({ passEvents }) => {
//   return (
//     <div className="overflow-x-auto">
//       <table className="w-full">
//         <thead>
//           <tr className="border-b border-gray-200 dark:border-gray-700">
//             <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Time</th>
//             <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Frame</th>
//             <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Pass Type</th>
//             <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Passer</th>
//             <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Receiver</th>
//             <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Distance</th>
//             <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Success</th>
//           </tr>
//         </thead>
//         <tbody>
//           {passEvents.map((event) => (
//             <tr key={event.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
//               <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">{event.time_seconds.toFixed(2)}s</td>
//               <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">#{event.frame_number}</td>
//               <td className="py-3 px-4">
//                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 capitalize">
//                   {event.pass_type.replace('_', ' ')}
//                 </span>
//               </td>
//               <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">Player {event.passer.id} (Team {event.passer.team})</td>
//               <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">Player {event.receiver.id} (Team {event.receiver.team})</td>
//               <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{event.metrics.ball_distance.toFixed(2)}m</td>
//               <td className="py-3 px-4">
//                 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                   event.metrics.pass_success 
//                     ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
//                     : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
//                 }`}>
//                   {event.metrics.pass_success ? '✓' : '✗'}
//                 </span>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )
// }
