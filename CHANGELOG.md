# Changelog

All notable changes to RVR2026 are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

## [1.1.0] — 2026-06-27

feat: Competition Management System — auth, schema, upload pipeline, public view, squad card generation

- NextAuth.js v5 magic-link login at `/competitions/login`; roles SUPER_ADMIN / EVENT_ADMIN / PITCH_ADMIN
- New Prisma models: AdminUser, AuthAccount, AuthSession, VerificationToken, Competition, CompetitionVenue, CompetitionTeam, PlayerPoolEntry, TeamPlayer, Fixture, CompetitionAssignment
- CSV/XLSX upload with fuzzy column detection, per-row flagging, GDPR notice gate, displayName-only public surfaces
- Theme pools (Countries, PL, LOI, Legends, Colours, Animals), Fisher-Yates randomiser, even team distribution
- Fixture generation for mini league, knockout, group+knockout, blitz, festival
- Public view `/competitions/[slug]` — Now / Fixtures / Standings / Teams tabs
- Squad card PNG generation via Satori at `/api/competitions/[id]/squad-card/[teamId]`
- Pitch Admin stripped score-entry UI for parent volunteers
- GDPR purge cron at `/api/cron/competitions-purge`

## [1.0.4] - 2026-06-22

### Added
- feat: static Instagram feed section (POC hardcoded data)

## [1.0.3] - 2026-06-22

### Added
- feat: sliding pinned announcement notification widget

## [1.0.2] - 2026-06-21

### Added
- Custom 404 page (app/not-found.tsx) — football pitch out-of-play theme
- /seniors/over-35s hub page and individual A/B team pages
- /seniors/lsl-div3b and /seniors/lsl-div3c senior team pages
- Over 35s section on /fixtures page with AFL standings (Over35sFixtureList)
- /api/over35s/standings route proxying AFL scraper data
- ?filter= URL param support on /teams page (boys/girls/senior/over35s)
- Div 3B Saturday and Div 3C Saturday cards to /teams Senior section

### Changed
- Header.tsx nav consolidated: TEAMS dropdown now contains all team categories (DDSL Boys/Girls, Seniors, Over 35s) with grouped flat links
- Mobile nav restructured with section headers and indented sub-links
- Header max-width increased to max-w-7xl, nav centred on desktop
- Homepage stats: team count now includes all squads, age range corrected to U8–U15
- /seniors/first-team filtered to LSL Senior 1B Sunday only (excludes Div 3B and Div 3C matches)

### Removed
- /league-tables page (permanent redirect to /teams added)
- Seniors and Over 35s as separate root-level nav items

## [1.0.1] - 2026-06-18

### Added

#### Club teams registry and dedicated pages
- `config/club-teams.ts` — typed registry of 8 non-DDSL club teams across 5 categories
  (academy, adult, community, inclusive, events) with `ClubTeam` interface,
  `findClubTeam()` and `getClubTeamsByCategory()` helpers
- `/club-teams` — index page grouping all teams by category with card grid
  (1 col mobile, 2 col md, 3 col lg); each card links to its dedicated page
- `/club-teams/[slug]` — static team page per `generateStaticParams()`; sections:
  hero, description + marketing copy, training info, contact, CTA, back link;
  all touch targets ≥ 44px; mobile-first layout throughout
- Homepage "More Than A Football Club" section — 4 category cards
  (Academy · Adult · Community · Inclusive) between teams grid and registration banner
- "All Teams" nav link — added to "Girls & Women" desktop dropdown and mobile
  utility drawer; links to `/club-teams`

### Changed
- `app/page.tsx` — inserted community categories section; section numbering updated
- `components/Header.tsx` — "All Teams → /club-teams" added to Girls & Women links
  and utilityLinks (mobile Club Essentials drawer)

## [1.0.0] - 2026-06-18

### Added

#### Project scaffold
- Next.js 16 App Router project with TypeScript strict mode
- Tailwind CSS v4 with CSS-first config (`@import "tailwindcss"`) and brand token design system:
  `brand-navy`, `brand-neon`, `brand-green`, `brand-charcoal`, `brand-cream`, `brand-sky`, `brand-maroon`
- Brutalist card and button component classes (`brutalist-card`, `btn-brutalist-neon`, `btn-brutalist-green`)
- `APP_VERSION` constant at `config/version.ts` — single source of truth for release versioning
- `CLUB_SEASON` config at `config/club-season.ts` — single source of truth for season label, age ranges, founding year

#### Homepage & hero
- Self-hosted hero video (`/videos/hero.mp4`) with neon hairline grid overlay and gradient overlay
- Five stat cards with CSS-only `explode-in` scatter-then-snap entrance animation
- `@keyframes explode-in` registered in `app/globals.css` via Tailwind v4 `@theme`

