'use client';

import { useState } from 'react';
import Image from 'next/image';
import { INSTAGRAM_POSTS, type InstagramPost } from '@/lib/instagram-data';

function PostCard({ post }: { post: InstagramPost }) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-IE', {
    day:   'numeric',
    month: 'short',
    year:  'numeric',
  });

  return (
    <a
      href={post.postUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="relative aspect-square overflow-hidden group border-2 border-transparent hover:border-brand-neon transition-colors duration-200 block"
    >
      <Image
        src={post.imageUrl}
        alt={post.caption.slice(0, 100)}
        width={400}
        height={400}
        unoptimized
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-brand-navy/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3">
        <p className="text-white text-xs leading-snug line-clamp-3 mb-1">
          {post.caption}
        </p>
        <p className="text-brand-neon text-xs font-bold">{formattedDate}</p>
      </div>
    </a>
  );
}

export default function InstagramFeed() {
  const [open, setOpen] = useState(false);

  return (
    <section className="bg-brand-navy px-4 border-b border-brand-sky/20" spellCheck={false}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full max-w-6xl mx-auto flex items-center justify-between py-6 group"
      >
        <div className="flex items-center gap-4">
          <p className="text-brand-neon text-xs font-bold uppercase tracking-widest">
            INSTAGRAM
          </p>
          <h2 className="font-display font-black italic uppercase tracking-tight text-white text-2xl md:text-3xl">
            Latest From Instagram
          </h2>
        </div>
        <span className="text-brand-neon text-xl font-bold transition-transform duration-200 group-hover:scale-110"
          style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)', display: 'inline-block', transition: 'transform 200ms' }}
        >
          +
        </span>
      </button>

      {open && (
        <div className="max-w-6xl mx-auto pb-10">
          <p className="text-brand-sky text-sm max-w-md mb-6">
            Follow our match days, training sessions and club updates.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
            {INSTAGRAM_POSTS.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          <div className="text-center mt-8">
            <a
              href="https://www.instagram.com/rvrfc1981/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border-2 border-brand-neon text-brand-neon font-bold uppercase tracking-wide text-sm px-6 py-3 min-h-[44px] hover:bg-brand-neon hover:text-brand-charcoal transition-colors duration-200"
            >
              View All On Instagram ↗
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
