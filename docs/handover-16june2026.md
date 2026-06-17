# Engineering Log & Post-Mortem: Matchday Hub Ingestion Engine
**Date:** 16 June 2026  
**Project:** Rivervalley Rangers 2026 Redesign (`rvr-2026-redesign`)  
**Target Environment:** Next.js 16.2.9 (Turbopack) / Vercel Cloud (iad1)

---

## 1. Executive Summary & Current Status
Over a multi-hour engineering cycle, we systematically re-architected the Matchday Hub's data integration pipeline. We successfully moved the infrastructure from a broken, unauthenticated external server scraper to a high-integrity localized database layer. 

While the backend data client now successfully structures the complete 14-team league matrix, a critical disconnect remains on the frontend user interface: **the dropdown component and data grid fail to render the correct number of teams, or intermittently drop into Next.js router 404 cache loops.**

---

## 2. Root Cause Analysis (RCA) & Challenges Faced

### 🚨 Challenge 1: The Content Security Policy (CSP) & Ghost Assets
* **The Symptom:** Frontend data spinner locked in a permanent loading loop. Console logging reported massive security violations when loading a background video asset from `https://assets.mixkit.co`.
* **The Cause:** The application root or middleware was enforcing a strict security rule (`default-src 'self'`). Because `media-src` and `connect-src` were not explicitly defined, the browser blocked both the template's background video and the outbound network data queries to the API routes.
* **The Resolution:** Cleanly purged the unused ghost video asset from the template layouts and updated `next.config.ts` headers to explicitly authorize local API data pathways.

### 🚨 Challenge 2: Vercel Prerender Compilation Failures
* **The Symptom:** Production builds crashing out on Vercel deployment with exit code 1.
* **The Cause:** The terminal agent placed server-side segment configuration options (`export const revalidate = 0`) inside `/app/teams/matches/page.tsx`, which had `"use client"` declared at the top. Next.js strictly prohibits mixing client components with server configuration variables.
* **The Resolution:** Stripped the segment exports out of the client page file to let data resolve dynamically through standard runtime parameters.

### 🚨 Challenge 3: Third-Party Feed 404s & String Mismatches
* **The Symptom:** The sync route endpoint throwing `HTTP 404 Not Found` or returning `{"source":"empty"}`.
* **The Cause:** Automated paths targeting `api.sportlomo.com` or local WordPress JSON folders were invalid. Furthermore, the league database listed the team using a space variant (`"River Valley Rangers FC"`), causing our strict string filters (`"Rivervalley Rangers"`) to discard the record entirely during data parsing loop processing.
* **The Resolution:** Transitioned the pipeline away from external live scraping. Embedded the immutable, finalized, historical U12 Major Saturday dataset directly into the local endpoint state to guarantee total compliance and data stability.

---

## 3. Verified System Schema (Ground Truth)
The local sync handler (`/app/api/fixtures/sync/route.ts`) is structurally configured to return the exact, verified **20-point historical finish** for Rivervalley Rangers as documented in the official DDSL ledger:

* **Division:** DDSL U12 Boys Major Saturday (Name stripped cleanly of generic "Division 1" suffixes).
* **True Record (Position 13):** Played: 26 | Won: 5 | Drawn: 5 | Lost: 16 | Points: 20 | Goal Difference: -38.
* **Rival Ingestion:** Includes all 14 clubs sequentially arrayed from Position 1 (Kilnamanagh AFC - 65pts) down to Position 14 (Bohemian FC - 14pts).

---

## 4. Immediate Next Steps & Unresolved UI Defects
When picking this project up in a fresh session, focus strictly on resolving the interface binding layers:

1.  **Audit Layout Bindings:** Open `/app/teams/matches/page.tsx`. Inspect why the component's state arrays are ignoring or truncating the incoming local API payload length.
2.  **Break Router Caching:** Resolve the local Next.js routing conflict where the browser targets an old cache lane instead of evaluating the fresh local handler.
3.  **Validate Color Snapping:** Verify that `inferAccentFromDivision()` reads the sanitized division strings to successfully paint the Girls' cards **Vibrant Magenta** (`#EC4899`) and the Boys' elements **Electric Blue** (`#38BDF8`).