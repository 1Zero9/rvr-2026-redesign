import { KNOWN_DIVISIONS } from '@/config/ddsl-competitions';
import { AFL_DIVISIONS } from '@/config/afl-competitions';
import { CLUB_SEASON } from '@/config/club-season';

// First Team, LSL Div 3B, LSL Div 3C
const SENIOR_TEAM_COUNT = 3;

function playersPerTeam(ageGroup: string): number {
  const age = parseInt(ageGroup.replace(/\D/g, ''), 10);
  if (isNaN(age) || age >= 13) return 14; // 11-a-side + 3 subs
  if (age === 12)              return 12; //  9-a-side + 3 subs
  if (age >= 10)               return 10; //  7-a-side + 3 subs
  return 8;                               //  5-a-side + 3 subs (U8, U9)
}

export interface ClubStats {
  yearsActive:       number;
  totalTeams:        number;
  estimatedPlayers:  number;
}

export function computeClubStats(): ClubStats {
  const yearsActive = new Date().getFullYear() - CLUB_SEASON.foundingYear;

  const totalTeams =
    KNOWN_DIVISIONS.length +
    AFL_DIVISIONS.length +
    SENIOR_TEAM_COUNT;

  const ddslPlayers    = KNOWN_DIVISIONS.reduce((sum, d) => sum + playersPerTeam(d.ageGroup), 0);
  const aflPlayers     = AFL_DIVISIONS.length * 14;
  const seniorPlayers  = SENIOR_TEAM_COUNT * 14;
  const estimatedPlayers = ddslPlayers + aflPlayers + seniorPlayers;

  return { yearsActive, totalTeams, estimatedPlayers };
}
