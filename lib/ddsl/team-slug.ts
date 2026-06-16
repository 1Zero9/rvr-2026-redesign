export interface TeamSlugFilter {
  ageGroup: string | null;
  keywords: string[];
}

/**
 * Converts a URL slug like "u12-academy" or "girls-senior" into a structured
 * filter. Segments matching /^u\d{1,2}$/ become the age-group token; "senior"
 * maps to "Senior"; everything else becomes a keyword matched against the
 * competition name.
 */
export function parseTeamSlug(slug: string): TeamSlugFilter {
  const parts = slug.toLowerCase().split("-");
  let ageGroup: string | null = null;
  const keywords: string[] = [];

  for (const part of parts) {
    if (/^u\d{1,2}$/.test(part)) {
      ageGroup = part.toUpperCase();
    } else if (part === "senior") {
      ageGroup = "Senior";
    } else if (part.length > 0) {
      keywords.push(part);
    }
  }

  return { ageGroup, keywords };
}

/**
 * Returns true when the given age group and competition name satisfy every
 * constraint expressed in the filter. A null ageGroup in the filter matches
 * any age group. An empty keywords list matches any competition name.
 */
export function matchesSlug(
  ageGroup: string,
  competitionName: string,
  filter: TeamSlugFilter,
): boolean {
  if (filter.ageGroup !== null && ageGroup !== filter.ageGroup) return false;
  const haystack = competitionName.toLowerCase();
  return filter.keywords.every((kw) => haystack.includes(kw));
}
