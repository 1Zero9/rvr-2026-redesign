import { NextRequest, NextResponse } from 'next/server';
import { sendMail } from '@/lib/safeguarding/mailer';

const MAILBOXES = {
  info:         'rivervalleyrangers+info@outlook.com',
  secretary:    'rivervalleyrangers+secretary@outlook.com',
  welfare:      'rivervalleyrangers+welfare@outlook.com',
  safeguarding: 'rivervalleyrangers+safeguarding@outlook.com',
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

export async function POST(request: NextRequest) {
  let body: { mailbox?: string; name?: string; email?: string; message?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
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

  const html = `
    <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
    <p><strong>Enquiry type:</strong> ${label}</p>
    <hr />
    <p>${message.replace(/\n/g, '<br />')}</p>
  `;
  const text = `From: ${name} <${email}>\nEnquiry type: ${label}\n\n${message}`;

  try {
    await sendMail({
      to,
      replyTo: `${name} <${email}>`,
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
