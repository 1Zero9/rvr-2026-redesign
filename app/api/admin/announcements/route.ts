import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret');
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }
  const body = await req.json();
  const announcement = await prisma.announcement.create({
    data: {
      title:       body.title,
      category:    body.category,
      body:        body.body,
      imageUrl:    body.imageUrl   || null,
      ctaLabel:    body.ctaLabel   || null,
      ctaUrl:      body.ctaUrl     || null,
      expiresAt:   body.expiresAt  ? new Date(body.expiresAt) : null,
      isPublished: body.isPublished ?? false,
      pinned:      body.pinned     ?? false,
    },
  });
  return NextResponse.json(announcement, { status: 201 });
}
