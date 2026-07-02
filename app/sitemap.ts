import type { MetadataRoute } from 'next';
import { getFeatureAvailability } from '@/lib/features';

const SITE_URL = 'https://www.rivervalleyrangers.ie';

type RouteConfig = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
};

const routes: RouteConfig[] = [
  // ── Core pages (highest priority) ──────────────────────────────────────────
  { path: '',                          changeFrequency: 'weekly',  priority: 1.0 },
  { path: '/teams',                    changeFrequency: 'weekly',  priority: 0.9 },
  { path: '/fixtures',                 changeFrequency: 'daily',   priority: 0.9 },
  { path: '/register',                 changeFrequency: 'monthly', priority: 0.9 },
  { path: '/news',                     changeFrequency: 'weekly',  priority: 0.8 },
  { path: '/academy',                  changeFrequency: 'monthly', priority: 0.8 },

  // ── Seniors ─────────────────────────────────────────────────────────────────
  { path: '/seniors',                  changeFrequency: 'monthly', priority: 0.7 },
  { path: '/seniors/first-team',       changeFrequency: 'weekly',  priority: 0.7 },
  { path: '/seniors/lsl-div3b',        changeFrequency: 'weekly',  priority: 0.6 },
  { path: '/seniors/lsl-div3c',        changeFrequency: 'weekly',  priority: 0.6 },
  { path: '/seniors/over-35s',         changeFrequency: 'monthly', priority: 0.6 },
  { path: '/seniors/over-35s/over35s-a', changeFrequency: 'weekly', priority: 0.6 },
  { path: '/seniors/over-35s/over35s-b', changeFrequency: 'weekly', priority: 0.6 },

  // ── Programmes ──────────────────────────────────────────────────────────────
  { path: '/football-for-all',         changeFrequency: 'monthly', priority: 0.7 },
  { path: '/walking-football',         changeFrequency: 'monthly', priority: 0.7 },
  { path: '/trials',                   changeFrequency: 'monthly', priority: 0.6 },

  // ── Club information ────────────────────────────────────────────────────────
  { path: '/club',                     changeFrequency: 'monthly', priority: 0.7 },
  { path: '/club/safeguarding',        changeFrequency: 'monthly', priority: 0.7 },
  { path: '/contact',                  changeFrequency: 'monthly', priority: 0.7 },
  { path: '/get-involved',             changeFrequency: 'monthly', priority: 0.6 },
  { path: '/sponsorship',              changeFrequency: 'monthly', priority: 0.6 },
  { path: '/pitch-locations',          changeFrequency: 'monthly', priority: 0.5 },
  { path: '/privacy',                  changeFrequency: 'yearly',  priority: 0.3 },

  // ── Tools ───────────────────────────────────────────────────────────────────
  { path: '/membership-calculator',    changeFrequency: 'monthly', priority: 0.6 },
  { path: '/astro-booking',            changeFrequency: 'monthly', priority: 0.6 },
  { path: '/boot-room',                changeFrequency: 'monthly', priority: 0.5 },
  { path: '/shop',                     changeFrequency: 'monthly', priority: 0.5 },
  { path: '/campaigns',                changeFrequency: 'monthly', priority: 0.5 },

  // ── DDSL-JMO ────────────────────────────────────────────────────────────────
  { path: '/ddsl-jmo',                 changeFrequency: 'monthly', priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const features = await getFeatureAvailability();
  const enabledRoutes = [...routes];

  if (features.anniversaryKit) {
    enabledRoutes.push({ path: '/campaigns/45th-anniversary-kit', changeFrequency: 'monthly', priority: 0.5 });
  }

  return enabledRoutes.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
