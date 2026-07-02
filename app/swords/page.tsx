import type { Metadata } from 'next';
import Link from 'next/link';
import PublicPageShell from '@/components/layout/PublicPageShell';
import PageHeroNavy from '@/components/layout/PageHeroNavy';

export const metadata: Metadata = {
  title: 'About Swords, Co. Dublin',
  description: 'Discover Swords — the historic county town of Fingal, just 10 km north of Dublin. Founded c. 560 AD, home to 40,000+ people, Swords Castle, the Ward River Valley Park, and Rivervalley Rangers AFC.',
  alternates: { canonical: '/swords' },
};

const TIMELINE = [
  { year: 'c. 560 AD', event: 'St. Colmcille founds a monastic settlement, blessing a spring — giving the town its Irish name Sord (clear water).' },
  { year: '9th century', event: 'The Round Tower is erected at the monastery site. It still stands today at 26 metres tall.' },
  { year: '1014', event: "After the Battle of Clontarf, High King Brian Boru's body rests in Swords church on its journey to Armagh." },
  { year: 'c. 1200', event: 'Archbishop John Comyn builds Swords Castle as a fortified manor and administrative centre for the Diocese of Dublin.' },
  { year: '1994', event: 'Swords is designated the county town of the newly created Fingal administrative area. A new County Hall opens on Main Street.' },
  { year: '2001', event: 'The Pavilions Shopping Centre opens — one of the largest retail centres in the Dublin region.' },
  { year: '2006', event: 'RNLI national headquarters opens in Airside Business Park, bringing significant employment to the area.' },
  { year: '2023–27', event: 'A new €40m Culture House (library, gallery, 165-seat theatre) is under construction in the Swords Cultural Quarter.' },
];

const LANDMARKS = [
  {
    icon: '🏰',
    name: 'Swords Castle',
    period: 'c. 1200 AD',
    description: "Built by Archbishop John Comyn, this restored 13th-century fortified manor anchors Swords Town Park on the Ward River. The castle courtyard is free to visit and hosts monthly Food & Crafts Markets (April–September) and a Christmas Fair each November.",
  },
  {
    icon: '🗼',
    name: 'St. Columba\'s Round Tower',
    period: '9th century',
    description: 'Standing 26 metres high, this tower marked the site of St. Colmcille\'s original monastery. Beside it stands a 14th-century belfry — the last visible remnant of the monastic church. Viewable from Church Road.',
  },
  {
    icon: '💧',
    name: 'St. Colmcille\'s Holy Well',
    period: '5th–6th century',
    description: "According to legend, Colmcille blessed a spring here that gave Swords its Irish name Sord — meaning 'clear water'. A protected historic site on Well Road, viewable through the railings.",
  },
  {
    icon: '🌿',
    name: 'Ward River Valley Park',
    period: '220 acres',
    description: 'A sweeping linear park following the Ward River south from the town. Includes forests, meadows, a lake, sports pitches, tennis courts, playgrounds, and extensive walking and cycling trails. Free to enter, served by Dublin Bus 33, 41, 41b, 41c.',
  },
  {
    icon: '🛍️',
    name: 'The Pavilions',
    period: 'Since 2001',
    description: 'One of Dublin\'s largest shopping centres, with 90+ stores (Dunnes, H&M, Next, The Range), an 11-screen Odeon cinema, restaurants and multi-storey parking. The retail heartbeat of modern Swords.',
  },
  {
    icon: '🏛️',
    name: 'Carnegie Library & Museum',
    period: 'Heritage centre',
    description: 'The Carnegie Library on Main Street houses local historical society records, local museum exhibits, and is a hub for community events. Swords Library (Brackenstown Road) also holds cultural programmes.',
  },
];

