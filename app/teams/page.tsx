import type { Metadata } from 'next';
import Header from '@/components/Header';
import ComingSoon from '@/components/ComingSoon';

export const metadata: Metadata = {
  title: 'Teams | Rivervalley Rangers AFC',
  description: 'Girls, Women, Boys, and Men\'s squads across all age groups and formats at Rivervalley Rangers AFC.',
};

export default function TeamsPage() {
  return (
    <>
      <Header />
      <ComingSoon
        section="Teams"
        description="Squad pages for all age groups and formats — Girls, Women, Boys, and Men — are being finalised. Full rosters, schedules, and coaching staff will be published here."
      />
    </>
  );
}
