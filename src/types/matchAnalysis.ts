export interface PassEvent {
  id: string;
  timestamp: number;
  fromPlayer: string;
  toPlayer: string;
  success: boolean;
  distance: number;
  zone: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

export interface PlayerStats {
  playerName: string;
  totalPasses: number;
  successfulPasses: number;
  passAccuracy: number;
  distanceCovered: number;
  possessionTime: number;
  teamColor: string;
}

export interface BallTrackingPoint {
  x: number;
  y: number;
  timestamp: number;
  possession: 'home' | 'away' | 'neutral';
}

export interface TeamStats {
  teamName: string;
  possession: number;
  totalPasses: number;
  passAccuracy: number;
  shotsOnTarget: number;
  defensiveActions: number;
}

export interface MatchAnalysisData {
  jobUuid: string;
  matchMetadata: {
    homeTeam: string;
    awayTeam: string;
    date: string;
    score: string;
  };
  passEvents: PassEvent[];
  playerStats: PlayerStats[];
  ballTracking: BallTrackingPoint[];
  homeTeamStats: TeamStats;
  awayTeamStats: TeamStats;
  analysisResult: {
    totalPasses: number;
    successfulPasses: number;
    passAccuracy: number;
    homeTeamPasses: number;
    awayTeamPasses: number;
  };
  timeSeriesData: {
    time: number;
    homePassAccuracy: number;
    awayPassAccuracy: number;
  }[];
}

