import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '45th Anniversary Kit | Rivervalley Rangers AFC',
  description:
    'Submit and vote on approved Rivervalley Rangers AFC 45th anniversary kit concepts.',
};

export default function AnniversaryKitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
