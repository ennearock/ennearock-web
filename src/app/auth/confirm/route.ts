import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { getAdminUser } from "@/lib/auth/admin";
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
  let supabase: Awaited<ReturnType<typeof createServerSupabaseClient>> | null =
    null;
  let sessionEstablished = false;

  try {
    supabase = await createServerSupabaseClient();
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
      sessionEstablished = true;
      let admin;

      try {
        admin = await getAdminUser();
      } catch (error) {
        console.error("[auth:confirm] Admin lookup failed", {
          name: error instanceof Error ? error.name : "unknown_error",
        });
        await supabase.auth.signOut({ scope: "local" });
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("authError", "admin_setup");
        loginUrl.searchParams.set("next", nextPath);
        return noStoreRedirect(loginUrl);
      }

      if (admin) {
        return noStoreRedirect(new URL(nextPath, request.url));
      }

      await supabase.auth.signOut({ scope: "local" });
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("authError", "unauthorized");
      loginUrl.searchParams.set("next", nextPath);
      return noStoreRedirect(loginUrl);
    }
  } catch (error) {
    console.error("[auth:confirm] Confirmation failed", {
      name: error instanceof Error ? error.name : "unknown_error",
    });
    if (sessionEstablished && supabase) {
      try {
        await supabase.auth.signOut({ scope: "local" });
      } catch (signOutError) {
        console.error("[auth:confirm] Sign-out after failure failed", {
          name:
            signOutError instanceof Error
              ? signOutError.name
              : "unknown_error",
        });
      }
    }
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("authError", "confirmation");
  loginUrl.searchParams.set("next", nextPath);
  return noStoreRedirect(loginUrl);
}
