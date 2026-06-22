import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Colour Fun Run | Rivervalley Rangers AFC',
  description:
    'Rivervalley Rangers AFC family colour fun run information, event details, and registration options.',
};

export default function ColourFunRunLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
