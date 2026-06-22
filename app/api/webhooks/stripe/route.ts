/**
 * POST /api/webhooks/stripe
 *
 * Canonical Stripe webhook handler for the rivervalleyrangers.ie production system.
 *
 * Handles:
 *   checkout.session.completed       → MembershipOrder PENDING → PAID
 *   checkout.session.expired         → MembershipOrder PENDING → CANCELLED
 *   invoice.payment_succeeded        → StripeSubscription OPEN|PAST_DUE → PAID
 *   invoice.payment_failed           → StripeSubscription PAID → PAST_DUE
 *   customer.subscription.updated    → sync period dates and status
 *   customer.subscription.deleted    → StripeSubscription → CANCELLED
 *   charge.refunded                  → MembershipOrder PAID → REFUNDED
 *
 * Security:
 *   - Raw body preserved for Stripe HMAC-SHA256 signature verification (STRIPE_WEBHOOK_SECRET)
 *   - No route-level body parsing (force-dynamic + req.text())
 *   - 400 on bad signature, 500 (triggering Stripe retry) on internal errors
 *   - Idempotency: all DB writes use updateMany with precise WHERE guards
 *
 * Stripe v22 (2026-05-27.dahlia) shape notes:
 *   - Invoice.subscription → invoice.parent?.subscription_details?.subscription
 *   - Subscription period dates → sub.items.data[0]?.current_period_start / current_period_end
 *   - Event names use dot notation: customer.subscription.updated / .deleted
 *
 * Env required:
 *   STRIPE_SECRET_KEY
 *   STRIPE_WEBHOOK_SECRET
 */

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/membership/stripe";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";
import { isFeatureEnabled } from "@/lib/features";

export const dynamic = "force-dynamic";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!(await isFeatureEnabled("stripePayments"))) {
    return NextResponse.json({ error: "Stripe payments are disabled." }, { status: 404 });
  }

  if (!WEBHOOK_SECRET) {
    console.error("[webhooks/stripe] STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  // Preserve exact raw body bytes — any transformation breaks the HMAC
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, WEBHOOK_SECRET);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[webhooks/stripe] signature verification failed:", msg);
    return NextResponse.json({ error: `Invalid signature: ${msg}` }, { status: 400 });
  }

  try {
    await dispatch(event);
  } catch (err) {
    // Return 500 so Stripe retries with exponential back-off (up to 3 days)
    console.error(`[webhooks/stripe] handler error for ${event.type} (${event.id}):`, err);
    return NextResponse.json({ error: "Internal handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true, eventId: event.id });
}

// ---------------------------------------------------------------------------
// Event dispatcher
// ---------------------------------------------------------------------------

async function dispatch(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    // One-off checkout
    case "checkout.session.completed":
      await onCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      break;
    case "checkout.session.expired":
      await onCheckoutExpired(event.data.object as Stripe.Checkout.Session);
      break;

    // Subscription invoices
    case "invoice.payment_succeeded":
      await onInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
      break;
    case "invoice.payment_failed":
      await onInvoicePaymentFailed(event.data.object as Stripe.Invoice);
      break;

    // Subscription lifecycle (dot notation — v22 requirement)
    case "customer.subscription.updated":
      await onSubscriptionUpdated(event.data.object as Stripe.Subscription);
      break;
    case "customer.subscription.deleted":
      await onSubscriptionDeleted(event.data.object as Stripe.Subscription);
      break;

    // Refunds
    case "charge.refunded":
      await onChargeRefunded(event.data.object as Stripe.Charge);
      break;

    default:
      // Acknowledge silently — don't fail on unhandled types
      break;
  }
}

// ---------------------------------------------------------------------------
// One-off checkout handlers
// ---------------------------------------------------------------------------

async function onCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const orderId = session.metadata?.orderId;
  if (!orderId) {
    console.warn("[webhooks/stripe] checkout.session.completed: no orderId in metadata", session.id);
    return;
  }

  const paymentIntentId =
    typeof session.payment_intent === "string" ? session.payment_intent : null;

  const updated = await prisma.membershipOrder.updateMany({
    where: { id: orderId, status: "PENDING" },
    data: {
      status: "PAID",
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId: paymentIntentId,
    },
  });

  if (updated.count === 0) {
    // Already processed — idempotency guard
    console.info(`[webhooks/stripe] order ${orderId} already in terminal state, skipping`);
  }
}

async function onCheckoutExpired(session: Stripe.Checkout.Session): Promise<void> {
  const orderId = session.metadata?.orderId;
  if (!orderId) return;

  await prisma.membershipOrder.updateMany({
    where: { id: orderId, status: "PENDING" },
    data: { status: "CANCELLED" },
  });
}

// ---------------------------------------------------------------------------
// Subscription invoice handlers
// ---------------------------------------------------------------------------

/**
 * Extracts the Stripe subscription ID from an invoice.
 *
 * In Stripe v22 (2026-05-27.dahlia), the subscription reference moved from
 * the top-level `invoice.subscription` field to `invoice.parent.subscription_details.subscription`.
 */
