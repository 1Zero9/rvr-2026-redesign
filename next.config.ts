import type { NextConfig } from "next";

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
  // 'unsafe-eval' is kept off; Next.js in production mode does not require it.
  // Stripe JS (checkout) requires js.stripe.com and hooks.stripe.com.
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://js.stripe.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.stripe.com https://hooks.stripe.com https://api.sportlomo.com https://widgets.sportlomo.com https://ddsl.ie",
      "frame-src https://js.stripe.com https://hooks.stripe.com",
      "form-action 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "media-src 'self' https://assets.mixkit.co",
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

  // Disallow crawling of admin/api paths
  async redirects() {
    return [];
  },
};

export default nextConfig;
