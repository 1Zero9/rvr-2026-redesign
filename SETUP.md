# RVR2026 — Local Setup Guide

## Prerequisites

- Node.js 20+
- PostgreSQL 15+ (local install or Docker)
- A Vercel account (for environment variable reference and deployment)

## Environment variables

Copy `.env.local.example` to `.env.local` and fill in the values below.
`prisma.config.ts` reads from `.env` (via `dotenv/config`), not `.env.local` —
for local dev, export `DATABASE_URL` in your shell or create a `.env` file
alongside `.env.local`.

### Database
```
DATABASE_URL=postgresql://user:password@localhost:5432/rvr2026
```

### Admin
```
ADMIN_SECRET=your-long-random-secret
```
All `/admin/*` routes require `Authorization: Bearer $ADMIN_SECRET`.

### Cron
```
CRON_SECRET=your-long-random-secret
```
Both cron routes (`/api/cron/ddsl-sync` and `/api/cron/safeguarding`) require
`Authorization: Bearer $CRON_SECRET`. Vercel Cron sets this automatically in
production when configured in `vercel.json`.

### Stripe
```
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

### Email (SMTP)
```
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=River Valley Rangers AFC <noreply@rivervalleyrangers.ie>
```
The mailer (`lib/safeguarding/mailer.ts`) no-ops gracefully if `SMTP_HOST` is
unset — local development does not require a live SMTP connection.

## Setup steps

1. Clone the repo and `cd` into it
2. Run `npm install`
3. Set `DATABASE_URL` in `.env` (or export it in your shell)
4. Run `npx prisma migrate dev` to apply all migrations
5. Run `npm run dev` to start the development server on `http://localhost:3000`

## Season rollover (every August)

1. Update `currentSeason` and `anniversaryYears` in `config/club-season.ts`
2. Replace all `sportlomoId` values in `config/ddsl-competitions.ts` with the
   new season's competition IDs from the DDSL admin panel
3. Update stub data in `lib/ddsl/local-seed.ts`
4. Run `npx prisma migrate dev --name <description>` if schema changes are needed
5. Deploy to Vercel — the daily cron will auto-detect new league IDs on first run

## Cron jobs

| Schedule         | Path                      | Purpose                                        |
|------------------|---------------------------|------------------------------------------------|
| Daily 07:00 UTC  | `/api/cron/ddsl-sync`     | Scrape standings, persist, detect new teams    |
| Monday 08:00 UTC | `/api/cron/safeguarding`  | FAI compliance check + email alerts            |

Both are configured in `vercel.json`. Auth: `Authorization: Bearer $CRON_SECRET`.

## Admin access

`/admin/moderation` requires `Authorization: Bearer $ADMIN_SECRET` — enforced
by `middleware.ts` at the edge. There is no login UI by design; this is an
internal tool. In production, access it via:

```bash
curl https://rvr2026.vercel.app/admin/moderation \
  -H "Authorization: Bearer $ADMIN_SECRET"
```

Or use a browser extension such as ModHeader to inject the header.

## Approving / rejecting shirt submissions

```bash
# Approve
curl -X POST https://rvr2026.vercel.app/api/admin/moderation/shirts/<id>/approve \
  -H "Authorization: Bearer $ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"reviewedBy":"admin"}'

# Reject
curl -X POST https://rvr2026.vercel.app/api/admin/moderation/shirts/<id>/reject \
  -H "Authorization: Bearer $ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"reviewedBy":"admin","notes":"Does not meet design guidelines."}'
```

## Terms acceptance

Every public submission form must record a `TermsAcceptance` row in the same
transaction as the parent record. Use `buildTermsAcceptanceCreate()` from
`lib/terms/record-acceptance.ts` inside `prisma.$transaction([])`. See
`app/api/shirts/submit/route.ts` for the reference implementation.

When terms wording changes for a given form type, bump the version string in
`lib/terms/versions.ts`. Old acceptance records retain the version they were
accepted under.

## Versioning

Bump `APP_VERSION` in `config/version.ts` at each release.
Add an entry to `CHANGELOG.md` following [Keep a Changelog](https://keepachangelog.com) format.
