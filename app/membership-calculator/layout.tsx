import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Membership Fee Calculator | Rivervalley Rangers AFC',
  description:
    'Estimate Rivervalley Rangers AFC individual and family membership fees before registration.',
};

export default function MembershipCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
