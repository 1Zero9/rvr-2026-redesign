export interface PublicAnnouncement {
  id:          string;
  title:       string;
  category:    'BREAKING' | 'CONGRATULATIONS' | 'COMMUNITY_NEWS' | 'IN_SYMPATHY';
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
  BREAKING: {
    label:      'Breaking News',
    colour:     'bg-brand-maroon',
    textColour: 'text-white',
    border:     'border-brand-maroon',
  },
  CONGRATULATIONS: {
    label:      'Congratulations',
    colour:     'bg-brand-neon',
    textColour: 'text-brand-charcoal',
    border:     'border-brand-neon',
  },
  COMMUNITY_NEWS: {
    label:      'Community News',
    colour:     'bg-brand-sky',
    textColour: 'text-brand-charcoal',
    border:     'border-brand-sky',
  },
  IN_SYMPATHY: {
    label:      'In Sympathy',
    colour:     'bg-brand-navy',
    textColour: 'text-brand-cream',
    border:     'border-brand-navy',
  },
};
