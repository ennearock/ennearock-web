"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import {
  loginAction,
  signupAction,
  type AuthActionState,
} from "@/app/(auth)/actions";

const inputClass =
  "mt-2 h-12 w-full rounded-[13px] border border-[#dcd9cf] bg-white px-4 text-[14px] text-[#11130f] outline-none transition placeholder:text-[#aaa9a2] hover:border-[#c7c4ba] focus:border-[#61734f] focus:ring-4 focus:ring-[#c9f26b]/20";

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
  nextPath = "/dashboard",
}: {
  initialError?: string;
  mode: "login" | "signup";
  nextPath?: string;
}) {
  const isSignup = mode === "signup";
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");
  const [state, formAction, pending] = useActionState(
    isSignup ? signupAction : loginAction,
    initialError
      ? { message: initialError, status: "error" as const }
      : initialAuthState,
  );

  function handleSocial(provider: string) {
    setNotice(`${provider} sign-in is not enabled yet. Use email and password.`);
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#6f795f]">
          {isSignup ? "Start your workspace" : "Welcome back"}
        </p>
        <h2 className="mt-3 text-[34px] font-semibold tracking-[-0.055em] text-[#11130f] sm:text-[40px]">
          {isSignup ? "Create your account" : "Sign in to Ennearock"}
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#6c7068]">
          {isSignup
            ? "Set up your studio workspace in under two minutes."
            : "Enter your details to access your workspace."}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleSocial("Google")}
          className="flex h-11 items-center justify-center gap-2 rounded-[12px] border border-[#dcd9cf] bg-white text-xs font-semibold transition hover:-translate-y-0.5 hover:border-[#bbb9af] hover:shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c9f26b]/30"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3Z"/>
            <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.5L15.4 17c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z"/>
            <path fill="#FBBC05" d="M6.4 13.9a6 6 0 0 1 0-3.8V7.5H3.1a10 10 0 0 0 0 9Z"/>
            <path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.8A9.7 9.7 0 0 0 3.1 7.5l3.3 2.6C7.2 7.8 9.4 6 12 6Z"/>
          </svg>
          Google
        </button>
        <button
          type="button"
          onClick={() => handleSocial("GitHub")}
          className="flex h-11 items-center justify-center gap-2 rounded-[12px] border border-[#dcd9cf] bg-white text-xs font-semibold transition hover:-translate-y-0.5 hover:border-[#bbb9af] hover:shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c9f26b]/30"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.9c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.6 1.1 1.6 1.1.9 1.6 2.4 1.1 2.9.9.1-.7.4-1.1.7-1.3-2.3-.3-4.6-1.1-4.6-5A3.9 3.9 0 0 1 6.7 9c-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.7 1a9.3 9.3 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.6a3.9 3.9 0 0 1 1.1 2.7c0 3.8-2.3 4.7-4.6 5 .4.3.7 1 .7 2V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z"/></svg>
          GitHub
        </button>
      </div>

      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-[#dddacf]" />
        <span className="font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-[#999b94]">or continue with email</span>
        <span className="h-px flex-1 bg-[#dddacf]" />
      </div>

      {notice ? (
        <div className="mb-5 rounded-xl border border-[#bcd985] bg-[#eff8dc] px-3.5 py-3 text-xs leading-5 text-[#395020]" role="status">
          {notice}
        </div>
      ) : null}

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
            <label className="text-xs font-semibold text-[#30332e]">
              Full name
              <input className={inputClass} name="name" autoComplete="name" placeholder="Alex Morgan" minLength={2} maxLength={80} required />
            </label>
            <label className="text-xs font-semibold text-[#30332e]">
              Studio name
              <input className={inputClass} name="organization" autoComplete="organization" placeholder="Acme Studio" minLength={2} maxLength={120} required />
            </label>
          </div>
        ) : null}

        <label className="block text-xs font-semibold text-[#30332e]">
          Work email
          <input className={inputClass} type="email" name="email" autoComplete="email" placeholder="you@studio.com" maxLength={254} required />
        </label>

        <label className="block text-xs font-semibold text-[#30332e]">
          <span className="flex items-center justify-between">
            Password
            {!isSignup ? (
              <Link href="/contact" className="font-medium text-[#5d6e48] hover:text-[#11130f]">Need sign-in help?</Link>
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
              className="absolute right-1.5 top-[14px] grid h-9 w-9 place-items-center rounded-lg text-[#777a72] transition hover:bg-[#f1efe8] hover:text-[#11130f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#81965b]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <EyeIcon open={showPassword} />
            </button>
          </span>
        </label>

        {isSignup ? (
          <label className="flex cursor-pointer items-start gap-3 pt-1 text-xs leading-5 text-[#6d7169]">
            <input name="terms" type="checkbox" value="accepted" required className="mt-0.5 h-4 w-4 rounded border-[#c7c4ba] accent-[#11130f]" />
            <span>I agree to the <Link href="/terms" className="font-medium text-[#11130f] underline underline-offset-2">Terms</Link> and <Link href="/privacy" className="font-medium text-[#11130f] underline underline-offset-2">Privacy Policy</Link>.</span>
          </label>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="group mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-[13px] bg-[#11130f] px-5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(17,19,15,.14)] transition hover:-translate-y-0.5 hover:bg-[#23271f] disabled:cursor-wait disabled:opacity-70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c9f26b]/50"
        >
          {pending ? (
            <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> {isSignup ? "Creating account…" : "Signing in…"}</>
          ) : (
            <>{isSignup ? "Create my workspace" : "Continue to workspace"}<span className="transition-transform group-hover:translate-x-1">→</span></>
          )}
        </button>
      </form>

      {isSignup ? (
        <p className="mt-5 text-center text-[11px] leading-5 text-[#8a8d85]">Email confirmation may be required before your first sign-in.</p>
      ) : (
        <p className="mt-5 text-center text-[11px] leading-5 text-[#8a8d85]">Admin access is limited to authorized Ennearock accounts.</p>
      )}
    </div>
  );
}
