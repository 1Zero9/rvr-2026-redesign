'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  approveAction: () => Promise<void>;
  rejectAction: () => Promise<void>;
}

export default function ModerationActions({ approveAction, rejectAction }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAction(action: 'approve' | 'reject') {
    setLoading(action);
    setError(null);

    try {
      await (action === 'approve' ? approveAction() : rejectAction());
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-col gap-2 items-start">
      <div className="flex gap-2">
        <button
          onClick={() => handleAction('approve')}
          disabled={loading !== null}
          className="px-3 py-1.5 text-xs font-display font-black uppercase tracking-wide bg-brand-neon text-brand-charcoal border-2 border-brand-charcoal rounded-lg shadow-brutalist-neon disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-all"
        >
          {loading === 'approve' ? 'Approving…' : 'Approve'}
        </button>
        <button
          onClick={() => handleAction('reject')}
          disabled={loading !== null}
          className="px-3 py-1.5 text-xs font-display font-black uppercase tracking-wide bg-brand-maroon text-white border-2 border-brand-charcoal rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-all"
        >
          {loading === 'reject' ? 'Rejecting…' : 'Reject'}
        </button>
      </div>
      {error && (
        <p className="text-red-400 text-xs font-sans">{error}</p>
      )}
    </div>
  );
}
