import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { getAccountUser } from "@/lib/auth/account";
import { authenticatedPath, safeWorkspacePath } from "@/lib/auth/paths";
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
  response.cookies.set("ennearock_email_next", "", {
    expires: new Date(0),
    path: "/auth/confirm",
  });
  return response;
}

export async function GET(request: NextRequest) {
  const nextPath = safeWorkspacePath(
    request.cookies.get("ennearock_email_next")?.value ??
      request.nextUrl.searchParams.get("next"),
  );
  const code = request.nextUrl.searchParams.get("code");
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const rawType = request.nextUrl.searchParams.get("type");
  try {
    const supabase = await createServerSupabaseClient();
    let verified = false;

    if (code) {
      const flowId = request.nextUrl.searchParams.get("sb_flow_id");
      const { error } = await supabase.auth.exchangeCodeForSession(
        code,
        flowId ? { flowId } : undefined,
      );
      verified = !error;
    } else if (tokenHash && rawType && emailOtpTypes.has(rawType)) {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: rawType as EmailOtpType,
      });
      verified = !error;
    }

    if (verified) {
      let account;

      try {
        account = await getAccountUser();
      } catch (error) {
        console.error("[auth:confirm] Account lookup failed", {
          name: error instanceof Error ? error.name : "unknown_error",
        });
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("authError", "account_setup");
        if (nextPath) loginUrl.searchParams.set("next", nextPath);
        return noStoreRedirect(loginUrl);
      }

      if (account) {
        return noStoreRedirect(new URL(authenticatedPath(nextPath, account.isAdmin), request.url));
      }
    }
  } catch (error) {
    console.error("[auth:confirm] Confirmation failed", {
      name: error instanceof Error ? error.name : "unknown_error",
    });
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("authError", "confirmation");
  if (nextPath) loginUrl.searchParams.set("next", nextPath);
  return noStoreRedirect(loginUrl);
}
