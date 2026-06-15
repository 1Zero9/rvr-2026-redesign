export interface PaymentTarget {
  id: string;
  title: string;
  targetUrl: string;
}

export const clubZapPaymentMap: Record<string, PaymentTarget> = {
  membership: {
    id: "membership",
    title: "Club Membership Signup",
    targetUrl: "https://rvrafc.ie/membership_signup?iframe=1",
  },
  shop: {
    id: "shop",
    title: "Official Merchandise & Gear",
    targetUrl: "https://rvrafc.ie/products?iframe=1",
  },
  lotto: {
    id: "lotto",
    title: "Club Lotto & Weekly Draws",
    targetUrl: "https://rvrafc.ie/draws?iframe=1",
  },
  camps: {
    id: "camps",
    title: "Summer Camps & Mini-Leagues",
    targetUrl: "https://rvrafc.ie/categories/camp/products?iframe=1",
  },
  fees: {
    id: "fees",
    title: "Training & Team Fees",
    targetUrl: "https://rvrafc.ie/categories/fees/products?iframe=1",
  },
};
