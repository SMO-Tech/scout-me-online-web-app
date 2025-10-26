import apiClient from './axios';

export interface MatchAnalysisResponse {
  status: string;
  message: string;
  data: {
    job_uuid: string;
    match_info: {
      team_home: string;
      team_away: string;
      match_date: string;
      league: string;
      video_duration?: string;
    };
    match_statistics: {
      total_passes: number;
      successful_passes: number;
      pass_accuracy: number;
      home_team_passes: number;
      away_team_passes: number;
      total_players: number;
      home_team_players: number;
      away_team_players: number;
    };
    player_performances?: any[];
    processing_info?: any;
  };
}

export interface PassEvent {
  id: number;
  frame_number: number;
  time_seconds: number;
  pass_type: string;
  passer: {
    id: number;
    team: string;
    team_color: string;
  };
  receiver: {
    id: number;
    team: string;
    team_color: string;
  };
  metrics: {
    ball_distance: number;
    pass_success: boolean;
    pass_accuracy: number;
  };
}

export interface PassEventsResponse {
  status: string;
  message: string;
  data: {
    job_uuid: string;
    match_info: any;
    summary: {
      total_passes: number;
      successful_passes: number;
      pass_accuracy: number;
    };
    pass_events: PassEvent[];
  };
}

export interface BallTrackingPoint {
  frame_number: number;
  time_seconds: number;
  position: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
  metrics: {
    speed: number;
    direction: number;
    confidence: number;
  };
}

export interface BallTrackingResponse {
  status: string;
  message: string;
  data: {
    job_uuid: string;
    match_info: any;
    ball_statistics: {
      total_frames: number;
      average_speed: number;
      max_speed: number;
    };
    tracking_data: BallTrackingPoint[];
  };
}

/**
 * Get comprehensive match analysis results
 */
export const getMatchAnalysis = async (jobUuid: string): Promise<MatchAnalysisResponse> => {
  const response = await apiClient.get(`/api/match/jobs/${jobUuid}/analysis/`);
  return response.data;
};

/**
 * Get all pass events for a match
 */
export const getPassEvents = async (jobUuid: string): Promise<PassEventsResponse> => {
  const response = await apiClient.get(`/api/match/jobs/${jobUuid}/pass-events/`);
  return response.data;
};

/**
 * Get ball tracking data
 */
export const getBallTracking = async (jobUuid: string): Promise<BallTrackingResponse> => {
  const response = await apiClient.get(`/api/match/jobs/${jobUuid}/ball-tracking/`);
  return response.data;
};

/**
 * Get comprehensive match data (all data in one call)
 */
export const getMatchData = async (jobUuid: string) => {
  const response = await apiClient.get(`/api/match/jobs/${jobUuid}/data/`);
  return response.data;
};

