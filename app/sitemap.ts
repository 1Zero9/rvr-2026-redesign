import type { MetadataRoute } from 'next';
import { getFeatureAvailability } from '@/lib/features';

const SITE_URL = 'https://rvr-2026-redesign.vercel.app';

const routes = [
  '',
  '/astro-booking',
  '/boot-room',
  '/campaigns',
  '/club',
  '/club/safeguarding',
  '/contact',
  '/ddsl-jmo',
  '/fixtures',
  '/football-for-all',
  '/get-involved',
  '/membership-calculator',
  '/news',
  '/register',
  '/seniors',
  '/seniors/first-team',
  '/seniors/lsl-div3b',
  '/seniors/lsl-div3c',
  '/seniors/over-35s',
  '/seniors/over-35s/over35s-a',
  '/seniors/over-35s/over35s-b',
  '/shop',
  '/sponsorship',
  '/teams',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const features = await getFeatureAvailability();
  const enabledRoutes = [...routes];

  if (features.anniversaryKit) {
    enabledRoutes.push('/campaigns/45th-anniversary-kit');
  }

  return enabledRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/news' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.7,
  }));
}
