import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateAndClassifyMembers, calculatePricing, type ValidationError } from '@/lib/membership/pricing';
import { createCheckoutSession } from '@/lib/membership/stripe';
import type { CalculateRequest, CalculateResponse } from '@/lib/membership/types';
import { isFeatureEnabled } from '@/lib/features';

function badRequest(errors: ValidationError[] | string) {
  const body =
    typeof errors === 'string'
      ? { error: errors }
      : { error: 'Validation failed', details: errors };
  return NextResponse.json(body, { status: 400 });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!(await isFeatureEnabled('stripePayments'))) {
    return NextResponse.json(
      { error: 'Online membership payment is not currently available.' },
      { status: 503 },
    );
  }

  // -------------------------------------------------------------------------
  // 1. Parse body
  // -------------------------------------------------------------------------
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequest('Request body must be valid JSON');
  }

  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return badRequest('Request body must be a JSON object');
  }

  const { members: rawMembers, successUrl, cancelUrl, contactEmail } =
    body as Partial<CalculateRequest>;

  // -------------------------------------------------------------------------
  // 2. Validate top-level fields
  // -------------------------------------------------------------------------
  const topErrors: ValidationError[] = [];

  if (typeof successUrl !== 'string' || !successUrl.startsWith('http')) {
    topErrors.push({ field: 'successUrl', message: 'successUrl must be a valid absolute URL' });
  }
  if (typeof cancelUrl !== 'string' || !cancelUrl.startsWith('http')) {
    topErrors.push({ field: 'cancelUrl', message: 'cancelUrl must be a valid absolute URL' });
  }
  if (contactEmail !== undefined && (typeof contactEmail !== 'string' || !contactEmail.includes('@'))) {
    topErrors.push({ field: 'contactEmail', message: 'contactEmail must be a valid email address' });
  }

  if (topErrors.length > 0) return badRequest(topErrors);

  // -------------------------------------------------------------------------
  // 3. Validate and classify members
  // -------------------------------------------------------------------------
  const classifyResult = validateAndClassifyMembers(rawMembers);

  if ('errors' in classifyResult) return badRequest(classifyResult.errors);

  const { members } = classifyResult;

  // -------------------------------------------------------------------------
  // 4. Calculate optimal pricing
  // -------------------------------------------------------------------------
  const pricing = calculatePricing(members);

  if (pricing.totalAmountCents <= 0) {
    return NextResponse.json(
      { error: 'Calculated total is zero — please check the member list' },
      { status: 422 },
    );
  }

  // -------------------------------------------------------------------------
  // 5. Persist pending order + create Stripe checkout session (transactional)
  // -------------------------------------------------------------------------
  let orderId: string;
  let checkoutUrl: string;

  try {
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.membershipOrder.create({
        data: {
          totalAmountCents: pricing.totalAmountCents,
          appliedOption: pricing.appliedOption,
          contactEmail: contactEmail ?? null,
          members: {
            create: members.map((m, i) => ({
              firstName: m.firstName,
              lastName: m.lastName,
              dateOfBirth: m.dateOfBirth,
              classification: m.classification,
              teamRegistration: m.teamRegistration ?? null,
              amountCents: pricing.members[i]?.amountCents ?? m.standaloneEuros * 100,
            })),
          },
        },
      });
      return created;
    });

    orderId = order.id;

    // Create Stripe session outside the transaction so a Stripe API failure
    // doesn't roll back the DB row (we can always create a new session later).
    const session = await createCheckoutSession({
      orderId,
      members,
      pricing,
      contactEmail,
      successUrl: successUrl!,
      cancelUrl: cancelUrl!,
    });

    checkoutUrl = session.url!;

    // Attach the session ID to the order (non-critical — webhook can proceed without it)
    await prisma.membershipOrder.update({
      where: { id: orderId },
      data: { stripeCheckoutSessionId: session.id },
    });
  } catch (err) {
    console.error('[membership/calculate] error:', err);
    return NextResponse.json(
      { error: 'Failed to create order. Please try again.' },
      { status: 500 },
    );
  }

  // -------------------------------------------------------------------------
  // 6. Return response
  // -------------------------------------------------------------------------
  const response: CalculateResponse = {
    orderId,
    stripeCheckoutUrl: checkoutUrl,
    pricing,
  };

  return NextResponse.json(response, { status: 201 });
}
