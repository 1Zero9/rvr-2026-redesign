'use client';

import { FormEvent, useState } from 'react';
import { CheckCircle2, PackagePlus } from 'lucide-react';

export default function BootRoomSubmissionForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [error, setError] = useState('');

  async function submitListing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'submitting') return;

    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus('submitting');
    setError('');

    try {
      const response = await fetch('/api/boot-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(data)),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(result.error || 'The listing could not be submitted.');
      }
      form.reset();
      setStatus('success');
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'The listing could not be submitted.',
      );
      setStatus('idle');
    }
  }

  if (status === 'success') {
    return (
      <div className="site-surface p-6 sm:p-8" role="status" aria-live="polite">
        <CheckCircle2 className="h-10 w-10 text-brand-green" aria-hidden="true" />
        <h2 className="mt-4 font-display text-2xl font-black uppercase text-brand-navy">
          Item sent for review
        </h2>
        <p className="mt-3 text-sm font-semibold leading-6 text-zinc-600">
          The club will review the listing before it appears publicly. Your
          contact information is never shown on the public page.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-5 min-h-11 font-display text-xs font-black uppercase text-brand-green underline decoration-2 underline-offset-4"
        >
          Submit another item
        </button>
      </div>
    );
  }

  const inputClass =
    'min-h-12 min-w-0 rounded-xl border-2 border-brand-navy bg-white px-4 text-base font-semibold outline-none focus:ring-4 focus:ring-brand-neon';

  return (
    <form onSubmit={submitListing} className="site-surface p-6 sm:p-8">
      <h2 className="font-display text-2xl font-black uppercase text-brand-navy">
        Donate an item
      </h2>
      <p className="mt-2 text-sm font-semibold leading-6 text-zinc-600">
        List clean, safe football equipment that another RVR family can reuse.
      </p>

      <div className="mt-6 grid gap-5">
        <label className="grid gap-2">
          <span className="font-display text-xs font-black uppercase text-brand-navy">
            Item title
          </span>
          <input
            required
            name="title"
            maxLength={120}
            placeholder="Example: Nike football boots, size 4"
            className={inputClass}
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="font-display text-xs font-black uppercase text-brand-navy">
              Category
            </span>
            <select required name="category" className={inputClass}>
              <option value="">Choose a category</option>
              <option value="BOOTS">Boots</option>
              <option value="KIT">Kit and clothing</option>
              <option value="GOALKEEPER">Goalkeeper gear</option>
              <option value="EQUIPMENT">Training equipment</option>
              <option value="BAGS">Bags</option>
              <option value="OTHER">Other</option>
            </select>
          </label>
          <label className="grid gap-2">
            <span className="font-display text-xs font-black uppercase text-brand-navy">
              Condition
            </span>
            <select required name="itemCondition" className={inputClass}>
              <option value="">Choose condition</option>
              <option value="EXCELLENT">Excellent</option>
              <option value="VERY_GOOD">Very good</option>
              <option value="GOOD">Good</option>
              <option value="FAIR">Fair</option>
            </select>
          </label>
        </div>

        <label className="grid gap-2">
          <span className="font-display text-xs font-black uppercase text-brand-navy">
            Size or age range
          </span>
          <input
            name="size"
            maxLength={80}
            placeholder="Example: UK 4, Youth Medium, U10–U12"
            className={inputClass}
          />
        </label>

        <label className="grid gap-2">
          <span className="font-display text-xs font-black uppercase text-brand-navy">
            Description
          </span>
          <textarea
            required
            name="description"
            minLength={10}
            maxLength={1200}
            rows={5}
            placeholder="Describe wear, defects, included parts, and anything a family should know."
            className="min-h-32 rounded-xl border-2 border-brand-navy bg-white p-4 text-base font-semibold outline-none placeholder:text-zinc-400 focus:ring-4 focus:ring-brand-neon"
          />
        </label>

        <div className="border-t-2 border-brand-navy/10 pt-5">
          <h3 className="font-display text-lg font-black uppercase text-brand-navy">
            Private contact details
          </h3>
          <p className="mt-1 text-xs font-semibold leading-5 text-zinc-500">
            These details are visible only to club administrators.
          </p>
        </div>

        <label className="grid gap-2">
          <span className="font-display text-xs font-black uppercase text-brand-navy">
            Your name
          </span>
          <input
            required
            name="donorName"
            autoComplete="name"
            maxLength={120}
            className={inputClass}
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="font-display text-xs font-black uppercase text-brand-navy">
              Email
            </span>
            <input
              name="donorEmail"
              type="email"
              autoComplete="email"
              maxLength={254}
              className={inputClass}
            />
          </label>
          <label className="grid gap-2">
            <span className="font-display text-xs font-black uppercase text-brand-navy">
              Phone
            </span>
            <input
              name="donorPhone"
              type="tel"
              autoComplete="tel"
              maxLength={40}
              className={inputClass}
            />
          </label>
        </div>
        <p className="-mt-2 text-xs font-semibold text-zinc-500">
          Provide at least one contact method.
        </p>

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
        <PackagePlus className="h-4 w-4" aria-hidden="true" />
        {status === 'submitting' ? 'Submitting…' : 'Send for review'}
      </button>
    </form>
  );
}
