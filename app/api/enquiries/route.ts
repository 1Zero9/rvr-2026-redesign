import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyTurnstile } from '@/lib/turnstile';

const allowedTypes = new Set([
  'FOOTBALL_FOR_ALL_CALLBACK',
  'JMO_INTEREST',
  'VOLUNTEER_INTEREST',
  'WALKING_FOOTBALL_INTEREST',
  'COACHING_INTEREST',
  'SPONSORSHIP_INTEREST',
]);

export async function POST(request: NextRequest) {
  let body: {
    type?: string;
    name?: string;
    email?: string;
    phone?: string;
    details?: string;
    website?: string;
    turnstileToken?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (body.website) {
    return NextResponse.json({ success: true }, { status: 201 });
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const tokenOk = await verifyTurnstile(body.turnstileToken ?? '', ip);
  if (!tokenOk) {
    return NextResponse.json(
      { error: 'Bot check failed. Please refresh the page and try again.' },
      { status: 403 },
    );
  }

  const type    = body.type?.trim() ?? '';
  const name    = body.name?.trim() ?? '';
  const email   = body.email?.trim().toLowerCase() || null;
  const phone   = body.phone?.trim() || null;
  const details = body.details?.trim() || null;

  if (!allowedTypes.has(type) || name.length < 2 || (!email && !phone)) {
    return NextResponse.json(
      { error: 'Please provide your name and at least one contact method.' },
      { status: 400 },
    );
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }

  const enquiry = await prisma.publicEnquiry.create({
    data: {
      type,
      name:    name.slice(0, 120),
      email:   email?.slice(0, 254) ?? null,
      phone:   phone?.slice(0, 40) ?? null,
      details: details?.slice(0, 2000) ?? null,
    },
    select: { id: true },
  });

  return NextResponse.json({ success: true, enquiryId: enquiry.id }, { status: 201 });
}
