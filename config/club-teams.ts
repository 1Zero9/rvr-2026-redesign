export type ClubTeamCategory =
  | 'academy'
  | 'adult'
  | 'community'
  | 'inclusive'
  | 'events';

export interface ClubTeam {
  slug: string;
  name: string;
  category: ClubTeamCategory;
  tagline: string;
  description: string;
  marketingCopy: string;
  trainingDay?: string;
  trainingTime?: string;
  trainingVenue?: string;
  contactName?: string;
  contactEmail?: string;
  isRecruiting: boolean;
  badge: string;
}

export const CLUB_TEAMS: ClubTeam[] = [
  {
    slug: 'academy',
    name: 'Development Academy',
    category: 'academy',
    badge: '⭐',
    tagline: 'Where the journey begins',
    description: 'The Rivervalley Rangers Development Academy is our Saturday football programme for children born 2020, 2021 & 2022 (ages 4–6). A fun, relaxed, and friendly environment for children to be introduced to football and make lifelong friends — operating in Swords for over 20 years.',
    marketingCopy: 'Sign up to the biggest and best football academy in Swords. Ginny and the Academy Team run Saturday morning sessions at the Small Astro Pitch in Rivervalley Park. No experience needed — just enthusiasm!',
    trainingDay: 'Saturday',
    trainingTime: '10:00am (born 2021 & 2022, ages 4–5) / 11:30am (born 2020, age 6)',
    trainingVenue: 'Small Astro Pitch, Rivervalley Park, Swords',
    contactName: 'Ginny & the Academy Team',
    isRecruiting: true,
  },
  {
    slug: 'seniors',
    name: 'RVR Seniors',
    category: 'adult',
    badge: '🏆',
    tagline: 'Competitive adult football in Swords',
    description: 'River Valley Rangers Seniors compete in adult league football. Players over 17 are welcome to train and try out.',
    marketingCopy: 'Looking for competitive football in North Dublin? RVR Seniors welcome players of all abilities over 17. Come train with us.',
    trainingDay: 'TBC',
    trainingTime: 'TBC',
    trainingVenue: 'Rivervalley Park, Swords',
    isRecruiting: true,
  },
  {
    slug: 'over-35s',
    name: 'RVR Over 35s',
    category: 'adult',
    badge: '🏆',
    tagline: 'Proving football has no age limit',
    description: 'The RVR Over 35s team keeps the beautiful game going for those who refuse to hang up their boots. Competitive, social, and welcoming.',
    marketingCopy: 'Still got it? The RVR Over 35s are always looking for experienced players who want to keep playing. Great football, great craic.',
    trainingDay: 'TBC',
    trainingTime: 'TBC',
    trainingVenue: 'Rivervalley Park, Swords',
    isRecruiting: true,
  },
  {
    slug: 'walking-football',
    name: 'Walking Football',
    category: 'community',
    badge: '🚶',
    tagline: 'Football for everyone, at any pace',
    description: 'Walking Football at RVR is open to all adults who want to stay active and enjoy the game at a gentler pace. No running required.',
    marketingCopy: 'Walking Football is one of the fastest growing sports in Ireland. Join us at RVR for a friendly, social game that keeps you fit and connected to the club.',
    trainingDay: 'TBC',
    trainingTime: 'TBC',
    trainingVenue: 'Rivervalley Park, Swords',
    isRecruiting: true,
  },
  {
    slug: 'ladies-football',
    name: 'Ladies Football',
    category: 'community',
    badge: '⚽',
    tagline: 'Get fit, have fun, learn the basics of football',
    description: 'Ladies Football Fit at Rivervalley Rangers is a fun, welcoming session open to all ladies in Swords. Get fit, learn football basics, and make new friends — no experience needed.',
    marketingCopy: 'Join Rivervalley Rangers Ladies Football Fit — Tuesdays at 8pm on the Small Astro at Rivervalley Park. €5 per session. Contact Emma to pre-book your place.',
    trainingDay: 'Tuesday',
    trainingTime: '8:00pm',
    trainingVenue: 'Small Astro, Rivervalley Park, Swords',
    contactName: 'Emma',
    isRecruiting: true,
  },
  {
    slug: 'inclusive',
    name: 'Inclusive Football',
    category: 'inclusive',
    badge: '💚',
    tagline: 'Football for every ability',
    description: 'River Valley Rangers is proud to offer an inclusive football programme for players of all abilities. Everyone is welcome, everyone belongs.',
    marketingCopy: 'At RVR we believe football is for everyone. Our inclusive programme is designed for players of all abilities in a safe, supportive, and joyful environment. If you want to play, we want you here.',
    trainingDay: 'TBC',
    trainingTime: 'TBC',
    trainingVenue: 'Rivervalley Park, Swords',
    isRecruiting: true,
  },
  {
    slug: 'events',
    name: 'Events Committee',
    category: 'events',
    badge: '🎉',
    tagline: 'The heartbeat of the club',
    description: 'The RVR Events Committee organises fundraising, social events, and community initiatives that bring the club together off the pitch.',
    marketingCopy: 'Want to get involved behind the scenes? The Events Committee is always looking for enthusiastic volunteers to help organise our club calendar. Get in touch.',
    isRecruiting: true,
  },
];

export function findClubTeam(slug: string): ClubTeam | undefined {
  return CLUB_TEAMS.find((t) => t.slug === slug);
}

export function getClubTeamsByCategory(category: ClubTeamCategory): ClubTeam[] {
  return CLUB_TEAMS.filter((t) => t.category === category);
}
