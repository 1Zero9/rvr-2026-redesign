export default function CompetitionLoading() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="h-32 bg-brand-navy animate-pulse" />
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-brand-navy/10 animate-pulse rounded" />
        ))}
      </div>
    </div>
  );
}
