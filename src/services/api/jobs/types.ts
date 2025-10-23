import { UserData } from '../types';

export interface JobRequest {
  video_filename: string;
  video_path: string;
  match_date: string;
  team_home: string;
  team_away: string;
  league: string;
  user_id: number;
}

export interface JobResponse {
  id: number;
  job_uuid: string;
  user: UserData;
  video_filename: string;
  video_path: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  match_date: string;
  team_home: string;
  team_away: string;
  league: string;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  total_frames: number | null;
  fps: number | null;
  video_duration: number | null;
  error_message: string | null;
}

export interface JobState {
  currentJobId: string | null;
  jobs: JobResponse[];
}
