# RVR2026 — Local Setup Guide

## Prerequisites

- Node.js 20+
- PostgreSQL 15+ (local install or Docker)
- A Vercel account (for environment variable reference and deployment)

## Environment variables

Copy `.env.example` to `.env.local` and fill in the values below.
`prisma.config.ts`, Next.js, and the project scripts all read `.env.local`.

### Database
```
DATABASE_URL=postgresql://user:password@localhost:5432/rvr2026
```

### Admin authentication
```
AUTH_SECRET=your-long-random-secret
AUTH_RESEND_KEY=re_...
EMAIL_FROM=noreply@rivervalleyrangers.ie
```
Administrators sign in by email magic link at `/admin/login`. Access is granted by
the `GlobalRole` stored on the matching `AdminUser` record. `SITE_ADMIN` can manage
site content; `SUPER_ADMIN` can also manage competitions and administrator access.

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

### Cloudflare Turnstile (spam protection)
```
NEXT_PUBLIC_TURNSTILE_SITE_KEY=   # public — safe to expose in client bundles
TURNSTILE_SECRET_KEY=             # server-only — never commit or expose
```
Both vars are required for form submissions on `/register`, `/get-involved`, `/sponsorship`,
`/walking-football`, `/football-for-all`, and `/boot-room` to pass server-side bot verification.
In local development the server helper logs a warning and passes through if `TURNSTILE_SECRET_KEY`
is unset — set it from `.env.local` to test end-to-end.
Obtain keys from the [Cloudflare Turnstile dashboard](https://dash.cloudflare.com/?to=/:account/turnstile).

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
3. Set `DATABASE_URL` in `.env.local`
4. Run `npx prisma migrate deploy` to apply committed migrations
5. Run `npm run dev` to start the development server on `http://localhost:3000`

## Season rollover (every August)

1. Update `currentSeason`, `registrationSeason`, and `anniversaryYears` in `config/club-season.ts`
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

Open `/admin/login`, request a magic link using an email already present in the
`AdminUser` table, and follow the link from that mailbox. Admin sessions expire
after eight hours of inactivity and only one session per administrator is retained.

## Terms acceptance

Every public submission form must record a `TermsAcceptance` row in the same
transaction as the parent record. Use `buildTermsAcceptanceCreate()` from
`lib/terms/record-acceptance.ts` inside `prisma.$transaction([])`.

When terms wording changes for a given form type, bump the version string in
`lib/terms/versions.ts`. Old acceptance records retain the version they were
accepted under.

## Versioning

Bump `APP_VERSION` in `config/version.ts` at each release.
Add an entry to `CHANGELOG.md` following [Keep a Changelog](https://keepachangelog.com) format.
