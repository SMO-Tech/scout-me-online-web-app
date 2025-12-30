'use client'
import { useState, useEffect } from 'react';
import DashboardNav from '@/components/layout/DashboardNav';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useRouter } from 'next/navigation';
import { FiUpload } from 'react-icons/fi';


export default function DashboardPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { replace } = useRouter()

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);


  if (isLoading) {
    return (
      <LoadingSpinner />
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-900 rounded-2xl shadow-sm p-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white">Your journey to faster improvement & recognition starts here.
              </h1>
              <p className="text-gray-300 text-sm mt-4">Upload your last match  <span className='text-pink-400'>video URL</span> and let our AI break down performance
                so players improve faster and get seen sooner.
              </p>
            </div>

            {/* No Stats / First Analysis Section */}
            <div className="mb-12 ">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center flex flex-col items-center justify-center gap-4 ">
                {/* <p className="text-lg font-semibold text-gray-200">
                  Top players and coaches don’t guess.
                </p>
                <p className="text-gray-400 max-w-md">
                  They review every game, fix weaknesses,
                  and prepare smarter for the next performance.

                </p> */}

                <button
                  onClick={() => replace('/dashboard/form')}
                  disabled={isUploading}
                  className="px-6 py-3 bg-pink-400 text-white rounded-lg hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Analyse my game now
                </button>
                  <FiUpload color='cyan' size={100} />
                <p className='text-sm text-cyan-400' >The more games analysed, the better the data becomes at spotting patterns
                  and supporting better decisions to improve your performance for next game.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}