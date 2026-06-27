import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifyAdminSession } from '@/lib/admin/session';

export function proxy(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl;

  // Cookie-based admin protection (existing /admin/* and /jmo-admin/*)
  if (pathname.startsWith('/admin') || pathname.startsWith('/jmo-admin')) {
    if (pathname === '/admin/login') return NextResponse.next();

    const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!verifyAdminSession(cookie)) {
      const accept = req.headers.get('accept') ?? '';
      if (accept.includes('text/html')) {
        return NextResponse.redirect(new URL('/admin/login', req.url));
      }
      return NextResponse.json({ error: 'Unauthorised.' }, { status: 401 });
    }
  }

  // NextAuth session gate for competitions admin (cookie presence check;
  // full session validation happens inside each page via requireCompetitionSession)
  if (pathname.startsWith('/competitions/admin')) {
    const sessionToken =
      req.cookies.get('authjs.session-token')?.value ??
      req.cookies.get('__Secure-authjs.session-token')?.value;
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/competitions/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/jmo-admin/:path*', '/competitions/admin/:path*'],
};
