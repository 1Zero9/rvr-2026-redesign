export type ClubContact = {
  role: string;
  summary: string;
  email?: string;
  href?: string;
  actionLabel: string;
  status: 'verified' | 'pending';
};

export type ClubPolicy = {
  title: string;
  description: string;
  href?: string;
  actionLabel?: string;
  status: 'available' | 'pending';
};

export const clubOverview = {
  foundingYear: 1981,
  location: 'Swords, Co. Dublin',
  summary:
    'Rivervalley Rangers AFC is a volunteer-led community football club serving players and families in Swords.',
  mission:
    'To provide a welcoming football environment where players can participate, develop, and build lasting connections with their community.',
};

export const clubValues = [
  {
    title: 'Community',
    description:
      'Local volunteers, families, coaches, and players working together to sustain grassroots football in Swords.',
  },
  {
    title: 'Development',
    description:
      'Age-appropriate football pathways that support learning, confidence, participation, and progression.',
  },
  {
    title: 'Inclusion',
    description:
      'Football opportunities designed to welcome different ages, formats, abilities, and levels of experience.',
  },
];

export const clubTimeline = [
  {
    year: '1981',
    title: 'Rivervalley Rangers AFC founded',
    description:
      'The club begins serving the Rivervalley and wider Swords community.',
    status: 'verified' as const,
  },
  {
    year: '2024',
    title: 'FAI Club Mark Award',
    description:
      'Rivervalley Rangers AFC awarded FAI Club Mark accreditation, recognising the club\'s high standards in player welfare, governance, and community football. Supported by Circle K.',
    status: 'verified' as const,
  },
  {
    year: 'Archive',
    title: 'Club milestones being compiled',
    description:
      'Championships, team launches, facility developments, and community milestones will be added after the club archive is verified.',
    status: 'pending' as const,
  },
];

export const clubContacts: ClubContact[] = [
  {
    role: 'Chairperson',
    summary:
      'Club leadership, governance, and strategic matters.',
    actionLabel: 'Contact details pending',
    status: 'pending',
  },
  {
    role: 'Club Secretary',
    summary:
      'Committee matters, official correspondence, and club documentation.',
    email: 'secretary@rvrafc.ie',
    actionLabel: 'Email the secretary',
    status: 'verified',
  },
  {
    role: 'Treasurer',
    summary:
      'Club finance, payments, and financial administration.',
    actionLabel: 'Contact details pending',
    status: 'pending',
  },
  {
    role: "Children's Welfare Officer",
    summary:
      'Child welfare questions, safeguarding support, and reporting pathways.',
    href: '/club/safeguarding',
    actionLabel: 'Open safeguarding',
    status: 'verified',
  },
  {
    role: 'General Enquiries',
    summary:
      'Membership, registration, coaching, and general club questions.',
    email: 'info@rvrafc.ie',
    actionLabel: 'Email the club',
    status: 'verified',
  },
];

export const clubFacilities = {
  name: 'Ward Rivervalley Park',
  addressLines: [
    'Ward Rivervalley Park',
    'Swords, Co. Dublin',
    'D17 W2X3',
  ],
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=53.458,-6.221',
  features: [
    {
      label: 'Community hire',
      value: 'Astro booking information is available online.',
      status: 'verified' as const,
    },
    {
      label: 'Accessibility',
      value: 'Detailed step-free access information requires club confirmation.',
      status: 'pending' as const,
    },
    {
      label: 'Parking',
      value: 'Parking arrangements and matchday restrictions require club confirmation.',
      status: 'pending' as const,
    },
    {
      label: 'Clubhouse and changing facilities',
      value: 'Facility details require club confirmation.',
      status: 'pending' as const,
    },
  ],
};

export const clubPolicies: ClubPolicy[] = [
  {
    title: 'Safeguarding',
    description:
      'Child welfare contacts, public safeguarding documents, and Garda Vetting guidance.',
    href: '/club/safeguarding',
    actionLabel: 'Open safeguarding hub',
    status: 'available',
  },
  {
    title: 'Code of Conduct',
    description:
      'Expected standards for players, parents, guardians, coaches, and volunteers.',
    href: '/documents/code-of-conduct.pdf',
    actionLabel: 'Download PDF',
    status: 'available',
  },
  {
    title: 'Complaints Procedure',
    description:
      'The approved public complaints and escalation procedure has not yet been supplied.',
    status: 'pending',
  },
  {
    title: 'Privacy Policy',
    description:
      'The approved club privacy policy document has not yet been supplied.',
    status: 'pending',
  },
  {
    title: 'Club Constitution',
    description:
      'The current approved club constitution has not yet been supplied.',
    status: 'pending',
  },
];
