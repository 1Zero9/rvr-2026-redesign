import type { Metadata } from 'next';
import Header from '@/components/Header';
import ComingSoon from '@/components/ComingSoon';

export const metadata: Metadata = {
  title: 'Shop | Rivervalley Rangers AFC',
  description: 'Official Rivervalley Rangers AFC kit, training wear, and accessories.',
};

export default function ShopPage() {
  return (
    <>
      <Header />
      <ComingSoon
        section="Shop"
        description="The official RVR online shop — club kit, training wear, and accessories — is coming soon. Kit ordering will open in line with the 2026/27 season registration window."
      />
    </>
  );
}
