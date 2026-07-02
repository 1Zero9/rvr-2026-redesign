import type {
  Competition,
  CompetitionTeam,
  CompetitionVenue,
  Fixture,
  PlayerPoolEntry,
  TeamPlayer,
  CompetitionAssignment,
  AdminUser,
  CompetitionState,
  CompetitionType,
  FixtureStatus,
  TeamTheme,
} from "@prisma/client";

// ---------- Re-exports ----------
export type {
  Competition,
  CompetitionTeam,
  CompetitionVenue,
  Fixture,
  PlayerPoolEntry,
  TeamPlayer,
  CompetitionAssignment,
  AdminUser,
  CompetitionState,
  CompetitionType,
  FixtureStatus,
  TeamTheme,
};

// ---------- Rich types ----------
export type CompetitionTeamWithPlayers = CompetitionTeam & {
  players: (TeamPlayer & { playerPoolEntry: PlayerPoolEntry })[];
};

export type FixtureWithTeams = Fixture & {
  homeTeam: CompetitionTeam;
  awayTeam: CompetitionTeam;
};

export type CompetitionFull = Competition & {
  venues: CompetitionVenue[];
  teams: CompetitionTeamWithPlayers[];
  fixtures: FixtureWithTeams[];
  assignments: CompetitionAssignment[];
};

export type PublicCompetition = Omit<Competition, "dataNoticeAcknowledgedAt"> & {
  venues: CompetitionVenue[];
  teams: PublicTeam[];
  fixtures: FixtureWithTeams[];
};

export type PublicTeam = CompetitionTeam & {
  players: { id: string; displayName: string }[];
};

// ---------- Upload types ----------
export interface ParsedPlayerRow {
  firstName: string;
  lastName: string;
  displayName: string;
  ageGroup?: string;
  clubOrSchool?: string;
  notes?: string;
  availableDays: string[];
  flags: string[];
}

// ---------- Scheduler types ----------
export interface SchedulerConfig {
  teams: Array<Pick<CompetitionTeam, "id">>;
  competitionType: CompetitionType;
  venues: Array<Pick<CompetitionVenue, "name" | "pitches">>;
  startTime: string;
  gameDuration: number;
  breakDuration: number;
  dates: Date[];
}

export interface GeneratedFixture {
  homeTeamId: string;
  awayTeamId: string;
  venueName: string;
  pitchLabel: string | null;
  scheduledAt: Date;
  duration: number;
  round: string | null;
}

// ---------- Standings types ----------
export interface StandingsRow {
  teamId: string;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

// ---------- Auth helpers ----------
export type SessionUser = {
  id: string;
  email: string;
  name?: string | null;
  globalRole: import("@prisma/client").GlobalRole | null;
};
