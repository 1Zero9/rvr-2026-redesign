import type { AgeGroup, DisplayScore, SportLoMoScore } from './types';

/**
 * Parse the numeric age from a competition name.
 * Handles formats like:
 *   "DDSL U10 Boys Division 1"  → 10
 *   "U12 Girls Shield"          → 12
 *   "Under-9 Mixed"             → 9
 *   "Senior Men's Cup"          → null
 */
export function parseAgeGroup(competitionName: string): AgeGroup {
  const match = competitionName.match(/[Uu](?:nder[-\s]?)?(\d{1,2})/);
  if (!match) return 'Senior';
  const age = parseInt(match[1], 10);
  if (age >= 7 && age <= 18) return `U${age}` as AgeGroup;
  return 'Unknown';
}

/** U7–U12 are youth development age groups subject to the Mercy Rule */
export function isMercyRuleAgeGroup(ageGroup: AgeGroup): boolean {
  const eligible = new Set<AgeGroup>(['U7', 'U8', 'U9', 'U10', 'U11', 'U12']);
  return eligible.has(ageGroup);
}

/**
 * Apply the DDSL Mercy Rule to a scoreline.
 *
 * The cap formula for public-facing JSON outputs:
 *   Margin_display = min(Score_winning − Score_losing, 5)
 *
 * The losing team's score is held constant; the winning team's displayed score
 * is reduced so that the margin never exceeds 5.
 *
 * Returns a DisplayScore with mercyRuleApplied=false when:
 *   - The age group is not subject to the rule, OR
 *   - The actual margin is already ≤ 5 (no cap needed)
 */
export function applyMercyRule(
  raw: SportLoMoScore,
  ageGroup: AgeGroup,
): DisplayScore {
  if (!isMercyRuleAgeGroup(ageGroup)) {
    return { home: raw.home, away: raw.away, mercyRuleApplied: false };
  }

  const winningScore = Math.max(raw.home, raw.away);
  const losingScore = Math.min(raw.home, raw.away);
  const actualMargin = winningScore - losingScore;
  const displayMargin = Math.min(actualMargin, 5);

  if (displayMargin === actualMargin) {
    return {
      home: raw.home,
      away: raw.away,
      mercyRuleApplied: false,
      actualMargin,
      displayMargin,
    };
  }

  // Rebuild the score with the capped winning total
  const cappedWinning = losingScore + displayMargin;
  const isHomeWinning = raw.home >= raw.away;

  return {
    home: isHomeWinning ? cappedWinning : losingScore,
    away: isHomeWinning ? losingScore : cappedWinning,
    mercyRuleApplied: true,
    actualMargin,
    displayMargin,
  };
}