function getInvoiceSubId(invoice: Stripe.Invoice): string | null {
  const details = invoice.parent?.subscription_details;
  if (!details) return null;
  const sub = details.subscription;
  return typeof sub === "string" ? sub : (sub?.id ?? null);
}

/**
 * invoice.payment_succeeded
 *
 * Transitions: OPEN → PAID, PAST_DUE → PAID
 * Also upserts the StripeSubscription row if it was created outside our system
 * (e.g. via the Stripe dashboard or a payment link).
 *
 * Billing contact association: the subscription carries the Stripe customer,
 * whose email is the billing contact for all MembershipOrders on this subscription.
 */
async function onInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
  const stripeSubId = getInvoiceSubId(invoice);
  if (!stripeSubId) return; // one-off invoice — not a subscription

  const customerId =
    typeof invoice.customer === "string" ? invoice.customer : null;
  if (!customerId) return;

  // invoice.period_start / period_end are Unix timestamps (seconds) at the top level
  const periodStart = invoice.period_start ? new Date(invoice.period_start * 1000) : null;
  const periodEnd = invoice.period_end ? new Date(invoice.period_end * 1000) : null;

  // Upsert the subscription row — handles the case where Stripe fires this
  // event before our checkout.session.completed hook has created the row.
  await prisma.stripeSubscription.upsert({
    where: { stripeSubscriptionId: stripeSubId },
    update: {
      status: "PAID",
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
    },
    create: {
      stripeSubscriptionId: stripeSubId,
      stripeCustomerId: customerId,
      status: "PAID",
      billingEmail: invoice.customer_email ?? "",
      billingName: invoice.customer_name ?? null,
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
    },
  });

  // Promote any associated MembershipOrders from PENDING → PAID
  await prisma.membershipOrder.updateMany({
    where: {
      subscription: { stripeSubscriptionId: stripeSubId },
      status: "PENDING",
    },
    data: { status: "PAID" },
  });
}

/**
 * invoice.payment_failed
 *
 * Transitions: PAID → PAST_DUE
 * Stripe will retry automatically; we mark the subscription without cancelling.
 */
async function onInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  const stripeSubId = getInvoiceSubId(invoice);
  if (!stripeSubId) return;

  await prisma.stripeSubscription.updateMany({
    where: {
      stripeSubscriptionId: stripeSubId,
      status: { in: ["OPEN", "PAID"] },
    },
    data: { status: "PAST_DUE" },
  });

  // Mirror onto associated orders so the club portal surfaces the issue
  await prisma.membershipOrder.updateMany({
    where: {
      subscription: { stripeSubscriptionId: stripeSubId },
      status: "PAID",
    },
    data: { status: "PENDING" }, // back to PENDING until payment resolves
  });
}

// ---------------------------------------------------------------------------
// Subscription lifecycle handlers
// ---------------------------------------------------------------------------

/**
 * customer.subscription.updated
 *
 * Keeps period dates and Stripe status in sync.
 * In v22, period dates live on each SubscriptionItem rather than the top-level
 * Subscription object — we read from the first item (all items share the period).
 */
async function onSubscriptionUpdated(sub: Stripe.Subscription): Promise<void> {
  const status = mapStripeSubStatus(sub.status);

  // current_period_start / current_period_end moved to SubscriptionItem in v22
  const firstItem = sub.items.data[0];
  const periodStart = firstItem?.current_period_start
    ? new Date(firstItem.current_period_start * 1000)
    : null;
  const periodEnd = firstItem?.current_period_end
    ? new Date(firstItem.current_period_end * 1000)
    : null;

  await prisma.stripeSubscription.updateMany({
    where: { stripeSubscriptionId: sub.id },
    data: { status, currentPeriodStart: periodStart, currentPeriodEnd: periodEnd },
  });
}

async function onSubscriptionDeleted(sub: Stripe.Subscription): Promise<void> {
  await prisma.stripeSubscription.updateMany({
    where: { stripeSubscriptionId: sub.id },
    data: { status: "CANCELLED", cancelledAt: new Date() },
  });
}

// ---------------------------------------------------------------------------
// Refund handler
// ---------------------------------------------------------------------------

async function onChargeRefunded(charge: Stripe.Charge): Promise<void> {
  const paymentIntentId =
    typeof charge.payment_intent === "string" ? charge.payment_intent : null;
  if (!paymentIntentId) return;

  await prisma.membershipOrder.updateMany({
    where: { stripePaymentIntentId: paymentIntentId, status: "PAID" },
    data: { status: "REFUNDED" },
  });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mapStripeSubStatus(
  stripeStatus: Stripe.Subscription.Status,
): "OPEN" | "PAID" | "PAST_DUE" | "CANCELLED" {
  switch (stripeStatus) {
    case "active":
    case "trialing":
      return "PAID";
    case "past_due":
    case "unpaid":
      return "PAST_DUE";
    case "canceled":
    case "incomplete_expired":
      return "CANCELLED";
    case "incomplete":
    case "paused":
    default:
      return "OPEN";
  }
}
