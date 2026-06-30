import { KNOWN_DIVISIONS } from '@/config/ddsl-competitions';
import { AFL_DIVISIONS } from '@/config/afl-competitions';

export type SearchCategory = 'page' | 'ddsl-boys' | 'ddsl-girls' | 'senior' | 'over35s';

export interface SearchEntry {
  id: string;
  label: string;
  subLabel: string;
  href: string;
  category: SearchCategory;
  badge: string;
  badgeColour: string;
  keywords?: string[];
}

const SITE_PAGES: SearchEntry[] = [
  {
    id: 'home',
    label: 'Home',
    subLabel: 'Rivervalley Rangers AFC',
    href: '/',
    category: 'page',
    badge: 'PAGE',
    badgeColour: 'bg-brand-charcoal text-brand-cream',
    keywords: ['rvr', 'rivervalley', 'rangers', 'swords'],
  },
  {
    id: 'news',
    label: 'Club News',
    subLabel: 'Announcements, events, recruitment',
    href: '/news',
    category: 'page',
    badge: 'PAGE',
    badgeColour: 'bg-brand-charcoal text-brand-cream',
    keywords: ['announcements', 'updates', 'events'],
  },
  {
    id: 'fixtures',
    label: 'Fixtures & Results',
    subLabel: 'All DDSL team fixtures and results',
    href: '/fixtures',
    category: 'page',
    badge: 'PAGE',
    badgeColour: 'bg-brand-charcoal text-brand-cream',
    keywords: ['schedule', 'matches', 'games', 'scores', 'results', 'upcoming'],
  },
  {
    id: 'teams',
    label: 'All Teams',
    subLabel: 'Youth, senior, and inclusive teams',
    href: '/teams',
    category: 'page',
    badge: 'PAGE',
    badgeColour: 'bg-brand-charcoal text-brand-cream',
    keywords: ['squads', 'age groups', 'boys', 'girls'],
  },
  {
    id: 'register',
    label: 'Join the Club',
    subLabel: 'Player registration for all age groups',
    href: '/register',
    category: 'page',
    badge: 'PAGE',
    badgeColour: 'bg-brand-charcoal text-brand-cream',
    keywords: ['sign up', 'registration', 'join', 'membership', 'enrol', 'play'],
  },
  {
    id: 'membership-calculator',
    label: 'Membership Calculator',
    subLabel: 'Calculate your annual membership fee',
    href: '/membership-calculator',
    category: 'page',
    badge: 'PAGE',
    badgeColour: 'bg-brand-charcoal text-brand-cream',
    keywords: ['fees', 'cost', 'price', 'subs', 'subscription', 'annual'],
  },
  {
    id: 'seniors',
    label: 'Senior Football',
    subLabel: 'First Team and Over 35s',
    href: '/seniors',
    category: 'page',
    badge: 'PAGE',
    badgeColour: 'bg-brand-charcoal text-brand-cream',
    keywords: ['adult', 'senior', 'lsl', 'first team'],
  },
  {
    id: 'seniors-first-team',
    label: 'First Team',
    subLabel: 'Senior Football · Leinster Senior League',
    href: '/seniors/first-team',
    category: 'page',
    badge: 'PAGE',
    badgeColour: 'bg-brand-charcoal text-brand-cream',
    keywords: ['lsl', 'adult', 'senior', 'men'],
  },
  {
    id: 'walking-football',
    label: 'Walking Football',
    subLabel: 'Low-impact football open to all adults',
    href: '/walking-football',
    category: 'page',
    badge: 'PAGE',
    badgeColour: 'bg-brand-charcoal text-brand-cream',
    keywords: ['over 50', 'older adults', 'gentle', 'social', 'fitness'],
  },
  {
    id: 'football-for-all',
    label: 'Football for All',
    subLabel: 'Inclusive football for players of every ability',
    href: '/football-for-all',
    category: 'page',
    badge: 'PAGE',
    badgeColour: 'bg-brand-charcoal text-brand-cream',
    keywords: ['inclusive', 'disability', 'sen', 'special needs', 'all abilities', 'para'],
  },
  {
    id: 'get-involved',
    label: 'Volunteer & Coach',
    subLabel: 'Coaching and volunteering at RVR',
    href: '/get-involved',
    category: 'page',
    badge: 'PAGE',
    badgeColour: 'bg-brand-charcoal text-brand-cream',
    keywords: ['volunteer', 'coach', 'help', 'mentor', 'garda vetting', 'safeguarding'],
  },
  {
    id: 'sponsorship',
    label: 'Sponsorship',
    subLabel: 'Partner with Rivervalley Rangers AFC',
    href: '/sponsorship',
    category: 'page',
    badge: 'PAGE',
    badgeColour: 'bg-brand-charcoal text-brand-cream',
    keywords: ['partner', 'sponsor', 'business', 'advertise', 'kit'],
  },
  {
    id: 'shop',
    label: 'Club Shop',
    subLabel: 'Official kit and merchandise via Balon Sports',
    href: '/shop',
    category: 'page',
    badge: 'PAGE',
    badgeColour: 'bg-brand-charcoal text-brand-cream',
    keywords: ['kit', 'jersey', 'shirt', 'gear', 'merchandise', 'training wear', 'buy'],
  },
  {
    id: 'boot-room',
    label: 'Boot Room Exchange',
    subLabel: 'Donate and reuse football boots and kit',
    href: '/boot-room',
    category: 'page',
    badge: 'PAGE',
    badgeColour: 'bg-brand-charcoal text-brand-cream',
    keywords: ['boots', 'donate', 'exchange', 'swap', 'free', 'second hand', 'kit'],
  },
  {
    id: 'astro-booking',
    label: 'Book the Astro',
    subLabel: "St Finian's 3G astroturf pitch booking",
    href: '/astro-booking',
    category: 'page',
    badge: 'PAGE',
    badgeColour: 'bg-brand-charcoal text-brand-cream',
    keywords: ['pitch', 'book', '3g', 'astro', 'hire', 'sportskey', 'finians'],
  },
  {
    id: 'contact',
    label: 'Contact',
    subLabel: 'Committee, coaching staff, and general enquiries',
    href: '/contact',
    category: 'page',
    badge: 'PAGE',
    badgeColour: 'bg-brand-charcoal text-brand-cream',
    keywords: ['email', 'phone', 'enquiry', 'committee', 'welfare', 'secretary'],
  },
  {
    id: 'club',
    label: 'Club Information',
    subLabel: 'History, governance, and documents',
    href: '/club',
    category: 'page',
    badge: 'PAGE',
    badgeColour: 'bg-brand-charcoal text-brand-cream',
    keywords: ['about', 'history', 'founded', '1981', 'committee', 'fai', 'governance'],
  },
  {
    id: 'safeguarding',
    label: 'Safeguarding',
    subLabel: 'Child welfare and safeguarding policy',
    href: '/club/safeguarding',
    category: 'page',
    badge: 'PAGE',
    badgeColour: 'bg-brand-charcoal text-brand-cream',
    keywords: ['child welfare', 'garda vetting', 'dbs', 'policy', 'designated officer', 'cpd'],
  },
  {
    id: 'club-anniversary',
    label: 'Club Anniversary',
    subLabel: '45 years of Rivervalley Rangers AFC',
    href: '/seniors/anniversary',
    category: 'page',
    badge: 'PAGE',
    badgeColour: 'bg-brand-charcoal text-brand-cream',
    keywords: ['45', 'history', '1981', 'anniversary', 'celebration'],
  },
];

