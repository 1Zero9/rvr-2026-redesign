import { NextResponse } from 'next/server';
import { getFixtureSyncData } from '@/lib/ddsl/sync-service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(): Promise<NextResponse> {
  const data = await getFixtureSyncData();
  return NextResponse.json(data, {
    headers: {
      'X-Data-Source': data.source,
      'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=60',
    },
  });
}
