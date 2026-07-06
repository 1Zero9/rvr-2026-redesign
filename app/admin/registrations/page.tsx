import { revalidatePath } from 'next/cache';
import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAdmin } from '@/lib/admin/require-admin';
import { prisma } from '@/lib/prisma';
import { RegistrationStatus } from '@prisma/client';

export const metadata: Metadata = {
  title: 'Registrations | RVR Admin',
  robots: { index: false, follow: false },
};

const STATUS_STYLES: Record<string, string> = {
  NEW:       'bg-brand-neon text-brand-charcoal',
  CONTACTED: 'bg-brand-sky text-brand-charcoal',
  WAITLISTED:'bg-yellow-300 text-brand-charcoal',
  ENROLLED:  'bg-brand-green text-white',
  DECLINED:  'bg-zinc-300 text-zinc-600',
};

const ALL_STATUSES = Object.values(RegistrationStatus);

function inferAgeGroup(yearOfBirth: number): string {
  const age = new Date().getFullYear() - yearOfBirth;
  return age <= 18 ? `U${age}` : 'Senior';
}

async function updateStatus(formData: FormData) {
  'use server';
  await requireAdmin();
  const id     = formData.get('id') as string;
  const status = formData.get('status');
  if (typeof status !== 'string' || !ALL_STATUSES.includes(status as RegistrationStatus)) {
    throw new Error('Invalid registration status.');
  }
  await prisma.playerProfile.update({
    where: { id },
    data:  { registrationStatus: status as RegistrationStatus },
  });
  revalidatePath('/admin/registrations');
}

