'use client';

import { Trash2 } from 'lucide-react';

type ServerAction = (formData: FormData) => Promise<void>;

export default function DeleteLineItemButton({
  id,
  action,
}: {
  id: string;
  action: ServerAction;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm('Delete this line item? This cannot be undone.')) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        aria-label="Delete line item"
        className="min-h-[44px] min-w-[44px] flex items-center justify-center text-brand-charcoal/40 hover:text-brand-maroon transition-colors"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </button>
    </form>
  );
}
