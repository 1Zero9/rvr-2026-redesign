import Header from "@/components/Header";
import KitDesignCompetition from "@/components/campaigns/KitDesignCompetition";
import type { KitDesignSubmission } from "@/types/campaigns";

const sampleSubmissions: KitDesignSubmission[] = [
  {
    id: "rvr-green-river",
    competitionId: "rvr-40-kit",
    designerName: "Ava",
    designerAge: 11,
    title: "Green River",
    story:
      "A flowing sash for the valley, with neon trim for the players who light up the pitch.",
    fileUrl: "/kit-designs/green-river.pdf",
    fileMimeType: "application/pdf",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=900&q=80",
    status: "APPROVED",
    voteCount: 48,
    createdAt: "2026-05-20T10:00:00.000Z",
  },
  {
    id: "rvr-1981-hoops",
    competitionId: "rvr-40-kit",
    designerName: "Noah",
    designerAge: 13,
    title: "1981 Hoops",
    story:
      "Classic hoops with a small 1981 mark on the back neck for everyone who built the club.",
    fileUrl: "/kit-designs/1981-hoops.pdf",
    fileMimeType: "application/pdf",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=900&q=80",
    status: "APPROVED",
    voteCount: 36,
    createdAt: "2026-05-21T10:00:00.000Z",
  },
  {
    id: "rvr-astro-nights",
    competitionId: "rvr-40-kit",
    designerName: "Sophie",
    designerAge: 10,
    title: "Astro Nights",
    story:
      "Dark sleeves, bright green flashes and a pattern inspired by floodlights on training nights.",
    fileUrl: "/kit-designs/astro-nights.pdf",
    fileMimeType: "application/pdf",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=900&q=80",
    status: "APPROVED",
    voteCount: 42,
    createdAt: "2026-05-22T10:00:00.000Z",
  },
];

export default function AnniversaryKitPage() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <Header />
      <main>
        <KitDesignCompetition
          competitionId="rvr-40-kit"
          templatePdfUrl="/downloads/rvr-40th-kit-template.pdf"
          initialSubmissions={sampleSubmissions}
        />
      </main>
    </div>
  );
}
