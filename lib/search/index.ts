import { KNOWN_DIVISIONS } from '@/config/ddsl-competitions';
import { AFL_DIVISIONS } from '@/config/afl-competitions';

export interface SearchEntry {
  id: string;
  label: string;
  subLabel: string;
  href: string;
  type: 'ddsl-boys' | 'ddsl-girls' | 'senior' | 'over35s';
  colour: string;
}

export const SEARCH_INDEX: SearchEntry[] = [
  ...KNOWN_DIVISIONS.map((d) => ({
    id:       d.slug,
    label:    d.competitionName.replace('DDSL ', ''),
    subLabel: d.competitionName.includes('Girls') ? 'DDSL Girls' : 'DDSL Boys',
    href:     `/teams/${d.slug}`,
    type:     (d.competitionName.includes('Girls') ? 'ddsl-girls' : 'ddsl-boys') as SearchEntry['type'],
    colour:   d.competitionName.includes('Girls') ? 'bg-brand-maroon' : 'bg-brand-sky',
  })),
  {
    id:       'first-team',
    label:    'First Team',
    subLabel: 'Senior Football · LSL',
    href:     '/seniors/first-team',
    type:     'senior',
    colour:   'bg-brand-green',
  },
  ...AFL_DIVISIONS.map((d) => ({
    id:       d.id,
    label:    d.competitionName.replace('AFL ', ''),
    subLabel: 'Over 35s · AFL',
    href:     `/seniors/over-35s/${d.id}`,
    type:     'over35s' as SearchEntry['type'],
    colour:   'bg-brand-neon',
  })),
];

export function searchTeams(query: string): SearchEntry[] {
  if (!query || query.trim().length < 2) return [];
  const q = query.toLowerCase().trim();
  return SEARCH_INDEX.filter(
    (e) =>
      e.label.toLowerCase().includes(q) ||
      e.subLabel.toLowerCase().includes(q) ||
      e.id.includes(q),
  ).slice(0, 8);
}
