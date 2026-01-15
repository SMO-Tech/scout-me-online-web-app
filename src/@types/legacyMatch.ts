interface UserData {
  name: string;
  email: string;
}

interface MatchInfo {
  match_date_time: string;
  competition_name: string;
  venue: string;
  location: string;
}

interface TeamsData {
  my_team: string;
  opponent_team: string;
  my_team_formation: string;
  opponent_team_formation: string | null;
}

interface ScoreData {
  home_score: number;
  away_score: number;
  winner: string | null;
}

interface LineupPlayer {
  position: string;
  player_name: string;
  jersy_number: string;
}

interface Lineups {
  my_team_starting_lineup: LineupPlayer[];
  opponent_team_starting_lineup: LineupPlayer[];
}

interface Substitutes {
  my_team_substitutes: LineupPlayer[];
  opponent_team_substitutes: LineupPlayer[];
}

interface MatchHalfTiming {
  start: string;
  end: string;
}

interface MatchTiming {
  first_half: MatchHalfTiming;
  second_half: MatchHalfTiming;
}

interface LegacyMatchMetadata {
  raw_data: any;
  originalMatch: any;
  originalMatchDetail: any;
  created_at: string;
  updated_at: string;
}

export interface LegacyMatchData {
  match_id: number;
  id: number;
  youtube_link: string;
  user: UserData;
  match_info: MatchInfo;
  teams: TeamsData;
  score: ScoreData;
  lineups: Lineups;
  substitutes: Substitutes;
  match_timing: MatchTiming;
  metadata: LegacyMatchMetadata;
}

export interface LegacyMatchResponse {
  status: string;
  message: string;
  data: LegacyMatchData;
}