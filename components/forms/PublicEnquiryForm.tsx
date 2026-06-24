'use client';

import { FormEvent, useState } from 'react';
import { CheckCircle2, Send } from 'lucide-react';

type EnquiryType =
  | 'VOLUNTEER_INTEREST'
  | 'COACHING_INTEREST'
  | 'SPONSORSHIP_INTEREST';

interface PublicEnquiryFormProps {
  type: EnquiryType;
  title: string;
  description: string;
  detailsLabel: string;
  detailsPlaceholder: string;
  submitLabel: string;
  successMessage: string;
}

export default function PublicEnquiryForm({
  type,
  title,
  description,
  detailsLabel,
  detailsPlaceholder,
  submitLabel,
  successMessage,
}: PublicEnquiryFormProps) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [error, setError] = useState('');

  async function submitEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'submitting') return;

    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus('submitting');
    setError('');

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          name: data.get('name'),
          email: data.get('email'),
          phone: data.get('phone'),
          details: data.get('details'),
          website: data.get('website'),
        }),
      });

      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(result.error || 'Your enquiry could not be submitted.');
      }

      form.reset();
      setStatus('success');
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Your enquiry could not be submitted.',
      );
      setStatus('idle');
    }
  }

  if (status === 'success') {
    return (
      <div
        className="rounded-2xl border-2 border-brand-navy bg-white p-6 sm:p-8"
        role="status"
        aria-live="polite"
      >
        <CheckCircle2 className="h-10 w-10 text-brand-green" aria-hidden="true" />
        <h2 className="mt-4 font-display text-3xl font-black uppercase text-brand-navy">
          Enquiry received
        </h2>
        <p className="mt-3 text-sm font-semibold leading-6 text-zinc-600">
          {successMessage}
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-5 min-h-11 font-display text-xs font-black uppercase text-brand-green underline decoration-2 underline-offset-4"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submitEnquiry} className="rounded-2xl border-2 border-brand-navy bg-white p-6 sm:p-8">
      <h2 className="font-display text-3xl font-black uppercase text-brand-navy">
        {title}
      </h2>
      <p className="mt-2 text-sm font-semibold leading-6 text-zinc-600">
        {description}
      </p>

      <div className="mt-6 grid gap-5">
        <label className="grid gap-2">
          <span className="font-display text-xs font-black uppercase text-brand-navy">
            Name
          </span>
          <input
            required
            name="name"
            autoComplete="name"
            maxLength={120}
            className="min-h-12 rounded-xl border-2 border-brand-navy bg-white px-4 text-base font-semibold outline-none focus:ring-4 focus:ring-brand-neon"
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="font-display text-xs font-black uppercase text-brand-navy">
              Email
            </span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
              className="min-h-12 min-w-0 rounded-xl border-2 border-brand-navy bg-white px-4 text-base font-semibold outline-none focus:ring-4 focus:ring-brand-neon"
            />
          </label>
          <label className="grid gap-2">
            <span className="font-display text-xs font-black uppercase text-brand-navy">
              Phone
            </span>
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              maxLength={40}
              className="min-h-12 min-w-0 rounded-xl border-2 border-brand-navy bg-white px-4 text-base font-semibold outline-none focus:ring-4 focus:ring-brand-neon"
            />
          </label>
        </div>

        <p className="-mt-2 text-xs font-semibold text-zinc-500">
          Provide at least one contact method.
        </p>

        <label className="grid gap-2">
          <span className="font-display text-xs font-black uppercase text-brand-navy">
            {detailsLabel}
          </span>
          <textarea
            name="details"
            rows={5}
            maxLength={2000}
            placeholder={detailsPlaceholder}
            className="min-h-32 rounded-xl border-2 border-brand-navy bg-white p-4 text-base font-semibold outline-none placeholder:text-zinc-400 focus:ring-4 focus:ring-brand-neon"
          />
        </label>

        <label className="hidden" aria-hidden="true">
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {error && (
        <p
          className="mt-5 rounded-xl border-2 border-red-700 bg-red-50 p-4 text-sm font-bold text-red-800"
          role="alert"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="btn-brutalist-neon mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 px-5 py-3 text-sm disabled:cursor-wait disabled:opacity-60 sm:w-auto"
      >
        <Send className="h-4 w-4" aria-hidden="true" />
        {status === 'submitting' ? 'Submitting…' : submitLabel}
      </button>
    </form>
  );
}
