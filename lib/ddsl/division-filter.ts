/**
 * Division integrity filter for the DDSL / SportLoMo ingestion pipeline.
 *
 * When a standings table is associated with a competition ID that appears in
 * the KNOWN_DIVISIONS registry AND that entry carries a `knownMembers` list,
 * this module strips any row whose normalised team name is not on the list.
 *
 * This is the defense against stale or incorrectly mapped competition IDs in
 * the SportLoMo feed causing unrelated clubs to appear in our public tables.
 */

import { findKnownDivision } from '@/config/ddsl-competitions';
import { normalizeTeamName } from './normalize';
import type { SportLoMoStandingsTable } from './types';

/**
 * Applies the known-members allowlist to each standings table.
 *
 * - Tables whose competition ID is not in the registry pass through unchanged.
 * - Tables in the registry but without a `knownMembers` list pass through
 *   unchanged (the registry entry carries metadata only).
 * - Tables in the registry WITH a `knownMembers` list have their standings
 *   rows filtered to those teams only. Each excluded row emits a warning so
 *   data integrity issues are visible in server logs.
 *
 * Comparison is performed on the normalised team name (lower-cased) so minor
 * casing or spacing differences in the feed do not cause false exclusions.
 */
export function applyDivisionFilter(
  tables: SportLoMoStandingsTable[],
): SportLoMoStandingsTable[] {
  return tables.map((table) => {
    const division = findKnownDivision(table.competitionId);

    // No registry entry or no allowlist — pass through unchanged.
    if (!division?.knownMembers?.length) return table;

    const allowed = new Set(
      division.knownMembers.map((n) => normalizeTeamName(n).toLowerCase()),
    );

    const filtered = table.standings.filter((row) => {
      const normalised = normalizeTeamName(row.team.teamName).toLowerCase();
      const pass = allowed.has(normalised);

      if (!pass) {
        console.warn(
          `[ddsl/division-filter] INTEGRITY WARNING — excluded "${row.team.teamName}"` +
          ` (team ID ${row.team.teamId}) from "${table.competitionName}"` +
          ` (competition ID ${table.competitionId}).` +
          ` This team is not in the registered member list for division` +
          ` "${division.officialName}". Verify the competition ID in the DDSL admin panel.`,
        );
      }

      return pass;
    });

    if (filtered.length !== table.standings.length) {
      const removed = table.standings.length - filtered.length;
      console.warn(
        `[ddsl/division-filter] Removed ${removed} unregistered row(s) from` +
        ` "${table.competitionName}" (competition ID ${table.competitionId}).` +
        ` Expected members: ${division.knownMembers.join(', ')}.`,
      );
    }

    return { ...table, standings: filtered };
  });
}
