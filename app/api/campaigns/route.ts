import { NextResponse } from 'next/server';
import { getActiveCampaigns } from '@/lib/campaigns';

export const revalidate = 300;

export async function GET() {
  const campaigns = await getActiveCampaigns();
  return NextResponse.json(
    campaigns.map((c) => ({
      id:         c.id,
      title:      c.title,
      subtitle:   c.subtitle,
      ctaLabel:   c.ctaLabel,
      ctaUrl:     c.ctaUrl,
      showBanner: c.showBanner,
    })),
  );
}
