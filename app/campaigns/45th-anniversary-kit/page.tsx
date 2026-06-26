import PublicPageShell from "@/components/layout/PublicPageShell";
import KitDesignCompetition from "@/components/campaigns/KitDesignCompetition";
import type { KitSubmission } from "@/types/campaigns";
import { notFound } from "next/navigation";
import { isFeatureEnabled } from "@/lib/features";
import { prisma } from "@/lib/prisma";

export default async function AnniversaryKitPage() {
  if (!(await isFeatureEnabled("anniversaryKit"))) notFound();

  const approved = await prisma.kitDesignSubmission.findMany({
    where: { moderationStatus: "APPROVED" },
    orderBy: [{ voteCount: "desc" }, { createdAt: "desc" }],
    take: 50,
  });

  const submissions: KitSubmission[] = approved.map((submission) => ({
    id: submission.id,
    designerName: submission.submitterName,
    teamName: submission.teamName ?? "RVR Community",
    imageUrl: submission.thumbnailUrl ?? submission.designFileUrl,
    votesCount: submission.voteCount,
    isApproved: true,
    createdAt: submission.createdAt.toISOString(),
  }));

  return (
    <PublicPageShell>
      <KitDesignCompetition initialSubmissions={submissions} />
    </PublicPageShell>
  );
}
