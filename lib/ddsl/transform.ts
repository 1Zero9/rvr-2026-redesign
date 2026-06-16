import { applyMercyRule, parseAgeGroup } from './mercy-rule';
import { resolveVenue } from './venue';
import type {
  AgeGroup,
  LeagueTable,
  MatchStatus,
  NormalisedMatch,
  SportLoMoFixture,
  SportLoMoStandingsTable,
  SportLoMoStatus,
} from './types';

function mapStatus(raw: SportLoMoStatus): MatchStatus {
  const s = raw.toLowerCase();
  if (s === 'live')                          return 'live';
  if (s === 'result' || s === 'completed')   return 'completed';
  if (s === 'postponed')                     return 'postponed';
  if (s === 'cancelled' || s === 'abandoned') return 'cancelled';
  return 'upcoming';
}

export function transformFixture(raw: SportLoMoFixture): NormalisedMatch {
  const competitionName = raw.competition.competitionName;
  const ageGroup = parseAgeGroup(competitionName);
  const status = mapStatus(raw.status);
  const venue = resolveVenue(raw.venue.venueName, raw.venue.venueAddress ?? null);

  let score = null;
  if (raw.score !== undefined && raw.score !== null) {
    score = applyMercyRule(raw.score, ageGroup);
  }

  return {
    id: raw.fixtureId,
    date: raw.fixtureDate,
    time: raw.fixtureTime,
    status,
    ageGroup,
    competition: competitionName,
    homeTeam: raw.homeTeam.teamName,
    awayTeam: raw.awayTeam.teamName,
    isRvrHome: venue.isRvrHome,
    venue,
    score,
    minutesElapsed: raw.minutesElapsed ?? null,
    allocationRef: raw.allocationRef ?? null,
  };
}

export function transformAll(fixtures: SportLoMoFixture[]): NormalisedMatch[] {
  return fixtures.map(transformFixture);
}

// ---------------------------------------------------------------------------
// Standings transform — shared with tables and sync routes
// ---------------------------------------------------------------------------

// Matches both spellings the DDSL system uses:
//   "Rivervalley Rangers"  (one word, as the club registers)
//   "River Valley Rangers" (two words, seen in some legacy DDSL exports)
// \s* between "river" and "valley" covers the space-variant without a second
// alternation branch. Lookbehind/lookahead instead of \b for the RVR acronym
// because word boundaries behave inconsistently around all-caps tokens.
const RVR_NAME_RE = /river\s*valley\s+rangers|(?<![a-z])rvr(?![a-z])/i;

export function isRvrTeam(teamName: string): boolean {
  return RVR_NAME_RE.test(teamName);
}

export function transformStandingsTable(
  raw: SportLoMoStandingsTable,
  ageGroup: AgeGroup,
): LeagueTable {
  return {
    competitionId: raw.competitionId,
    competitionName: raw.competitionName,
    ageGroup,
    season: raw.season,
    rows: raw.standings.map((row) => ({
      position:       row.position,
      teamName:       row.team.teamName,
      played:         row.played,
      won:            row.won,
      drawn:          row.drawn,
      lost:           row.lost,
      goalsFor:       row.goalsFor,
      goalsAgainst:   row.goalsAgainst,
      goalDifference: row.goalDifference,
      points:         row.points,
      isRvr:          isRvrTeam(row.team.teamName),
    })),
  };
}
