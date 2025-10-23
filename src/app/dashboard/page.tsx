'use client'
import { useState, useEffect } from 'react';
import { FiUpload } from 'react-icons/fi';
import DashboardNav from '@/components/layout/DashboardNav';

export default function DashboardPage() {
  const [videoUrl, setVideoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleAnalyze = async () => {
    if (!videoUrl) {
      // Show error toast
      return;
    }
    setIsUploading(true);
    // TODO: Implement video analysis
    setTimeout(() => setIsUploading(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Match Analysis Center</h1>
              <p className="text-gray-600 mt-2">Choose an option below to upload your video for analysis.</p>
            </div>

            {/* YouTube/Vimeo Link Section */}
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Copy/Paste a Match Link</h2>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="YouTube or Vimeo URL (e.g. https://youtube.com/...)"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={handleAnalyze}
                  disabled={isUploading}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Analyzing...
                    </>
                  ) : (
                    'Start Analysis'
                  )}
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Supports Public YouTube, VEO, and Vimeo videos.
              </p>
            </div>

            {/* Upload Section */}
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Match Footage</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
                <div className="mx-auto w-16 h-16 mb-4 text-gray-400">
                  <FiUpload className="w-full h-full" />
                </div>
                <p className="text-gray-600 mb-2">
                  Drag and drop your full match video (up to 3GB) here to receive a detailed analysis
                </p>
                <p className="text-sm text-gray-500">
                  Compatible formats: VEO, Pixellot, MP4, MOV, AVI, WMV
                </p>
                <button className="mt-4 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  Click to browse
                </button>
              </div>
            </div>

            {/* Live Analysis Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Go Live with a Device - Coming Soon!</h2>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 mb-2">
                      Connect your camera or external device to stream matches live and analyze stats in real time.
                    </p>
                    <p className="text-sm text-gray-500">Perfect for on-the-go play-by-play insights!</p>
                  </div>
                  <button disabled className="px-6 py-3 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed">
                    Connect External Device
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}