import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { safeDashboardPath } from "./paths";

export type AdminUser = {
  authorizationSource: "allowlist" | "profile";
  avatarUrl: string | null;
  company: string | null;
  email: string;
  fullName: string | null;
  id: string;
  role: "admin";
};

type ProfileRow = {
  avatar_url: string | null;
  company: string | null;
  email: string | null;
  full_name: string | null;
  role: string | null;
};

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function allowedAdminEmails() {
  return new Set(
    [process.env.ADMIN_EMAILS, process.env.CONTACT_TEAM_EMAIL]
      .flatMap((value) => value?.split(/[;,\n]/) ?? [])
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean),
  );
}

export const getAdminUser = cache(async (): Promise<AdminUser | null> => {
  const supabase = await createServerSupabaseClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    return null;
  }

  const claims = claimsData.claims;
  const { data, error } = await supabase
    .from("profiles")
    .select("email, full_name, avatar_url, company, role")
    .eq("id", claims.sub)
    .maybeSingle<ProfileRow>();

  if (error) {
    console.error("[auth:admin] Profile lookup failed", {
      code: error.code,
      status: error.code === "PGRST205" ? 503 : null,
    });
    throw new Error("Admin profile lookup failed", { cause: error });
  }

  const profile = data ?? null;
  // The allowlist must be matched against the signed Auth claim, never a
  // profile field that originated from application data.
  const claimedEmail = optionalString(claims.email);
  const email = claimedEmail ?? optionalString(profile?.email) ?? "";
  const emailIsAllowed =
    claimedEmail !== null &&
    allowedAdminEmails().has(claimedEmail.toLowerCase());
  const profileIsAdmin = profile?.role === "admin";

  if (!profileIsAdmin && !emailIsAllowed) {
    return null;
  }

  const metadata = claims.user_metadata;

  return {
    authorizationSource: profileIsAdmin ? "profile" : "allowlist",
    avatarUrl:
      optionalString(profile?.avatar_url) ?? optionalString(metadata?.avatar_url),
    company: optionalString(profile?.company) ?? optionalString(metadata?.company),
    email,
    fullName:
      optionalString(profile?.full_name) ??
      optionalString(metadata?.full_name) ??
      optionalString(metadata?.name),
    id: claims.sub,
    role: "admin",
  };
});

export async function requireAdmin(nextPath = "/dashboard"): Promise<AdminUser> {
  const admin = await getAdminUser();

  if (!admin) {
    const safeNextPath = safeDashboardPath(nextPath);
    redirect(`/login?next=${encodeURIComponent(safeNextPath)}`);
  }

  return admin;
}
