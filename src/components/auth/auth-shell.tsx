import Link from "next/link";
import type { ReactNode } from "react";
import { BrandLockup } from "@/components/logo";

export function AuthShell({
  children,
  mode,
  nextPath = "",
}: {
  children: ReactNode;
  mode: "login" | "signup";
  nextPath?: string;
}) {
  const isSignup = mode === "signup";

  return (
    <main className="min-h-screen bg-background text-ink lg:grid lg:grid-cols-[minmax(420px,0.92fr)_minmax(560px,1.08fr)]">
      <section className="relative hidden min-h-screen overflow-hidden bg-ink p-10 text-white lg:flex lg:flex-col xl:p-14">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.11]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.35) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="pointer-events-none absolute -right-32 top-28 h-[420px] w-[420px] rounded-full bg-accent/20 blur-[110px]" />

        <Link href="/" className="relative z-10 w-fit" aria-label="Ennearock home">
          <BrandLockup inverse />
        </Link>

        <div className="relative z-10 my-auto max-w-xl py-16">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_12px_rgba(226,229,235,.35)]" />
            Ennearock client space
          </div>
          <h1 className="max-w-[620px] text-[48px] font-medium leading-[0.98] tracking-[-0.06em] xl:text-[62px]">
            {isSignup ? "Your next project starts with a conversation." : "Your projects. A shared point of view."}
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-7 text-white/55">
            {isSignup
              ? "Tell us what you want to build, keep your details up to date, and follow your requests in one place."
              : "Find your requests, check the progress shared by Ennearock, and keep your client profile up to date."}
          </p>

          <div className="mt-12 rounded-[24px] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">Your account</p>
                <p className="mt-1.5 text-sm font-medium">One place to work with Ennearock</p>
              </div>
              <span className="rounded-full bg-accent px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-ink">
                Client
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-5">
              {[
                ["01", "Your profile"],
                ["02", "Your requests"],
                ["03", "Project status"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl bg-black/20 p-4">
                  <p className="text-xl font-semibold tracking-[-0.04em]">{value}</p>
                  <p className="mt-1 text-[11px] text-white/40">{label}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs leading-5 text-white/50">Only your own client information is available in your account. Website management remains reserved for administrators.</p>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-[11px] text-white/35">
          <span>© {new Date().getFullYear()} Ennearock</span>
          <span>Designed for collaboration</span>
        </div>
      </section>

      <section className="flex min-h-screen flex-col px-5 py-5 sm:px-8 lg:px-12 xl:px-20">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between lg:justify-end">
          <Link href="/" className="shrink-0 lg:hidden" aria-label="Ennearock home">
            <BrandLockup />
          </Link>
          <p className="text-xs text-[var(--muted)] sm:text-sm">
            {isSignup ? "Already have an account?" : "New to Ennearock?"}{" "}
            <Link
              href={`${isSignup ? "/login" : "/signup"}${nextPath ? `?next=${encodeURIComponent(nextPath)}` : ""}`}
              className="font-semibold text-ink underline decoration-[var(--line)] underline-offset-4 transition-colors hover:decoration-ink"
            >
              {isSignup ? "Sign in" : "Create account"}
            </Link>
          </p>
        </div>

        <div className="mx-auto flex w-full max-w-[450px] flex-1 items-center py-12 sm:py-16">
          {children}
        </div>
        <div className="flex justify-center gap-5 pb-2 text-[11px] text-[var(--muted)] lg:justify-end">
          <Link href="/contact" className="hover:text-ink">Help</Link>
          <Link href="/privacy" className="hover:text-ink">Privacy</Link>
          <Link href="/terms" className="hover:text-ink">Terms</Link>
        </div>
      </section>
    </main>
  );
}
