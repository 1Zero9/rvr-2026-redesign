# RVR2026 Site Audit — 2026-06-21

## ✅ Verified Links

### Header.tsx — NAV_SECTIONS (desktop dropdown)

| Label | href | Page |
|---|---|---|
| All Teams | `/teams` | `app/teams/page.tsx` ✅ |
| First Team | `/seniors/first-team` | `app/seniors/first-team/page.tsx` ✅ |
| Div 3B Saturday | `/seniors/lsl-div3b` | `app/seniors/lsl-div3b/page.tsx` ✅ |
| Div 3C Saturday | `/seniors/lsl-div3c` | `app/seniors/lsl-div3c/page.tsx` ✅ |
| Over 35s A | `/seniors/over-35s/over35s-a` | `app/seniors/over-35s/[id]/page.tsx` ✅ |
| Over 35s B | `/seniors/over-35s/over35s-b` | `app/seniors/over-35s/[id]/page.tsx` ✅ |
| Fixtures & Results | `/fixtures` | `app/fixtures/page.tsx` ✅ |
| Register a Player | `/register` | `app/register/page.tsx` ✅ |
| Calculate Fees | `/membership-calculator` | `app/membership-calculator/page.tsx` ✅ |
| Book Astro Pitch | `/astro-booking` | `app/astro-booking/page.tsx` ✅ |
| Football For All | `/football-for-all` | `app/football-for-all/page.tsx` ✅ |
| Contact Us | `/contact` | `app/contact/page.tsx` ✅ |
| Club Shop | `/shop` | `app/shop/page.tsx` ✅ |
| Safeguarding Statement | `/club/safeguarding` | `app/club/safeguarding/page.tsx` ✅ |
| Campaigns | `/campaigns` | `app/campaigns/page.tsx` ✅ |

### Header.tsx — MOBILE_NAV_GROUPS

All mobile nav hrefs resolve to the same pages as the desktop nav above. ✅

### next.config.ts — Redirect destinations

| Source | Destination | Status |
|---|---|---|
| `/club-teams` | `/teams` | `app/teams/page.tsx` ✅ |
| `/club-teams/:slug*` | `/teams` | `app/teams/page.tsx` ✅ |
| `/teams/matches` | `/fixtures` | `app/fixtures/page.tsx` ✅ |
| `/club/anniversary` | `/campaigns/45th-anniversary-kit` | `app/campaigns/45th-anniversary-kit/page.tsx` ✅ |
| `/academy` | `/teams` | `app/teams/page.tsx` ✅ |
| `/adult` | `/seniors` | `app/seniors/page.tsx` ✅ |
| `/community` | `/club` | `app/club/page.tsx` ✅ |
| `/inclusive` | `/football-for-all` | `app/football-for-all/page.tsx` ✅ |
| `/fees` | `/register` | `app/register/page.tsx` ✅ |
| `/book-astro-pitch` | `/astro-booking` | `app/astro-booking/page.tsx` ✅ |
| `/league-tables` | `/teams` | `app/teams/page.tsx` ✅ |

### Senior pages (Step 4 check)

| Page | Status |
|---|---|
| `app/seniors/first-team/page.tsx` | ✅ |
| `app/seniors/lsl-div3b/page.tsx` | ✅ |
| `app/seniors/lsl-div3c/page.tsx` | ✅ |
| `app/seniors/over-35s/page.tsx` | ✅ |
| `app/seniors/over-35s/[id]/page.tsx` | ✅ |

---

## ⚠️ Broken or Missing

### 1. Redirect chain: `/tables` → `/league-tables` → `/teams`

- **Source:** `next.config.ts`, redirect entry `source: '/tables'`
- **Issue:** Destination is `/league-tables`, which itself has no page file — it was deleted and replaced with its own redirect to `/teams`. This creates a two-hop chain. Next.js will follow it, so it is not broken at runtime, but it is wasteful and fragile.
- **Suggested fix:** Update the `/tables` redirect to point directly to `/teams`:
  ```ts
  { source: '/tables', destination: '/teams', permanent: true },
  ```

---

## ℹ️ Intentional (query params / client-side filters)

These links use URL query params handled client-side. There is no separate page for each — they are not broken.

| Label | href | Notes |
|---|---|---|
| DDSL Boys | `/teams?filter=boys` | `TeamsClient` reads `?filter` on mount |
| DDSL Girls | `/teams?filter=girls` | Same |
| Youth Fixtures | `/fixtures?filter=youth` | `FixturesPageClient` pill |
| Senior Fixtures | `/fixtures?filter=senior` | `FixturesPageClient` pill |

---

## 🔁 Duplicate Routes

### Nav duplicates — CLUB dropdown (intentional, but missing anchors)

Three separate nav labels each resolve to the same page with no anchor fragment. Visitors land at the top regardless of which label they click.

| Labels | Shared href | Issue |
|---|---|---|
| Football For All · Walking Football · Sensory Sessions | `/football-for-all` | All three land at page top — no `#section` anchors |
| Safeguarding Statement · Garda Vetting · Child Welfare | `/club/safeguarding` | All three land at page top — no `#section` anchors |

**Suggested fix:** Add `id` attributes to the relevant sections in each page and update the nav hrefs:
- `/football-for-all#walking-football`
- `/football-for-all#sensory`
- `/club/safeguarding#garda-vetting`
- `/club/safeguarding#child-welfare`

### seniors/page.tsx — same href in hero grid and Our Teams cards

`/seniors/first-team` and `/seniors/over-35s` each appear twice: once in the hero quick-nav grid (lines 159, 171) and once in the Our Teams card section (lines 242, 259). This is **intentional** — two separate UI patterns on the same page linking to the same destinations. Not a bug.

### Header.tsx — mobile nav header + link both point to same href

The mobile nav uses a discriminated union where `type: 'header'` items are also links. "Seniors" header → `/seniors/first-team` (line 107) and the "First Team" sub-link → `/seniors/first-team` (line 108) are the same href. This is expected given the design — tapping the section header navigates directly to First Team. Consider whether the "Seniors" header should link to `/seniors` (the hub) instead.
