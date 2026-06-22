import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const revalidate = 300;

export async function GET() {
  const now = new Date();
  const announcements = await prisma.announcement.findMany({
    where: {
      isPublished: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: now } },
      ],
    },
    orderBy: [{ pinned: 'desc' }, { publishedAt: 'desc' }],
    select: {
      id:          true,
      title:       true,
      category:    true,
      body:        true,
      imageUrl:    true,
      ctaLabel:    true,
      ctaUrl:      true,
      publishedAt: true,
      expiresAt:   true,
      pinned:      true,
    },
  });
  return NextResponse.json(announcements);
}
