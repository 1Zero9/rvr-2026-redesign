import Image from 'next/image';

interface PhotoPlaceholderProps {
  /** Absolute path to the image once available, e.g. '/photos/academy-session.jpg' */
  src?: string;
  alt: string;
  /** Descriptive label shown when no src is provided — helps identify what shot is needed */
  label: string;
  aspectRatio?: '16/9' | '4/3' | '1/1' | '3/2';
  className?: string;
  priority?: boolean;
}

const ASPECT_CLASSES: Record<string, string> = {
  '16/9': 'aspect-video',
  '4/3':  'aspect-[4/3]',
  '1/1':  'aspect-square',
  '3/2':  'aspect-[3/2]',
};

export default function PhotoPlaceholder({
  src,
  alt,
  label,
  aspectRatio = '16/9',
  className = '',
  priority = false,
}: PhotoPlaceholderProps) {
  const aspectClass = ASPECT_CLASSES[aspectRatio] ?? 'aspect-video';

  if (src) {
    return (
      <div className={`relative overflow-hidden ${aspectClass} ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    );
  }

  /* No photo yet — render a branded placeholder */
  return (
    <div
      className={`relative overflow-hidden ${aspectClass} ${className} bg-brand-navy/8 border-2 border-dashed border-brand-navy/20 flex flex-col items-center justify-center gap-2`}
      role="img"
      aria-label={alt}
    >
      {/* RVR crest watermark */}
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-brand-navy/20"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
      <span className="text-[10px] font-display font-black uppercase tracking-widest text-brand-navy/30 text-center px-4 leading-snug">
        {label}
      </span>
    </div>
  );
}
