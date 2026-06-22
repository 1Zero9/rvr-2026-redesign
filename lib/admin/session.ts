import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export const ADMIN_COOKIE_NAME = 'rvr_admin_session';
const SESSION_SECONDS = 60 * 60 * 8;

function getSecret(): string | null {
  const secret = process.env.ADMIN_SECRET?.trim();
  return secret ? secret : null;
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export function createAdminSession(): string {
  const secret = getSecret();
  if (!secret) throw new Error('ADMIN_SECRET is not configured');

  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = `${expiresAt}.${randomBytes(16).toString('base64url')}`;
  return `${payload}.${sign(payload, secret)}`;
}

export function verifyAdminSession(token: string | undefined): boolean {
  const secret = getSecret();
  if (!secret || !token) return false;

  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [expiresRaw, nonce, signature] = parts;
  const expiresAt = Number(expiresRaw);
  if (!Number.isFinite(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000)) {
    return false;
  }

  const payload = `${expiresRaw}.${nonce}`;
  const expected = Buffer.from(sign(payload, secret));
  const received = Buffer.from(signature);
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export function isAdminSecretConfigured(): boolean {
  return getSecret() !== null;
}
