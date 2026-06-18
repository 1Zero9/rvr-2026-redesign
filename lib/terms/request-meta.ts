import type { NextRequest } from 'next/server';

export function getRequestMeta(req: NextRequest): { ipAddress: string | null; userAgent: string | null } {
  return {
    ipAddress: req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? null,
    userAgent: req.headers.get('user-agent') ?? null,
  };
}
