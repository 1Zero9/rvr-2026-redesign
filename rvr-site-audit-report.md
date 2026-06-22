# RVR2026 Post-Fix Audit — 2026-06-22

## Result

The revised local production build is ready for deployment. The previous
critical and high-priority findings have either been fixed or intentionally
parked behind disabled admin-controlled feature flags.

The currently deployed Vercel build has not been updated by this work and must
be redeployed before these results apply to the public URL.

## Verification completed

- ESLint: zero errors and zero warnings
- Static security audit: clean
- Prisma schema: valid
- Database migration: applied successfully
- Production build: passes with no Turbopack or PostgreSQL SSL warnings
- Database connectivity: healthy
- Local `/api/health`: HTTP 200
- Enquiry API: persistence verified with a temporary record, then removed
- Desktop and 390×844 mobile browser checks completed
- Fixtures mobile overflow: resolved
- Audited mobile interactive targets: no remaining sub-44px targets
- Search dialog: absent while closed, focused while open, trigger focus restored
- Canonical and Open Graph metadata: present
- `robots.txt`, `sitemap.xml`, and `manifest.webmanifest`: HTTP 200
- `/admin/*` and `/jmo-admin`: protected by signed admin sessions

## Feature availability

The following optional capabilities now fail closed and can be controlled at
`/admin/features`:

- Stripe payments: disabled
- Club lotto: disabled
- Instagram preview feed: disabled
- Anniversary kit competition: disabled

Stripe environment variables are only required by `/api/health` when Stripe
payments are enabled. Membership checkout and Stripe webhooks return unavailable
responses while the feature is disabled.

## Functional fixes

- Football For All callback requests now persist to the admin enquiry inbox.
- JMO interest forms now persist to the admin enquiry inbox.
- False client-only success confirmations were removed.
- Placeholder Football For All coordinator name and phone number were removed.
- `/admin/enquiries` provides a review queue with new/resolved status.
- The published `TEST` announcement was unpublished.
- Placeholder Instagram content is hidden by default.
- The anniversary kit prototype and sample gallery are hidden by default.
- The campaigns page now reports that no campaigns are open rather than showing
  generic “Coming Soon” copy.

## Accessibility and responsive fixes

- Closed search controls are removed from the accessibility tree.
- Search focus returns to its trigger when closed.
- Player registration now has an `h1`.
- Fixtures no longer overflow at 390px.
- Football For All fields, controls, attribution links, and testimonial controls
  meet the 44px target baseline.
- Invalid JSX SVG attributes were corrected.

## Security fixes

- The admin secret is no longer stored directly in a browser cookie.
- Admin cookies now contain a signed, expiring session token.
- The admin secret is no longer serialized into moderation page JavaScript.
- Admin mutations verify the authenticated session server-side.
- The JMO administration route is protected by the same admin proxy.
- Admin routes are marked `noindex`.

## Search and metadata fixes

- Added route-aware canonical URLs.
- Added Open Graph and Twitter metadata.
- Added route-specific metadata for membership, Football For All, JMO, Colour
  Fun Run, and the anniversary kit.
- Added generated robots, sitemap, and web manifest routes.
- Disabled campaign routes are excluded from the sitemap.

## Remaining review items

These are not release blockers for the current disabled-feature configuration:

1. Deploy the current branch and repeat the health/metadata smoke check against
   the Vercel URL.
2. Confirm the Football For All testimonials are approved real quotations.
3. Decide whether enquiry submissions also need email notifications in addition
   to the admin inbox.
4. Configure Stripe secrets before enabling Stripe payments.
5. Configure and verify the lotto provider before enabling club lotto.
6. Replace the placeholder Instagram dataset before enabling the Instagram feed.
7. Complete the anniversary kit upload endpoint before enabling that campaign.
