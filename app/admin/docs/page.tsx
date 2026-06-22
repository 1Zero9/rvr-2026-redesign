import fs from 'fs/promises';
import path from 'path';
import Image from 'next/image';
import { APP_VERSION } from '@/config/version';
import AdminNav from '@/components/admin/AdminNav';

export default async function AdminDocsPage() {
  const [changelog, setup] = await Promise.all([
    fs.readFile(path.join(/* turbopackIgnore: true */ process.cwd(), 'CHANGELOG.md'), 'utf-8'),
    fs.readFile(path.join(/* turbopackIgnore: true */ process.cwd(), 'SETUP.md'), 'utf-8'),
  ]);

  return (
    <main className="min-h-screen bg-brand-navy text-brand-cream font-sans p-8">
      <div className="max-w-5xl mx-auto">
        <AdminNav />

        <div className="mb-10">
          <h1 className="font-display font-black text-4xl uppercase tracking-tight text-brand-cream italic">
            Admin Docs
            <span className="text-brand-neon ml-3">— RVR2026</span>
          </h1>
          <p className="text-xs text-brand-sky/50 mt-2">
            RVR2026 Admin · v{APP_VERSION}
          </p>
        </div>

        {/* Changelog */}
        <section id="changelog" className="mb-12">
          <h2 className="font-display font-black text-2xl uppercase tracking-tight text-brand-neon mb-4 border-b border-brand-sky/20 pb-2">
            Changelog
          </h2>
          <pre className="text-xs text-brand-cream/80 font-mono leading-relaxed whitespace-pre-wrap bg-brand-charcoal/40 border border-brand-sky/20 rounded-xl p-6 overflow-x-auto">
            {changelog}
          </pre>
        </section>

        {/* Setup Guide */}
        <section id="setup" className="mb-12">
          <h2 className="font-display font-black text-2xl uppercase tracking-tight text-brand-neon mb-4 border-b border-brand-sky/20 pb-2">
            Setup Guide
          </h2>
          <pre className="text-xs text-brand-cream/80 font-mono leading-relaxed whitespace-pre-wrap bg-brand-charcoal/40 border border-brand-sky/20 rounded-xl p-6 overflow-x-auto">
            {setup}
          </pre>
        </section>

        {/* Site Data Flow */}
        <section id="flow">
          <h2 className="font-display font-black text-2xl uppercase tracking-tight text-brand-neon mb-4 border-b border-brand-sky/20 pb-2">
            Site Data Flow
          </h2>
          <Image
            src="/admin/site-flow.svg"
            alt="RVR2026 site data flow diagram"
            width={1600}
            height={900}
            className="w-full border border-brand-neon mt-4"
          />
        </section>

      </div>
    </main>
  );
}
