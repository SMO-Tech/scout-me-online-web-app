import axios from 'axios'
import { API_CONFIG, STORAGE_KEYS } from '../config'

export const fetchUserJobs = async () => {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    const userId = localStorage.getItem(STORAGE_KEYS.USER_ID)
    
    console.log('Debugging fetchUserJobs:', {
      token: token ? 'Token present' : 'No token',
      userId: userId,
      baseUrl: API_CONFIG.BASE_URL,
      endpoint: API_CONFIG.ENDPOINTS.JOBS.LIST
    })

    if (!token || !userId) {
      console.error('Missing authentication credentials')
      throw new Error('Authentication required: No token or user ID')
    }

    // Detailed request configuration logging
    const requestConfig = {
      method: 'get',
      url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.JOBS.LIST}?user_id=${userId}`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      params: {
        user_id: userId
      }
    }

    console.log('Request Configuration:', {
      url: requestConfig.url,
      headers: {
        Authorization: requestConfig.headers.Authorization ? 'Bearer [TOKEN]' : 'No token',
        'Content-Type': requestConfig.headers['Content-Type']
      },
      params: requestConfig.params
    })

    try {
      const response = await axios(requestConfig)

      console.log('Full API Response:', {
        status: response.status,
        data: response.data
      })

      // Validate response structure
      if (!response.data || !response.data.data || !response.data.data.recent_jobs) {
        console.error('Unexpected response structure:', response.data)
        throw new Error('Invalid response format from server')
      }

      return response.data
    } catch (axiosError: any) {
      console.error('Axios Error Details:', {
        message: axiosError.message,
        response: axiosError.response ? {
          status: axiosError.response.status,
          data: axiosError.response.data,
          headers: axiosError.response.headers
        } : 'No response',
        request: axiosError.request ? 'Request was made' : 'No request',
        config: axiosError.config
      })

      throw axiosError
    }
  } catch (error: any) {
    console.error('Error in fetchUserJobs:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    })
    throw error
  }
}
