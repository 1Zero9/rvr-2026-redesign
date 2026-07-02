import Link from 'next/link';
import Image from 'next/image';
import { APP_VERSION, APP_VERSION_DATE } from '@/config/version';
import { CLUB_SEASON } from '@/config/club-season';

const FOOTER_NAV = [
  {
    heading: 'Play',
    links: [
      { label: 'All Teams',       href: '/teams'          },
      { label: 'Fixtures',        href: '/fixtures'       },
      { label: 'Senior Hub',      href: '/seniors'        },
      { label: 'Register',        href: '/register'       },
      { label: 'Book Astro',      href: '/astro-booking'  },
      { label: 'Pitch Locations', href: '/pitch-locations'},
    ],
  },
  {
    heading: 'Club',
    links: [
      { label: 'About',           href: '/club'            },
      { label: 'Our History',     href: '/club/history'    },
      { label: 'Club News',       href: '/news'            },
      { label: 'Contact',         href: '/contact'         },
      { label: 'Volunteer',       href: '/get-involved'    },
      { label: 'Sponsorship',     href: '/sponsorship'     },
    ],
  },
  {
    heading: 'Community',
    links: [
      { label: 'Community Football', href: '/community'        },
      { label: 'Football For All',   href: '/football-for-all' },
      { label: 'Walking Football',   href: '/walking-football' },
      { label: 'Ladies Football',    href: '/ladies-football'  },
      { label: 'Player Pathway',     href: '/pathway'          },
      { label: 'About Swords',       href: '/swords'           },
    ],
  },
];

const TRUST_ITEMS = [
  '100% Garda Vetted Coaches',
  'FAI Club Mark Accredited',
];

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white border-t border-brand-sky/20">

      {/* Join CTA strip */}
      <div className="border-b border-brand-sky/10">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-display font-black italic text-xl uppercase text-brand-cream leading-tight">
              Ready to join Rivervalley Rangers?
            </p>
            <p className="text-brand-sky/70 text-sm mt-1">
              Teams for every age, every level — from Academy to Seniors.
            </p>
          </div>
          <Link
            href="/register"
            className="shrink-0 inline-flex items-center gap-2 min-h-[48px] px-7 bg-brand-neon text-brand-charcoal font-display font-black italic uppercase text-sm border-3 border-brand-charcoal shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all whitespace-nowrap"
          >
            Register Now →
          </Link>
        </div>
      </div>

      {/* Nav columns */}
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-6 grid grid-cols-2 md:grid-cols-4 gap-8">

        {/* Club description */}
        <div className="col-span-2 md:col-span-1">
          <h4 className="font-display font-black text-base italic uppercase tracking-tight text-brand-neon mb-3">
            Rivervalley Rangers AFC
          </h4>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Swords&apos; leading community football club, established in{' '}
            {CLUB_SEASON.foundingYear}. Dedicated to equality, youth development,
            and inclusive sport.
          </p>
          <div className="mt-5 space-y-1.5">
            {TRUST_ITEMS.map((item) => (
              <p key={item} className="text-zinc-500 text-xs font-semibold">
                <span className="text-brand-neon mr-1.5" aria-hidden="true">✓</span>
                {item}
              </p>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {FOOTER_NAV.map((col) => (
          <div key={col.heading}>
            <h4 className="font-display font-bold text-[10px] uppercase tracking-widest text-brand-sky/60 mb-3">
              {col.heading}
            </h4>
            <ul className="space-y-2 text-sm">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-zinc-400 hover:text-brand-neon transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

      </div>

      {/* Legal strip */}
      <div className="max-w-6xl mx-auto px-6 pb-6 border-t border-zinc-800 pt-5">
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/privacy"          className="text-xs text-zinc-500 hover:text-brand-neon transition-colors">Privacy Policy</Link>
          <Link href="/club/safeguarding" className="text-xs text-zinc-500 hover:text-brand-neon transition-colors">Child Safeguarding</Link>
          <Link href="/boot-room"         className="text-xs text-zinc-500 hover:text-brand-neon transition-colors">Boot Room</Link>
          <Link href="/shop"              className="text-xs text-zinc-500 hover:text-brand-neon transition-colors">Club Shop</Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-6xl mx-auto px-6 py-5 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <p>&copy; {new Date().getFullYear()} Rivervalley Rangers AFC. All rights reserved.</p>

        <a
          href="https://www.instagram.com/rvrfc1981"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-brand-neon transition-colors"
          aria-label="Follow Rivervalley Rangers on Instagram"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
          @rvrfc1981
        </a>

        <div className="flex items-center gap-4">
          <p className="text-brand-sky/40">
            RVR2026 v{APP_VERSION} · {APP_VERSION_DATE}
          </p>
          <span className="h-3 w-px bg-zinc-700" aria-hidden="true" />
          <a
            href="https://www.1zero9.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-brand-neon hover:text-white transition-colors"
            aria-label="Built by 1Zero9Studio"
          >
            <Image
              src="/marketing/109-logo-circle-white2.png"
              alt="1Zero9Studio"
              width={16}
              height={16}
              className="h-7 w-7 opacity-90"
            />
            <span className="font-bold">Built by 1Zero9Studio</span>
          </a>
        </div>
      </div>

    </footer>
  );
}
