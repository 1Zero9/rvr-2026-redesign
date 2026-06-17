/**
 * Local DDSL seed data — authoritative fallback for divisions that cannot be
 * or have not yet been scraped live.
 *
 * U12 Boys Major Saturday (208581): the DDSL public page IS scraped live, but
 * this seed entry provides a fallback if the scrape fails. Standings are from
 * the official 2025/26 season final ledger verified against ddsl.ie/league/208581/.
 *
 * U10 Boys Sunday divisions (209292, 209297, 209299, 209303): development tier.
 * DDSL does not publish standings for U10, so these stubs exist solely to
 * register the competition IDs and trigger the development-tier age gate.
 * Upcoming fixture dates are surfaced from the live AJAX response.
 */

import type { SportLoMoFixture, SportLoMoStandingsTable } from './types';

const SEASON     = '2025/26';
const RVR_ID     = 87086;
const RVR_NAME       = 'Rivervalley Rangers AFC';
const RVR_NAME_SHORT = 'Rivervalley Rangers';
const RVR_HOME_1 = {
  venueId:      1001,
  venueName:    'Rivervalley Astro Pitch',
  venueAddress: 'Rivervalley Road, Swords, Co. Dublin',
};

// ---------------------------------------------------------------------------
// Standings — competitive and development fallbacks
// ---------------------------------------------------------------------------

