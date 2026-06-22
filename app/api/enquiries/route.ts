import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const allowedTypes = new Set([
  'FOOTBALL_FOR_ALL_CALLBACK',
  'JMO_INTEREST',
  'VOLUNTEER_INTEREST',
  'COACHING_INTEREST',
  'SPONSORSHIP_INTEREST',
]);
const recentRequests = new Map<string, number[]>();

function isRateLimited(request: NextRequest): boolean {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
  const now = Date.now();
  const windowStart = now - 10 * 60 * 1000;
  const recent = (recentRequests.get(ip) ?? []).filter((time) => time > windowStart);
  recent.push(now);
  recentRequests.set(ip, recent);
  return recent.length > 5;
}

export async function POST(request: NextRequest) {
  if (isRateLimited(request)) {
    return NextResponse.json(
      { error: 'Too many submissions. Please try again later.' },
      { status: 429 },
    );
  }

  let body: {
    type?: string;
    name?: string;
    email?: string;
    phone?: string;
    details?: string;
    website?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (body.website) {
    return NextResponse.json({ success: true }, { status: 201 });
  }

  const type = body.type?.trim() ?? '';
  const name = body.name?.trim() ?? '';
  const email = body.email?.trim().toLowerCase() || null;
  const phone = body.phone?.trim() || null;
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
      name: name.slice(0, 120),
      email: email?.slice(0, 254) ?? null,
      phone: phone?.slice(0, 40) ?? null,
      details: details?.slice(0, 2000) ?? null,
    },
    select: { id: true },
  });

  return NextResponse.json({ success: true, enquiryId: enquiry.id }, { status: 201 });
}
