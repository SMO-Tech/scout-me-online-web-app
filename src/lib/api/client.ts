// /lib/apiClient.ts
import axios from 'axios'
import { auth } from '../firebaseConfig'


const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'
})

apiClient.interceptors.request.use(async (config) => {
  const user = auth.currentUser
  if (user) {
    const token = await user.getIdToken()
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default apiClient
