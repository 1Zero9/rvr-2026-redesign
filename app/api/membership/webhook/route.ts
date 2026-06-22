import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/membership/stripe';
import { prisma } from '@/lib/prisma';
import type Stripe from 'stripe';
import { isFeatureEnabled } from '@/lib/features';

// Next.js App Router — disable automatic body parsing so we get the raw
// buffer Stripe needs for signature verification.
export const dynamic = 'force-dynamic';

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!(await isFeatureEnabled('stripePayments'))) {
    return NextResponse.json({ error: 'Stripe payments are disabled.' }, { status: 404 });
  }

  if (!WEBHOOK_SECRET) {
    console.error('[membership/webhook] STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const sig = req.headers.get('stripe-signature');
  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, WEBHOOK_SECRET);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[membership/webhook] signature verification failed:', message);
    return NextResponse.json({ error: `Webhook signature invalid: ${message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }
      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutExpired(session);
        break;
      }
      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        await handleChargeRefunded(charge);
        break;
      }
      default:
        // Unhandled event types — acknowledge receipt and move on
        break;
    }
  } catch (err) {
    console.error(`[membership/webhook] error handling ${event.type}:`, err);
    // Return 500 so Stripe retries delivery
    return NextResponse.json({ error: 'Internal error processing webhook' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const orderId = session.metadata?.orderId;
  if (!orderId) {
    console.warn('[membership/webhook] checkout.session.completed missing orderId in metadata');
    return;
  }

  await prisma.membershipOrder.updateMany({
    where: {
      id: orderId,
      status: 'PENDING',
    },
    data: {
      status: 'PAID',
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId:
        typeof session.payment_intent === 'string' ? session.payment_intent : null,
    },
  });
}

async function handleCheckoutExpired(session: Stripe.Checkout.Session): Promise<void> {
  const orderId = session.metadata?.orderId;
  if (!orderId) return;

  await prisma.membershipOrder.updateMany({
    where: {
      id: orderId,
      status: 'PENDING',
    },
    data: { status: 'CANCELLED' },
  });
}

async function handleChargeRefunded(charge: Stripe.Charge): Promise<void> {
  const paymentIntentId =
    typeof charge.payment_intent === 'string' ? charge.payment_intent : null;
  if (!paymentIntentId) return;

  await prisma.membershipOrder.updateMany({
    where: {
      stripePaymentIntentId: paymentIntentId,
      status: 'PAID',
    },
    data: { status: 'REFUNDED' },
  });
}
