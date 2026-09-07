import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { safeDashboardPath } from "@/lib/auth/paths";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const emailOtpTypes = new Set([
  "email",
  "email_change",
  "invite",
  "magiclink",
  "recovery",
  "signup",
]);

function noStoreRedirect(url: URL) {
  const response = NextResponse.redirect(url);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export async function GET(request: NextRequest) {
  const nextPath = safeDashboardPath(request.nextUrl.searchParams.get("next"));
  const code = request.nextUrl.searchParams.get("code");
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const rawType = request.nextUrl.searchParams.get("type");
  const supabase = await createServerSupabaseClient();
  let verified = false;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    verified = !error;
  } else if (tokenHash && rawType && emailOtpTypes.has(rawType)) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: rawType as EmailOtpType,
    });
    verified = !error;
  }

  if (verified) {
    return noStoreRedirect(new URL(nextPath, request.url));
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("authError", "confirmation");
  loginUrl.searchParams.set("next", nextPath);
  return noStoreRedirect(loginUrl);
}

