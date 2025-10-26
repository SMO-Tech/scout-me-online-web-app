import { MatchAnalysisData } from '@/types/matchAnalysis';

export const mockMatchData: MatchAnalysisData = {
  jobUuid: 'mock-job-uuid-123',
  matchMetadata: {
    homeTeam: 'Manchester City',
    awayTeam: 'Liverpool FC',
    date: '2024-10-20',
    score: '2-1'
  },
  analysisResult: {
    totalPasses: 847,
    successfulPasses: 724,
    passAccuracy: 85.5,
    homeTeamPasses: 512,
    awayTeamPasses: 335
  },
  homeTeamStats: {
    teamName: 'Manchester City',
    possession: 61,
    totalPasses: 512,
    passAccuracy: 88.3,
    shotsOnTarget: 8,
    defensiveActions: 42
  },
  awayTeamStats: {
    teamName: 'Liverpool FC',
    possession: 39,
    totalPasses: 335,
    passAccuracy: 81.2,
    shotsOnTarget: 5,
    defensiveActions: 67
  },
  playerStats: [
    {
      playerName: 'Kevin De Bruyne',
      totalPasses: 87,
      successfulPasses: 79,
      passAccuracy: 90.8,
      distanceCovered: 11.2,
      possessionTime: 4.8,
      teamColor: '#6CABDD'
    },
    {
      playerName: 'Rodri',
      totalPasses: 95,
      successfulPasses: 88,
      passAccuracy: 92.6,
      distanceCovered: 10.5,
      possessionTime: 5.2,
      teamColor: '#6CABDD'
    },
    {
      playerName: 'Erling Haaland',
      totalPasses: 28,
      successfulPasses: 22,
      passAccuracy: 78.6,
      distanceCovered: 9.8,
      possessionTime: 1.9,
      teamColor: '#6CABDD'
    },
    {
      playerName: 'Phil Foden',
      totalPasses: 64,
      successfulPasses: 58,
      passAccuracy: 90.6,
      distanceCovered: 10.9,
      possessionTime: 3.7,
      teamColor: '#6CABDD'
    },
    {
      playerName: 'Mohamed Salah',
      totalPasses: 42,
      successfulPasses: 35,
      passAccuracy: 83.3,
      distanceCovered: 11.4,
      possessionTime: 2.8,
      teamColor: '#C8102E'
    },
    {
      playerName: 'Virgil van Dijk',
      totalPasses: 71,
      successfulPasses: 65,
      passAccuracy: 91.5,
      distanceCovered: 9.2,
      possessionTime: 3.4,
      teamColor: '#C8102E'
    },
    {
      playerName: 'Trent Alexander-Arnold',
      totalPasses: 68,
      successfulPasses: 55,
      passAccuracy: 80.9,
      distanceCovered: 10.8,
      possessionTime: 3.1,
      teamColor: '#C8102E'
    },
    {
      playerName: 'Darwin Núñez',
      totalPasses: 31,
      successfulPasses: 24,
      passAccuracy: 77.4,
      distanceCovered: 10.3,
      possessionTime: 2.1,
      teamColor: '#C8102E'
    }
  ],
  passEvents: [
    { id: '1', timestamp: 120, fromPlayer: 'Rodri', toPlayer: 'De Bruyne', success: true, distance: 15.2, zone: 'midfield', fromX: 45, fromY: 50, toX: 60, toY: 55 },
    { id: '2', timestamp: 135, fromPlayer: 'De Bruyne', toPlayer: 'Foden', success: true, distance: 22.3, zone: 'attack', fromX: 60, fromY: 55, toX: 75, toY: 45 },
    { id: '3', timestamp: 156, fromPlayer: 'Salah', toPlayer: 'Núñez', success: false, distance: 18.7, zone: 'attack', fromX: 70, fromY: 20, toX: 85, toY: 30 },
    { id: '4', timestamp: 178, fromPlayer: 'Van Dijk', toPlayer: 'Alexander-Arnold', success: true, distance: 28.4, zone: 'defense', fromX: 20, fromY: 30, toX: 35, toY: 15 },
    { id: '5', timestamp: 200, fromPlayer: 'Foden', toPlayer: 'Haaland', success: true, distance: 12.5, zone: 'attack', fromX: 75, fromY: 45, toX: 85, toY: 50 },
    { id: '6', timestamp: 225, fromPlayer: 'Alexander-Arnold', toPlayer: 'Salah', success: true, distance: 35.8, zone: 'midfield', fromX: 35, fromY: 15, toX: 65, toY: 20 },
    { id: '7', timestamp: 245, fromPlayer: 'Haaland', toPlayer: 'De Bruyne', success: false, distance: 20.1, zone: 'attack', fromX: 85, fromY: 50, toX: 70, toY: 55 },
    { id: '8', timestamp: 280, fromPlayer: 'Rodri', toPlayer: 'Foden', success: true, distance: 18.9, zone: 'midfield', fromX: 50, fromY: 48, toX: 68, toY: 42 },
    { id: '9', timestamp: 310, fromPlayer: 'Van Dijk', toPlayer: 'Núñez', success: false, distance: 45.2, zone: 'defense', fromX: 25, fromY: 35, toX: 70, toY: 30 },
    { id: '10', timestamp: 340, fromPlayer: 'De Bruyne', toPlayer: 'Haaland', success: true, distance: 16.7, zone: 'attack', fromX: 65, fromY: 52, toX: 80, toY: 48 },
    { id: '11', timestamp: 380, fromPlayer: 'Foden', toPlayer: 'Rodri', success: true, distance: 14.3, zone: 'midfield', fromX: 70, fromY: 40, toX: 55, toY: 45 },
    { id: '12', timestamp: 420, fromPlayer: 'Salah', toPlayer: 'Alexander-Arnold', success: false, distance: 25.6, zone: 'midfield', fromX: 60, fromY: 18, toX: 40, toY: 12 },
    { id: '13', timestamp: 455, fromPlayer: 'Haaland', toPlayer: 'Foden', success: true, distance: 11.8, zone: 'attack', fromX: 82, fromY: 50, toX: 72, toY: 44 },
    { id: '14', timestamp: 490, fromPlayer: 'Rodri', toPlayer: 'De Bruyne', success: true, distance: 13.5, zone: 'midfield', fromX: 48, fromY: 52, toX: 62, toY: 56 },
    { id: '15', timestamp: 525, fromPlayer: 'Núñez', toPlayer: 'Salah', success: false, distance: 19.4, zone: 'attack', fromX: 75, fromY: 32, toX: 68, toY: 22 },
  ],
  ballTracking: Array.from({ length: 100 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 60,
    timestamp: i * 60,
    possession: i % 3 === 0 ? 'home' : i % 3 === 1 ? 'away' : 'neutral' as 'home' | 'away' | 'neutral'
  })),
  timeSeriesData: Array.from({ length: 20 }, (_, i) => ({
    time: i * 5,
    homePassAccuracy: 85 + Math.random() * 10,
    awayPassAccuracy: 78 + Math.random() * 10
  }))
};

