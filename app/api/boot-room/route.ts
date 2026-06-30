import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyTurnstile } from '@/lib/turnstile';

const categories = new Set([
  'BOOTS',
  'KIT',
  'GOALKEEPER',
  'EQUIPMENT',
  'BAGS',
  'OTHER',
]);
const conditions = new Set(['EXCELLENT', 'VERY_GOOD', 'GOOD', 'FAIR']);

export async function GET() {
  const listings = await prisma.bootRoomListing.findMany({
    where: { moderationStatus: 'APPROVED' },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: {
      id: true,
      title: true,
      category: true,
      size: true,
      itemCondition: true,
      description: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ listings });
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (String(body.website ?? '')) {
    return NextResponse.json({ success: true }, { status: 201 });
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const tokenOk = await verifyTurnstile(String(body.turnstileToken ?? ''), ip);
  if (!tokenOk) {
    return NextResponse.json(
      { error: 'Bot check failed. Please refresh the page and try again.' },
      { status: 403 },
    );
  }

  const title = String(body.title ?? '').trim();
  const category = String(body.category ?? '').trim();
  const size = String(body.size ?? '').trim() || null;
  const itemCondition = String(body.itemCondition ?? '').trim();
  const description = String(body.description ?? '').trim();
  const donorName = String(body.donorName ?? '').trim();
  const donorEmail = String(body.donorEmail ?? '').trim().toLowerCase() || null;
  const donorPhone = String(body.donorPhone ?? '').trim() || null;

  if (
    title.length < 3 ||
    !categories.has(category) ||
    !conditions.has(itemCondition) ||
    description.length < 10 ||
    donorName.length < 2 ||
    (!donorEmail && !donorPhone)
  ) {
    return NextResponse.json(
      { error: 'Complete the item details and provide one contact method.' },
      { status: 400 },
    );
  }

  if (donorEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donorEmail)) {
    return NextResponse.json(
      { error: 'Enter a valid email address.' },
      { status: 400 },
    );
  }

  const listing = await prisma.bootRoomListing.create({
    data: {
      title: title.slice(0, 120),
      category,
      size: size?.slice(0, 80) ?? null,
      itemCondition,
      description: description.slice(0, 1200),
      donorName: donorName.slice(0, 120),
      donorEmail: donorEmail?.slice(0, 254) ?? null,
      donorPhone: donorPhone?.slice(0, 40) ?? null,
    },
    select: { id: true },
  });

  return NextResponse.json(
    { success: true, listingId: listing.id },
    { status: 201 },
  );
}
