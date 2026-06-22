import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifyAdminSession } from '@/lib/admin/session';

export function proxy(req: NextRequest): NextResponse {
  if (
    req.nextUrl.pathname.startsWith('/admin') ||
    req.nextUrl.pathname.startsWith('/jmo-admin')
  ) {
    // Login page is always accessible
    if (req.nextUrl.pathname === '/admin/login') return NextResponse.next();

    const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const authorised = verifyAdminSession(cookie);
    if (!authorised) {
      // Browser requests get redirected to login; API calls get 401
      const accept = req.headers.get('accept') ?? '';
      if (accept.includes('text/html')) {
        return NextResponse.redirect(new URL('/admin/login', req.url));
      }
      return NextResponse.json({ error: 'Unauthorised.' }, { status: 401 });
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/jmo-admin/:path*'],
};
