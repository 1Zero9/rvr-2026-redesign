export interface SeniorMatch {
  matchId: string;
  date: string;              // "YYYY-MM-DD"
  homeTeam: string;
  awayTeam: string;
  score: { home: number; away: number } | null;
  status: 'Result' | 'Postponed' | 'Fixture';
  competition: string;
  venue: string;
  matchUrl: string;
  isRvrHome: boolean;
}

export interface SeniorSyncResponse {
  scrapedAt: string;         // ISO timestamp
  source: string;            // "finalwhistle.ie"
  results: SeniorMatch[];
  fixtures: SeniorMatch[];
}
