// ---------------------------------------------------------------------------
// Raw shapes returned by the SportLoMo JSON API
// Verify field names against your DDSL / SportLoMo API documentation.
// All optional fields may be absent depending on the endpoint version.
// ---------------------------------------------------------------------------

export interface SportLoMoTeam {
  teamId: number;
  teamName: string;
  clubId: number;
  clubName: string;
}

export interface SportLoMoCompetition {
  competitionId: number;
  competitionName: string; // e.g. "DDSL U10 Boys Division 1"
  seasonId?: number;
  seasonName?: string;
}

export interface SportLoMoScore {
  home: number;
  away: number;
}

export interface SportLoMoVenue {
  venueId?: number;
  venueName: string;
  venueAddress?: string;
  venuePostcode?: string;
}

/** Possible status values SportLoMo uses — extend as needed */
export type SportLoMoStatus =
  | 'Fixture'
  | 'Live'
  | 'Result'
  | 'Postponed'
  | 'Cancelled'
  | 'Abandoned'
  | string;

export interface SportLoMoFixture {
  fixtureId: number;
  fixtureDate: string;     // "YYYY-MM-DD"
  fixtureTime: string;     // "HH:MM"
  homeTeam: SportLoMoTeam;
  awayTeam: SportLoMoTeam;
  venue: SportLoMoVenue;
  competition: SportLoMoCompetition;
  status: SportLoMoStatus;
  score?: SportLoMoScore;
  /** Minutes elapsed — only present when status === 'Live' */
  minutesElapsed?: number;
  allocationRef?: string;
}

/** Envelope that SportLoMo wraps collections in */
export interface SportLoMoEnvelope<T> {
  total: number;
  page?: number;
  pageSize?: number;
  data: T[];
}

// ---------------------------------------------------------------------------
// Normalised / enriched output types (what the API routes return to clients)
// ---------------------------------------------------------------------------

export type MatchStatus = 'upcoming' | 'live' | 'completed' | 'postponed' | 'cancelled';

export type AgeGroup =
  | 'U7' | 'U8' | 'U9' | 'U10' | 'U11' | 'U12'
  | 'U13' | 'U14' | 'U15' | 'U16' | 'U17' | 'U18'
  | 'Senior'
  | 'Unknown';

export interface DisplayScore {
  home: number;
  away: number;
  /** True when the Mercy Rule capped the displayed margin */
  mercyRuleApplied: boolean;
  /**
   * Only present when mercyRuleApplied === true.
   * Formula: Margin_display = min(Score_winning − Score_losing, 5)
   */
  actualMargin?: number;
  displayMargin?: number;
}

export interface VenueInfo {
  name: string;
  address: string | null;
  isRvrHome: boolean;
  googleMapsUrl: string;
}

export interface NormalisedMatch {
  id: number;
  date: string;           // "YYYY-MM-DD"
  time: string;           // "HH:MM"
  status: MatchStatus;
  ageGroup: AgeGroup;
  competition: string;
  homeTeam: string;
  awayTeam: string;
  isRvrHome: boolean;     // convenience flag mirroring venue.isRvrHome
  venue: VenueInfo;
  score: DisplayScore | null;
  minutesElapsed: number | null;
  allocationRef: string | null;
}

export interface MatchesResponse {
  cachedAt: string;       // ISO timestamp
  cacheExpiresAt: string;
  matches: NormalisedMatch[];
}
