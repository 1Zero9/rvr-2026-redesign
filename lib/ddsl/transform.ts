import { applyMercyRule, parseAgeGroup } from './mercy-rule';
import { normalizeKickoffTime, normalizeTeamName, normalizeVenueName, RVR_TEAM_RE } from './normalize';
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
  const s = raw.toLowerCase().trim();
  if (s === 'live')                           return 'live';
  if (s === 'result' || s === 'completed')    return 'completed';
  if (s === 'postponed')                      return 'postponed';
  if (s === 'cancelled' || s === 'abandoned') return 'cancelled';
  if (s === 'walkover' || s === 'w/o')        return 'walkover';
  return 'upcoming';
}

export function transformFixture(raw: SportLoMoFixture): NormalisedMatch {
  const competitionName = raw.competition.competitionName;
  const ageGroup = parseAgeGroup(competitionName);
  const status = mapStatus(raw.status);

  // Sanitize team names — collapses spacing variants and maps RVR aliases to
  // the single canonical form before anything else reads the name.
  const homeTeam = normalizeTeamName(raw.homeTeam.teamName);
  const awayTeam = normalizeTeamName(raw.awayTeam.teamName);

  // Apply structural fallbacks for fields that may be absent from the feed.
  const time  = normalizeKickoffTime(raw.fixtureTime);
  const venue = resolveVenue(
    normalizeVenueName(raw.venue.venueName),
    raw.venue.venueAddress ?? null,
  );

  // Walkovers are recorded in the feed without a scoreline — suppress the score
  // entirely so the UI renders the explicit "Walkover" status rather than "0–0".
  let score = null;
  if (status !== 'walkover' && raw.score != null) {
    score = applyMercyRule(raw.score, ageGroup);
  }

  return {
    id: raw.fixtureId,
    date: raw.fixtureDate,
    time,
    status,
    ageGroup,
    competition: competitionName,
    homeTeam,
    awayTeam,
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

export function isRvrTeam(teamName: string): boolean {
  return RVR_TEAM_RE.test(teamName);
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
    rows: raw.standings
      .map((row) => ({
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
      }))
      .sort((a, b) => a.position - b.position),
  };
}