const TEAM_PAGES: SearchEntry[] = [
  ...KNOWN_DIVISIONS.map((d) => ({
    id: d.slug,
    label: d.competitionName.replace('DDSL ', ''),
    subLabel: d.competitionName.includes('Girls') ? 'DDSL Girls' : 'DDSL Boys',
    href: `/teams/${d.slug}`,
    category: (d.competitionName.includes('Girls') ? 'ddsl-girls' : 'ddsl-boys') as SearchCategory,
    badge: d.competitionName.includes('Girls') ? 'GIRLS' : 'BOYS',
    badgeColour: d.competitionName.includes('Girls') ? 'bg-brand-maroon text-white' : 'bg-brand-sky text-brand-charcoal',
  })),
  {
    id: 'first-team',
    label: 'First Team',
    subLabel: 'Senior Football · LSL',
    href: '/seniors/first-team',
    category: 'senior',
    badge: 'SENIOR',
    badgeColour: 'bg-brand-green text-white',
    keywords: ['lsl', 'adult', 'men'],
  },
  ...AFL_DIVISIONS.map((d) => ({
    id: d.id,
    label: d.competitionName.replace('AFL ', ''),
    subLabel: 'Over 35s · AFL',
    href: `/seniors/over-35s/${d.id}`,
    category: 'over35s' as SearchCategory,
    badge: 'OVER 35s',
    badgeColour: 'bg-brand-neon text-brand-charcoal',
  })),
];

export const SEARCH_INDEX: SearchEntry[] = [...SITE_PAGES, ...TEAM_PAGES];

export function searchSite(query: string): SearchEntry[] {
  if (!query || query.trim().length < 2) return [];
  const q = query.toLowerCase().trim();
  return SEARCH_INDEX.filter((e) =>
    e.label.toLowerCase().includes(q) ||
    e.subLabel.toLowerCase().includes(q) ||
    e.id.includes(q) ||
    e.keywords?.some((k) => k.includes(q)),
  ).slice(0, 12);
}
