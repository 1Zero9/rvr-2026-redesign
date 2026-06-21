import Header from "@/components/Header";
import KitDesignCompetition from "@/components/campaigns/KitDesignCompetition";
import type { KitSubmission } from "@/types/campaigns";

const sampleSubmissions: KitSubmission[] = [
  {
    id: "rvr-green-river",
    designerName: "Ava",
    teamName: "Green River",
    imageUrl:
      "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=900&q=80",
    votesCount: 48,
    isApproved: true,
    createdAt: "2026-05-20T10:00:00.000Z",
  },
  {
    id: "rvr-1981-hoops",
    designerName: "Noah",
    teamName: "1981 Hoops",
    imageUrl:
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=900&q=80",
    votesCount: 36,
    isApproved: true,
    createdAt: "2026-05-21T10:00:00.000Z",
  },
  {
    id: "rvr-astro-nights",
    designerName: "Sophie",
    teamName: "Astro Nights",
    imageUrl:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=900&q=80",
    votesCount: 42,
    isApproved: true,
    createdAt: "2026-05-22T10:00:00.000Z",
  },
];

export default function AnniversaryKitPage() {
  return (
    <div
      className="min-h-screen bg-brand-cream"
      style={{
        backgroundImage: `linear-gradient(rgba(11,31,59,0.04) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(11,31,59,0.04) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }}
    >
      <Header />
      <main>
        <KitDesignCompetition initialSubmissions={sampleSubmissions} />
      </main>
    </div>
  );
}
