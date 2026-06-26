"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const TABS = [
  { key: "now", label: "Now" },
  { key: "fixtures", label: "Fixtures" },
  { key: "standings", label: "Standings" },
  { key: "teams", label: "Teams" },
] as const;

export function CompetitionTabs({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? "now";

  return (
    <nav className="flex md:gap-1 bg-brand-navy border-b-3 border-brand-charcoal">
      {TABS.map((t) => (
        <Link
          key={t.key}
          href={`/competitions/${slug}?tab=${t.key}`}
          className={`flex-1 md:flex-none min-h-[48px] px-4 flex items-center justify-center font-display font-black italic text-sm uppercase transition-colors ${
            tab === t.key
              ? "bg-brand-neon text-brand-charcoal"
              : "text-brand-sky hover:text-brand-neon"
          }`}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
