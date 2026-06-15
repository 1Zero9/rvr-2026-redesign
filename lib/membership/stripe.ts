import Stripe from 'stripe';
import type { ClassifiedMember, PricingBreakdown } from './types';

let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set');
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-05-27.dahlia' as any,
      typescript: true,
    });
  }
  return stripeInstance;
}

export const stripe = new Proxy({} as Stripe, {
  get(target, prop, receiver) {
    return Reflect.get(getStripe(), prop, receiver);
  }
});

/**
 * Stripe metadata has a 500-char limit per value and 50-key limit.
 * Member details go into the DB; metadata carries only what Stripe
 * needs for reconciliation and support queries.
 */
export function buildStripeMetadata(
  orderId: string,
  members: ClassifiedMember[],
  pricing: PricingBreakdown,
): Stripe.MetadataParam {
  const memberSummary = members.map((m) => ({
    name: `${m.firstName} ${m.lastName}`,
    dob: m.dateOfBirth.toISOString().split('T')[0],
    classification: m.classification,
    team: m.teamRegistration ?? null,
  }));

  return {
    orderId,
    memberCount: String(members.length),
    appliedOption: pricing.appliedOption ?? 'Individual rates',
    totalAmountCents: String(pricing.totalAmountCents),
    savingsCents: String(pricing.savingsCents),
    // Truncate at 500 chars to respect Stripe's metadata value limit
    members: JSON.stringify(memberSummary).slice(0, 500),
  };
}

export async function createCheckoutSession(params: {
  orderId: string;
  members: ClassifiedMember[];
  pricing: PricingBreakdown;
  contactEmail: string | undefined;
  successUrl: string;
  cancelUrl: string;
}): Promise<Stripe.Checkout.Session> {
  const { orderId, members, pricing, contactEmail, successUrl, cancelUrl } = params;

  const memberNames = members
    .map((m) => `${m.firstName} ${m.lastName}`)
    .join(', ');

  const description =
    pricing.appliedOption
      ? `${pricing.appliedOption} | Members: ${memberNames}`
      : `Individual membership | Members: ${memberNames}`;

  return stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: contactEmail,
    line_items: [
      {
        price_data: {
          currency: 'eur',
          unit_amount: pricing.totalAmountCents,
          product_data: {
            name: 'Rivervalley Rangers AFC — Family Membership 2026',
            description: description.slice(0, 500),
          },
        },
        quantity: 1,
      },
    ],
    metadata: buildStripeMetadata(orderId, members, pricing),
    success_url: `${successUrl}?orderId=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${cancelUrl}?orderId=${orderId}`,
    payment_intent_data: {
      metadata: buildStripeMetadata(orderId, members, pricing),
    },
  });
}
