// ─── Pagination envelope ──────────────────────────────────────────────────────

export interface ClubZapPage<T> {
  data: T[];
  page: number;
  per_page: number;
  total: number;
}

// ─── Shared sub-types ─────────────────────────────────────────────────────────

export interface ClubZapClub {
  id: number;
  name: string;
  logo?: {
    url: string;
    width?: number;
    height?: number;
  };
  color_scheme?: {
    primary: string;
    secondary: string;
  };
}

export interface ClubZapAuthor {
  id: number;
  name: string;
}

// ─── Articles ─────────────────────────────────────────────────────────────────

/** Summary shape returned from GET /clubs/{id}/articles */
export interface ClubZapArticleSummary {
  id: number;
  title: string;
  created_at: string;   // ISO 8601
  updated_at: string;
  view_count: number;
  thumb?: string;       // URL
}

/** Full shape returned from GET /articles/{id} */
export interface ClubZapArticle extends ClubZapArticleSummary {
  md_content: string;
  feature_image?: string;
  author?: ClubZapAuthor;
  club?: ClubZapClub;
}

// ─── Fixtures ─────────────────────────────────────────────────────────────────

export interface ClubZapTeam {
  id: number;
  name: string;
  club?: ClubZapClub;
}

export interface ClubZapFixture {
  id: number;
  event_id: number;
  start: string;           // ISO 8601 datetime
  venue?: string;
  referee?: string;
  grade?: string;
  competition?: string;
  division?: string;
  event_type?: string;
  ground_type?: string;
  home_club?: ClubZapClub;
  away_club?: ClubZapClub;
  home_team?: ClubZapTeam;
  away_team?: ClubZapTeam;
  external_url?: string;
}

// ─── Results ──────────────────────────────────────────────────────────────────

export interface ClubZapResultScore {
  score?: number;
  result_status?: 'win' | 'loss' | 'draw' | string;
}

export interface ClubZapResult extends ClubZapFixture {
  article_id?: number;
  home_club_score?: ClubZapResultScore;
  away_club_score?: ClubZapResultScore;
  club_data?: Record<string, unknown>;
}

// ─── Credential check ─────────────────────────────────────────────────────────

export interface ClubZapCredentials {
  appId: string;
  jwt: string;
  clubId: string;
  baseUrl: string;
}
