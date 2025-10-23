'use client'
import { useState, useEffect } from 'react';
import DashboardNav from '@/components/layout/DashboardNav';
import { FiEdit2, FiSave } from 'react-icons/fi';
import authService from '@/services/api/auth.service';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneno: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser?.id) {
          const response = await authService.getUserInfo(currentUser.id);
          setUser(response.data);
          setFormData({
            name: response.data.name || '',
            email: response.data.email || '',
            phoneno: response.data.phoneno || ''
          });
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // Use cached data from localStorage as fallback
        const cachedUser = authService.getCurrentUser();
        setUser(cachedUser);
        setFormData({
          name: cachedUser?.name || '',
          email: cachedUser?.email || '',
          phoneno: cachedUser?.phoneno || ''
        });
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700"
              >
                {isEditing ? (
                  <>
                    <FiSave className="w-4 h-4" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <FiEdit2 className="w-4 h-4" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>

            {/* Profile Picture */}
            <div className="mb-8 text-center">
              <div className="relative inline-block">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-32 w-32 rounded-full border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-full bg-purple-100 flex items-center justify-center border-4 border-white shadow-lg">
                    <span className="text-4xl font-semibold text-purple-600">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phoneno}
                  onChange={(e) => setFormData({ ...formData, phoneno: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              {isEditing && (
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>

            {/* Account Info */}
            <div className="mt-12 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Videos Analyzed</h3>
                  <p className="text-3xl font-bold text-purple-600">0</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Reports Generated</h3>
                  <p className="text-3xl font-bold text-purple-600">0</p>
                </div>
               
              </div>

              {/* Additional User Info */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Account Status</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Email Verification</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {user.is_verified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Member Since</span>
                    <span className="text-gray-900">
                      {new Date(user.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Last Login</span>
                    <span className="text-gray-900">
                      {user.last_login
                        ? new Date(user.last_login).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'Never'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Last Updated</span>
                    <span className="text-gray-900">
                      {new Date(user.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
