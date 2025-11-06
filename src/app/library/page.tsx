// 'use client'

// import React, { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'

// import DashboardNav from '@/components/layout/DashboardNav'
// import { fetchUserJobs, formatDate, getStatusColor } from '@/services/api/jobs.service'
// import { JobSummary } from '@/types/jobs'
// import { FiEye, FiVideo, FiInfo } from 'react-icons/fi'
// import { useAuth } from '@/lib/AuthContext'

// export default function LibraryPage() {
//   const router = useRouter()
//   const [jobs, setJobs] = useState<JobSummary[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const {user} = useAuth()
//   if(!user){
//     return router.replace('/auth')
//   }

//   const handleViewResults = (jobId: number) => {
//     router.push(`/library/job/${jobId}`)
//   }

//   const handleViewDetails = (jobUuid: string) => {
//     router.push(`/library/analysis/${jobUuid}`)
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
//         <DashboardNav />
//         <div className="container mx-auto px-4 py-8 text-center">
//           <p className="text-xl text-gray-600 dark:text-gray-300">Loading your analysis jobs...</p>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
//         <DashboardNav />
//         <div className="container mx-auto px-4 py-8 text-center">
//           <p className="text-xl text-red-600 dark:text-red-400">{error}</p>
//           <button 
//             onClick={() => router.replace('/auth')}
//             className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
//           >
//             Login Again
//           </button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
//       <DashboardNav />
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
//           Match Library
//         </h1>
        
//         {jobs.length === 0 ? (
//           <div className="text-center py-12">
//             <p className="text-xl text-gray-600 dark:text-gray-300">No analysis jobs found. Start your first analysis!</p>
//             <button 
//               onClick={() => router.push('/dashboard/form')}
//               className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
//             >
//               New Analysis
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {jobs.map((job) => (
//               <div 
//                 key={job.id} 
//                 className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
//               >
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
//                     {job.team_home} vs {job.team_away}
//                   </h2>
//                   <span 
//                     className={`px-3 py-1 rounded-full text-xs uppercase ${getStatusColor(job.status)}`}
//                   >
//                     {job.status}
//                   </span>
//                 </div>
                
//                 <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-4">
//                   <p><strong>League:</strong> {job.league}</p>
//                   <p><strong>Match Date:</strong> {formatDate(job.match_date)}</p>
//                   <p><strong>Submitted:</strong> {new Date(job.created_at).toLocaleDateString()}</p>
//                 </div>
                
//                 <div className="flex justify-between items-center">
//                   <a 
//                     href={job.video_path} 
//                     target="_blank" 
//                     rel="noopener noreferrer" 
//                     className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
//                   >
//                     <FiVideo className="mr-1" /> View Video
//                   </a>
//                   <div className="flex space-x-2">
//                     <button 
//                       onClick={() => handleViewResults(job.id)}
//                       disabled={job.status !== 'completed'}
//                       className={`
//                         px-4 py-2 rounded-lg text-white font-semibold transition flex items-center
//                         ${job.status === 'completed' 
//                           ? 'bg-purple-600 hover:bg-purple-700' 
//                           : 'bg-gray-400 cursor-not-allowed'
//                         }
//                       `}
//                     >
//                       <FiEye className="mr-1" /> Results
//                     </button>
//                     <button 
//                       onClick={() => handleViewDetails(job.job_uuid)}
//                       className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition flex items-center"
//                     >
//                       <FiInfo className="mr-1" /> Details
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
