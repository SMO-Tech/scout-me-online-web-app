'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useAuth } from '@/lib/AuthContext'
import { getClient } from '@/lib/api/client'
import { 
  FiYoutube, 
  FiLink, 
  FiArrowRight, 
  FiAlertCircle, 
  FiInfo, 
  FiCheckCircle,
  FiVideo
} from 'react-icons/fi'

const YoutubeSubmissionPage = () => {
  const { user } = useAuth()
  const router = useRouter()
  
  // State
  const [matchURL, setMatchURL] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Animation trigger on mount
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const schema = yup.object({
        matchURL: yup
          .string()
          .required("Please enter a URL")
          .matches(
            /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
            "Please enter a valid YouTube link."
          ),
      });

      await schema.validate({ matchURL });

      const client = await getClient()
      
      if (!user) {
        throw new Error("User not found. Please log in.");
      }

      await client.post("/match", {
        "videoUrl": matchURL
      });

      toast.success("Match submitted! The scout is watching the tape.", { 
        duration: 4000, 
        icon: "⚽",
        style: {
            background: '#fff',
            color: '#111827',
            border: '1px solid #E5E7EB'
        } 
      });
      
      router.replace("/dashboard");

    } catch (err: any) {
      let errorMessage = "Something went wrong, please try again.";
      if (err instanceof yup.ValidationError) {
        errorMessage = err.message;
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage = "Network error: Unable to connect to the server.";
      } else if (err.response) {
        const responseData = err.response.data;
        errorMessage = responseData?.message || responseData?.error || errorMessage;
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-6 lg:p-12">
      
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        
        {/* LEFT COLUMN: Educational Context (Spread out to let input breathe) */}
        <div className={`space-y-8 order-2 lg:order-1 transition-all duration-700 delay-100 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-4">
                    Submit Match Footage
                </h1>
                <p className="text-lg text-gray-500 leading-relaxed">
                    Our AI acts as your assistant scout. Submit your full-match replay, and we will generate a timeline of key moments for your review.
                </p>
            </div>

            <div className="space-y-6">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <FiInfo className="text-orange-600" /> 
                    The Process
                </h3>
                
                <div className="space-y-5">
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 mt-1">
                            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                                1
                            </div>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900">Auto-Detection</h4>
                            <p className="text-sm text-gray-500 mt-1">Our engine scans the footage to identify events.</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-shrink-0 mt-1">
                            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                                2
                            </div>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900">Processing Time</h4>
                            <p className="text-sm text-gray-500 mt-1">Takes a few hours. We'll notify you when ready.</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-shrink-0 mt-1">
                            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                                3
                            </div>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900">Review</h4>
                            <p className="text-sm text-gray-500 mt-1">You receive a timeline with video previews to verify.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-400 italic">
                    "ScoutAI is an assistive tool. We recommend reviewing all clips for the final verdict."
                </p>
            </div>
        </div>

        {/* RIGHT COLUMN: The Input Focus (Hero Card) */}
        <div className={`w-full order-1 lg:order-2 transition-all duration-700 ease-out ${isMounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl shadow-gray-200/50 p-8 md:p-10 relative overflow-hidden">
                
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-orange-50 rounded-full blur-2xl opacity-50 pointer-events-none"></div>

                <div className="relative mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <FiVideo className="text-orange-600" />
                        New Analysis
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-3 group">
                        <label 
                            htmlFor="matchURL" 
                            className="block text-sm font-medium text-gray-700"
                        >
                            Paste YouTube URL
                        </label>
                        
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FiLink className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                id="matchURL"
                                value={matchURL}
                                onChange={(e) => {
                                    setMatchURL(e.target.value);
                                    if (error) setError('');
                                }}
                                placeholder="https://www.youtube.com/watch?v=..."
                                className={`
                                    block w-full pl-11 pr-4 h-14
                                    text-lg
                                    border border-gray-200 rounded-xl
                                    text-gray-900 placeholder-gray-400 
                                    bg-white
                                    focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500
                                    transition-all duration-200 ease-in-out
                                    shadow-sm
                                    ${error ? 'border-red-300 focus:ring-red-200 bg-red-50' : ''}
                                `}
                            />
                        </div>

                        {/* Helper under input */}
                        <div className="flex items-start gap-2 px-1">
                             <FiCheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                             <p className="text-xs text-gray-400">
                                Best results with high-quality, wide-angle footage.
                            </p>
                        </div>
                       
                        {/* Error Message */}
                        <div className={`
                            overflow-hidden transition-all duration-300 ease-in-out
                            ${error ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}
                        `}>
                            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                                <FiAlertCircle className="flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`
                            relative w-full flex items-center justify-center gap-2
                            h-14 rounded-xl font-semibold text-white text-lg
                            bg-orange-600 hover:bg-orange-700
                            focus:outline-none focus:ring-4 focus:ring-orange-500/20
                            disabled:opacity-70 disabled:cursor-not-allowed
                            transform active:scale-[0.99] transition-all duration-200
                            shadow-lg shadow-orange-600/20 hover:shadow-orange-600/30
                        `}
                    >
                        {loading ? (
                        <div className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Scouting...</span>
                        </div>
                        ) : (
                            <>
                                <span>Start Analysis</span>
                                <FiArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>

      </div>
    </div>
  )
}

export default YoutubeSubmissionPage