import { NextRequest, NextResponse } from 'next/server';
import { sendMail } from '@/lib/safeguarding/mailer';
import { verifyTurnstile } from '@/lib/turnstile';

const MAILBOXES = {
  info:           'rivervalleyrangers+info@outlook.com',
  secretary:      'rivervalleyrangers+secretary@outlook.com',
  welfare:        'rivervalleyrangers+welfare@outlook.com',
  safeguarding:   'rivervalleyrangers+safeguarding@outlook.com',
  footballforall: 'rivervalleyrangers+footballforall@outlook.com',
} as const;

type Mailbox = keyof typeof MAILBOXES;

const LABELS: Record<Mailbox, string> = {
  info:           'General Enquiries',
  secretary:      'Club Secretary',
  welfare:        "Children's Welfare Officer",
  safeguarding:   'Designated Liaison Person',
  footballforall: 'Football For All',
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function sanitiseHeaderValue(str: string): string {
  return str.replace(/[\r\n\t]/g, ' ').trim();
}

export async function POST(request: NextRequest) {
  let body: {
    mailbox?: string;
    name?: string;
    email?: string;
    message?: string;
    website?: string;
    turnstileToken?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  // Honeypot — bots fill hidden fields, humans don't
  if (body.website) {
    return NextResponse.json({ success: true });
  }

  // Turnstile bot protection
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const tokenOk = await verifyTurnstile(body.turnstileToken ?? '', ip);
  if (!tokenOk) {
    return NextResponse.json(
      { error: 'Bot check failed. Please refresh the page and try again.' },
      { status: 403 },
    );
  }

  const mailbox = body.mailbox?.trim() ?? '';
  const name    = body.name?.trim() ?? '';
  const email   = body.email?.trim().toLowerCase() ?? '';
  const message = body.message?.trim() ?? '';

  if (!(mailbox in MAILBOXES)) {
    return NextResponse.json({ error: 'Invalid mailbox.' }, { status: 400 });
  }
  if (name.length < 2) {
    return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }
  if (message.length < 5) {
    return NextResponse.json({ error: 'Please enter a message.' }, { status: 400 });
  }

  const to    = MAILBOXES[mailbox as Mailbox];
  const label = LABELS[mailbox as Mailbox];

  // Escape all user input before embedding in HTML
  const safeName    = escapeHtml(name.slice(0, 120));
  const safeEmail   = escapeHtml(email.slice(0, 254));
  const safeMessage = escapeHtml(message.slice(0, 5000)).replace(/\n/g, '<br />');
  const safeLabel   = escapeHtml(label);

  const html = `
    <p><strong>From:</strong> ${safeName} &lt;${safeEmail}&gt;</p>
    <p><strong>Enquiry type:</strong> ${safeLabel}</p>
    <hr />
    <p>${safeMessage}</p>
  `;
  const text = `From: ${name} <${email}>\nEnquiry type: ${label}\n\n${message}`;

  // Strip control characters from replyTo to prevent email header injection
  const safeReplyToName = sanitiseHeaderValue(name.slice(0, 120));

  try {
    await sendMail({
      to,
      replyTo: `${safeReplyToName} <${email}>`,
      subject: `Website enquiry — ${label}`,
      html,
      text,
    });
  } catch (err) {
    console.error('[contact] sendMail error:', err);
    return NextResponse.json(
      { error: 'Failed to send your message. Please try again shortly.' },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
