import { applyMercyRule, parseAgeGroup } from './mercy-rule';
import { resolveVenue } from './venue';
import type {
  MatchStatus,
  NormalisedMatch,
  SportLoMoFixture,
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
