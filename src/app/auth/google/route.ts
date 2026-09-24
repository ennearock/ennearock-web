import { NextResponse, type NextRequest } from "next/server";

import { safeWorkspacePath } from "@/lib/auth/paths";
import { getSupabasePublicConfig } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type AuthSettings = {
  external?: { google?: boolean };
};

const OAUTH_NEXT_COOKIE = "ennearock_oauth_next";
const OAUTH_SOURCE_COOKIE = "ennearock_oauth_source";

function noStoreRedirect(url: URL | string) {
  const response = NextResponse.redirect(url);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

function sourcePage(request: NextRequest) {
  return request.nextUrl.searchParams.get("from") === "signup"
    ? "/signup"
    : "/login";
}

function errorRedirect(
  request: NextRequest,
  code: "google_disabled" | "oauth",
  nextPath: string,
) {
  const url = new URL(sourcePage(request), request.url);
  url.searchParams.set("authError", code);
  if (nextPath) url.searchParams.set("next", nextPath);
  return noStoreRedirect(url);
}

function callbackOrigin(request: NextRequest) {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredSiteUrl) {
    try {
      const configuredUrl = new URL(configuredSiteUrl);
      if (["http:", "https:"].includes(configuredUrl.protocol)) {
        return configuredUrl.origin;
      }
    } catch {
      // Fall through to the origin already validated by Next.js.
    }
  }

  return request.nextUrl.origin;
}

async function googleProviderEnabled() {
  const { publishableKey, url } = getSupabasePublicConfig();

  try {
    const response = await fetch(`${url}/auth/v1/settings`, {
      cache: "no-store",
      headers: { apikey: publishableKey },
      signal: AbortSignal.timeout(5_000),
    });

    if (!response.ok) return null;

    const settings = (await response.json()) as AuthSettings;
    return typeof settings.external?.google === "boolean"
      ? settings.external.google
      : null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const nextPath = safeWorkspacePath(request.nextUrl.searchParams.get("next"));

  try {
    const canonicalOrigin = callbackOrigin(request);
    if (request.nextUrl.origin !== canonicalOrigin) {
      const canonicalUrl = new URL(
        `${request.nextUrl.pathname}${request.nextUrl.search}`,
        canonicalOrigin,
      );
      return noStoreRedirect(canonicalUrl);
    }

    const providerEnabled = await googleProviderEnabled();

    if (providerEnabled === false) {
      return errorRedirect(request, "google_disabled", nextPath);
    }

    if (providerEnabled !== true) {
      return errorRedirect(request, "oauth", nextPath);
    }

    const callbackUrl = new URL("/auth/callback", canonicalOrigin);

    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl.toString(),
        skipBrowserRedirect: true,
      },
    });

    if (error || !data.url) {
      console.error("[auth:google] OAuth initiation failed", {
        code: error?.code ?? "missing_provider_url",
        status: error?.status ?? null,
      });
      return errorRedirect(request, "oauth", nextPath);
    }

    const providerUrl = new URL(data.url);
    const authOrigin = new URL(getSupabasePublicConfig().url).origin;

    if (providerUrl.origin !== authOrigin) {
      console.error("[auth:google] Rejected an unexpected OAuth origin");
      return errorRedirect(request, "oauth", nextPath);
    }

    const response = noStoreRedirect(providerUrl);
    const cookieOptions = {
      httpOnly: true,
      maxAge: 10 * 60,
      path: "/auth/callback",
      sameSite: "lax" as const,
      secure: callbackUrl.protocol === "https:",
    };

    response.cookies.set(OAUTH_NEXT_COOKIE, nextPath, cookieOptions);
    response.cookies.set(
      OAUTH_SOURCE_COOKIE,
      sourcePage(request) === "/signup" ? "signup" : "login",
      cookieOptions,
    );
    return response;
  } catch (error) {
    console.error("[auth:google] OAuth initiation failed", {
      name: error instanceof Error ? error.name : "unknown_error",
    });
    return errorRedirect(request, "oauth", nextPath);
  }
}
