/**
 * RVR v2 enhanced identity palette — sourced from official identity sheets.
 * These constants document the exact approved hex values for programmatic use.
 * Tailwind theme tokens remain unchanged; reference these when writing one-off
 * inline styles, canvas renders, or server-side image generation.
 */
export const BRAND_COLORS = {
  MAROON:    "#8B1E4D",
  SKY_BLUE:  "#B8CDEE",
  DARK_NAVY: "#0B1F3B",
  WHITE:     "#FFFFFF",
} as const;

export type BrandColor = (typeof BRAND_COLORS)[keyof typeof BRAND_COLORS];
