import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Pass the current pathname to layouts via header
  // (admin layout uses this to detect the login page and skip the auth check)
  const headers = new Headers(request.headers);
  headers.set('x-pathname', pathname);

  return NextResponse.next({ request: { headers } });
}

export const config = {
  // Run on all pages except static assets, api routes, and Next.js internals
  matcher: ['/((?!api|_next/static|_next/image|_next/webpack|favicon).*)'],
};
