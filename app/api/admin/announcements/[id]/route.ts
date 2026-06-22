import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const secret = req.headers.get('x-admin-secret');
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const updated = await prisma.announcement.update({
    where: { id },
    data: {
      title:       body.title,
      category:    body.category,
      body:        body.body,
      imageUrl:    body.imageUrl   ?? null,
      ctaLabel:    body.ctaLabel   ?? null,
      ctaUrl:      body.ctaUrl     ?? null,
      expiresAt:   body.expiresAt  ? new Date(body.expiresAt) : null,
      isPublished: body.isPublished,
      pinned:      body.pinned,
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const secret = req.headers.get('x-admin-secret');
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }
  const { id } = await params;
  await prisma.announcement.delete({ where: { id } });
  return NextResponse.json({ deleted: true });
}
