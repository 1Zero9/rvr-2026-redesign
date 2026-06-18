import { getPendingShirts } from '@/lib/moderation/get-pending-shirts';
import { APP_VERSION } from '@/config/version';
import ModerationActions from './ModerationActions';

export default async function ModerationPage() {
  const submissions = await getPendingShirts();
  const adminSecret = process.env.ADMIN_SECRET ?? '';

  return (
    <main className="min-h-screen bg-brand-navy text-brand-cream p-8 font-sans">
      <div className="max-w-7xl mx-auto">

        <div className="mb-10">
          <h1 className="font-display font-black text-4xl uppercase tracking-tight text-brand-cream italic">
            Shirt Submissions
            <span className="text-brand-neon ml-3">— Pending Review</span>
          </h1>
          <p className="text-brand-sky text-sm mt-2">
            {submissions.length} submission{submissions.length !== 1 ? 's' : ''} awaiting moderation
          </p>
          <p className="text-xs text-brand-sky/50 mb-4">
            RVR2026 Admin · v{APP_VERSION}
          </p>
        </div>

        {submissions.length === 0 ? (
          <div className="border-3 border-brand-sky/30 rounded-2xl p-12 text-center">
            <p className="text-brand-sky font-display font-bold text-xl uppercase">All clear — no pending submissions</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border-3 border-brand-sky/30">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-brand-navy border-b-3 border-brand-sky/30">
                  {['Submitted', 'Name', 'Email', 'Team', 'Size', 'Qty', 'Design', 'Actions'].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left font-display font-black text-xs uppercase tracking-wider text-brand-neon"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {submissions.map((s, i) => (
                  <tr
                    key={s.id}
                    className={`border-b border-brand-sky/10 ${i % 2 === 0 ? 'bg-brand-navy' : 'bg-brand-navy/60'} hover:bg-brand-sky/5 transition-colors`}
                  >
                    <td className="px-4 py-3 text-brand-sky whitespace-nowrap">
                      {s.createdAt.toLocaleDateString('en-IE', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 font-semibold text-brand-cream">
                      {s.submitterName}
                      {s.playerName && (
                        <span className="block text-xs text-brand-sky font-normal">Print: {s.playerName}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-brand-sky">{s.submitterEmail}</td>
                    <td className="px-4 py-3 text-brand-cream">{s.teamName ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block bg-brand-sky/20 text-brand-sky px-2 py-0.5 rounded-lg font-mono text-xs uppercase">
                        {s.size.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-brand-cream">{s.quantity}</td>
                    <td className="px-4 py-3">
                      {s.thumbnailUrl ? (
                        <a href={s.designFileUrl} target="_blank" rel="noopener noreferrer">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={s.thumbnailUrl}
                            alt="Design preview"
                            className="w-16 h-16 object-cover rounded-lg border-2 border-brand-sky/30 hover:border-brand-neon transition-colors"
                          />
                        </a>
                      ) : (
                        <a
                          href={s.designFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-sky underline text-xs hover:text-brand-neon transition-colors"
                        >
                          No preview
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <ModerationActions id={s.id} adminSecret={adminSecret} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
