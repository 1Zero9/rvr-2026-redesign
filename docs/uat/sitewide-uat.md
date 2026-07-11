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
| Homepage and global shell | `/`, header nav, mobile nav, search, footer | Not started |  |
| Club and community pages | `/club`, `/club/history`, `/club/anniversary`, `/community`, `/sponsorship`, `/accessibility`, `/privacy` | Not started |  |
| Programmes | `/academy`, `/football-for-all`, `/walking-football`, `/ladies-football`, `/trials`, `/pathway`, `/get-involved` | Not started |  |
| Teams and seniors | `/teams`, `/teams/[slug]`, `/club-teams`, `/club-teams/[slug]`, `/seniors`, senior subpages, over-35s pages | Not started |  |
| Fixtures and matchday | `/fixtures`, `/matchday`, `/pitch-locations` | Not started |  |
| News and campaigns | `/news`, `/news/[id]`, `/campaigns`, campaign detail pages | Not started |  |
| Registration and payments | `/register`, `/pay-fees`, `/membership-calculator`, Stripe/ClubZap handoff paths | Not started |  |
| Contact and enquiry forms | `/contact`, `/club/refereeing`, `/boot-room`, campaign forms | Not started |  |
| Competitions public | `/competitions/[slug]`, `/competitions/login` | Not started |  |
| Competitions admin | `/competitions/admin` and nested admin routes | Not started |  |
| Site admin | `/admin`, noticeboard, hero media, campaigns, announcements, registrations, approvals | Not started |  |
| API health and integrations | `/api/health`, fixtures, DDSL, membership calculation, contact/enquiry APIs | Not started |  |
| Responsive and accessibility | 390px mobile, tablet, desktop, keyboard, reduced motion, contrast | Not started |  |
| Build and automated checks | `npm run typecheck`, `npm test`, `npm run build`, `npm run lint` baseline | Not started |  |

## Findings

No UAT findings logged yet.

## Sign-off

- Codex: Pending
- Claude: Pending
- User: Pending
