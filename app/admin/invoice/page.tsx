import type { Metadata } from 'next';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireSuperAdmin } from '@/lib/admin/require-admin';
import DeleteLineItemButton from '@/components/admin/DeleteLineItemButton';

export const metadata: Metadata = {
  title: 'Dev Invoice | RVR Admin',
  robots: { index: false, follow: false, noarchive: true },
};

const euro = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' });

const CATEGORY_SUGGESTIONS = [
  'New Page',
  'Admin Portal',
  'New Feature',
  'Design',
  'Fix',
  'Security',
  'Maintenance',
  'Docs',
];

function parseEuros(raw: FormDataEntryValue | null): number | null {
  const trimmed = (raw as string | null)?.trim();
  if (!trimmed) return null;
  const value = Math.round(Number(trimmed) * 100);
  return Number.isFinite(value) ? value : null;
}

export default async function InvoiceAdminPage() {
  await requireSuperAdmin();

  const items = await prisma.invoiceLineItem.findMany({
    orderBy: [{ workDate: 'desc' }, { createdAt: 'desc' }],
  });
  const pricedTotal = items.reduce((sum, i) => sum + (i.priceCents ?? 0), 0);
  const pricedCount = items.filter((i) => i.priceCents !== null).length;

  const categories = new Map<string, typeof items>();
  for (const item of items) {
    const bucket = categories.get(item.category);
    if (bucket) bucket.push(item);
    else categories.set(item.category, [item]);
  }
  const sortedCategories = [...categories.entries()].sort((a, b) => b[1].length - a[1].length);

  async function updatePrice(formData: FormData) {
    'use server';
    await requireSuperAdmin();
    const { prisma: db } = await import('@/lib/prisma');
    const id = formData.get('id') as string;
    await db.invoiceLineItem.update({
      where: { id },
      data: { priceCents: parseEuros(formData.get('priceEuros')) },
    });
    revalidatePath('/admin/invoice');
  }

  async function deleteLineItem(formData: FormData) {
    'use server';
    await requireSuperAdmin();
    const { prisma: db } = await import('@/lib/prisma');
    const id = formData.get('id') as string;
    await db.invoiceLineItem.delete({ where: { id } });
    revalidatePath('/admin/invoice');
  }

  async function addLineItem(formData: FormData) {
    'use server';
    await requireSuperAdmin();
    const { prisma: db } = await import('@/lib/prisma');
    const title = (formData.get('title') as string)?.trim();
    if (!title) redirect('/admin/invoice');
    const category = (formData.get('category') as string)?.trim() || 'New Feature';
    const workDateRaw = formData.get('workDate') as string;
    await db.invoiceLineItem.create({
      data: {
        title,
        category,
        notes: (formData.get('notes') as string)?.trim() || null,
        workDate: workDateRaw ? new Date(workDateRaw) : null,
        priceCents: parseEuros(formData.get('priceEuros')),
      },
    });
    revalidatePath('/admin/invoice');
    redirect('/admin/invoice');
  }

  return (
    <main className="min-h-screen bg-brand-cream px-4 py-8 text-brand-charcoal">
      <div className="mx-auto max-w-4xl">

        <div className="mb-6">
          <h1 className="font-display font-black italic text-4xl uppercase text-brand-navy">
            Dev Invoice
          </h1>
          <p className="text-brand-charcoal/60 text-sm mt-1">
            Private pricing log for site development work — never shown on the public site.
            Seeded from the git history and grouped by category; add a rate to whichever lines you want to bill.
          </p>
        </div>

        <div className="bg-brand-navy border-2 border-brand-charcoal p-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <p className="text-brand-sky text-xs font-bold uppercase tracking-wider">Priced total</p>
            <p className="text-brand-cream font-display font-black text-3xl italic">{euro.format(pricedTotal / 100)}</p>
          </div>
          <p className="text-brand-sky/70 text-sm">
            {pricedCount} of {items.length} line{items.length === 1 ? '' : 's'} priced
          </p>
        </div>

        <details className="mb-6 border-2 border-brand-navy/15 bg-white">
          <summary className="cursor-pointer px-4 py-3 text-sm font-bold text-brand-navy hover:bg-brand-navy/5 transition-colors">
            + Add a line item
          </summary>
          <form action={addLineItem} className="space-y-3 border-t border-brand-navy/10 p-4">
            <div>
              <label htmlFor="title" className="block text-sm font-bold text-brand-charcoal mb-1">Title *</label>
              <input id="title" name="title" type="text" required className="w-full border-2 border-brand-charcoal px-3 py-2 min-h-[44px] bg-white focus:outline-none focus:border-brand-neon text-brand-charcoal" />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-bold text-brand-charcoal mb-1">Category</label>
              <input
                id="category"
                name="category"
                type="text"
                list="category-suggestions"
                defaultValue="New Feature"
                className="w-full border-2 border-brand-charcoal px-3 py-2 min-h-[44px] bg-white focus:outline-none focus:border-brand-neon text-brand-charcoal"
              />
              <datalist id="category-suggestions">
                {CATEGORY_SUGGESTIONS.map((c) => <option key={c} value={c} />)}
              </datalist>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="workDate" className="block text-sm font-bold text-brand-charcoal mb-1">Date</label>
                <input id="workDate" name="workDate" type="date" defaultValue={new Date().toISOString().slice(0, 10)} className="w-full border-2 border-brand-charcoal px-3 py-2 min-h-[44px] bg-white focus:outline-none focus:border-brand-neon text-brand-charcoal" />
              </div>
              <div>
                <label htmlFor="priceEuros" className="block text-sm font-bold text-brand-charcoal mb-1">Price (€)</label>
                <input id="priceEuros" name="priceEuros" type="number" step="0.01" min="0" inputMode="decimal" placeholder="0.00" className="w-full border-2 border-brand-charcoal px-3 py-2 min-h-[44px] bg-white focus:outline-none focus:border-brand-neon text-brand-charcoal" />
              </div>
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-bold text-brand-charcoal mb-1">Notes</label>
              <input id="notes" name="notes" type="text" className="w-full border-2 border-brand-charcoal px-3 py-2 min-h-[44px] bg-white focus:outline-none focus:border-brand-neon text-brand-charcoal" />
            </div>
            <button type="submit" className="bg-brand-navy text-brand-cream font-bold px-4 py-2 min-h-[44px] border-2 border-brand-navy hover:bg-brand-navy/85 transition-colors">
              Add
            </button>
          </form>
        </details>

        {items.length === 0 ? (
          <div className="bg-brand-navy border border-brand-sky/20 p-8 text-center">
            <p className="text-brand-sky">No line items yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedCategories.map(([category, categoryItems]) => {
              const categoryTotal = categoryItems.reduce((sum, i) => sum + (i.priceCents ?? 0), 0);
              const categoryPricedCount = categoryItems.filter((i) => i.priceCents !== null).length;
              return (
                <details key={category} className="border-2 border-brand-navy/15 bg-white">
                  <summary className="cursor-pointer px-4 py-3 flex flex-wrap items-center justify-between gap-2 hover:bg-brand-navy/5 transition-colors">
                    <span className="font-bold text-brand-navy">
                      {category} <span className="font-normal text-brand-charcoal/50">({categoryItems.length})</span>
                    </span>
                    <span className="text-sm text-brand-charcoal/60">
                      {euro.format(categoryTotal / 100)}
                      <span className="text-brand-charcoal/40"> · {categoryPricedCount} priced</span>
                    </span>
                  </summary>
                  <div className="space-y-2 border-t border-brand-navy/10 p-3">
                    {categoryItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-brand-cream border-2 border-brand-charcoal/10 p-3 flex flex-col sm:flex-row sm:items-center gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-brand-charcoal truncate">{item.title}</p>
                          <p className="text-xs text-brand-charcoal/50">
                            {item.workDate?.toLocaleDateString('en-IE', { day: '2-digit', month: 'short', year: 'numeric' }) ?? '—'}
                            {item.notes && <> · {item.notes}</>}
                            {item.commitSha && <> · <span className="font-mono">{item.commitSha.slice(0, 7)}</span></>}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <form action={updatePrice} className="flex items-center gap-1">
                            <input type="hidden" name="id" value={item.id} />
                            <span className="text-brand-charcoal/50 text-sm font-bold">€</span>
                            <input
                              name="priceEuros"
                              type="number"
                              step="0.01"
                              min="0"
                              inputMode="decimal"
                              defaultValue={item.priceCents !== null ? (item.priceCents / 100).toFixed(2) : ''}
                              aria-label={`Price for ${item.title}`}
                              className="w-24 border-2 border-brand-charcoal px-2 py-2 min-h-[44px] bg-white text-brand-charcoal focus:outline-none focus:border-brand-neon"
                            />
                            <button
                              type="submit"
                              className="min-h-[44px] px-3 flex items-center text-xs font-bold border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-brand-cream transition-all"
                            >
                              Save
                            </button>
                          </form>
                          <DeleteLineItemButton id={item.id} action={deleteLineItem} />
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}
