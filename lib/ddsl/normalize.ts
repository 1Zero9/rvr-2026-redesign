/**
 * Data sanitization and normalization utilities for the DDSL / SportLoMo
 * ingestion pipeline.
 *
 * All functions are pure (no side-effects) so they can be applied at any point
 * in the transform chain without risk of mutating shared state.
 *
 * Why this layer exists
 * ─────────────────────
 * Grassroots league data is inconsistent: club names contain stray spaces,
 * missing punctuation, and variant spellings; kick-off times and venues are
 * occasionally absent from the raw feed. These helpers centralise the
 * defensive logic so route handlers stay readable.
 */

// ---------------------------------------------------------------------------
// Internal constants
// ---------------------------------------------------------------------------

// The single canonical name used across the entire platform.
const RVR_CANONICAL = 'Rivervalley Rangers';

// Covers all known variants returned by the DDSL / SportLoMo system:
//   "Rivervalley Rangers"        official one-word spelling
//   "River Valley Rangers"       two-word legacy export spelling
//   "Rivervalley Rgrs"           abbreviated short form
//   "River Valley Rgrs"          abbreviated + space variant
//   "Rivervalley Rangers FC"     with FC suffix
//   "Rivervalley Rangers AFC"    with AFC suffix
const RVR_VARIANT_RE =
  /^river\s*valley\s+r(?:angers|grs)(?:\s+(?:afc|fc))?$/i;

// ---------------------------------------------------------------------------
// normalizeTeamName
// ---------------------------------------------------------------------------

/**
 * Sanitises an incoming team name string from the DDSL feed.
 *
 * Steps applied in order:
 *   1. Guard against empty / whitespace-only input
 *   2. Trim leading and trailing whitespace
 *   3. Collapse internal multi-space runs to a single space
 *   4. Insert a space after a full stop immediately followed by a letter
 *      ("St.Brendans" → "St. Brendans")
 *   5. Insert a space before a terminal "AFC" or "FC" suffix when missing
 *      ("SwordsAFC" → "Swords AFC")
 *   6. Map all known RVR name variants to the single canonical form
 */
export function normalizeTeamName(raw: string): string {
  if (!raw || raw.trim().length === 0) {
    console.warn('[ddsl/normalize] Received empty team name — returning "Unknown Team"');
    return 'Unknown Team';
  }

  // Steps 2–3: whitespace
  let name = raw.trim().replace(/\s{2,}/g, ' ');

  // Step 4: space after full stop before a word character
  name = name.replace(/\.(?=[A-Za-z])/g, '. ');

  // Step 5: missing space before terminal FC / AFC suffix
  // Only fires when the character immediately before the suffix is a letter
  // (prevents splitting intentional all-caps acronyms like "WAFC" which are rare
  // but would be "W AFC" without the lowercase guard)
  name = name.replace(/([a-z])(AFC|FC)$/i, '$1 $2');

  // Step 6: RVR canonical mapping
  if (RVR_VARIANT_RE.test(name)) {
    return RVR_CANONICAL;
  }

  return name;
}

// ---------------------------------------------------------------------------
// normalizeKickoffTime
// ---------------------------------------------------------------------------

/**
 * Returns the kick-off time string from the feed, or "TBC" when the value is
 * absent, empty, or whitespace-only.
 *
 * Prevents layout crashes and avoids rendering null / undefined in time slots.
 */
export function normalizeKickoffTime(raw: string | null | undefined): string {
  const t = raw?.trim();
  if (!t || t.length === 0) {
    console.warn('[ddsl/normalize] Missing kick-off time in feed — falling back to "TBC"');
    return 'TBC';
  }
  return t;
}

// ---------------------------------------------------------------------------
// normalizeVenueName
// ---------------------------------------------------------------------------

/**
 * Returns the venue name string from the feed, or "Venue TBC" when the value
 * is absent, empty, or whitespace-only.
 */
export function normalizeVenueName(raw: string | null | undefined): string {
  const v = raw?.trim();
  if (!v || v.length === 0) {
    console.warn('[ddsl/normalize] Missing venue name in feed — falling back to "Venue TBC"');
    return 'Venue TBC';
  }
  return v;
}
