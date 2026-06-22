import { NextResponse } from 'next/server';
import { getFeatureAvailability } from '@/lib/features';

export const revalidate = 60;

export async function GET() {
  return NextResponse.json(await getFeatureAvailability());
}
