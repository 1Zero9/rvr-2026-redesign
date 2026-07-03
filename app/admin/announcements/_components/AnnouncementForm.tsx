'use client';

import { useState } from 'react';
import ImageUploadField from '@/components/admin/ImageUploadField';

export interface AnnouncementFormData {
  id:          string;
  title:       string;
  category:    string;
  body:        string;
  imageUrl:    string | null;
  ctaLabel:    string | null;
  ctaUrl:      string | null;
  expiresAt:   string | null;
  isPublished: boolean;
  pinned:      boolean;
}

interface Props {
  action:        (formData: FormData) => Promise<void>;
  deleteAction?: (formData: FormData) => Promise<void>;
  initialData?:  AnnouncementFormData;
}

const LABEL = 'block text-sm font-bold text-brand-charcoal mb-1';
const INPUT = 'w-full border-2 border-brand-charcoal px-3 py-2 min-h-[44px] bg-white focus:outline-none focus:border-brand-neon text-brand-charcoal';
const TEXTAREA = 'w-full border-2 border-brand-charcoal px-3 py-2 bg-white focus:outline-none focus:border-brand-neon text-brand-charcoal resize-y';

export default function AnnouncementForm({ action, deleteAction, initialData }: Props) {
  const d = initialData;
  const [imageUrl, setImageUrl] = useState(d?.imageUrl ?? '');

  return (
    <div className="space-y-8">
      {/* ── Main form ──────────────────────────────────────────────── */}
      <form action={action as (formData: FormData) => void} className="space-y-5">

        {/* Title */}
        <div>
          <label htmlFor="title" className={LABEL}>Title *</label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={d?.title ?? ''}
            className={INPUT}
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className={LABEL}>Category *</label>
          <select
            id="category"
            name="category"
            required
            defaultValue={d?.category ?? 'COMMUNITY_NEWS'}
            className={INPUT}
          >
            <option value="BREAKING">Breaking News — urgent, time-sensitive</option>
            <option value="CONGRATULATIONS">Congratulations — wins, awards, milestones</option>
            <option value="COMMUNITY_NEWS">Community News — general club updates</option>
            <option value="IN_SYMPATHY">In Sympathy — condolence notices</option>
          </select>
          <p className="mt-1 text-xs text-brand-charcoal/60">
            In Sympathy notices: keep wording gentle and factual — &ldquo;The club extends
            its deepest sympathies to…&rdquo;. Always confirm with the family before publishing.
          </p>
        </div>

        {/* Body */}
        <div>
          <label htmlFor="body" className={LABEL}>Body * <span className="font-normal text-brand-charcoal/50">(markdown, 2–3 paragraphs)</span></label>
          <textarea
            id="body"
            name="body"
            rows={6}
            required
            defaultValue={d?.body ?? ''}
            className={TEXTAREA}
          />
        </div>

        {/* Image */}
        <ImageUploadField
          id="imageUrl"
          name="imageUrl"
          label="Image"
          hint="optional — shown on the news card, article page, and homepage spotlight"
          url={imageUrl}
          onUrlChange={setImageUrl}
          pathPrefix="news"
          showPreview
        />

        {/* CTA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ctaLabel" className={LABEL}>CTA Label <span className="font-normal text-brand-charcoal/50">(optional)</span></label>
            <input
              id="ctaLabel"
              name="ctaLabel"
              type="text"
              defaultValue={d?.ctaLabel ?? ''}
              placeholder="Register Now"
              className={INPUT}
            />
          </div>
          <div>
            <label htmlFor="ctaUrl" className={LABEL}>CTA URL <span className="font-normal text-brand-charcoal/50">(optional — relative paths like /walking-football are fine)</span></label>
            <input
              id="ctaUrl"
              name="ctaUrl"
              type="text"
              defaultValue={d?.ctaUrl ?? ''}
              placeholder="/walking-football or https://..."
              className={INPUT}
            />
          </div>
        </div>

        {/* Expires at */}
        <div>
          <label htmlFor="expiresAt" className={LABEL}>Expires At <span className="font-normal text-brand-charcoal/50">(optional — auto-hides after this date)</span></label>
          <input
            id="expiresAt"
            name="expiresAt"
            type="date"
            defaultValue={d?.expiresAt?.slice(0, 10) ?? ''}
            className={INPUT}
          />
        </div>

        {/* Flags */}
        <div className="flex gap-8">
          <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
            <input
              name="isPublished"
              type="checkbox"
              defaultChecked={d?.isPublished ?? false}
              className="w-5 h-5 accent-brand-neon"
            />
            <span className="text-sm font-bold text-brand-charcoal">Published</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
            <input
              name="pinned"
              type="checkbox"
              defaultChecked={d?.pinned ?? false}
              className="w-5 h-5 accent-brand-neon"
            />
            <span className="text-sm font-bold text-brand-charcoal">📌 Pinned</span>
          </label>
        </div>

        <button
          type="submit"
          className="bg-brand-neon text-brand-charcoal font-bold px-6 py-3 min-h-[44px] border-3 border-brand-charcoal shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
        >
          {d ? 'Save Changes' : 'Create Announcement'}
        </button>
      </form>

      {/* ── Delete form ────────────────────────────────────────────── */}
      {deleteAction && (
        <div className="border-t-2 border-brand-charcoal/10 pt-8">
          <h2 className="font-display font-black italic text-lg text-brand-maroon mb-2">
            Danger Zone
          </h2>
          <p className="text-sm text-brand-charcoal/60 mb-4">
            This permanently deletes the announcement and cannot be undone.
          </p>
          <form
            action={deleteAction as (formData: FormData) => void}
            onSubmit={(e) => {
              if (!window.confirm('Delete this announcement? This cannot be undone.')) {
                e.preventDefault();
              }
            }}
          >
            <button
              type="submit"
              className="bg-white text-brand-maroon font-bold px-6 py-3 min-h-[44px] border-2 border-brand-maroon hover:bg-brand-maroon hover:text-white transition-all"
            >
              Delete Announcement
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