#### Database & ORM
- PostgreSQL via Prisma ORM with `@prisma/adapter-pg` (driver adapter pattern)
- Migration baseline established; new changes applied via `prisma migrate dev`
- Prisma models:
  - `Season`, `HistoricalStanding`
  - `StaffMember`, `TeamAssignment`, `ComplianceAlert`, `ComplianceCheck`
  - `CoachProfile`, `ClubWelfareContact`
  - `PlayerProfile`, `ParentConsent`
  - `MembershipOrder`, `MembershipMember`, `StripeSubscription`
  - `FundraisingCampaign`, `Donation`, `KitDesignSubmission`, `KitDesignVote`
  - `KitSubmission`, `VoteRecord`, `LottoDraw`, `FunRunRegistration`
  - `TermsAcceptance` — legal audit trail for all public form submissions
  - `ShirtSubmission` — anniversary shirt design orders with moderation gating

#### DDSL data pipeline
- Scraper (`lib/ddsl/scraper.ts`) using Chrome User-Agent to bypass DDSL AJAX access denial
- In-memory cache (`lib/ddsl/cache.ts`) with 15-minute TTL
- Transform (`lib/ddsl/transform.ts`) and normalise (`lib/ddsl/normalize.ts`) pipeline
- Persist layer (`lib/ddsl/persist.ts`) writing to `HistoricalStanding`
- Division filter (`lib/ddsl/division-filter.ts`) and mercy rule (`lib/ddsl/mercy-rule.ts`)
- Local seed stubs (`lib/ddsl/local-seed.ts`) for development without live scraping
- KNOWN_DIVISIONS registry in `config/ddsl-competitions.ts` — 28 confirmed RVR competitions for 2025/26

#### API routes
- `GET /api/fixtures/sync` — on-demand DDSL scrape with 15-minute cache
- `GET /api/fixtures` — cached fixture list
- `GET /api/fixtures/tables` — cached league table data
- `GET /api/ddsl/fixtures` — raw DDSL fixture feed
- `GET /api/ddsl/results` — raw DDSL results feed
- `GET /api/ddsl/live` — live match data
- `GET /api/historical/standings` — historical season standings
- `GET /api/health` — health check endpoint
- `GET /api/coaches` and `GET /api/teams/[team]/coaches` — public coach directory (compliance-filtered)
- `POST /api/cron/ddsl-sync` — Vercel Cron daily standings sync (auth: `CRON_SECRET`)
- `POST /api/cron/safeguarding` — weekly FAI compliance check and email alerts (auth: `CRON_SECRET`)
- `POST /api/player-recruitment` — player recruitment form submission
- `POST /api/membership/calculate` — membership fee calculation
- `POST /api/membership/webhook` — Stripe webhook handler
- `POST /api/webhooks/stripe` — Stripe event processor
- `POST /api/kit-submissions/[id]/vote` — public kit design vote
- `POST /api/club/vetting` — coach vetting status update
- `POST /api/shirts/submit` — anniversary shirt submission (atomic transaction with `TermsAcceptance`)
- `POST /api/admin/moderation/shirts/[id]/approve` — approve shirt submission (auth: `ADMIN_SECRET`)
- `POST /api/admin/moderation/shirts/[id]/reject` — reject shirt submission (auth: `ADMIN_SECRET`)

#### Terms acceptance pattern
- `lib/terms/submission-types.ts` — typed `SUBMISSION_TYPES` constants
- `lib/terms/versions.ts` — per-type version strings; bump here when terms wording changes
- `lib/terms/record-acceptance.ts` — `buildTermsAcceptanceCreate()` returns a `PrismaPromise` for use inside `prisma.$transaction([])`
- `lib/terms/request-meta.ts` — extracts IP and user-agent from `NextRequest`
- `lib/terms/validate-agreement.ts` — server-side guard requiring `agreedToTerms: true`

#### Safeguarding & compliance
- `lib/safeguarding/compliance-checker.ts` — evaluates FAI vetting and safeguarding deadlines
- `lib/safeguarding/email-templates.ts` — HTML email templates for compliance alerts
- `lib/safeguarding/mailer.ts` — Nodemailer SMTP wrapper with graceful no-op when `SMTP_HOST` is unset
- `lib/safeguarding/public-filter.ts` — strips non-compliant staff from public API responses

#### Admin moderation
- `/admin/moderation` — server-rendered queue of `PENDING` shirt submissions
- `ModerationActions` client component with loading state and `router.refresh()` on success
- `middleware.ts` protecting all `/admin/*` routes via `Authorization: Bearer $ADMIN_SECRET`
- Version string displayed in site footer and admin page header