export default async function RegistrationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  await requireAdmin();

  const { status: statusParam, q } = await searchParams;
  const statusFilter = ALL_STATUSES.includes(statusParam as RegistrationStatus)
    ? (statusParam as RegistrationStatus)
    : null;
  const query = q?.trim() ?? '';

  const [registrations, newCount] = await Promise.all([
    prisma.playerProfile.findMany({
      where: {
        ...(statusFilter ? { registrationStatus: statusFilter } : {}),
        ...(query ? { displayName: { contains: query, mode: 'insensitive' } } : {}),
      },
      include: {
        parentConsents: {
          orderBy: { signedAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 300,
    }),
    prisma.playerProfile.count({ where: { registrationStatus: RegistrationStatus.NEW } }),
  ]);

  const filterHref = (s: string | null) => {
    const params = new URLSearchParams();
    if (s) params.set('status', s);
    if (query) params.set('q', query);
    const qs = params.toString();
    return qs ? `/admin/registrations?${qs}` : '/admin/registrations';
  };

  return (
    <main className="min-h-screen bg-brand-cream px-4 py-8 text-brand-charcoal">
      <div className="mx-auto max-w-5xl">

        <div className="flex items-center gap-4 mb-2">
          <h1 className="font-display text-4xl font-black uppercase italic text-brand-navy">
            Registrations
          </h1>
          {newCount > 0 && (
            <span className="bg-brand-neon border-2 border-brand-charcoal font-display font-black text-xs px-3 py-1 uppercase">
              {newCount} New
            </span>
          )}
        </div>
        <p className="text-sm font-semibold text-zinc-600 mb-6">
          Player expressions of interest submitted via the public site.
        </p>

        {/* Filters */}
        <div className="mb-6 space-y-3">
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            <Link
              href={filterHref(null)}
              className={`shrink-0 px-3 min-h-[40px] flex items-center text-xs font-bold border-2 transition-colors ${
                !statusFilter
                  ? 'border-brand-charcoal bg-brand-navy text-brand-cream'
                  : 'border-brand-charcoal/20 bg-white text-brand-charcoal/60 hover:border-brand-charcoal/50'
              }`}
            >
              All
            </Link>
            {ALL_STATUSES.map((s) => (
              <Link
                key={s}
                href={filterHref(s)}
                className={`shrink-0 px-3 min-h-[40px] flex items-center text-xs font-bold border-2 transition-colors ${
                  statusFilter === s
                    ? 'border-brand-charcoal bg-brand-navy text-brand-cream'
                    : 'border-brand-charcoal/20 bg-white text-brand-charcoal/60 hover:border-brand-charcoal/50'
                }`}
              >
                {s}
                {s === 'NEW' && newCount > 0 && (
                  <span className="ml-1.5 bg-brand-neon text-brand-charcoal px-1 min-w-[18px] text-center leading-[18px] text-[10px] font-black">
                    {newCount}
                  </span>
                )}
              </Link>
            ))}
          </div>
          <form method="GET" className="flex gap-2">
            {statusFilter && <input type="hidden" name="status" value={statusFilter} />}
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search player name…"
              aria-label="Search registrations by player name"
              className="w-full max-w-xs border-2 border-brand-charcoal px-3 py-2 min-h-[44px] bg-white focus:outline-none focus:border-brand-neon"
            />
            <button
              type="submit"
              className="min-h-[44px] px-4 border-2 border-brand-navy font-display font-black text-xs uppercase text-brand-navy hover:bg-brand-navy hover:text-white transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {registrations.length === 0 ? (
          <p className="border-3 border-brand-navy bg-white p-8 text-center font-bold">
            {statusFilter || query ? 'Nothing matches this filter.' : 'No registrations yet.'}
          </p>
        ) : (
          <div className="grid gap-4">
            {registrations.map((reg) => {
              const consent = reg.parentConsents[0];
              const ageGroup = inferAgeGroup(reg.yearOfBirth);
              const statusStyle = STATUS_STYLES[reg.registrationStatus] ?? STATUS_STYLES.NEW;

              return (
                <article
                  key={reg.id}
                  className="border-3 border-brand-charcoal bg-white p-5 shadow-brutalist-charcoal"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                    {/* Left: info */}
                    <div className="flex-1 min-w-0">
                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className={`px-2 py-1 font-display text-[10px] font-black uppercase ${statusStyle}`}>
                          {reg.registrationStatus}
                        </span>
                        <span className="bg-brand-navy text-white px-2 py-1 font-display text-[10px] font-black uppercase">
                          {ageGroup}
                        </span>
                        {reg.gender && (
                          <span className="bg-brand-charcoal/10 text-brand-charcoal px-2 py-1 font-display text-[10px] font-black uppercase">
                            {reg.gender === 'MALE' ? 'Boys' : 'Girls'}
                          </span>
                        )}
                      </div>

                      {/* Player name */}
                      <h2 className="font-display text-xl font-black uppercase">
                        {reg.displayName}
                      </h2>
                      <p className="text-xs text-zinc-400 font-mono mt-0.5 mb-3">
                        Born {reg.yearOfBirth} · Submitted {new Date(reg.createdAt).toLocaleString('en-IE')}
                      </p>

                      {/* Parent contact */}
                      {consent && (
                        <div className="text-sm font-semibold text-zinc-700 space-y-0.5">
                          <p>{consent.parentName}</p>
                          <p>
                            <a href={`mailto:${consent.parentEmail}`} className="text-brand-navy underline">
                              {consent.parentEmail}
                            </a>
                            {consent.parentPhone && (
                              <> · <a href={`tel:${consent.parentPhone}`} className="text-brand-navy underline">{consent.parentPhone}</a></>
                            )}
                          </p>
                        </div>
                      )}

                      {/* Notes */}
                      {reg.notes && (
                        <p className="mt-3 text-sm text-zinc-600 leading-relaxed bg-zinc-50 border border-zinc-200 px-3 py-2">
                          {reg.notes}
                        </p>
                      )}
                    </div>

                    {/* Right: one-tap status */}
                    <form action={updateStatus} className="shrink-0 sm:max-w-[180px]">
                      <input type="hidden" name="id" value={reg.id} />
                      <p className="text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40 mb-1.5">
                        Set status
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {ALL_STATUSES.map((s) => {
                          const isCurrent = s === reg.registrationStatus;
                          return (
                            <button
                              key={s}
                              type="submit"
                              name="status"
                              value={s}
                              disabled={isCurrent}
                              className={`px-2.5 min-h-[40px] font-display font-black text-[10px] uppercase border-2 transition-colors ${
                                isCurrent
                                  ? `${STATUS_STYLES[s]} border-brand-charcoal cursor-default`
                                  : 'border-brand-charcoal/20 bg-white text-brand-charcoal/60 hover:border-brand-charcoal hover:text-brand-charcoal'
                              }`}
                            >
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    </form>

                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
