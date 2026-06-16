/**
 * Master seasonal configuration for Rivervalley Rangers AFC.
 *
 * This is the single source of truth for age-group display ranges,
 * the active DDSL season identifier, and club milestone text.
 *
 * Update this file at the start of each season to propagate changes
 * automatically across all components that import these tokens.
 */

interface ClubSeasonConfig {
  /** Active DDSL season displayed across the platform, e.g. "2025/26". */
  currentSeason: string;
  /** Display range for the Junior Academy pathway (non-competitive tiers). */
  juniorAcademyAges: string;
  /** Display range for the Youth Competitive pathway (league teams). */
  youthCompetitiveAges: string;
  /** Year the club was founded — drives "Est." and "Since" copy. */
  foundingYear: number;
  /** Ordinal label for the current anniversary edition, e.g. "45th". */
  anniversaryEdition: string;
  /**
   * Number of full years since founding for the stats card.
   * Update alongside foundingYear at each milestone.
   */
  anniversaryYears: number;
}

export const CLUB_SEASON = {
  currentSeason:        "2025/26",
  juniorAcademyAges:    "U7 – U12",
  youthCompetitiveAges: "U13 – U18",
  foundingYear:         1981,
  anniversaryEdition:   "45th",
  anniversaryYears:     45,
} as const satisfies ClubSeasonConfig;
