import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";

const securityHeaders = [
  // Prevent framing (clickjacking)
  { key: "X-Frame-Options", value: "DENY" },
  // Block MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Only send origin on cross-origin requests, full referrer on same-origin
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Enforce HTTPS for 2 years with subdomains; submit to preload list once live
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Disable browser features not used by this site
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(self)",
  },
  // Content-Security-Policy
  // 'unsafe-inline' for styles is needed by Tailwind CSS-in-JS and Next.js inline styles.
  // React requires 'unsafe-eval' for development diagnostics. It remains disabled
  // in production, where neither React nor Next.js requires it.
  // Stripe JS (checkout) requires js.stripe.com and hooks.stripe.com.
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""} https://js.stripe.com`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.stripe.com https://hooks.stripe.com https://api.sportlomo.com https://widgets.sportlomo.com https://ddsl.ie",
      "frame-src https://js.stripe.com https://hooks.stripe.com https://docs.google.com",
      "form-action 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "media-src 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        // Stripe webhooks must not be redirected or modified by headers
        // that could alter the raw body — keep them clean
        source: "/api/webhooks/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/club-teams',
        destination: '/teams',
        permanent: true,
      },
      {
        source: '/club-teams/:slug*',
        destination: '/teams',
        permanent: true,
      },
      {
        source: '/teams/matches',
        destination: '/fixtures',
        permanent: true,
      },
      {
        source: '/club/anniversary',
        destination: '/campaigns/45th-anniversary-kit',
        permanent: true,
      },
      {
        source: '/tables',
        destination: '/teams',
        permanent: true,
      },
      {
        source: '/adult',
        destination: '/seniors',
        permanent: false,
      },
      {
        source: '/community',
        destination: '/club',
        permanent: false,
      },
      {
        source: '/inclusive',
        destination: '/football-for-all',
        permanent: false,
      },
      {
        source: '/fees',
        destination: '/register',
        permanent: false,
      },
      {
        source: '/book-astro-pitch',
        destination: '/astro-booking',
        permanent: false,
      },
      {
        source: '/league-tables',
        destination: '/teams',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
