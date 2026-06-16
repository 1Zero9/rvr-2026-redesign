/**
 * Local DDSL seed data — authoritative baseline for RVR fixture schedules and
 * league standings while the public SportLoMo feed is pending verification.
 *
 * Data is shaped as raw SportLoMo API types so it flows through the full
 * transform pipeline (mercy rule, venue resolution, division integrity filter,
 * age-gate) unchanged.
 *
 * U12 Boys Major Saturday: complete 2025/26 double round-robin season,
 * 14 clubs, 26 games played each. Standings are mathematically consistent:
 *   Sum(W) = Sum(L) = 155, Sum(D) = 54, Sum(GF) = Sum(GA) = 634, Sum(GD) = 0
 *
 * To re-enable live API fetching set USE_LOCAL_SEED = false in
 * app/api/fixtures/sync/route.ts.
 */

import type { SportLoMoFixture, SportLoMoStandingsTable } from './types';

const SEASON     = '2025/26';
const RVR_ID     = 87086;
const RVR_NAME   = 'Rivervalley Rangers AFC';
const RVR_HOME_1 = {
  venueId:      1001,
  venueName:    'Rivervalley Astro Pitch',
  venueAddress: 'Rivervalley Road, Swords, Co. Dublin',
};

// ---------------------------------------------------------------------------
// Standings — competitive divisions (U12+)
// ---------------------------------------------------------------------------

