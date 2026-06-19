/**
 * AFL competition registry — RVR Over 35s teams, 2025/26 season.
 *
 * The AFL runs on SportsPress/WordPress. Standings are server-rendered
 * HTML tables at amateurfootballleague.com/table/{slug}/.
 *
 * Full table URLs confirmed by inspecting amateurfootballleague.com
 * homepage division links (19 Jun 2026).
 *
 * RVR team name on AFL site: "Rivervalley Rgs A" and "Rivervalley Rgs B"
 * These must match exactly for the RVR row highlight to work.
 */

export interface AflDivision {
  /** Short internal identifier, used as part of team page slug. */
  id: string;
  /** Official AFL division name as displayed on amateurfootballleague.com */
  officialName: string;
  /** Canonical name used throughout the RVR platform. */
  competitionName: string;
  /** RVR team name exactly as it appears on the AFL site. */
  rvrTeamName: string;
  /** Public AFL standings page URL. */
  tableUrl: string;
  /** Public AFL fixtures page URL — may be added later. */
  fixturesUrl?: string;
}

export const AFL_DIVISIONS: AflDivision[] = [
  {
    id: 'over35s-a',
    officialName: 'Division 2 North',
    competitionName: 'AFL Over 35s Division 2 North',
    rvrTeamName: 'Rivervalley Rgs A',
    tableUrl: 'https://www.amateurfootballleague.com/table/2-nth-2026/',
  },
  {
    id: 'over35s-b',
    officialName: 'Division 4 North',
    competitionName: 'AFL Over 35s Division 4 North',
    rvrTeamName: 'Rivervalley Rgs B',
    tableUrl: 'https://www.amateurfootballleague.com/table/4-nth-2026/',
  },
];

/**
 * Returns the registry entry for the given AFL division id,
 * or undefined if not found.
 */
export function findAflDivision(id: string): AflDivision | undefined {
  return AFL_DIVISIONS.find((d) => d.id === id);
}
