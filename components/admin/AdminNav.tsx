import Link from 'next/link';

const links = [
  { href: '/admin/announcements', label: 'Announcements' },
  { href: '/admin/enquiries', label: 'Enquiries' },
  { href: '/admin/features', label: 'Features' },
  { href: '/admin/moderation', label: 'Moderation' },
  { href: '/admin/docs', label: 'Docs' },
];

export default function AdminNav() {
  return (
    <nav
      aria-label="Admin navigation"
      className="mb-8 flex flex-wrap gap-2 border-b-2 border-brand-navy/10 pb-4"
    >
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="inline-flex min-h-11 items-center border-2 border-brand-navy px-4 font-display text-xs font-black uppercase text-brand-navy transition hover:bg-brand-navy hover:text-white"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