const EVENTS = [
  { icon: '🎆', name: 'Fingal Festival of Fire', when: 'Late October', description: 'A spectacular Halloween fireworks and light show at Swords Castle, one of the largest Halloween events in Ireland.' },
  { icon: '🎄', name: 'Swords Castle Christmas Fair', when: 'November', description: 'A festive market with crafts, music and family entertainment in the castle courtyard — a Swords tradition.' },
  { icon: '🏃', name: 'Fingal 10k Road Race', when: 'July', description: 'A major charity road race through Swords streets, drawing hundreds of runners from across the county.' },
  { icon: '🎵', name: 'Summer Concerts', when: 'Summer', description: 'Occasional classical and folk concerts held in the grounds of Swords Castle, overlooking the Ward River.' },
  { icon: '🌺', name: 'Heritage Week', when: 'August', description: 'Historical walks, library talks and craft workshops organised by the Swords Historical Society and Fingal Libraries.' },
];

const TRANSPORT = [
  { mode: '🚌', label: 'Dublin Bus', detail: 'Routes 41, 41c, 33, 102 connect Swords to Dublin city, Malahide, and Dublin Airport. Frequent services from early morning to late evening.' },
  { mode: '🚍', label: 'Swords Express', detail: '150+ coach departures daily to Dublin City Centre via the Port Tunnel. 35 minutes to the city. Leap card accepted, tax-saver passes available.' },
  { mode: '✈️', label: 'Dublin Airport', detail: 'Just 3 km from Main Street — a 5–10 minute drive. One of Swords\'s greatest practical assets for residents and businesses alike.' },
  { mode: '🚗', label: 'Road', detail: 'On the R132, 10 km north of Dublin. The M1 motorway (Junction 4) gives fast access to Dublin city and Belfast. M50 interchange nearby.' },
  { mode: '🚲', label: 'Cycling', detail: 'Protected cycle lanes along the R132 and through Ward River Park. The Ward River Valley loop and coastal greenway to Malahide are popular routes.' },
];

const KEY_FACTS = [
  { value: '40,776', label: 'Residents (2022)' },
  { value: 'c. 560 AD', label: 'Founded' },
  { value: '10 km', label: 'From Dublin city' },
  { value: '3 km', label: 'From Dublin Airport' },
  { value: '8th', label: 'Largest Irish urban area' },
  { value: '220 acres', label: 'Ward River Valley Park' },
];

