import type { Metadata } from 'next';
import Header from '@/components/Header';
import ComingSoon from '@/components/ComingSoon';

export const metadata: Metadata = {
  title: 'Club | Rivervalley Rangers AFC',
  description: 'The story, values, and governance of Rivervalley Rangers AFC — Swords\' community football club since 1981.',
};

export default function ClubPage() {
  return (
    <>
      <Header />
      <ComingSoon
        section="Club"
        description="Our history, committee, governance documents, and child safeguarding policy are being prepared. This page will be the authoritative home for all club information."
      />
    </>
  );
}
