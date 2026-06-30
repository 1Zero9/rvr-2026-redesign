import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Rivervalley Rangers AFC',
    short_name: 'RVR AFC',
    description: 'Rivervalley Rangers AFC community football club in Swords.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAF8F5',
    theme_color: '#0B1F3B',
    icons: [
      {
        src: '/river-valley-rangers-logo-pack-v2/icon-new.png',
        sizes: '1000x1000',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/river-valley-rangers-logo-pack-v2/icon-new.png',
        sizes: '1000x1000',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
