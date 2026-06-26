import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export const metadata = {
  title: "Admin Login | RVR Competitions",
};

export default async function CompetitionsLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ verify?: string; error?: string }>;
}) {
  const [session, params] = await Promise.all([auth(), searchParams]);
  if (session) redirect("/competitions/admin");

  if (params.verify) {
    return (
      <div className="min-h-screen bg-brand-navy flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="text-5xl mb-4">📬</div>
          <h1 className="font-display font-black italic text-3xl text-brand-neon uppercase mb-2">
            Check Your Email
          </h1>
          <p className="text-brand-sky text-sm leading-relaxed">
            A magic link has been sent. Click it to sign in — the link expires in 24 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-brand-sky/60 mb-1">
            Rivervalley Rangers AFC
          </p>
          <h1 className="font-display font-black italic text-3xl text-brand-neon uppercase">
            Competitions Admin
          </h1>
          <p className="text-brand-sky text-sm mt-2">
            Enter your email to receive a sign-in link.
          </p>
        </div>

        {params.error && (
          <div className="mb-4 bg-brand-maroon/20 border border-brand-maroon text-brand-cream text-sm px-4 py-3">
            Something went wrong. Please try again.
          </div>
        )}

        <form
          action={async (formData: FormData) => {
            "use server";
            const email = formData.get("email") as string;
            await signIn("nodemailer", {
              email,
              redirectTo: "/competitions/admin",
            });
          }}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-bold text-brand-sky mb-1"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoFocus
              placeholder="you@example.com"
              className="w-full border-2 border-brand-sky/40 bg-white/5 text-brand-cream placeholder:text-brand-sky/30 px-3 py-2 min-h-[44px] focus:outline-none focus:border-brand-neon"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-brand-neon text-brand-charcoal font-display font-black italic uppercase min-h-[44px] border-3 border-brand-charcoal shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            Send Magic Link →
          </button>
        </form>

        <p className="mt-6 text-xs text-brand-sky/40 text-center">
          Access is restricted to authorised Rivervalley Rangers administrators.
        </p>
      </div>
    </div>
  );
}
