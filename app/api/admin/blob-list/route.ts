import { NextRequest, NextResponse } from 'next/server';
import { list } from '@vercel/blob';
import { requireAdmin } from '@/lib/admin/require-admin';

const ALLOWED_PREFIXES = ['news', 'campaigns', 'posters', 'uploads'];

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const prefix = searchParams.get('prefix') ?? '';
  const cursor = searchParams.get('cursor') ?? undefined;

  if (prefix && !ALLOWED_PREFIXES.includes(prefix)) {
    return NextResponse.json({ error: 'Invalid prefix' }, { status: 400 });
  }

  try {
    const result = await list({
      prefix: prefix ? `${prefix}/` : undefined,
      cursor,
      limit: 24,
    });
    return NextResponse.json({
      blobs: result.blobs
        .filter((b) => /\.(jpe?g|png|webp|avif)$/i.test(b.pathname))
        .map((b) => ({
        url: b.url,
        pathname: b.pathname,
        size: b.size,
          uploadedAt: b.uploadedAt,
        })),
      cursor: result.cursor ?? null,
      hasMore: result.hasMore,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Listing failed' },
      { status: 500 },
    );
  }
}
