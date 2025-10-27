export interface User {
  id: number;
  user_sub: string;
  name: string;
  email: string;
  phoneno: string | null;
  auth_provider: string;
  avatar: string | null;
  is_active: boolean;
  is_verified: boolean;
  last_login: string;
  created_at: string;
  updated_at: string;
}

export interface JobSummary {
  id: number;
  job_uuid: string;
  user: User;
  video_filename: string;
  video_path: string;
  status: 'completed' | 'pending' | 'failed';
  match_date: string;
  team_home: string;
  team_away: string;
  league: string;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  total_frames: number | null;
  fps: number | null;
  video_duration: string | null;
  error_message: string | null;
}

export interface JobsSummaryResponse {
  status: string;
  message: string;
  data: {
    total_jobs: number;
    status_breakdown: Array<{
      status: string;
      count: number;
    }>;
    recent_jobs: JobSummary[];
  };
}
