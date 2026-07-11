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
| Homepage and global shell | `/`, header nav, mobile nav, search, footer | In progress | Initial desktop/mobile route render pass OK. Mobile nav open/close verified. |
| Club and community pages | `/club`, `/club/history`, `/club/anniversary`, `/community`, `/sponsorship`, `/accessibility`, `/privacy` | Not started |  |
| Programmes | `/academy`, `/football-for-all`, `/walking-football`, `/ladies-football`, `/trials`, `/pathway`, `/get-involved` | Not started |  |
| Teams and seniors | `/teams`, `/teams/[slug]`, `/club-teams`, `/club-teams/[slug]`, `/seniors`, senior subpages, over-35s pages | Not started |  |
| Fixtures and matchday | `/fixtures`, `/matchday`, `/pitch-locations` | Not started |  |
| News and campaigns | `/news`, `/news/[id]`, `/campaigns`, campaign detail pages | Not started |  |
| Registration and payments | `/register`, `/pay-fees`, `/membership-calculator`, Stripe/ClubZap handoff paths | In progress | Claude pass complete: 1 fix (UAT-003). No other bugs found; ClubZap iframes to `rvrafc.ie` confirmed intentional (migration in flight). |
| Contact and enquiry forms | `/contact`, `/club/refereeing`, `/boot-room`, campaign forms | In progress | Claude pass complete: 1 P1 fix (UAT-004). Codex's UAT-002 label fix reviewed and confirmed correct. |
| Competitions public | `/competitions/[slug]`, `/competitions/login` | Not started |  |
| Competitions admin | `/competitions/admin` and nested admin routes | Not started |  |
| Site admin | `/admin`, noticeboard, hero media, campaigns, announcements, registrations, approvals | In progress | Claude pass complete: no bugs found. Verified `proxy.ts` + `app/admin/layout.tsx` two-layer auth gate (cookie presence at the edge, role check in layout) protects every nested route even where a page/action's own `requireAdmin()` looks like the only guard. |
| API health and integrations | `/api/health`, fixtures, DDSL, membership calculation, contact/enquiry APIs | In progress | `/api/health` OK; feature flags OK. Membership calculation currently 503 because online payments are feature-disabled. |
| Responsive and accessibility | 390px mobile, tablet, desktop, keyboard, reduced motion, contrast | In progress | Initial 390px and 1440px route sweep found no horizontal overflow. |
| Build and automated checks | `npm run typecheck`, `npm test`, `npm run build`, `npm run lint` baseline | In progress | Typecheck, tests, and build pass. Lint fails on existing React/escaping/prefer-const issues. |

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

Status: Open for Claude/Codex review.

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

## Sign-off

- Codex: Pending
- Claude: Pending
- User: Pending
