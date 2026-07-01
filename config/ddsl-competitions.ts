/**
 * Hard-locked DDSL competition registry — all RVR teams, 2025/26 season.
 *
 * IDs confirmed by scanning ddsl.ie/league/{id}/ and cross-referencing
 * with the DDSL tables page team membership (17 Jun 2026).
 *
 * Entries without `knownMembers` pass through the division filter unchanged.
 * Only add knownMembers where you have verified the complete team list from
 * the DDSL admin panel or public standings page.
 */

export interface KnownDivision {
  /** Official SportLoMo numeric competition identifier. */
  sportlomoId: number;
  /** Short label shown in the DDSL administration system. */
  officialName: string;
  /** Canonical competition name used throughout the RVR platform. */
  competitionName: string;
  /** DDSL age group string, e.g. "U12". */
  ageGroup: string;
  /** URL-safe slug used for /teams/[slug] routing. */
  slug: string;
  /**
   * Complete roster of team names permitted in this division.
   * When set, any row not on this list is stripped by the division filter.
   * Leave undefined to disable filtering.
   */
  knownMembers?: string[];
  /** Public DDSL league page URL. The sync route scrapes live standings here. */
  leagueUrl?: string;
}

export const KNOWN_DIVISIONS: KnownDivision[] = [

  // ── U7 (internal/festival — no DDSL ID confirmed yet) ──────────────────
  { sportlomoId: 0, officialName: 'U7 Boys', competitionName: 'DDSL U7 Boys Development', ageGroup: 'U7', slug: 'u7-boys' },

  // ── U8 (development — no standings published) ───────────────────────────
  { sportlomoId: 208624, officialName: '8.6 Boys Sun',  competitionName: 'DDSL U8 Boys Sunday Division 6',  ageGroup: 'U8',  slug: 'u8-boys-sunday-division-6',  leagueUrl: 'https://ddsl.ie/league/208624/' },
  { sportlomoId: 209250, officialName: '8.9 Boys Sun',  competitionName: 'DDSL U8 Boys Sunday Division 9',  ageGroup: 'U8',  slug: 'u8-boys-sunday-division-9',  leagueUrl: 'https://ddsl.ie/league/209250/' },
  { sportlomoId: 209376, officialName: '8.3 Girls Sun', competitionName: 'DDSL U8 Girls Sunday Division 3', ageGroup: 'U8',  slug: 'u8-girls-sunday-division-3', leagueUrl: 'https://ddsl.ie/league/209376/' },

  // ── U9 (development) ─────────────────────────────────────────────────────
  { sportlomoId: 209261, officialName: '9.7 Boys Sun',  competitionName: 'DDSL U9 Boys Sunday Division 7',  ageGroup: 'U9',  slug: 'u9-boys-sunday-division-7',  leagueUrl: 'https://ddsl.ie/league/209261/' },
  { sportlomoId: 209267, officialName: '9.11 Boys Sun', competitionName: 'DDSL U9 Boys Sunday Division 11', ageGroup: 'U9',  slug: 'u9-boys-sunday-division-11', leagueUrl: 'https://ddsl.ie/league/209267/' },
  { sportlomoId: 209336, officialName: '9.3 Girls Sun', competitionName: 'DDSL U9 Girls Sunday Division 3', ageGroup: 'U9',  slug: 'u9-girls-sunday-division-3', leagueUrl: 'https://ddsl.ie/league/209336/' },

  // ── U10 (development) ────────────────────────────────────────────────────
  { sportlomoId: 209292, officialName: '10.4 Boys Sun',  competitionName: 'DDSL U10 Boys Sunday Division 4',  ageGroup: 'U10', slug: 'u10-boys-sunday-division-4',  leagueUrl: 'https://ddsl.ie/league/209292/' },
  { sportlomoId: 209297, officialName: '10.8 Boys Sun',  competitionName: 'DDSL U10 Boys Sunday Division 8',  ageGroup: 'U10', slug: 'u10-boys-sunday-division-8',  leagueUrl: 'https://ddsl.ie/league/209297/' },
  { sportlomoId: 209299, officialName: '10.10 Boys Sun', competitionName: 'DDSL U10 Boys Sunday Division 10', ageGroup: 'U10', slug: 'u10-boys-sunday-division-10', leagueUrl: 'https://ddsl.ie/league/209299/' },
  { sportlomoId: 209303, officialName: '10.13 Boys Sun', competitionName: 'DDSL U10 Boys Sunday Division 13', ageGroup: 'U10', slug: 'u10-boys-sunday-division-13', leagueUrl: 'https://ddsl.ie/league/209303/' },
  { sportlomoId: 209347, officialName: '10.8 Girls Sun', competitionName: 'DDSL U10 Girls Sunday Division 8', ageGroup: 'U10', slug: 'u10-girls-sunday-division-8', leagueUrl: 'https://ddsl.ie/league/209347/' },

  // ── U11 (development) ────────────────────────────────────────────────────
  { sportlomoId: 208986, officialName: '11.2 Boys Sun', competitionName: 'DDSL U11 Boys Sunday Division 2', ageGroup: 'U11', slug: 'u11-boys-sunday-division-2', leagueUrl: 'https://ddsl.ie/league/208986/' },
  { sportlomoId: 208993, officialName: '11.9 Boys Sun', competitionName: 'DDSL U11 Boys Sunday Division 9', ageGroup: 'U11', slug: 'u11-boys-sunday-division-9', leagueUrl: 'https://ddsl.ie/league/208993/' },

  // ── U12 (competitive — mercy rule applies) ───────────────────────────────
  {
    sportlomoId: 208581,
    officialName: '12 MAJOR BOYS SAT',
    competitionName: 'DDSL U12 Boys Major Saturday',
    ageGroup: 'U12',
    slug: 'u12-boys-major-saturday',
    leagueUrl: 'https://ddsl.ie/league/208581/',
    // Team names verified against ddsl.ie/league/208581/ (17 Jun 2026).
    knownMembers: [
      'Rivervalley Rangers',
      'River Valley Rangers',
      'River Valley Rangers FC',
      'Cherry Orchard FC',
      'Kilnamanagh AFC',
      'Greystones United AFC',
      'Belvedere FC',
      'Leixlip United AFC',
      'Beechwood FC',
      'St Francis FC',
      'Corduff FC',
      'Home Farm FC',
      'Leicester Celtic FC',
      'Ballyoulster United FC',
      'Crumlin United FC',
      'Bohemian FC',
    ],
  },
  { sportlomoId: 208714, officialName: '12.8 Boys Sat',  competitionName: 'DDSL U12 Boys Saturday Division 8', ageGroup: 'U12', slug: 'u12-boys-saturday-division-8', leagueUrl: 'https://ddsl.ie/league/208714/' },
  { sportlomoId: 208699, officialName: '12.5 Boys Sun',  competitionName: 'DDSL U12 Boys Sunday Division 5',  ageGroup: 'U12', slug: 'u12-boys-sunday-division-5',  leagueUrl: 'https://ddsl.ie/league/208699/' },
  { sportlomoId: 208703, officialName: '12.9 Boys Sun',  competitionName: 'DDSL U12 Boys Sunday Division 9',  ageGroup: 'U12', slug: 'u12-boys-sunday-division-9',  leagueUrl: 'https://ddsl.ie/league/208703/' },
  { sportlomoId: 208749, officialName: '12.1 Girls Sun', competitionName: 'DDSL U12 Girls Sunday Division 1', ageGroup: 'U12', slug: 'u12-girls-sunday-division-1', leagueUrl: 'https://ddsl.ie/league/208749/' },
  { sportlomoId: 208753, officialName: '12.5 Girls Sun', competitionName: 'DDSL U12 Girls Sunday Division 5', ageGroup: 'U12', slug: 'u12-girls-sunday-division-5', leagueUrl: 'https://ddsl.ie/league/208753/' },

  // ── U13 (competitive) ────────────────────────────────────────────────────
  { sportlomoId: 208857, officialName: '13.8 Boys Sat', competitionName: 'DDSL U13 Boys Saturday Division 8', ageGroup: 'U13', slug: 'u13-boys-saturday-division-8', leagueUrl: 'https://ddsl.ie/league/208857/' },
  { sportlomoId: 208862, officialName: '13.5 Boys Sun', competitionName: 'DDSL U13 Boys Sunday Division 5',  ageGroup: 'U13', slug: 'u13-boys-sunday-division-5',  leagueUrl: 'https://ddsl.ie/league/208862/' },
  { sportlomoId: 208867, officialName: '13.9 Boys Sun', competitionName: 'DDSL U13 Boys Sunday Division 9',  ageGroup: 'U13', slug: 'u13-boys-sunday-division-9',  leagueUrl: 'https://ddsl.ie/league/208867/' },

  // ── U14 (competitive) ────────────────────────────────────────────────────
  { sportlomoId: 208783, officialName: '14.4 Boys Sat',  competitionName: 'DDSL U14 Boys Saturday Division 4',  ageGroup: 'U14', slug: 'u14-boys-saturday-division-4',  leagueUrl: 'https://ddsl.ie/league/208783/' },
  { sportlomoId: 208871, officialName: '14.3 Boys Sun',  competitionName: 'DDSL U14 Boys Sunday Division 3',  ageGroup: 'U14', slug: 'u14-boys-sunday-division-3',  leagueUrl: 'https://ddsl.ie/league/208871/' },
  { sportlomoId: 208875, officialName: '14.7 Boys Sun',  competitionName: 'DDSL U14 Boys Sunday Division 7',  ageGroup: 'U14', slug: 'u14-boys-sunday-division-7',  leagueUrl: 'https://ddsl.ie/league/208875/' },
  { sportlomoId: 208877, officialName: '14.9 Boys Sun',  competitionName: 'DDSL U14 Boys Sunday Division 9',  ageGroup: 'U14', slug: 'u14-boys-sunday-division-9',  leagueUrl: 'https://ddsl.ie/league/208877/' },
  { sportlomoId: 208720, officialName: '14.3 Girls Sun', competitionName: 'DDSL U14 Girls Sunday Division 3', ageGroup: 'U14', slug: 'u14-girls-sunday-division-3', leagueUrl: 'https://ddsl.ie/league/208720/' },

  // ── U15 (competitive) ────────────────────────────────────────────────────
  { sportlomoId: 208885, officialName: '15.5 Boys Sat', competitionName: 'DDSL U15 Boys Saturday Division 5', ageGroup: 'U15', slug: 'u15-boys-saturday-division-5', leagueUrl: 'https://ddsl.ie/league/208885/' },

  // ── U17 (competitive) — league ID TBC (not found in 207000-210200 scan)
  // { sportlomoId: ???, officialName: '17.4 Boys Sun', competitionName: 'DDSL U17 Boys Sunday Division 4', ageGroup: 'U17', slug: 'u17-boys-sunday-division-4', leagueUrl: 'https://ddsl.ie/league/???/' },
];

/**
 * Returns the registry entry for the given SportLoMo competition ID,
 * or undefined if the competition is not in the registry.
 */
export function findKnownDivision(sportlomoId: number): KnownDivision | undefined {
  return KNOWN_DIVISIONS.find((d) => d.sportlomoId === sportlomoId);
}

export function competitionNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/^ddsl\s+/i, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
