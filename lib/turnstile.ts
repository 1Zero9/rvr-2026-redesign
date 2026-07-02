export async function verifyTurnstile(token: string, ip?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    const canBypass = process.env.NODE_ENV !== 'production';
    console.warn(
      `[turnstile] TURNSTILE_SECRET_KEY not set — verification ${canBypass ? 'bypassed outside production' : 'rejected'}`,
    );
    return canBypass;
  }
  if (!token) return false;

  const params = new URLSearchParams({ secret, response: token });
  if (ip) params.set('remoteip', ip);

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: params,
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { success: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
