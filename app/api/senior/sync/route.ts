import { NextResponse } from 'next/server';
import { getSeniorSyncData } from '@/lib/finalwhistle/service';

export const dynamic   = 'force-dynamic';
export const revalidate = 0;

export async function GET(): Promise<NextResponse> {
  const data = await getSeniorSyncData();
  return NextResponse.json(data, {
    headers: {
      'X-Data-Source': 'finalwhistle-live',
      'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=60',
    },
  });
}
