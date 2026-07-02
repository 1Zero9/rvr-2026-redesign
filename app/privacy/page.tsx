import type { Metadata } from 'next';
import PublicPageShell from '@/components/layout/PublicPageShell';
import PageHeroNavy from '@/components/layout/PageHeroNavy';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Rivervalley Rangers AFC collects, uses, and protects your personal data.',
};

const EFFECTIVE_DATE = '1 July 2025';
const CONTACT_EMAIL = 'rivervalleyrangers+privacy@outlook.com';

export default function PrivacyPolicyPage() {
  return (
    <PublicPageShell>
      <PageHeroNavy
        eyebrow="Legal"
        title="Privacy Policy"
        description={`Effective ${EFFECTIVE_DATE}`}
      />

      <div className="max-w-3xl mx-auto px-6 py-16 prose prose-zinc prose-headings:font-display prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-a:text-brand-green prose-a:no-underline hover:prose-a:underline">

        <p className="lead">
          Rivervalley Rangers AFC (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is a voluntary community
          football club based in Swords, Co. Dublin, Ireland. This policy explains what personal
          data we collect through <strong>rivervalleyrangers.ie</strong>, why we collect it, and
          your rights under the General Data Protection Regulation (GDPR).
        </p>

        <hr />

        <h2>1. Who is the Data Controller?</h2>
        <p>
          Rivervalley Rangers AFC is the data controller for information collected through this
          website. For data-related queries, contact us at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>

        <h2>2. What Data We Collect and Why</h2>

        <h3>Player Registration</h3>
        <p>
          When a player or guardian submits a registration enquiry we collect: first name, last
          name, year of birth, preferred position, guardian name (where required), email address,
          and phone number. This is used solely to process the registration and contact the
          relevant age-group coordinator.
        </p>
        <p><strong>Lawful basis:</strong> Legitimate interests (responding to a membership enquiry).</p>

        <h3>General Enquiries</h3>
        <p>
          Enquiry forms on the volunteering, coaching, sponsorship, Football for All, and Walking
          Football pages collect your name, email or phone number, and any message you provide.
          This information is used to respond to your enquiry and is not used for marketing.
        </p>
        <p><strong>Lawful basis:</strong> Legitimate interests (responding to an inbound enquiry).</p>

        <h3>Boot Room Exchange</h3>
        <p>
          Listings submitted to the Boot Room exchange include a title, item description, and
          donor contact details (name, email or phone). Approved listings are displayed publicly
          on the site; your contact details are visible only to club administrators.
        </p>
        <p><strong>Lawful basis:</strong> Legitimate interests (facilitating the community exchange).</p>

        <h3>Website Usage</h3>
        <p>
          We do not use Google Analytics or similar tracking cookies. Basic server logs (IP
          address, pages visited, timestamps) may be retained by our hosting provider, Vercel,
          for security and operational purposes in accordance with their{' '}
          <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>.
        </p>

        <h2>3. Bot Protection — Cloudflare Turnstile</h2>
        <p>
          To protect our public forms from automated spam submissions, we use{' '}
          <strong>Cloudflare Turnstile</strong>. Turnstile analyses signals from your browser to
          determine whether a submission is likely automated, without showing you a traditional
          CAPTCHA puzzle.
        </p>
        <p>
          When you submit a form on this site, data including your IP address and browser
          characteristics may be processed by Cloudflare, Inc. (101 Townsend St, San Francisco,
          CA 94107, USA) acting as a data processor on our behalf. Cloudflare processes this data
          in accordance with the{' '}
          <a
            href="https://www.cloudflare.com/cloudflare-customer-privacy-addendum/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Cloudflare Customer Privacy Addendum
          </a>{' '}
          and their{' '}
          <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>.
        </p>

        <h2>4. How Long We Keep Your Data</h2>
        <ul>
          <li><strong>Player registrations</strong> — retained for the duration of a player&rsquo;s membership and up to 2 years after the last contact, then deleted.</li>
          <li><strong>General enquiries</strong> — retained for 12 months, then deleted unless a relationship develops.</li>
          <li><strong>Boot Room listings</strong> — retained until the listing is removed or the item is taken, then deleted.</li>
        </ul>

        <h2>5. Who We Share Data With</h2>
        <p>
          We do not sell your data. We may share data with:
        </p>
        <ul>
          <li><strong>Vercel</strong> — our hosting provider, who processes data on our behalf.</li>
          <li><strong>Cloudflare</strong> — for bot protection via Turnstile (see Section 3).</li>
          <li><strong>Football Association of Ireland (FAI) / DDSL</strong> — where required for player registration and league administration.</li>
        </ul>
        <p>
          All third-party processors are bound by data processing agreements and may only process
          your data as instructed.
        </p>

        <h2>6. Your Rights</h2>
        <p>Under GDPR, you have the right to:</p>
        <ul>
          <li><strong>Access</strong> the personal data we hold about you.</li>
          <li><strong>Correct</strong> inaccurate data.</li>
          <li><strong>Erase</strong> your data (&ldquo;right to be forgotten&rdquo;).</li>
          <li><strong>Restrict</strong> or <strong>object</strong> to processing.</li>
          <li><strong>Data portability</strong> — receive your data in a structured format.</li>
        </ul>
        <p>
          To exercise any of these rights, email{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We will respond within 30 days.
          You also have the right to lodge a complaint with the{' '}
          <a href="https://www.dataprotection.ie" target="_blank" rel="noopener noreferrer">
            Data Protection Commission of Ireland
          </a>.
        </p>

        <h2>7. Cookies</h2>
        <p>
          This site uses a single session cookie for authenticated admin users. No tracking or
          advertising cookies are set for public visitors.
        </p>

        <h2>8. Changes to This Policy</h2>
        <p>
          We may update this policy from time to time. The effective date at the top of this page
          will reflect the most recent revision. Continued use of the site constitutes acceptance
          of the updated policy.
        </p>

        <h2>9. Contact</h2>
        <p>
          For any privacy-related questions, contact us at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>

        <hr />
        <p className="text-sm text-zinc-500">
          Rivervalley Rangers AFC · Swords, Co. Dublin, Ireland ·{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </div>
    </PublicPageShell>
  );
}
