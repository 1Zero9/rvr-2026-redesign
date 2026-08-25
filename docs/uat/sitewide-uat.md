# Sitewide UAT Coordination

This PR is the shared record for a full-site UAT pass between Codex and Claude.
Use PR comments for discussion, push commits for fixes, and update this file only
when the checklist or final sign-off state changes.

## Scope

- Public homepage, navigation, search, footer, and announcement surfaces
- Public content pages for club, teams, seniors, fixtures, news, campaigns, and community programmes
- Public forms and conversion journeys: contact, register, pay fees, refereeing, boot room, campaigns, membership calculator
- Admin/editor journeys where access is available: login, noticeboard, hero rotation, campaigns, club moment, announcements, registrations, approvals
- Competition admin and public competition views
- Responsive UAT across mobile and desktop breakpoints
- Accessibility, content clarity, SEO basics, and error/loading states
- Build, typecheck, test, and known lint baseline

## Collaboration Protocol

- Codex posts UAT findings as PR comments with severity, route, reproduction steps, expected result, and evidence.
- Claude responds in PR comments, either agreeing, pushing a fix, or explicitly declining with rationale.
- After each Claude response or commit, Codex rechecks the changed area and posts a follow-up.
- Findings are considered closed when both agents agree or the user explicitly accepts the tradeoff.

## Severity

- P0: blocks core site use, payments, registration, or admin publishing
- P1: broken high-traffic journey, misleading content, major mobile/accessibility issue
- P2: visible defect or workflow friction with reasonable workaround
- P3: polish, copy, minor consistency, or follow-up improvement

## UAT Matrix

| Area | Routes / Journeys | Status | Owner Notes |
| --- | --- | --- | --- |
| Homepage and global shell | `/`, header nav, mobile nav, search, footer | In progress | Claude pass complete on nav/footer/search: 1 fix (UAT-005). Footer and search overlay reviewed, no other bugs. |
| Club and community pages | `/club`, `/club/history`, `/club/anniversary`, `/community`, `/sponsorship`, `/accessibility`, `/privacy` | In progress | Claude pass: no bugs found. |
| Programmes | `/academy`, `/football-for-all`, `/walking-football`, `/ladies-football`, `/trials`, `/pathway`, `/get-involved` | In progress | Claude pass: no bugs found. |
| Teams and seniors | `/teams`, `/teams/[slug]`, `/club-teams`, `/club-teams/[slug]`, `/seniors`, senior subpages, over-35s pages | In progress | Claude pass: 1 fix (UAT-009, downgraded to P3 — `/club-teams*` permanently redirects to `/teams` per `next.config.ts`, so the affected code is unreachable). |
| Fixtures and matchday | `/fixtures`, `/matchday`, `/pitch-locations` | In progress | Claude pass: no bugs found. |
| News and campaigns | `/news`, `/news/[id]`, `/campaigns`, campaign detail pages | In progress | Claude pass: no bugs found. |
| Registration and payments | `/register`, `/pay-fees`, `/membership-calculator`, Stripe/ClubZap handoff paths | In progress | Claude pass complete: 1 fix (UAT-003). No other bugs found; ClubZap iframes to `rvrafc.ie` confirmed intentional (migration in flight). |
| Contact and enquiry forms | `/contact`, `/club/refereeing`, `/boot-room`, campaign forms | In progress | Claude pass complete: 1 P1 fix (UAT-004). Codex's UAT-002 label fix reviewed and confirmed correct. |
| Competitions public | `/competitions/[slug]`, `/competitions/login` | In progress | Claude pass: no bugs found. |
| Competitions admin | `/competitions/admin` and nested admin routes | In progress | Claude pass: 1 P1 fix (UAT-008, missing auth check on state-transition action). |
| Site admin | `/admin`, noticeboard, hero media, campaigns, announcements, registrations, approvals | In progress | Claude pass complete: no bugs found. Verified `proxy.ts` + `app/admin/layout.tsx` two-layer auth gate (cookie presence at the edge, role check in layout) protects every nested route even where a page/action's own `requireAdmin()` looks like the only guard. |
| API health and integrations | `/api/health`, fixtures, DDSL, membership calculation, contact/enquiry APIs | In progress | `/api/health` OK; feature flags OK. Membership calculation currently 503 because online payments are feature-disabled. |
| Responsive and accessibility | 390px mobile, tablet, desktop, keyboard, reduced motion, contrast | In progress | Initial 390px and 1440px route sweep found no horizontal overflow. Claude pass: 2 fixes (UAT-006, UAT-007). `Hero.tsx` reduced-motion handling (video, carousel, pixelate reveal, zoom animation) verified correct. |
| Build and automated checks | `npm run typecheck`, `npm test`, `npm run build`, `npm run lint` baseline | In progress | Re-verified after all Claude fixes (commit `24d92e7`): typecheck, tests (6/6), and build pass. Lint fails on pre-existing baseline issues only. |

## Findings

### UAT-001 — P3 — Duplicate site name in some document titles

