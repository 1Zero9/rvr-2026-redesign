/**
 * ClubZap embedded checkout URL map.
 *
 * The `?iframe=1` parameter instructs ClubZap to strip the legacy navigation
 * header so the checkout renders cleanly inside an <iframe> on this site.
 *
 * Usage:
 *   import { PAYMENT_URLS } from '@/config/payments';
 *   <iframe src={PAYMENT_URLS.membership} title="Membership signup" />
 */

export type PaymentKey =
  | "membership"
  | "shop"
  | "lotto"
  | "camps"
  | "fees";

export interface PaymentTarget {
  /** Absolute URL to the ClubZap checkout page */
  url: string;
  /** Human-readable label for use in <title>, aria-label, and UI headings */
  label: string;
}

export const PAYMENT_URLS: Record<PaymentKey, PaymentTarget> = {
  membership: {
    url: "https://rvrafc.ie/membership_signup?iframe=1",
    label: "Membership Signup",
  },
  shop: {
    url: "https://rvrafc.ie/products?iframe=1",
    label: "Merchandise and Shop",
  },
  lotto: {
    url: "https://rvrafc.ie/draws?iframe=1",
    label: "Lotto and Weekly Draws",
  },
  camps: {
    url: "https://rvrafc.ie/categories/camp/products?iframe=1",
    label: "Summer Camps and Mini-Leagues",
  },
  fees: {
    url: "https://rvrafc.ie/categories/fees/products?iframe=1",
    label: "Training and Team Fees",
  },
} as const;
