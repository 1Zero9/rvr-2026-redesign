import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest): NextResponse {
  if (req.nextUrl.pathname.startsWith('/admin')) {
    // Login page is always accessible
    if (req.nextUrl.pathname === '/admin/login') return NextResponse.next();

    const secret  = process.env.ADMIN_SECRET ?? '';
    const header  = req.headers.get('authorization') ?? '';
    const cookie  = req.cookies.get('rvr_admin')?.value ?? '';

    const authorised = header === `Bearer ${secret}` || cookie === secret;
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
  matcher: ['/admin/:path*'],
};