export default function SwordsPage() {
  return (
    <PublicPageShell>
      <PageHeroNavy
        eyebrow="Fingal, County Dublin · Est. c. 560 AD"
        title="Swords"
        description="Swords is where Rivervalley Rangers call home — and we're proud of it. Historic, growing, and full of community spirit. From a 9th-century round tower to a new €40m culture house, Swords is a town with deep roots and serious ambition."
        links={
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-2">
            {KEY_FACTS.map((f) => (
              <div key={f.label} className="border border-brand-sky/30 bg-white/10 p-3 text-center">
                <p className="font-display font-black text-lg md:text-xl italic text-brand-neon leading-none">{f.value}</p>
                <p className="text-brand-sky/70 text-[10px] font-bold uppercase tracking-widest mt-1 leading-tight">{f.label}</p>
              </div>
            ))}
          </div>
        }
      />

      <div className="mx-auto max-w-4xl px-4 py-10 space-y-12">

        {/* ── About Swords ───────────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border-2 border-brand-navy p-6 sm:p-8">
          <h2 className="font-display font-black italic text-2xl uppercase text-brand-navy mb-4">
            About Swords
          </h2>
          <div className="space-y-3 text-sm font-semibold text-zinc-700 leading-relaxed">
            <p>
              Swords — Irish <em>Sord</em>, meaning "clear" — is the county town of Fingal and one of Ireland&apos;s fastest-growing urban centres. Situated 10 km north of Dublin city centre and just 3 km from Dublin Airport, it blends over 1,400 years of recorded history with a modern, cosmopolitan energy.
            </p>
            <p>
              According to tradition, <strong>St. Colmcille</strong> founded a monastic settlement here around 560 AD, blessing a spring that gave the town its name. The <strong>Round Tower</strong> built at his monastery still stands today. In 1014, after the Battle of Clontarf, High King <strong>Brian Boru&apos;s</strong> body rested in Swords before the journey to Armagh. In the early 13th century, Archbishop John Comyn built <strong>Swords Castle</strong> — a landmark that still anchors the town centre.
            </p>
            <p>
              Today, Swords is home to over 40,000 residents and hosts major employers including Ryanair&apos;s headquarters, AIB, Kellogg&apos;s European HQ, and the RNLI national headquarters. Fingal County Council — based here — has described Swords as an &quot;emerging city&quot;, with plans to accommodate up to 100,000 residents by 2035.
            </p>
          </div>
        </section>

        {/* ── Timeline ───────────────────────────────────────────────────── */}
        <section>
          <h2 className="font-display font-black italic text-2xl uppercase text-brand-navy border-l-4 border-brand-neon pl-3 mb-6">
            A Town With Deep Roots
          </h2>
          <div className="relative">
            <div className="absolute left-[22px] top-2 bottom-2 w-0.5 bg-brand-navy/15" aria-hidden="true" />
            <ol className="space-y-5">
              {TIMELINE.map((entry) => (
                <li key={entry.year} className="flex gap-5 items-start">
                  <div className="shrink-0 w-11 h-11 rounded-full bg-brand-navy border-3 border-brand-charcoal flex items-center justify-center z-10" aria-hidden="true">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-neon block" />
                  </div>
                  <div className="flex-1 pb-1">
                    <p className="font-display font-black text-xs uppercase tracking-widest text-brand-neon mb-0.5">{entry.year}</p>
                    <p className="text-sm font-semibold text-zinc-700 leading-relaxed">{entry.event}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Landmarks ──────────────────────────────────────────────────── */}
        <section>
          <h2 className="font-display font-black italic text-2xl uppercase text-brand-navy border-l-4 border-brand-green pl-3 mb-6">
            Places to Explore
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {LANDMARKS.map((l) => (
              <div key={l.name} className="bg-white rounded-2xl border-2 border-brand-navy p-5 flex gap-4">
                <span className="text-3xl shrink-0 select-none mt-0.5" aria-hidden="true">{l.icon}</span>
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <h3 className="font-display font-black uppercase text-brand-navy text-sm leading-tight">{l.name}</h3>
                    <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wide shrink-0">{l.period}</span>
                  </div>
                  <p className="text-xs font-semibold text-zinc-600 leading-relaxed">{l.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Getting Around ─────────────────────────────────────────────── */}
        <section className="bg-brand-navy rounded-2xl p-6 sm:p-8">
          <h2 className="font-display font-black italic text-2xl uppercase text-brand-neon mb-6">
            Getting Around
          </h2>
          <div className="space-y-4">
            {TRANSPORT.map((t) => (
              <div key={t.label} className="flex gap-4 items-start">
                <span className="text-2xl shrink-0 select-none mt-0.5" aria-hidden="true">{t.mode}</span>
                <div>
                  <p className="font-display font-black uppercase text-white text-xs tracking-wide mb-0.5">{t.label}</p>
                  <p className="text-xs font-semibold text-brand-sky/80 leading-relaxed">{t.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-brand-sky/50 text-xs font-semibold border-t border-brand-sky/15 pt-4">
            No rail station in Swords yet — nearest DART/Commuter stations are Malahide (7 km) and Howth Junction (9 km). A MetroLink extension to Swords is a long-term infrastructure project.
          </p>
        </section>

        {/* ── Events & Culture ───────────────────────────────────────────── */}
        <section>
          <h2 className="font-display font-black italic text-2xl uppercase text-brand-navy border-l-4 border-brand-maroon pl-3 mb-6">
            Events &amp; Culture
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {EVENTS.map((e) => (
              <div key={e.name} className="bg-white rounded-2xl border-2 border-brand-navy p-5 flex gap-4">
                <span className="text-3xl shrink-0 select-none mt-0.5" aria-hidden="true">{e.icon}</span>
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <h3 className="font-display font-black uppercase text-brand-navy text-sm leading-tight">{e.name}</h3>
                    <span className="text-[10px] font-bold text-brand-green uppercase tracking-wide shrink-0">{e.when}</span>
                  </div>
                  <p className="text-xs font-semibold text-zinc-600 leading-relaxed">{e.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Swords Today ───────────────────────────────────────────────── */}
        <section className="bg-brand-neon rounded-2xl border-3 border-brand-charcoal shadow-brutalist p-6 sm:p-8">
          <h2 className="font-display font-black italic text-2xl uppercase text-brand-charcoal mb-4">
            Swords Today
          </h2>
          <div className="space-y-3 text-sm font-semibold text-brand-charcoal/80 leading-relaxed">
            <p>
              With 40,776 residents at the 2022 census — Ireland&apos;s 8th largest urban area — Swords is one of the country&apos;s most significant towns. The population has grown steadily since the 1990s and Fingal County Council projects growth towards <strong>100,000 by 2035</strong>, driven by new housing, infrastructure investment, and the town&apos;s unmatched proximity to Dublin Airport.
            </p>
            <p>
              The town is diverse and young, with over 7,000 non-Irish nationals among its residents. Median incomes rank among the highest for Irish towns, reflecting a professional, family-oriented community spread across neighbourhoods including Rivervalley, Brackenstown, Applewood, Boroimhe, and Kinsealy-Drinan.
            </p>
            <p>
              The <strong>Swords Cultural Quarter</strong> — a €40m development including a new Culture House with library, art gallery, and 165-seat theatre — is currently under construction, signalling serious civic ambition for the decades ahead.
            </p>
          </div>
        </section>

        {/* ── Sponsor placeholder ────────────────────────────────────────── */}
        <section>
          <h2 className="font-display font-black italic text-2xl uppercase text-brand-navy border-l-4 border-brand-sky pl-3 mb-2">
            Supporting Our Community
          </h2>
          <p className="text-sm font-semibold text-brand-muted mb-6">
            Local businesses that invest in Swords — sponsoring clubs, events, and people.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="border-2 border-dashed border-brand-navy/20 rounded-2xl p-6 flex items-center justify-center aspect-[3/2] bg-white/50"
                aria-hidden="true"
              >
                <span className="text-brand-navy/20 font-display font-black text-xs uppercase tracking-widest text-center">Sponsor</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs font-semibold text-brand-muted">
            Interested in sponsoring Rivervalley Rangers or advertising here?{' '}
            <Link href="/sponsorship" className="text-brand-navy underline underline-offset-4 hover:text-brand-neon transition-colors">
              Get in touch →
            </Link>
          </p>
        </section>

        {/* ── RVR connection ─────────────────────────────────────────────── */}
        <section className="bg-brand-navy rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex-1">
            <p className="font-display font-black text-[10px] uppercase tracking-widest text-brand-neon mb-1">Football in the heart of Swords</p>
            <h2 className="font-display font-black italic text-xl uppercase text-white mb-2 leading-tight">
              Rivervalley Rangers AFC
            </h2>
            <p className="text-brand-sky/80 text-sm font-semibold leading-relaxed">
              Founded in 1981, RVR has been part of Swords&apos;s community for over 45 years — playing in Ward River Valley and Rivervalley Park, the same green spaces that make this town special.
            </p>
          </div>
          <Link
            href="/register"
            className="shrink-0 inline-flex items-center gap-2 min-h-[48px] px-6 bg-brand-neon text-brand-charcoal font-display font-black italic uppercase text-sm border-3 border-brand-charcoal shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all whitespace-nowrap"
          >
            Join the Club →
          </Link>
        </section>

      </div>
    </PublicPageShell>
  );
}
