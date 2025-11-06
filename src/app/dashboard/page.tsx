'use client'
import { useState, useEffect } from 'react';
import DashboardNav from '@/components/layout/DashboardNav';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useRouter } from 'next/navigation';


export default function DashboardPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { replace} = useRouter()

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
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Match Analysis Center</h1>
              <p className="text-gray-600 mt-2">Choose an option below to upload your video for analysis.</p>
            </div>

            {/* No Stats / First Analysis Section */}
            <div className="mb-12">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center flex flex-col items-center justify-center gap-4 bg-gray-50">
                <p className="text-lg font-semibold text-gray-900">
                  You don’t have stats yet.
                </p>
                <p className="text-gray-600 max-w-md">
                  Start by analyzing your first game.
                </p>

                <button
                  onClick={() => replace('/dashboard/form')}
                  disabled={isUploading}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Analyze Game
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}