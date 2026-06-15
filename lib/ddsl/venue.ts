import type { VenueInfo } from './types';

/**
 * Known RVR home venues with verified coordinates.
 * The `keywords` are matched case-insensitively against the venue string
 * returned by SportLoMo.
 */
const RVR_HOME_VENUES: Array<{
  keywords: string[];
  label: string;
  address: string;
  lat: number;
  lng: number;
}> = [
  {
    keywords: ['ward rivervalley', 'rivervalley all weather', 'rivervalley astro', 'rivervalley park'],
    label: 'Ward Rivervalley All-Weather Pitch',
    address: 'Ward Rivervalley All-Weather Pitch, Rivervalley, Swords, Co. Dublin',
    lat: 53.458,
    lng: -6.221,
  },
  {
    keywords: ['ridgewood'],
    label: 'Ridgewood Park',
    address: 'Ridgewood, Swords, Co. Dublin, K67 R672',
    lat: 53.453,
    lng: -6.246,
  },
  {
    keywords: ['rathingle'],
    label: 'Rathingle Park',
    address: 'Rathingle Road, Swords, Co. Dublin',
    lat: 53.4543,
    lng: -6.2182,
  },
  {
    keywords: ['brookdale', 'hilltown'],
    label: 'Brookdale Green / Hilltown',
    address: 'Brookdale Green, Swords, Co. Dublin',
    lat: 53.4612,
    lng: -6.2198,
  },
  {
    keywords: ["st finian", "st. finian", "st finian's", "finian"],
    label: "St Finian's Astro",
    address: "St Finian's Community College, Swords Road, Swords, Co. Dublin",
    lat: 53.4595,
    lng: -6.2245,
  },
];

function normalisedVenueName(raw: string): string {
  return raw.toLowerCase().replace(/['’‘]/g, "'").trim();
}

function buildMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

function buildMapsUrlFromText(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/**
 * Resolve a venue string from SportLoMo into structured VenueInfo.
 * Flags home games and generates a precise Google Maps link.
 */
export function resolveVenue(venueName: string, venueAddress?: string | null): VenueInfo {
  const normalised = normalisedVenueName(venueName);

  for (const home of RVR_HOME_VENUES) {
    if (home.keywords.some((kw) => normalised.includes(kw))) {
      return {
        name: home.label,
        address: home.address,
        isRvrHome: true,
        googleMapsUrl: buildMapsUrl(home.lat, home.lng),
      };
    }
  }

  // Away or neutral venue — construct Maps link from available text
  const lookupText = venueAddress
    ? `${venueName}, ${venueAddress}`
    : `${venueName}, Dublin, Ireland`;

  return {
    name: venueName,
    address: venueAddress ?? null,
    isRvrHome: false,
    googleMapsUrl: buildMapsUrlFromText(lookupText),
  };
}
