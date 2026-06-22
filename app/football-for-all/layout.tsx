import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Football For All | Rivervalley Rangers AFC',
  description:
    'Inclusive, adaptive, mixed-ability, and walking football programmes at Rivervalley Rangers AFC in Swords.',
};

export default function FootballForAllLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
