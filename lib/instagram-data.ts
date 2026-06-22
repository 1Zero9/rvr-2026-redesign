export interface InstagramPost {
  id:       string;
  imageUrl: string;
  caption:  string;
  postUrl:  string;
  date:     string; // ISO date string e.g. "2026-05-18"
}

function placeholder(label: string): string {
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">',
    '<rect width="400" height="400" fill="#0B1F3B"/>',
    '<rect x="0" y="0" width="400" height="6" fill="#85E320"/>',
    '<rect x="0" y="394" width="400" height="6" fill="#85E320"/>',
    '<rect x="0" y="0" width="6" height="400" fill="#85E320"/>',
    '<rect x="394" y="0" width="6" height="400" fill="#85E320"/>',
    '<text x="200" y="175" font-family="Arial,sans-serif" font-size="28" font-weight="900"',
    ' fill="#85E320" text-anchor="middle" dominant-baseline="middle" letter-spacing="4">RVR FC</text>',
    '<text x="200" y="215" font-family="Arial,sans-serif" font-size="15"',
    ' fill="#85E320" text-anchor="middle" dominant-baseline="middle" opacity="0.7">',
    label,
    '</text>',
    '<text x="200" y="255" font-family="Arial,sans-serif" font-size="13"',
    ' fill="#5BA0D0" text-anchor="middle" dominant-baseline="middle" opacity="0.6">@rvrfc1981</text>',
    '</svg>',
  ].join('');
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id:       '1',
    imageUrl: placeholder('Post 1'),
    caption:  'Match day at the Valley! #RVR #UpTheValley',
    postUrl:  'https://www.instagram.com/rvrfc1981/',
    date:     '2026-06-15',
  },
  {
    id:       '2',
    imageUrl: placeholder('Post 2'),
    caption:  'Training hard ahead of the weekend. #RVR #UpTheValley',
    postUrl:  'https://www.instagram.com/rvrfc1981/',
    date:     '2026-06-10',
  },
  {
    id:       '3',
    imageUrl: placeholder('Post 3'),
    caption:  'Three points secured — great team effort! #RVR #UpTheValley',
    postUrl:  'https://www.instagram.com/rvrfc1981/',
    date:     '2026-06-05',
  },
  {
    id:       '4',
    imageUrl: placeholder('Post 4'),
    caption:  'Our U10s in action at Ward Rivervalley Park. #RVR #UpTheValley',
    postUrl:  'https://www.instagram.com/rvrfc1981/',
    date:     '2026-05-31',
  },
  {
    id:       '5',
    imageUrl: placeholder('Post 5'),
    caption:  'Big win for the Girls U12s this morning! #RVR #UpTheValley',
    postUrl:  'https://www.instagram.com/rvrfc1981/',
    date:     '2026-05-26',
  },
  {
    id:       '6',
    imageUrl: placeholder('Post 6'),
    caption:  'Proud club, proud community. Est. 1981. #RVR #UpTheValley',
    postUrl:  'https://www.instagram.com/rvrfc1981/',
    date:     '2026-05-21',
  },
  {
    id:       '7',
    imageUrl: placeholder('Post 7'),
    caption:  'Registration for 2026/27 is now open! Sign up today. #RVR #UpTheValley',
    postUrl:  'https://www.instagram.com/rvrfc1981/',
    date:     '2026-05-16',
  },
  {
    id:       '8',
    imageUrl: placeholder('Post 8'),
    caption:  "Over 35s showing the youngsters how it's done! #RVR #UpTheValley",
    postUrl:  'https://www.instagram.com/rvrfc1981/',
    date:     '2026-05-11',
  },
  {
    id:       '9',
    imageUrl: placeholder('Post 9'),
    caption:  'Walking Football — open to all, every Wednesday. #RVR #UpTheValley',
    postUrl:  'https://www.instagram.com/rvrfc1981/',
    date:     '2026-05-06',
  },
  {
    id:       '10',
    imageUrl: placeholder('Post 10'),
    caption:  'Full house at the astro tonight. What a session! #RVR #UpTheValley',
    postUrl:  'https://www.instagram.com/rvrfc1981/',
    date:     '2026-05-01',
  },
  {
    id:       '11',
    imageUrl: placeholder('Post 11'),
    caption:  'Huge shout out to all our volunteers this season. #RVR #UpTheValley',
    postUrl:  'https://www.instagram.com/rvrfc1981/',
    date:     '2026-04-26',
  },
  {
    id:       '12',
    imageUrl: placeholder('Post 12'),
    caption:  'End of season presentation night — well done everyone! #RVR #UpTheValley',
    postUrl:  'https://www.instagram.com/rvrfc1981/',
    date:     '2026-04-21',
  },
];
