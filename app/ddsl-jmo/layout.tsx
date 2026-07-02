import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Junior Match Officials',
  description:
    'Register interest in Junior Match Official training and referee development with Rivervalley Rangers AFC.',
};

export default function JmoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
