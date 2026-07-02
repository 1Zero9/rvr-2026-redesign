import type { MetadataRoute } from 'next';

const SITE_URL = 'https://www.rivervalleyrangers.ie';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Standard crawlers and search engines
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/jmo-admin/', '/api/'],
      },
      {
        // AI assistants — allow indexing for visibility in AI search
        userAgent: ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'PerplexityBot', 'ClaudeBot', 'anthropic-ai', 'Applebot-Extended'],
        allow: '/',
        disallow: ['/admin/', '/jmo-admin/', '/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
