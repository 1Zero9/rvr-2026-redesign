import { NextRequest, NextResponse } from 'next/server';

function getSessionToken(req: NextRequest): string | undefined {
  return (
    req.cookies.get('authjs.session-token')?.value ??
    req.cookies.get('__Secure-authjs.session-token')?.value
  );
}

export function proxy(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl;

  // NextAuth session gate for /admin/* (role check happens in layout + server actions)
  if (pathname.startsWith('/admin') || pathname.startsWith('/jmo-admin')) {
    if (pathname !== '/admin/login' && !getSessionToken(req)) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  // NextAuth session gate for competitions admin
  if (pathname.startsWith('/competitions/admin') && !getSessionToken(req)) {
    return NextResponse.redirect(new URL('/competitions/login', req.url));
  }

  // Forward pathname so the layout can read it without client hooks
  const res = NextResponse.next();
  res.headers.set('x-pathname', pathname);
  return res;
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/jmo-admin', '/jmo-admin/:path*', '/competitions/admin/:path*'],
};