Some pages set `metadata.title` to a string that already includes
`Rivervalley Rangers AFC`; the root metadata template then appends
`| Rivervalley Rangers AFC` again.

Observed examples:

- `/club/history`
- `/academy`
- `/ladies-football`
- `/pathway`
- `/teams/u7-boys`

Expected: page title should include the page-specific title plus one site suffix.

Actual examples:

- `Club History | Rivervalley Rangers AFC | Rivervalley Rangers AFC`
- `Development Academy | Rivervalley Rangers AFC | Rivervalley Rangers AFC`

Fix: removed the redundant `| Rivervalley Rangers AFC` suffix from each
page's own `title` (`app/club/history/page.tsx`, `app/academy/page.tsx`,
`app/ladies-football/page.tsx`, `app/pathway/page.tsx`, and the
`generateMetadata` in `app/teams/[slug]/page.tsx`, which covers every team
slug including `/teams/u7-boys`) — the root layout's `title.template`
already appends the site suffix once.

Validation: typecheck passes; grepped the whole `app/` tree for any other
`title:`/`` title: `...` `` string containing the literal site name to
confirm these were the only five affected.

Status: Fixed by Claude, commit `523d822`.

### UAT-002 — P2 — Contact form fields used placeholders as accessible names

The compact public `ContactForm` instances on `/contact` and
`/football-for-all` displayed visible placeholder text but had no label,
`aria-label`, or `aria-labelledby` for the name, email, and message fields.

Impact: screen reader and voice-control users could encounter unnamed required
fields, especially on the three separate contact cards on `/contact`.

Fix: added programmatic labels and form `name` attributes in
`components/ContactForm.tsx` while preserving the current visual layout.

Validation: typecheck passes; browser accessibility spot check reports zero
unlabeled visible controls on `/contact` and `/football-for-all`.

Status: Fixed by Codex; reviewed and confirmed correct by Claude.

### UAT-003 — P2 — Membership calculator sibling discount matched by name, not id

`app/membership-calculator/page.tsx` looked up each family member's computed
sibling-discount price from `siblingLines` by matching `member.name`. Two
family members sharing the same display name (default names are unique, but
a parent can rename both to the same text, e.g. twins) would both render
whichever entry matched first — the wrong price/discount shown right before
the user goes to `/pay-fees`.

Fix: match `siblingLines` entries by `member.id` (unique, stable across
add/remove) instead of `name`, in both the family-builder list and the cost
summary panel.

Validation: typecheck passes; unique-name case (the common path) is
byte-for-byte unchanged.

Status: Fixed by Claude, commit `9cefa03`.

### UAT-004 — P1 — Two enquiry forms always fail Turnstile bot check in production

`RefInterestForm` (`/club/refereeing`) and the "Request a Friendly Call Back"
form (`/football-for-all`) both POST to `/api/enquiries`, which calls
`verifyTurnstile(body.turnstileToken, ip)`. That function returns `false`
whenever the token is empty, once `TURNSTILE_SECRET_KEY` is configured
(i.e. in production). Neither form ever rendered a `TurnstileWidget` or sent
a `turnstileToken`, so every real submission would receive a 403 "Bot check
failed" error — both conversion journeys were silently broken end-to-end in
production, while working in local/dev (where the check bypasses without a
secret key configured).

Impact: prospective referees and Football For All families requesting a
callback could never successfully submit either form once deployed.

Fix: wired both forms up the same way `ContactForm`/`PublicEnquiryForm`
already do — added `TurnstileWidget`, tracked the token in state, and
included `turnstileToken` in the POST body.

Validation: typecheck passes.

Status: Fixed by Claude, commit `0e2801e`.

### UAT-005 — P3 — Header nav highlights wrong/no section on several real routes

`Header.tsx`'s `isNavActive` (desktop mega-menu) and `isMobileSectionActive`
(mobile drawer) hardcode which pathnames belong to each nav section,
independent of the actual link lists (`NAV_SECTIONS` / `MOBILE_NAV_SECTIONS`).
The two lists had drifted:

- `pathname.startsWith('/club')` also matched the unrelated `/club-teams` and
  `/club-teams/[slug]` routes, so visiting Club Teams pages lit up the "Club"
  nav item instead of nothing/"Play".
- `/swords` (linked under Club → About RVR) was never checked at all.
- `/campaigns` detail pages (`/campaigns/45th-anniversary-kit`,
  `/campaigns/colour-fun-run`) weren't matched on desktop or mobile, and
  desktop never matched even the `/campaigns` index.
- `/news/[id]` article pages weren't matched on desktop or mobile (only the
  exact `/news` index was) — meaning every individual news article, a
  high-traffic page type, failed to highlight "Club" in the nav.

Impact: cosmetic only — no broken links or blocked journeys, just incorrect
or missing active-state highlighting in the header nav on several real pages.

Fix: bounded the `/club` prefix match to `pathname === '/club' ||
pathname.startsWith('/club/')` (excludes `/club-teams`), and added the
missing `/swords`, `/campaigns`(+ prefix), and `/news/` prefix checks to both
`isNavActive` and `isMobileSectionActive` so desktop and mobile agree.

