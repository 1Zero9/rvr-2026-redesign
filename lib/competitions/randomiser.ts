import type { PlayerPoolEntry } from "@prisma/client";

export function shufflePlayers<T>(players: T[]): T[] {
  const arr = [...players];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function distributeToTeams(
  players: PlayerPoolEntry[],
  teamCount: number,
): PlayerPoolEntry[][] {
  const shuffled = shufflePlayers(players);
  const teams: PlayerPoolEntry[][] = Array.from({ length: teamCount }, () => []);
  shuffled.forEach((player, i) => {
    teams[i % teamCount].push(player);
  });
  return teams;
}

export function suggestTeamCount(playerCount: number): number {
  // Aim for 5-7 players per team
  const ideal = Math.round(playerCount / 6);
  return Math.min(12, Math.max(2, ideal));
}
