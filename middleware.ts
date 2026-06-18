import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest): NextResponse {
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const header = req.headers.get('authorization') ?? '';
    if (header !== `Bearer ${process.env.ADMIN_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorised.' }, { status: 401 });
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