Validation: typecheck passes.

Status: Fixed by Claude, commit `d2228c1`.

### UAT-006 — P2 — Desktop mega-menu can't be closed by keyboard once focus moves past it

`Header.tsx`'s desktop mega-menu opened a section on hover, click, or focus,
and closed on mouse-leave (after a 150ms grace timer) or the global Escape
handler — but had no path to close when a keyboard user simply tabbed past
the open panel onto the next control (Search, Pay Fees, Instagram). The
panel stayed visually open, absolutely positioned over page content below
the header, until the user pressed Escape or clicked elsewhere.

Impact: keyboard-only users seeing a stray open dropdown floating over the
page after tabbing through it — no dead end, but a real "content doesn't
behave as expected" trap for non-mouse navigation.

Fix: added an `onBlur` handler on the `<nav>` container that closes the open
section only when focus leaves the entire nav (checked via
`e.currentTarget.contains(e.relatedTarget)`), so tabbing between sections
within the nav still works but tabbing out of it closes whatever was open.

Validation: typecheck passes.

Status: Fixed by Claude, commit `1537700`.

### UAT-007 — P3 — Duplicate "Skip to main content" link on 42+ public pages

`app/layout.tsx` (root layout, wraps every route) already renders one
"Skip to main content" link targeting `#main-content`. `PublicPageShell.tsx`
— used by 42+ public content pages — rendered a second, separately-styled
skip link with the same target, so keyboard and screen-reader users on any
of those pages hit two identical skip links before reaching the header nav.

Impact: minor but real — redundant/confusing first two tab stops on most
public pages.

Fix: removed the duplicate skip link from `PublicPageShell.tsx`; the root
layout's link already covers every route (including ones that don't use
`PublicPageShell`, like the homepage and admin).

Validation: typecheck passes.

Status: Fixed by Claude, commit `1537700`.

### UAT-008 — P1 — Competition state transitions could be triggered by a non-super-admin

`app/competitions/admin/[id]/page.tsx`'s `StateButton` component renders an
inline server action that calls `prisma.competition.update` to advance a
competition's state (`DRAFT` → `READY` → `LIVE` → `COMPLETE` → `ARCHIVED`).
The button itself was only rendered when `isSuperAdmin` was true, but that
check is client/render-side only — the server action closure had no
authorization check of its own. The page only requires
`requireEventAdmin(id)`, which also passes for a `CompetitionAssignment`
with role `EVENT_ADMIN` or `PITCH_ADMIN` (not just `SUPER_ADMIN`). So a
competition-scoped `EVENT_ADMIN`/`PITCH_ADMIN` — a real, lower-privilege
admin tier used in this codebase — could invoke the action directly and
transition a competition's state, an operation clearly intended to be
`SUPER_ADMIN`-only per the existing pattern in `deleteCompetition`
(`app/competitions/admin/page.tsx`), which does call `requireSuperAdmin()`.

Impact: an authenticated event/pitch admin for a competition could force it
`LIVE` or `ARCHIVED` early, bypassing the intended sign-off gate on a
public-facing competition's lifecycle.

Fix: added `await requireSuperAdmin();` as the first line of the action
closure, matching `deleteCompetition`'s existing pattern.

Validation: typecheck passes.

Status: Fixed by Claude, commit `279daa3`.

### UAT-009 — P3 — Club Teams detail page "All Teams" backlink pointed to `/teams`, but the whole route is dead code

**Correction after Codex's baseline sweep**: `next.config.ts` has a
permanent redirect for both `/club-teams` and `/club-teams/:slug*` to
`/teams`, so `app/club-teams/[slug]/page.tsx` (and the rest of the
`app/club-teams` tree) is never actually reachable — Next.js redirects the
request before that page component ever renders, the same way
`components/Navigation.tsx` was found to be dead/unimported code in the
mobile-nav pass. Originally filed as a P2 "wrong backlink sends users to
the wrong listing" — that impact doesn't apply to any real visitor, since
no real visitor can reach this page in the first place.

Fix (harmless, low-value but not reverted): the backlink's `href` still
changed from `/teams` to `/club-teams`, which is more internally correct
given the page's own `CLUB_TEAMS` data/content, in case this route is ever
un-redirected. The `/club-teams` bounding in UAT-005's `isNavActive` /
`isMobileSectionActive` fix is similarly precautionary rather than fixing
an active bug, since a real user's pathname can never actually be
`/club-teams*` — but it's still correct in isolation and doesn't hurt.

Validation: typecheck passes.

Status: Fixed by Claude (commit `279daa3`), reclassified P2 → P3 after
Codex's redirect finding; no live-user impact.

## Sign-off

- Codex: Pending
- Claude: Independent pass complete across all 8 matrix areas (registration/payments, contact/enquiry, site admin, mobile nav/shell, accessibility, remaining public pages, competitions). 9 findings total (UAT-001 through UAT-009), all fixed and typecheck/test/build-clean as of commit `24d92e7`. Awaiting Codex's final review and any last findings before full sign-off.
- User: Pending
