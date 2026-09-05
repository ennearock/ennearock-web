import Link from "next/link";
import type { ReactNode } from "react";

function EnnearockLogo({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3">
      <span
        className={`grid h-9 w-9 grid-cols-3 gap-[3px] rounded-[11px] p-[7px] ${
          inverse ? "bg-[#c9f26b]" : "bg-[#11130f]"
        }`}
        aria-hidden="true"
      >
        {Array.from({ length: 9 }, (_, index) => (
          <span
            key={index}
            className={`rounded-[1px] ${
              index === 8
                ? inverse
                  ? "translate-x-[2px] bg-[#11130f]"
                  : "translate-x-[2px] bg-[#c9f26b]"
                : inverse
                  ? "bg-[#11130f]"
                  : "bg-white"
            }`}
          />
        ))}
      </span>
      <span
        className={`text-[18px] font-semibold tracking-[-0.04em] ${inverse ? "text-white" : "text-[#11130f]"}`}
      >
        ennearock
      </span>
    </span>
  );
}

export function AuthShell({
  children,
  mode,
}: {
  children: ReactNode;
  mode: "login" | "signup";
}) {
  const isSignup = mode === "signup";

  return (
    <main className="min-h-screen bg-[#f5f2ea] text-[#11130f] lg:grid lg:grid-cols-[minmax(420px,0.92fr)_minmax(560px,1.08fr)]">
      <section className="relative hidden min-h-screen overflow-hidden bg-[#11130f] p-10 text-white lg:flex lg:flex-col xl:p-14">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.11]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.35) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="pointer-events-none absolute -right-32 top-28 h-[420px] w-[420px] rounded-full bg-[#c9f26b]/20 blur-[110px]" />

        <Link href="/" className="relative z-10 w-fit" aria-label="Ennearock home">
          <EnnearockLogo inverse />
        </Link>

        <div className="relative z-10 my-auto max-w-xl py-16">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c9f26b] shadow-[0_0_12px_#c9f26b]" />
            Studio operating system
          </div>
          <h1 className="max-w-[620px] text-[48px] font-medium leading-[0.98] tracking-[-0.06em] xl:text-[62px]">
            {isSignup ? "Build remarkable work. Keep the process calm." : "Your studio, moving in one direction."}
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-7 text-white/55">
            {isSignup
              ? "A focused workspace for projects, templates, client feedback, and the numbers that keep your team sharp."
              : "Pick up where your team left off. Projects, templates, delivery, and growth—without the operational noise."}
          </p>

          <div className="mt-12 rounded-[24px] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">Live project</p>
                <p className="mt-1.5 text-sm font-medium">Northstar Commerce</p>
              </div>
              <span className="rounded-full bg-[#c9f26b] px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-[#11130f]">
                On track
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-5">
              {[
                ["82%", "Delivered"],
                ["12", "Days left"],
                ["4.9", "Client score"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl bg-black/20 p-4">
                  <p className="text-xl font-semibold tracking-[-0.04em]">{value}</p>
                  <p className="mt-1 text-[11px] text-white/40">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[82%] rounded-full bg-[#c9f26b]" />
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-[11px] text-white/35">
          <span>© {new Date().getFullYear()} Ennearock</span>
          <span>Built for ambitious teams</span>
        </div>
      </section>

      <section className="flex min-h-screen flex-col px-5 py-5 sm:px-8 lg:px-12 xl:px-20">
        <div className="flex items-center justify-between lg:justify-end">
          <Link href="/" className="lg:hidden" aria-label="Ennearock home">
            <EnnearockLogo />
          </Link>
          <p className="text-xs text-[#6d7169] sm:text-sm">
            {isSignup ? "Already have a workspace?" : "New to Ennearock?"}{" "}
            <Link
              href={isSignup ? "/login" : "/signup"}
              className="font-semibold text-[#11130f] underline decoration-[#aeb0a8] underline-offset-4 transition-colors hover:decoration-[#11130f]"
            >
              {isSignup ? "Sign in" : "Create account"}
            </Link>
          </p>
        </div>

        <div className="mx-auto flex w-full max-w-[450px] flex-1 items-center py-12 sm:py-16">
          {children}
        </div>
        <div className="flex justify-center gap-5 pb-2 text-[11px] text-[#898c84] lg:justify-end">
          <Link href="/contact" className="hover:text-[#11130f]">Help</Link>
          <Link href="/privacy" className="hover:text-[#11130f]">Privacy</Link>
          <Link href="/terms" className="hover:text-[#11130f]">Terms</Link>
        </div>
      </section>
    </main>
  );
}
