import { isAuthError } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { getAdminUser } from "@/lib/auth/admin";
import { safeDashboardPath } from "@/lib/auth/paths";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const OAUTH_NEXT_COOKIE = "ennearock_oauth_next";
const OAUTH_SOURCE_COOKIE = "ennearock_oauth_source";

function noStoreRedirect(url: URL) {
  const response = NextResponse.redirect(url);
  response.headers.set("Cache-Control", "private, no-store");
  for (const name of [OAUTH_NEXT_COOKIE, OAUTH_SOURCE_COOKIE]) {
    response.cookies.set(name, "", {
      expires: new Date(0),
      path: "/auth/callback",
    });
  }
  return response;
}

function sourcePage(request: NextRequest) {
  const source =
    request.cookies.get(OAUTH_SOURCE_COOKIE)?.value ??
    request.nextUrl.searchParams.get("from");

  return source === "signup" ? "/signup" : "/login";
}

function errorRedirect(
  request: NextRequest,
  code:
    | "admin_setup"
    | "google_disabled"
    | "oauth"
    | "oauth_cancelled"
    | "unauthorized",
  nextPath: string,
) {
  const url = new URL(sourcePage(request), request.url);
  url.searchParams.set("authError", code);
  url.searchParams.set("next", nextPath);
  return noStoreRedirect(url);
}

function logExchangeFailure(error: unknown) {
  console.error("[auth:google] OAuth callback failed", {
    code: isAuthError(error) ? (error.code ?? "unknown_auth_error") : undefined,
    name: error instanceof Error ? error.name : "unknown_error",
    status: isAuthError(error) ? (error.status ?? null) : null,
  });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const nextPath = safeDashboardPath(
    request.cookies.get(OAUTH_NEXT_COOKIE)?.value ?? searchParams.get("next"),
  );
  const providerError = searchParams.get("error");
  const providerErrorCode = searchParams.get("error_code");

  if (providerError || providerErrorCode) {
    const code =
      providerErrorCode === "provider_disabled" ||
      providerErrorCode === "oauth_provider_not_supported"
        ? "google_disabled"
        : providerError === "access_denied"
          ? "oauth_cancelled"
          : "oauth";

    console.error("[auth:google] Provider returned an OAuth error", {
      code: providerErrorCode ?? providerError ?? "unknown_provider_error",
    });
    return errorRedirect(request, code, nextPath);
  }

  const code = searchParams.get("code");
  if (!code) return errorRedirect(request, "oauth", nextPath);

  let supabase: Awaited<ReturnType<typeof createServerSupabaseClient>> | null =
    null;
  let sessionEstablished = false;

  try {
    supabase = await createServerSupabaseClient();
    const flowId = searchParams.get("sb_flow_id");
    const { error } = await supabase.auth.exchangeCodeForSession(
      code,
      flowId ? { flowId } : undefined,
    );

    if (error) {
      logExchangeFailure(error);
      return errorRedirect(request, "oauth", nextPath);
    }

    sessionEstablished = true;
    let admin;

    try {
      admin = await getAdminUser();
    } catch (error) {
      logExchangeFailure(error);
      await supabase.auth.signOut({ scope: "local" });
      return errorRedirect(request, "admin_setup", nextPath);
    }

    if (!admin) {
      await supabase.auth.signOut({ scope: "local" });
      return errorRedirect(request, "unauthorized", nextPath);
    }

    return noStoreRedirect(new URL(nextPath, request.url));
  } catch (error) {
    logExchangeFailure(error);
    if (sessionEstablished && supabase) {
      try {
        await supabase.auth.signOut({ scope: "local" });
      } catch (signOutError) {
        logExchangeFailure(signOutError);
      }
    }
    return errorRedirect(request, "oauth", nextPath);
  }
}
