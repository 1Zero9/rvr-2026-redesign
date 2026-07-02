/**
 * Local DDSL seed data — fallback for scrape failures and development-tier stubs.
 *
 * U12 Boys Major Saturday (208581): real standings from ddsl.ie/league/208581/
 * verified 17 Jun 2026. Used as fallback if the live scrape fails.
 *
 * Development tier stubs (U8-U11): DDSL does not publish standings for these
 * age groups. Single-row stubs register each competition ID so the sync route
 * can categorise them as development, surface upcoming fixture dates from the
 * live AJAX response, and display them correctly without a standings table.
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
// Standings
// ---------------------------------------------------------------------------

const stub = (competitionId: number, competitionName: string, teamId: number): SportLoMoStandingsTable => ({
  competitionId,
  competitionName,
  season: SEASON,
  standings: [
    { position: 1, team: { teamId, teamName: RVR_NAME_SHORT, clubId: RVR_ID }, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
  ],
});

const STANDINGS: SportLoMoStandingsTable[] = [

  // ── U7 internal festival registration stub ──────────────────────────────
  stub(0, 'DDSL U7 Boys Development', 87109),

  // ── U12 Boys Major Saturday — real 2025/26 season standings ────────────
  // Source: ddsl.ie/league/208581/ scraped 17 Jun 2026.
  // GF/GA/GD = 0 (DDSL public page does not publish goal data).
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

  // ── U8 development stubs ─────────────────────────────────────────────────
  stub(208624, 'DDSL U8 Boys Sunday Division 6',  87110),
  stub(209250, 'DDSL U8 Boys Sunday Division 9',  87111),
  stub(209376, 'DDSL U8 Girls Sunday Division 3', 87112),

  // ── U9 development stubs ─────────────────────────────────────────────────
  stub(209261, 'DDSL U9 Boys Sunday Division 7',  87113),
  stub(209267, 'DDSL U9 Boys Sunday Division 11', 87114),
  stub(209336, 'DDSL U9 Girls Sunday Division 3', 87115),

  // ── U10 development stubs ────────────────────────────────────────────────
  stub(209292, 'DDSL U10 Boys Sunday Division 4',  87116),
  stub(209297, 'DDSL U10 Boys Sunday Division 8',  87117),
  stub(209299, 'DDSL U10 Boys Sunday Division 10', 87118),
  stub(209303, 'DDSL U10 Boys Sunday Division 13', 87119),
  stub(209347, 'DDSL U10 Girls Sunday Division 8', 87120),

  // ── U11 development stubs ────────────────────────────────────────────────
  stub(208986, 'DDSL U11 Boys Sunday Division 2', 87121),
  stub(208993, 'DDSL U11 Boys Sunday Division 9', 87122),
];

// ---------------------------------------------------------------------------
// Fixtures — empty; live AJAX supplies upcoming matches
// ---------------------------------------------------------------------------

const FIXTURES: SportLoMoFixture[] = [];

// ---------------------------------------------------------------------------
// Results — U12 Boys Major Saturday sample (season complete, no AJAX data)
// ---------------------------------------------------------------------------

const RESULTS: SportLoMoFixture[] = [
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
