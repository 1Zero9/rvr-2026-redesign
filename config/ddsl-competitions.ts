/**
 * Hard-locked DDSL competition registry.
 *
 * Each entry pins an official SportLoMo competition ID to its canonical name
 * and, optionally, the complete set of member team names for that division.
 *
 * When `knownMembers` is populated the division filter in
 * `lib/ddsl/division-filter.ts` will strip any row whose normalised team name
 * is not on the list. This prevents incorrectly associated clubs (caused by
 * stale or mismatched competition IDs in the SportLoMo feed) from appearing
 * in our public-facing tables.
 *
 * MAINTENANCE
 * ───────────
 * - Names in `knownMembers` must match the canonical form produced by
 *   `normalizeTeamName()` (see lib/ddsl/normalize.ts). Comparison is
 *   case-insensitive at runtime so exact casing does not matter here.
 * - Complete the `knownMembers` list for each entry from the DDSL admin panel
 *   before enabling the filter in production.
 * - Update `sportlomoId` if the DDSL reissues competition IDs between seasons.
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
  /**
   * Complete roster of team names permitted in this division.
   *
   * When set, any standings row whose normalised team name is not in this list
   * is silently removed and logged as a data integrity warning. Leave undefined
   * to disable filtering for this division.
   */
  knownMembers?: string[];
  /**
   * Public DDSL league page URL (ddsl.ie/league/{id}/).
   *
   * When set, the sync route attempts to scrape live standings from this URL
   * before falling back to the local seed. Confirmed by inspecting the public
   * DDSL website — no authentication required.
   */
  leagueUrl?: string;
}

export const KNOWN_DIVISIONS: KnownDivision[] = [
  {
    // Confirmed competition ID from DDSL admin panel (image_ed0a65.jpg).
    // Coolmine Athletic FC must NOT appear in this division — their presence
    // in the SportLoMo feed indicates a mismatched competition ID at source.
    sportlomoId: 208581,
    officialName: '12 MAJOR BOYS SAT',
    competitionName: 'DDSL U12 Boys Major Saturday',
    ageGroup: 'U12',
    // Team names verified against the live DDSL public page (17 Jun 2026).
    // 'River Valley Rangers FC' is the two-word form the DDSL site uses; it
    // normalizes to 'Rivervalley Rangers' via normalizeTeamName().
    knownMembers: [
      'Rivervalley Rangers',
      'River Valley Rangers',     // legacy two-word variant
      'River Valley Rangers FC',  // form used on ddsl.ie standings page
      'Cherry Orchard FC',
      'Kilnamanagh AFC',
      'Greystones United AFC',    // confirmed name on ddsl.ie (was wrong: 'Greystones AFC')
      'Belvedere FC',
      'Leixlip United AFC',
      'Beechwood FC',             // confirmed name on ddsl.ie (was wrong: 'Beechwood SC')
      'St Francis FC',
      'Corduff FC',
      'Home Farm FC',
      'Leicester Celtic FC',
      'Ballyoulster United FC',
      'Crumlin United FC',        // confirmed name on ddsl.ie (was wrong: 'Crumlin United AFC')
      'Bohemian FC',
    ],
    leagueUrl: 'https://ddsl.ie/league/208581/',
  },
];

/**
 * Returns the registry entry for the given SportLoMo competition ID,
 * or undefined if the competition is not in the registry.
 */
export function findKnownDivision(sportlomoId: number): KnownDivision | undefined {
  return KNOWN_DIVISIONS.find((d) => d.sportlomoId === sportlomoId);
}
