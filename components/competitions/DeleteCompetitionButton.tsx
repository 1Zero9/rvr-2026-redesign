'use client';

import { Trash2 } from 'lucide-react';

type ServerAction = (formData: FormData) => Promise<void>;

export function DeleteCompetitionButton({
  id,
  name,
  action,
}: {
  id: string;
  name: string;
  action: ServerAction;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(`Delete "${name}"? This removes all its teams, fixtures, and results. This cannot be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        aria-label={`Delete ${name}`}
        className="min-h-[44px] min-w-[44px] flex items-center justify-center px-4 text-brand-charcoal/40 hover:text-brand-maroon transition-colors"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </button>
    </form>
  );
}
