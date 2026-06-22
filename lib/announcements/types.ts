export interface PublicAnnouncement {
  id:          string;
  title:       string;
  category:    'RECRUITMENT' | 'EVENT' | 'NEWS' | 'VOLUNTEER';
  body:        string;
  imageUrl:    string | null;
  ctaLabel:    string | null;
  ctaUrl:      string | null;
  publishedAt: string;
  expiresAt:   string | null;
  pinned:      boolean;
}

export const CATEGORY_CONFIG: Record<
  PublicAnnouncement['category'],
  { label: string; colour: string; textColour: string; border: string }
> = {
  RECRUITMENT: {
    label:      'Recruitment',
    colour:     'bg-brand-neon',
    textColour: 'text-brand-charcoal',
    border:     'border-brand-neon',
  },
  EVENT: {
    label:      'Event',
    colour:     'bg-brand-sky',
    textColour: 'text-brand-charcoal',
    border:     'border-brand-sky',
  },
  NEWS: {
    label:      'News',
    colour:     'bg-brand-green',
    textColour: 'text-white',
    border:     'border-brand-green',
  },
  VOLUNTEER: {
    label:      'Volunteer',
    colour:     'bg-brand-maroon',
    textColour: 'text-white',
    border:     'border-brand-maroon',
  },
};
