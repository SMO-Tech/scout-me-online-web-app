import axios from './axios'
import { JobsSummaryResponse } from '@/types/jobs'
import { STORAGE_KEYS } from '@/services/config'

export const fetchUserJobs = async (): Promise<JobsSummaryResponse> => {
  // Get user ID from local storage
  const userId = localStorage.getItem(STORAGE_KEYS.USER_ID)
  
  if (!userId) {
    throw new Error('User ID not found. Please log in again.')
  }

  const response = await axios.get(`/api/jobs/summary/?user_id=${userId}`)
  return response.data
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date).replace(/(\d+)/, (match) => {
    const day = parseInt(match);
    const suffix = ['th', 'st', 'nd', 'rd'][(day % 10 > 3 || (day % 100 - day % 10 === 10)) ? 0 : day % 10];
    return `${day}${suffix}`;
  });
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800'
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'failed': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}