const STANDINGS: SportLoMoStandingsTable[] = [

  // --------------------------------------------------------------------------
  // U12 Boys Major Saturday (ID 208581) — complete 2025/26 season, 14 clubs
  //
  // All 14 members are registered in config/ddsl-competitions.ts knownMembers.
  // The division integrity filter matches by competition ID (208581), not name,
  // so the name change from "…Division 1" to the official short form is safe.
  // Mercy Rule applies (U12).
  // --------------------------------------------------------------------------
  {
    competitionId:   208581,
    competitionName: 'DDSL U12 Boys Major Saturday',
    season:          SEASON,
    standings: [
      { position:  1, team: { teamId: 11001, teamName: 'Kilnamanagh AFC',         clubId: 22000 }, played: 26, won: 21, drawn: 2, lost:  3, goalsFor: 72, goalsAgainst: 30, goalDifference:  42, points: 65 },
      { position:  2, team: { teamId: 23001, teamName: 'Home Farm FC',            clubId: 23000 }, played: 26, won: 19, drawn: 3, lost:  4, goalsFor: 70, goalsAgainst: 34, goalDifference:  36, points: 60 },
      { position:  3, team: { teamId: 24001, teamName: 'Cherry Orchard FC',       clubId: 24000 }, played: 26, won: 17, drawn: 3, lost:  6, goalsFor: 66, goalsAgainst: 38, goalDifference:  28, points: 54 },
      { position:  4, team: { teamId: 87101, teamName: RVR_NAME,                  clubId: RVR_ID }, played: 26, won: 15, drawn: 4, lost:  7, goalsFor: 60, goalsAgainst: 38, goalDifference:  22, points: 49 },
      { position:  5, team: { teamId: 25001, teamName: 'Leixlip United AFC',      clubId: 25000 }, played: 26, won: 14, drawn: 3, lost:  9, goalsFor: 54, goalsAgainst: 40, goalDifference:  14, points: 45 },
      { position:  6, team: { teamId: 26001, teamName: 'Beechwood SC',            clubId: 26000 }, played: 26, won: 13, drawn: 3, lost: 10, goalsFor: 48, goalsAgainst: 42, goalDifference:   6, points: 42 },
      { position:  7, team: { teamId: 27001, teamName: 'Crumlin United AFC',      clubId: 27000 }, played: 26, won: 11, drawn: 5, lost: 10, goalsFor: 46, goalsAgainst: 44, goalDifference:   2, points: 38 },
      { position:  8, team: { teamId: 28001, teamName: 'St Francis FC',           clubId: 28000 }, played: 26, won: 10, drawn: 5, lost: 11, goalsFor: 42, goalsAgainst: 46, goalDifference:  -4, points: 35 },
      { position:  9, team: { teamId: 12001, teamName: 'Belvedere FC',            clubId: 12000 }, played: 26, won:  9, drawn: 4, lost: 13, goalsFor: 38, goalsAgainst: 50, goalDifference: -12, points: 31 },
      { position: 10, team: { teamId: 29001, teamName: 'Leicester Celtic FC',     clubId: 29000 }, played: 26, won:  8, drawn: 4, lost: 14, goalsFor: 34, goalsAgainst: 52, goalDifference: -18, points: 28 },
      { position: 11, team: { teamId: 30001, teamName: 'Bohemian FC',             clubId: 30000 }, played: 26, won:  7, drawn: 5, lost: 14, goalsFor: 30, goalsAgainst: 54, goalDifference: -24, points: 26 },
      { position: 12, team: { teamId: 31001, teamName: 'Ballyoulster United FC',  clubId: 31000 }, played: 26, won:  5, drawn: 5, lost: 16, goalsFor: 26, goalsAgainst: 56, goalDifference: -30, points: 20 },
      { position: 13, team: { teamId: 32001, teamName: 'Corduff FC',              clubId: 32000 }, played: 26, won:  4, drawn: 3, lost: 19, goalsFor: 22, goalsAgainst: 60, goalDifference: -38, points: 15 },
      { position: 14, team: { teamId: 13001, teamName: 'Greystones AFC',          clubId: 13000 }, played: 26, won:  2, drawn: 5, lost: 19, goalsFor: 26, goalsAgainst: 50, goalDifference: -24, points: 11 },
    ],
  },

  // --------------------------------------------------------------------------
  // U14 Boys Division 1 (ID 208582) — season in progress
  // --------------------------------------------------------------------------
  {
    competitionId:   208582,
    competitionName: 'DDSL U14 Boys Division 1',
    season:          SEASON,
    standings: [
      { position: 1, team: { teamId: 15001, teamName: 'Swords Celtic AFC',             clubId: 15000 }, played: 8, won: 7, drawn: 0, lost: 1, goalsFor: 26, goalsAgainst:  9, goalDifference:  17, points: 21 },
      { position: 2, team: { teamId: 87102, teamName: RVR_NAME,                        clubId: RVR_ID }, played: 8, won: 6, drawn: 1, lost: 1, goalsFor: 22, goalsAgainst: 10, goalDifference:  12, points: 19 },
      { position: 3, team: { teamId: 14001, teamName: 'Malahide United AFC',           clubId: 14000 }, played: 8, won: 4, drawn: 2, lost: 2, goalsFor: 18, goalsAgainst: 14, goalDifference:   4, points: 14 },
      { position: 4, team: { teamId: 16001, teamName: "St Kevin's Boys AFC",           clubId: 16000 }, played: 8, won: 3, drawn: 1, lost: 4, goalsFor: 13, goalsAgainst: 16, goalDifference:  -3, points: 10 },
      { position: 5, team: { teamId: 17001, teamName: 'Donabate Portside United FC',   clubId: 17000 }, played: 8, won: 2, drawn: 0, lost: 6, goalsFor:  9, goalsAgainst: 23, goalDifference: -14, points:  6 },
      { position: 6, team: { teamId: 18001, teamName: 'Portmarnock AFC',               clubId: 18000 }, played: 8, won: 0, drawn: 0, lost: 8, goalsFor:  5, goalsAgainst: 21, goalDifference: -16, points:  0 },
    ],
  },

  // --------------------------------------------------------------------------
  // U12 Girls Division 1 (ID 208583) — Magenta accent (#EC4899)
  // Mercy Rule applies (U12).
  // --------------------------------------------------------------------------
  {
    competitionId:   208583,
    competitionName: 'DDSL U12 Girls Division 1',
    season:          SEASON,
    standings: [
      { position: 1, team: { teamId: 19001, teamName: 'Shelbourne FC',                clubId: 19000 }, played: 8, won: 7, drawn: 0, lost: 1, goalsFor: 24, goalsAgainst:  8, goalDifference:  16, points: 21 },
      { position: 2, team: { teamId: 87103, teamName: RVR_NAME,                       clubId: RVR_ID }, played: 8, won: 6, drawn: 0, lost: 2, goalsFor: 22, goalsAgainst: 11, goalDifference:  11, points: 18 },
      { position: 3, team: { teamId: 20001, teamName: 'Raheny United AFC',            clubId: 20000 }, played: 8, won: 4, drawn: 2, lost: 2, goalsFor: 18, goalsAgainst: 13, goalDifference:   5, points: 14 },
      { position: 4, team: { teamId: 14002, teamName: 'Malahide United AFC',          clubId: 14000 }, played: 8, won: 3, drawn: 2, lost: 3, goalsFor: 14, goalsAgainst: 16, goalDifference:  -2, points: 11 },
      { position: 5, team: { teamId: 21001, teamName: "St Joseph's Boys AFC",         clubId: 21000 }, played: 8, won: 1, drawn: 2, lost: 5, goalsFor:  9, goalsAgainst: 22, goalDifference: -13, points:  5 },
      { position: 6, team: { teamId: 17002, teamName: 'Donabate Portside United FC',  clubId: 17000 }, played: 8, won: 0, drawn: 2, lost: 6, goalsFor:  6, goalsAgainst: 23, goalDifference: -17, points:  2 },
    ],
  },

  // --------------------------------------------------------------------------
  // U14 Girls Division 1 (ID 208584) — Magenta accent (#EC4899)
  // --------------------------------------------------------------------------
  {
    competitionId:   208584,
    competitionName: 'DDSL U14 Girls Division 1',
    season:          SEASON,
    standings: [
      { position: 1, team: { teamId: 20002, teamName: 'Raheny United AFC',            clubId: 20000 }, played: 8, won: 7, drawn: 1, lost: 0, goalsFor: 26, goalsAgainst:  7, goalDifference:  19, points: 22 },
      { position: 2, team: { teamId: 87104, teamName: RVR_NAME,                       clubId: RVR_ID }, played: 8, won: 6, drawn: 1, lost: 1, goalsFor: 22, goalsAgainst: 10, goalDifference:  12, points: 19 },
      { position: 3, team: { teamId: 19002, teamName: 'Shelbourne FC',                clubId: 19000 }, played: 8, won: 4, drawn: 1, lost: 3, goalsFor: 16, goalsAgainst: 14, goalDifference:   2, points: 13 },
      { position: 4, team: { teamId: 15002, teamName: 'Swords Celtic AFC',            clubId: 15000 }, played: 8, won: 2, drawn: 1, lost: 5, goalsFor: 11, goalsAgainst: 21, goalDifference: -10, points:  7 },
      { position: 5, team: { teamId: 18002, teamName: 'Portmarnock AFC',              clubId: 18000 }, played: 8, won: 0, drawn: 0, lost: 8, goalsFor:  4, goalsAgainst: 27, goalDifference: -23, points:  0 },
    ],
  },

  // --------------------------------------------------------------------------
  // U16 Boys Division 1 (ID 208585) — Electric Blue accent (#38BDF8)
  // --------------------------------------------------------------------------
  {
    competitionId:   208585,
    competitionName: 'DDSL U16 Boys Division 1',
    season:          SEASON,
    standings: [
      { position: 1, team: { teamId: 14003, teamName: 'Malahide United AFC',          clubId: 14000 }, played: 10, won: 9, drawn: 1, lost:  0, goalsFor: 34, goalsAgainst: 10, goalDifference:  24, points: 28 },
      { position: 2, team: { teamId: 87105, teamName: RVR_NAME,                       clubId: RVR_ID }, played: 10, won: 7, drawn: 2, lost:  1, goalsFor: 26, goalsAgainst: 12, goalDifference:  14, points: 23 },
      { position: 3, team: { teamId: 16002, teamName: "St Kevin's Boys AFC",          clubId: 16000 }, played: 10, won: 6, drawn: 1, lost:  3, goalsFor: 22, goalsAgainst: 16, goalDifference:   6, points: 19 },
      { position: 4, team: { teamId: 15003, teamName: 'Swords Celtic AFC',            clubId: 15000 }, played: 10, won: 4, drawn: 1, lost:  5, goalsFor: 16, goalsAgainst: 22, goalDifference:  -6, points: 13 },
      { position: 5, team: { teamId: 17003, teamName: 'Donabate Portside United FC',  clubId: 17000 }, played: 10, won: 2, drawn: 1, lost:  7, goalsFor: 11, goalsAgainst: 28, goalDifference: -17, points:  7 },
      { position: 6, team: { teamId: 18003, teamName: 'Portmarnock AFC',              clubId: 18000 }, played: 10, won: 0, drawn: 2, lost:  8, goalsFor:  8, goalsAgainst: 29, goalDifference: -21, points:  2 },
    ],
  },

  // --------------------------------------------------------------------------
  // U10 Boys Saturday Blitz (ID 208586) — development tier
  // Age-gate strips standings; only upcoming fixture dates surface.
  // --------------------------------------------------------------------------
  {
    competitionId:   208586,
    competitionName: 'DDSL U10 Boys Saturday Blitz',
    season:          SEASON,
    standings: [
      { position: 1, team: { teamId: 87106, teamName: RVR_NAME, clubId: RVR_ID }, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
    ],
  },

  // --------------------------------------------------------------------------
  // U9 Girls Saturday Blitz (ID 208587) — development tier
  // --------------------------------------------------------------------------
  {
    competitionId:   208587,
    competitionName: 'DDSL U9 Girls Saturday Blitz',
    season:          SEASON,
    standings: [
      { position: 1, team: { teamId: 87107, teamName: RVR_NAME, clubId: RVR_ID }, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Upcoming fixtures (status: 'Fixture')
// U12 Boys Major Saturday is a complete season (P26) — no upcoming fixtures.
// ---------------------------------------------------------------------------

const FIXTURES: SportLoMoFixture[] = [
  // U14 Boys — Away at Swords Celtic
  {
    fixtureId:   9002,
    fixtureDate: '2026-06-21',
    fixtureTime: '11:00',
    homeTeam:  { teamId: 15001, teamName: 'Swords Celtic AFC',  clubId: 15000, clubName: 'Swords Celtic AFC' },
    awayTeam:  { teamId: 87102, teamName: RVR_NAME,             clubId: RVR_ID, clubName: RVR_NAME },
    venue:       { venueName: 'Swords Celtic Park', venueAddress: 'Swords Celtic AFC, Swords, Co. Dublin' },
    competition: { competitionId: 208582, competitionName: 'DDSL U14 Boys Division 1' },
    status:      'Fixture',
  },

  // U12 Girls — RVR vs Raheny United (HOME)
  {
    fixtureId:   9003,
    fixtureDate: '2026-06-28',
    fixtureTime: '10:30',
    homeTeam:  { teamId: 87103, teamName: RVR_NAME,              clubId: RVR_ID, clubName: RVR_NAME },
    awayTeam:  { teamId: 20001, teamName: 'Raheny United AFC',   clubId: 20000,  clubName: 'Raheny United AFC' },
    venue:       RVR_HOME_1,
    competition: { competitionId: 208583, competitionName: 'DDSL U12 Girls Division 1' },
    status:      'Fixture',
  },

  // U14 Girls — RVR vs Shelbourne (HOME)
  {
    fixtureId:   9004,
    fixtureDate: '2026-06-28',
    fixtureTime: '12:00',
    homeTeam:  { teamId: 87104, teamName: RVR_NAME,         clubId: RVR_ID, clubName: RVR_NAME },
    awayTeam:  { teamId: 19001, teamName: 'Shelbourne FC',  clubId: 19000,  clubName: 'Shelbourne FC' },
    venue:       RVR_HOME_1,
    competition: { competitionId: 208584, competitionName: 'DDSL U14 Girls Division 1' },
    status:      'Fixture',
  },

  // U16 Boys — RVR vs Malahide United (HOME)
  {
    fixtureId:   9005,
    fixtureDate: '2026-07-05',
    fixtureTime: '11:00',
    homeTeam:  { teamId: 87105, teamName: RVR_NAME,              clubId: RVR_ID, clubName: RVR_NAME },
    awayTeam:  { teamId: 14003, teamName: 'Malahide United AFC', clubId: 14000,  clubName: 'Malahide United AFC' },
    venue:       RVR_HOME_1,
    competition: { competitionId: 208585, competitionName: 'DDSL U16 Boys Division 1' },
    status:      'Fixture',
  },

  // U10 Boys Blitz — development (date surfaced only, score never published)
  {
    fixtureId:   9006,
    fixtureDate: '2026-06-21',
    homeTeam:  { teamId: 87106, teamName: RVR_NAME,              clubId: RVR_ID, clubName: RVR_NAME },
    awayTeam:  { teamId: 14004, teamName: 'Malahide United AFC', clubId: 14000,  clubName: 'Malahide United AFC' },
    venue:       RVR_HOME_1,
    competition: { competitionId: 208586, competitionName: 'DDSL U10 Boys Saturday Blitz' },
    status:      'Fixture',
  },

  // U10 Boys Blitz — second upcoming date (away)
  {
    fixtureId:   9007,
    fixtureDate: '2026-07-05',
    homeTeam:  { teamId: 15004, teamName: 'Swords Celtic AFC', clubId: 15000, clubName: 'Swords Celtic AFC' },
    awayTeam:  { teamId: 87106, teamName: RVR_NAME,            clubId: RVR_ID, clubName: RVR_NAME },
    venue:       { venueName: 'Swords Celtic Park', venueAddress: 'Swords Celtic AFC, Swords, Co. Dublin' },
    competition: { competitionId: 208586, competitionName: 'DDSL U10 Boys Saturday Blitz' },
    status:      'Fixture',
  },

  // U9 Girls Blitz — development (HOME)
  {
    fixtureId:   9008,
    fixtureDate: '2026-06-28',
    homeTeam:  { teamId: 87107, teamName: RVR_NAME,        clubId: RVR_ID, clubName: RVR_NAME },
    awayTeam:  { teamId: 19003, teamName: 'Shelbourne FC', clubId: 19000,  clubName: 'Shelbourne FC' },
    venue:       RVR_HOME_1,
    competition: { competitionId: 208587, competitionName: 'DDSL U9 Girls Saturday Blitz' },
    status:      'Fixture',
  },

  // U9 Girls Blitz — second upcoming date (away)
  {
    fixtureId:   9009,
    fixtureDate: '2026-07-12',
    homeTeam:  { teamId: 20003, teamName: 'Raheny United AFC', clubId: 20000, clubName: 'Raheny United AFC' },
    awayTeam:  { teamId: 87107, teamName: RVR_NAME,            clubId: RVR_ID, clubName: RVR_NAME },
    venue:       { venueName: 'Raheny United Park', venueAddress: 'Raheny, Dublin 5' },
    competition: { competitionId: 208587, competitionName: 'DDSL U9 Girls Saturday Blitz' },
    status:      'Fixture',
  },
];

// ---------------------------------------------------------------------------
// Results — completed matches (status: 'Result')
// U12 Boys Major Saturday: sampled from the complete 26-game season.
// All U12 scores are within the mercy-rule cap of 5; no capping occurs.
// ---------------------------------------------------------------------------

const RESULTS: SportLoMoFixture[] = [

  // -- U12 Boys Major Saturday (completed season sample) --------------------

  // Home win vs Greystones — margin 3, no mercy cap
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

  // Away loss at Cherry Orchard
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

  // Home win vs Corduff
  {
    fixtureId:   8007,
    fixtureDate: '2026-05-10',
    fixtureTime: '10:00',
    homeTeam:  { teamId: 87101, teamName: RVR_NAME,      clubId: RVR_ID, clubName: RVR_NAME },
    awayTeam:  { teamId: 32001, teamName: 'Corduff FC',  clubId: 32000,  clubName: 'Corduff FC' },
    venue:       RVR_HOME_1,
    competition: { competitionId: 208581, competitionName: 'DDSL U12 Boys Major Saturday' },
    status:      'Result',
    score:       { home: 3, away: 0 },
  },

  // Away draw vs Crumlin United
  {
    fixtureId:   8008,
    fixtureDate: '2026-04-26',
    fixtureTime: '11:00',
    homeTeam:  { teamId: 27001, teamName: 'Crumlin United AFC', clubId: 27000, clubName: 'Crumlin United AFC' },
    awayTeam:  { teamId: 87101, teamName: RVR_NAME,             clubId: RVR_ID, clubName: RVR_NAME },
    venue:       { venueName: 'Crumlin United Park', venueAddress: 'Crumlin, Dublin 12' },
    competition: { competitionId: 208581, competitionName: 'DDSL U12 Boys Major Saturday' },
    status:      'Result',
    score:       { home: 2, away: 2 },
  },

  // Home win vs Ballyoulster United
  {
    fixtureId:   8009,
    fixtureDate: '2026-04-12',
    fixtureTime: '10:00',
    homeTeam:  { teamId: 87101, teamName: RVR_NAME,                  clubId: RVR_ID, clubName: RVR_NAME },
    awayTeam:  { teamId: 31001, teamName: 'Ballyoulster United FC',  clubId: 31000,  clubName: 'Ballyoulster United FC' },
    venue:       RVR_HOME_1,
    competition: { competitionId: 208581, competitionName: 'DDSL U12 Boys Major Saturday' },
    status:      'Result',
    score:       { home: 4, away: 0 },
  },

  // Away win vs Leicester Celtic
  {
    fixtureId:   8010,
    fixtureDate: '2026-03-28',
    fixtureTime: '10:30',
    homeTeam:  { teamId: 29001, teamName: 'Leicester Celtic FC', clubId: 29000, clubName: 'Leicester Celtic FC' },
    awayTeam:  { teamId: 87101, teamName: RVR_NAME,              clubId: RVR_ID, clubName: RVR_NAME },
    venue:       { venueName: 'Leicester Celtic Park', venueAddress: 'Clondalkin, Dublin 22' },
    competition: { competitionId: 208581, competitionName: 'DDSL U12 Boys Major Saturday' },
    status:      'Result',
    score:       { home: 1, away: 3 },
  },

  // Away loss vs Kilnamanagh (league leaders)
  {
    fixtureId:   8011,
    fixtureDate: '2026-03-14',
    fixtureTime: '10:00',
    homeTeam:  { teamId: 11001, teamName: 'Kilnamanagh AFC', clubId: 22000, clubName: 'Kilnamanagh AFC' },
    awayTeam:  { teamId: 87101, teamName: RVR_NAME,          clubId: RVR_ID, clubName: RVR_NAME },
    venue:       { venueName: 'Kilnamanagh Park', venueAddress: 'Kilnamanagh, Dublin 24' },
    competition: { competitionId: 208581, competitionName: 'DDSL U12 Boys Major Saturday' },
    status:      'Result',
    score:       { home: 3, away: 1 },
  },

  // Home draw vs Leixlip United
  {
    fixtureId:   8012,
    fixtureDate: '2026-02-28',
    fixtureTime: '10:00',
    homeTeam:  { teamId: 87101, teamName: RVR_NAME,              clubId: RVR_ID, clubName: RVR_NAME },
    awayTeam:  { teamId: 25001, teamName: 'Leixlip United AFC',  clubId: 25000,  clubName: 'Leixlip United AFC' },
    venue:       RVR_HOME_1,
    competition: { competitionId: 208581, competitionName: 'DDSL U12 Boys Major Saturday' },
    status:      'Result',
    score:       { home: 2, away: 2 },
  },

  // -- Other active divisions -----------------------------------------------

  // U14 Boys — Home win vs St Kevin's Boys
  {
    fixtureId:   8002,
    fixtureDate: '2026-06-07',
    fixtureTime: '11:00',
    homeTeam:  { teamId: 87102, teamName: RVR_NAME,               clubId: RVR_ID, clubName: RVR_NAME },
    awayTeam:  { teamId: 16001, teamName: "St Kevin's Boys AFC",  clubId: 16000,  clubName: "St Kevin's Boys AFC" },
    venue:       RVR_HOME_1,
    competition: { competitionId: 208582, competitionName: 'DDSL U14 Boys Division 1' },
    status:      'Result',
    score:       { home: 3, away: 1 },
  },

  // U14 Boys — Away draw vs Malahide United
  {
    fixtureId:   8013,
    fixtureDate: '2026-05-24',
    fixtureTime: '11:00',
    homeTeam:  { teamId: 14001, teamName: 'Malahide United AFC', clubId: 14000, clubName: 'Malahide United AFC' },
    awayTeam:  { teamId: 87102, teamName: RVR_NAME,              clubId: RVR_ID, clubName: RVR_NAME },
    venue:       { venueName: 'Malahide United Park', venueAddress: 'Malahide, Co. Dublin' },
    competition: { competitionId: 208582, competitionName: 'DDSL U14 Boys Division 1' },
    status:      'Result',
    score:       { home: 1, away: 1 },
  },

  // U12 Girls — Away draw vs Shelbourne
  {
    fixtureId:   8003,
    fixtureDate: '2026-06-07',
    fixtureTime: '10:30',
    homeTeam:  { teamId: 19001, teamName: 'Shelbourne FC', clubId: 19000, clubName: 'Shelbourne FC' },
    awayTeam:  { teamId: 87103, teamName: RVR_NAME,        clubId: RVR_ID, clubName: RVR_NAME },
    venue:       { venueName: 'Tolka Park', venueAddress: 'Richmond Road, Dublin 3' },
    competition: { competitionId: 208583, competitionName: 'DDSL U12 Girls Division 1' },
    status:      'Result',
    score:       { home: 1, away: 1 },
  },

  // U12 Girls — Home win vs Malahide United
  {
    fixtureId:   8014,
    fixtureDate: '2026-05-31',
    fixtureTime: '10:30',
    homeTeam:  { teamId: 87103, teamName: RVR_NAME,              clubId: RVR_ID, clubName: RVR_NAME },
    awayTeam:  { teamId: 14002, teamName: 'Malahide United AFC', clubId: 14000,  clubName: 'Malahide United AFC' },
    venue:       RVR_HOME_1,
    competition: { competitionId: 208583, competitionName: 'DDSL U12 Girls Division 1' },
    status:      'Result',
    score:       { home: 3, away: 1 },
  },

  // U14 Girls — Away loss vs Raheny United
  {
    fixtureId:   8004,
    fixtureDate: '2026-05-31',
    fixtureTime: '12:00',
    homeTeam:  { teamId: 20002, teamName: 'Raheny United AFC', clubId: 20000, clubName: 'Raheny United AFC' },
    awayTeam:  { teamId: 87104, teamName: RVR_NAME,            clubId: RVR_ID, clubName: RVR_NAME },
    venue:       { venueName: 'Raheny United Park', venueAddress: 'Raheny, Dublin 5' },
    competition: { competitionId: 208584, competitionName: 'DDSL U14 Girls Division 1' },
    status:      'Result',
    score:       { home: 2, away: 1 },
  },

  // U14 Girls — Home win vs Swords Celtic
  {
    fixtureId:   8015,
    fixtureDate: '2026-05-17',
    fixtureTime: '12:00',
    homeTeam:  { teamId: 87104, teamName: RVR_NAME,             clubId: RVR_ID, clubName: RVR_NAME },
    awayTeam:  { teamId: 15002, teamName: 'Swords Celtic AFC',  clubId: 15000,  clubName: 'Swords Celtic AFC' },
    venue:       RVR_HOME_1,
    competition: { competitionId: 208584, competitionName: 'DDSL U14 Girls Division 1' },
    status:      'Result',
    score:       { home: 3, away: 0 },
  },

  // U16 Boys — Home win vs Swords Celtic
  {
    fixtureId:   8005,
    fixtureDate: '2026-05-31',
    fixtureTime: '11:00',
    homeTeam:  { teamId: 87105, teamName: RVR_NAME,             clubId: RVR_ID, clubName: RVR_NAME },
    awayTeam:  { teamId: 15003, teamName: 'Swords Celtic AFC',  clubId: 15000,  clubName: 'Swords Celtic AFC' },
    venue:       RVR_HOME_1,
    competition: { competitionId: 208585, competitionName: 'DDSL U16 Boys Division 1' },
    status:      'Result',
    score:       { home: 2, away: 0 },
  },

  // U16 Boys — Away loss vs St Kevin's Boys
  {
    fixtureId:   8016,
    fixtureDate: '2026-05-10',
    fixtureTime: '11:00',
    homeTeam:  { teamId: 16002, teamName: "St Kevin's Boys AFC", clubId: 16000, clubName: "St Kevin's Boys AFC" },
    awayTeam:  { teamId: 87105, teamName: RVR_NAME,              clubId: RVR_ID, clubName: RVR_NAME },
    venue:       { venueName: "St Kevin's Boys Park", venueAddress: 'Whitehall, Dublin 9' },
    competition: { competitionId: 208585, competitionName: 'DDSL U16 Boys Division 1' },
    status:      'Result',
    score:       { home: 2, away: 1 },
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
