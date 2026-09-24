"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import {
  loginAction,
  signupAction,
  type AuthActionState,
} from "@/app/(auth)/actions";

const inputClass =
  "mt-2 h-12 w-full rounded-[13px] border border-[var(--line)] bg-white px-4 text-[14px] text-ink outline-none transition placeholder:text-[var(--muted)] hover:border-[var(--line)] focus:border-[var(--focus)] focus:ring-4 focus:ring-[var(--focus)]/20";

function EyeIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4.5 w-4.5" aria-hidden="true">
      {open ? (
        <><path d="M3 3l18 18"/><path d="M10.6 10.7a2 2 0 0 0 2.7 2.7M9.9 5.2A10.6 10.6 0 0 1 12 5c6.5 0 9.5 7 9.5 7a15.7 15.7 0 0 1-2.1 3.1M6.5 6.5C3.9 8.3 2.5 12 2.5 12s3 7 9.5 7c1.3 0 2.5-.3 3.6-.7"/></>
      ) : (
        <><path d="M2.5 12s3-7 9.5-7 9.5 7 9.5 7-3 7-9.5 7-9.5-7-9.5-7Z"/><circle cx="12" cy="12" r="3"/></>
      )}
    </svg>
  );
}

const initialAuthState: AuthActionState = { message: "", status: "idle" };

export function AuthForm({
  initialError,
  mode,
  nextPath = "",
}: {
  initialError?: string;
  mode: "login" | "signup";
  nextPath?: string;
}) {
  const isSignup = mode === "signup";
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, pending] = useActionState(
    isSignup ? signupAction : loginAction,
    initialError
      ? { message: initialError, status: "error" as const }
      : initialAuthState,
  );

  return (
    <div className="w-full">
      <div className="mb-8">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
          {isSignup ? "Your client account" : "Welcome back"}
        </p>
        <h2 className="mt-3 text-[34px] font-semibold tracking-[-0.055em] text-ink sm:text-[40px]">
          {isSignup ? "Create your account" : "Sign in to Ennearock"}
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          {isSignup
            ? "Create an account to share your project requests and stay in touch with Ennearock."
            : "Access your client account. Authorized team members can also access the administration."}
        </p>
      </div>

      <div>
        <a
          href={`/auth/google?from=${mode}${nextPath ? `&next=${encodeURIComponent(nextPath)}` : ""}`}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-[12px] border border-[var(--line)] bg-white text-xs font-semibold transition hover:-translate-y-0.5 hover:border-[var(--line)] hover:shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus)]/30"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3Z"/>
            <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.5L15.4 17c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z"/>
            <path fill="#FBBC05" d="M6.4 13.9a6 6 0 0 1 0-3.8V7.5H3.1a10 10 0 0 0 0 9Z"/>
            <path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.8A9.7 9.7 0 0 0 3.1 7.5l3.3 2.6C7.2 7.8 9.4 6 12 6Z"/>
          </svg>
          Continue with Google
        </a>
      </div>

      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-[var(--line)]" />
        <span className="font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-[var(--muted)]">or continue with email</span>
        <span className="h-px flex-1 bg-[var(--line)]" />
      </div>

      {state.message ? (
        <div
          className={`mb-5 rounded-xl border px-3.5 py-3 text-xs leading-5 ${
            state.status === "success"
              ? "border-[#bcd985] bg-[#eff8dc] text-[#395020]"
              : "border-[#dca8a1] bg-[#fff0ed] text-[#813c31]"
          }`}
          role={state.status === "error" ? "alert" : "status"}
        >
          {state.message}
        </div>
      ) : null}

      <form action={formAction} className="space-y-4">
        <input name="next" type="hidden" value={nextPath} />
        {isSignup ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-ink">
              Full name
              <input className={inputClass} name="name" autoComplete="name" placeholder="Alex Morgan" minLength={2} maxLength={80} required />
            </label>
            <label className="text-xs font-semibold text-ink">
              Company (optional)
              <input className={inputClass} name="organization" autoComplete="organization" placeholder="Your company" minLength={2} maxLength={120} />
            </label>
          </div>
        ) : null}

        <label className="block text-xs font-semibold text-ink">
          Email address
          <input className={inputClass} type="email" name="email" autoComplete="email" placeholder="you@example.com" maxLength={254} required />
        </label>

        <label className="block text-xs font-semibold text-ink">
          <span className="flex items-center justify-between">
            Password
            {!isSignup ? (
              <Link href="/contact" className="font-medium text-ink hover:text-ink">Need sign-in help?</Link>
            ) : null}
          </span>
          <span className="relative block">
            <input
              className={`${inputClass} pr-12`}
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              placeholder={isSignup ? "Minimum 8 characters" : "Enter your password"}
              minLength={8}
              maxLength={128}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-1.5 top-[14px] grid h-9 w-9 place-items-center rounded-lg text-[var(--muted)] transition hover:bg-surface-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <EyeIcon open={showPassword} />
            </button>
          </span>
        </label>

        {isSignup ? (
          <label className="flex cursor-pointer items-start gap-3 pt-1 text-xs leading-5 text-[var(--muted)]">
            <input name="terms" type="checkbox" value="accepted" required className="mt-0.5 h-4 w-4 rounded border-[var(--line)] accent-ink" />
            <span>I agree to the <Link href="/terms" className="font-medium text-ink underline underline-offset-2">Terms</Link> and <Link href="/privacy" className="font-medium text-ink underline underline-offset-2">Privacy Policy</Link>.</span>
          </label>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="group mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-[13px] bg-ink px-5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(19,20,24,.14)] transition hover:-translate-y-0.5 hover:bg-panel disabled:cursor-wait disabled:opacity-70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus)]/50"
        >
          {pending ? (
            <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> {isSignup ? "Creating account…" : "Signing in…"}</>
          ) : (
            <>{isSignup ? "Create my account" : "Sign in"}<span className="transition-transform group-hover:translate-x-1">→</span></>
          )}
        </button>
      </form>

      {isSignup ? (
        <p className="mt-5 text-center text-[11px] leading-5 text-[var(--muted)]">Email confirmation may be required before your first sign-in.</p>
      ) : (
        <p className="mt-5 text-center text-[11px] leading-5 text-[var(--muted)]">Client accounts and website administration have separate access permissions.</p>
      )}
    </div>
  );
}