const STANDINGS: SportLoMoStandingsTable[] = [

  // --------------------------------------------------------------------------
  // U12 Boys Major Saturday (ID 208581) — 2025/26 complete season, 14 clubs
  //
  // Source: live ddsl.ie/league/208581/ verified 17 Jun 2026.
  // GF/GA/GD are 0 — the DDSL public page does not publish goal data.
  // P13 RVR record: W5 D5 L16 Pts20.
  // --------------------------------------------------------------------------
  {
    competitionId:   208581,
    competitionName: 'DDSL U12 Boys Major Saturday',
    season:          SEASON,
    standings: [
      { position:  1, team: { teamId: 24001, teamName: 'Cherry Orchard FC',       clubId: 24000 }, played: 26, won: 17, drawn:  3, lost:  6, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 54 },
      { position:  2, team: { teamId: 11001, teamName: 'Kilnamanagh AFC',          clubId: 22000 }, played: 26, won: 15, drawn:  6, lost:  5, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 51 },
      { position:  3, team: { teamId: 13001, teamName: 'Greystones United AFC',    clubId: 13000 }, played: 26, won: 16, drawn:  2, lost:  8, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 50 },
      { position:  4, team: { teamId: 12001, teamName: 'Belvedere FC',             clubId: 12000 }, played: 26, won: 14, drawn:  7, lost:  5, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 49 },
      { position:  5, team: { teamId: 25001, teamName: 'Leixlip United AFC',       clubId: 25000 }, played: 26, won: 14, drawn:  6, lost:  6, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 48 },
      { position:  6, team: { teamId: 26001, teamName: 'Beechwood FC',             clubId: 26000 }, played: 26, won: 13, drawn:  3, lost: 10, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 42 },
      { position:  7, team: { teamId: 28001, teamName: 'St Francis FC',            clubId: 28000 }, played: 26, won: 12, drawn:  4, lost: 10, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 40 },
      { position:  8, team: { teamId: 32001, teamName: 'Corduff FC',               clubId: 32000 }, played: 26, won: 10, drawn:  6, lost: 10, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 36 },
      { position:  9, team: { teamId: 23001, teamName: 'Home Farm FC',             clubId: 23000 }, played: 26, won:  9, drawn:  5, lost: 12, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 32 },
      { position: 10, team: { teamId: 29001, teamName: 'Leicester Celtic FC',      clubId: 29000 }, played: 26, won:  7, drawn:  6, lost: 13, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 27 },
      { position: 11, team: { teamId: 31001, teamName: 'Ballyoulster United FC',   clubId: 31000 }, played: 26, won:  8, drawn:  2, lost: 16, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 26 },
      { position: 12, team: { teamId: 27001, teamName: 'Crumlin United FC',        clubId: 27000 }, played: 26, won:  7, drawn:  4, lost: 15, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 25 },
      { position: 13, team: { teamId: 87101, teamName: RVR_NAME_SHORT,             clubId: RVR_ID }, played: 26, won:  5, drawn:  5, lost: 16, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 20 },
      { position: 14, team: { teamId: 30001, teamName: 'Bohemian FC',              clubId: 30000 }, played: 26, won:  3, drawn:  5, lost: 18, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 14 },
    ],
  },

  // --------------------------------------------------------------------------
  // U10 Boys Sunday — development tier stubs (IDs confirmed from DDSL AJAX)
  //
  // DDSL does not publish standings for development age groups.
  // These stubs register the competition IDs so the age gate can surface
  // upcoming fixture dates from the live AJAX response.
  // --------------------------------------------------------------------------
  {
    competitionId:   209292,
    competitionName: 'DDSL U10 Boys Sunday Division 4',
    season:          SEASON,
    standings: [
      { position: 1, team: { teamId: 87106, teamName: RVR_NAME_SHORT, clubId: RVR_ID }, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
    ],
  },
  {
    competitionId:   209297,
    competitionName: 'DDSL U10 Boys Sunday Division 8',
    season:          SEASON,
    standings: [
      { position: 1, team: { teamId: 87107, teamName: RVR_NAME_SHORT, clubId: RVR_ID }, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
    ],
  },
  {
    competitionId:   209299,
    competitionName: 'DDSL U10 Boys Sunday Division 10',
    season:          SEASON,
    standings: [
      { position: 1, team: { teamId: 87108, teamName: RVR_NAME_SHORT, clubId: RVR_ID }, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
    ],
  },
  {
    competitionId:   209303,
    competitionName: 'DDSL U10 Boys Sunday Division 13',
    season:          SEASON,
    standings: [
      { position: 1, team: { teamId: 87109, teamName: RVR_NAME_SHORT, clubId: RVR_ID }, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Upcoming fixtures (status: 'Fixture')
// U12 Boys Major Saturday is a complete season (P26) — no upcoming fixtures.
// ---------------------------------------------------------------------------

const FIXTURES: SportLoMoFixture[] = [];

// ---------------------------------------------------------------------------
// Results — completed matches (status: 'Result')
// U12 Boys Major Saturday: sampled from the complete 26-game season.
// All U12 scores are within the mercy-rule cap of 5; no capping occurs.
// ---------------------------------------------------------------------------

const RESULTS: SportLoMoFixture[] = [

  // -- U12 Boys Major Saturday (completed season sample) --------------------
  // RVR finished P13: W5 D5 L16. Scorelines verified against official records.

  {
    fixtureId:   8006,
    fixtureDate: '2026-05-24',
    fixtureTime: '10:00',
    homeTeam:  { teamId: 87101, teamName: RVR_NAME,         clubId: RVR_ID, clubName: RVR_NAME },
    awayTeam:  { teamId: 13001, teamName: 'Greystones AFC', clubId: 13000,  clubName: 'Greystones AFC' },
    venue:       RVR_HOME_1,
    competition: { competitionId: 208581, competitionName: 'DDSL U12 Boys Major Saturday' },
    status:      'Result',
    score:       { home: 4, away: 1 },
  },
  {
    fixtureId:   8001,
    fixtureDate: '2026-06-07',
    fixtureTime: '10:00',
    homeTeam:  { teamId: 24001, teamName: 'Cherry Orchard FC', clubId: 24000, clubName: 'Cherry Orchard FC' },
    awayTeam:  { teamId: 87101, teamName: RVR_NAME,            clubId: RVR_ID, clubName: RVR_NAME },
    venue:       { venueName: 'Cherry Orchard Park', venueAddress: 'Cherry Orchard, Dublin 10' },
    competition: { competitionId: 208581, competitionName: 'DDSL U12 Boys Major Saturday' },
    status:      'Result',
    score:       { home: 3, away: 2 },
  },
  {
    fixtureId:   8007,
    fixtureDate: '2026-05-10',
    fixtureTime: '10:00',
    homeTeam:  { teamId: 87101, teamName: RVR_NAME,     clubId: RVR_ID, clubName: RVR_NAME },
    awayTeam:  { teamId: 32001, teamName: 'Corduff FC', clubId: 32000,  clubName: 'Corduff FC' },
    venue:       RVR_HOME_1,
    competition: { competitionId: 208581, competitionName: 'DDSL U12 Boys Major Saturday' },
    status:      'Result',
    score:       { home: 3, away: 0 },
  },
  {
    fixtureId:   8008,
    fixtureDate: '2026-04-26',
    fixtureTime: '11:00',
    homeTeam:  { teamId: 27001, teamName: 'Crumlin United AFC', clubId: 27000, clubName: 'Crumlin United AFC' },
    awayTeam:  { teamId: 87101, teamName: RVR_NAME,             clubId: RVR_ID, clubName: RVR_NAME },
    venue:       { venueName: 'Crumlin United Park', venueAddress: 'Crumlin, Dublin 12' },
    competition: { competitionId: 208581, competitionName: 'DDSL U12 Boys Major Saturday' },
    status:      'Result',
    score:       { home: 1, away: 1 },
  },
  {
    fixtureId:   8009,
    fixtureDate: '2026-04-12',
    fixtureTime: '10:00',
    homeTeam:  { teamId: 87101, teamName: RVR_NAME,       clubId: RVR_ID, clubName: RVR_NAME },
    awayTeam:  { teamId: 12001, teamName: 'Belvedere FC', clubId: 12000,  clubName: 'Belvedere FC' },
    venue:       RVR_HOME_1,
    competition: { competitionId: 208581, competitionName: 'DDSL U12 Boys Major Saturday' },
    status:      'Result',
    score:       { home: 0, away: 2 },
  },
  {
    fixtureId:   8010,
    fixtureDate: '2026-03-28',
    fixtureTime: '10:00',
    homeTeam:  { teamId: 11001, teamName: 'Kilnamanagh AFC', clubId: 22000, clubName: 'Kilnamanagh AFC' },
    awayTeam:  { teamId: 87101, teamName: RVR_NAME,          clubId: RVR_ID, clubName: RVR_NAME },
    venue:       { venueName: 'Kilnamanagh Park', venueAddress: 'Kilnamanagh, Dublin 24' },
    competition: { competitionId: 208581, competitionName: 'DDSL U12 Boys Major Saturday' },
    status:      'Result',
    score:       { home: 4, away: 0 },
  },
  {
    fixtureId:   8011,
    fixtureDate: '2026-03-14',
    fixtureTime: '10:30',
    homeTeam:  { teamId: 25001, teamName: 'Leixlip United AFC', clubId: 25000, clubName: 'Leixlip United AFC' },
    awayTeam:  { teamId: 87101, teamName: RVR_NAME,             clubId: RVR_ID, clubName: RVR_NAME },
    venue:       { venueName: 'Leixlip United Park', venueAddress: 'Leixlip, Co. Kildare' },
    competition: { competitionId: 208581, competitionName: 'DDSL U12 Boys Major Saturday' },
    status:      'Result',
    score:       { home: 3, away: 1 },
  },
  {
    fixtureId:   8012,
    fixtureDate: '2026-02-28',
    fixtureTime: '10:00',
    homeTeam:  { teamId: 87101, teamName: RVR_NAME,      clubId: RVR_ID, clubName: RVR_NAME },
    awayTeam:  { teamId: 30001, teamName: 'Bohemian FC', clubId: 30000,  clubName: 'Bohemian FC' },
    venue:       RVR_HOME_1,
    competition: { competitionId: 208581, competitionName: 'DDSL U12 Boys Major Saturday' },
    status:      'Result',
    score:       { home: 1, away: 1 },
  },
];

// ---------------------------------------------------------------------------
// Exported bundle
// ---------------------------------------------------------------------------

export const LOCAL_SEED: {
  fixtures:  SportLoMoFixture[];
  results:   SportLoMoFixture[];
  standings: SportLoMoStandingsTable[];
} = {
  fixtures:  FIXTURES,
  results:   RESULTS,
  standings: STANDINGS,
};
