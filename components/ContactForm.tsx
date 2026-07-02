'use client';

import { useState } from 'react';
import { CheckCircle, Send } from 'lucide-react';
import TurnstileWidget from '@/components/TurnstileWidget';

type Mailbox = 'info' | 'secretary' | 'welfare' | 'safeguarding' | 'footballforall';

interface ContactFormProps {
  mailbox: Mailbox;
  messagePlaceholder?: string;
}

export default function ContactForm({
  mailbox,
  messagePlaceholder = 'How can we help?',
}: ContactFormProps) {
  const [name,           setName]           = useState('');
  const [email,          setEmail]          = useState('');
  const [message,        setMessage]        = useState('');
  const [status,         setStatus]         = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errMsg,         setErrMsg]         = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setErrMsg('');

    try {
      const res  = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ mailbox, name, email, message, website: '', turnstileToken }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrMsg(data.error ?? 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setErrMsg('Could not send your message. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className="flex items-start gap-3 rounded-xl border-2 border-brand-neon/40 bg-brand-neon/10 px-4 py-4 mt-3">
        <CheckCircle className="h-5 w-5 text-brand-neon shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <p className="font-display font-black text-sm uppercase text-brand-charcoal">Message sent!</p>
          <p className="text-xs text-brand-charcoal/60 mt-0.5">We&apos;ll get back to you as soon as possible.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 mt-3" noValidate>
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        minLength={2}
        className="w-full border border-zinc-200 px-3 py-2.5 text-sm text-brand-charcoal placeholder:text-zinc-400 focus:border-brand-navy focus:outline-none"
      />
      <input
        type="email"
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full border border-zinc-200 px-3 py-2.5 text-sm text-brand-charcoal placeholder:text-zinc-400 focus:border-brand-navy focus:outline-none"
      />
      <textarea
        placeholder={messagePlaceholder}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        rows={3}
        className="w-full border border-zinc-200 px-3 py-2.5 text-sm text-brand-charcoal placeholder:text-zinc-400 focus:border-brand-navy focus:outline-none resize-none"
      />
      <label className="hidden" aria-hidden="true">
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <TurnstileWidget onToken={setTurnstileToken} action="contact" />
      {errMsg && (
        <p className="text-xs font-semibold text-red-600">{errMsg}</p>
      )}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="mt-1 inline-flex items-center gap-2 min-h-[44px] px-4 bg-brand-navy text-brand-neon font-display font-black uppercase text-xs border-2 border-brand-charcoal shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="h-3.5 w-3.5" aria-hidden="true" />
        {status === 'sending' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}
