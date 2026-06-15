/**
 * Builds the Prisma WHERE clause that gates public-facing coach queries.
 *
 * A coach profile is only surfaced publicly when ALL of the following are true:
 *   1. isGardaVetted === true          (vetting approved via FAI COMET)
 *   2. isVettingExpired === false       (within the 3-year window)
 *   3. isClubMarkCompliant === true     (Safeguarding 1 current + all flags green)
 *   4. isActivelyCoaching === true      (not archived / left the club)
 *
 * This object is spread directly into Prisma `findMany({ where: ... })` calls.
 */
export const PUBLIC_COACH_WHERE = {
  isGardaVetted:       true,
  isVettingExpired:    false,
  isClubMarkCompliant: true,
  isActivelyCoaching:  true,
} as const;

/**
 * The public-safe field selection.
 * Deliberately excludes: faiCometId, gardaVettingApprovedAt, safeguarding1CompletedAt,
 * lastComplianceCheckedAt, and all raw compliance boolean flags.
 * GDPR: vetting dates are personal data — never expose them publicly.
 */
export const PUBLIC_COACH_SELECT = {
  id:        true,
  firstName: true,
  lastName:  true,
  role:      true,
  teamAssignments: {
    select: {
      teamName:  true,
      ageGroup:  true,
      season:    true,
      isPrimary: true,
    },
  },
} as const;
