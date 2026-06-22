import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JMO Administration | RVR Admin',
  robots: { index: false, follow: false, noarchive: true },
};

export default function JmoAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
