import type { Metadata } from 'next';
import PublicPageShell from '@/components/layout/PublicPageShell';
import PageHeroNavy from '@/components/layout/PageHeroNavy';

export const metadata: Metadata = {
  title: 'Accessibility Statement',
  description: 'How rivervalleyrangers.ie is built to be usable by everyone, and how to tell us when it falls short.',
};

const CONTACT_EMAIL = 'rivervalleyrangers+info@outlook.com';

export default function AccessibilityPage() {
  return (
    <PublicPageShell>
      <PageHeroNavy
        eyebrow="Everyone welcome"
        title="Accessibility Statement"
        description="Football at RVR is for everyone — this website should be too."
      />

      <div className="max-w-3xl mx-auto px-6 py-16 prose prose-zinc prose-headings:font-display prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-a:text-brand-green prose-a:no-underline hover:prose-a:underline">

        <p className="lead">
          Rivervalley Rangers AFC wants every parent, player, and supporter to be able to
          use this website — including people using screen readers, keyboard navigation,
          or assistive technology. We aim to meet the{' '}
          <a href="https://www.w3.org/TR/WCAG22/" target="_blank" rel="noopener noreferrer">
            Web Content Accessibility Guidelines (WCAG) 2.2
          </a>{' '}
          at Level AA.
        </p>

        <h2>What we&rsquo;ve built in</h2>
        <ul>
          <li>Full keyboard navigation with a visible focus indicator on every interactive element.</li>
          <li>A &ldquo;skip to main content&rdquo; link on every page.</li>
          <li>Descriptive alternative text on meaningful images; decorative icons are hidden from screen readers.</li>
          <li>Animations and auto-rotating content are disabled for visitors with the &ldquo;reduce motion&rdquo; system setting, and rotating content can always be controlled manually.</li>
          <li>Touch targets sized for real thumbs (44px minimum).</li>
          <li>Forms with proper labels, error messages, and no time limits.</li>
          <li>Colour is never the only way information is conveyed.</li>
        </ul>

        <h2>Known limitations</h2>
        <p>
          This is a volunteer-run club website and some things will occasionally slip
          through — for example, photos uploaded by volunteers may sometimes have
          imperfect descriptions, and some third-party content (such as payment forms)
          is outside our direct control.
        </p>

        <h2>Tell us when it falls short</h2>
        <p>
          If any part of this site is difficult or impossible for you to use, we
          genuinely want to know. Email{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or use the{' '}
          <a href="/contact">contact form</a>, and we&rsquo;ll do our best to fix the
          problem and to get you the information you needed in another format in the
          meantime.
        </p>

        <hr />
        <p className="text-sm text-zinc-500">
          This statement was last reviewed in July 2026.
        </p>
      </div>
    </PublicPageShell>
  );
}
