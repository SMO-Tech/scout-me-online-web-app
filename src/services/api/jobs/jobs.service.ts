import { ApiResponse } from '../types';
import { JobRequest, JobResponse } from './types';
import apiClient from '../axios';
import { API_CONFIG, STORAGE_KEYS } from '../../config';

class JobsService {
  async createJob(data: JobRequest): Promise<ApiResponse<JobResponse>> {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.JOBS.CREATE, data);
      const responseData = response.data;

      if (responseData.status === 'success') {
        // Store job ID in localStorage
        const currentJobs = localStorage.getItem(STORAGE_KEYS.JOBS) || '[]';
        const jobs = JSON.parse(currentJobs);
        jobs.push(responseData.data);
        localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
        localStorage.setItem(STORAGE_KEYS.CURRENT_JOB_ID, responseData.data.job_uuid);

        return responseData;
      }

      throw new Error(responseData.message || 'Failed to create job');
    } catch (error: any) {
      console.error('Job creation error:', error);
      
      if (!error.response) {
        throw new Error('Network error. Please check your connection.');
      }

      const status = error.response.status;
      const errorData = error.response.data;

      switch (status) {
        case 400:
          if (errorData?.errors) {
            const validationErrors = Object.values(errorData.errors).flat().join(', ');
            throw new Error(`Validation error: ${validationErrors}`);
          }
          throw new Error(errorData?.message || 'Invalid request data');
        case 401:
          throw new Error('Please login to continue');
        case 403:
          throw new Error('You do not have permission to perform this action');
        case 500:
          throw new Error('Server error. Please try again later');
        default:
          throw new Error(errorData?.message || 'Something went wrong');
      }
    }
  }

  getCurrentJobId(): string | null {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_JOB_ID);
  }

  getJobs(): JobResponse[] {
    const jobs = localStorage.getItem(STORAGE_KEYS.JOBS);
    return jobs ? JSON.parse(jobs) : [];
  }
}

export const jobsService = new JobsService();
export default jobsService;
