import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";

import { getAdminUser } from "@/lib/auth/admin";
import { safeWorkspacePath } from "@/lib/auth/paths";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AccountUser = {
  id: string;
  email: string;
  fullName: string | null;
  company: string | null;
  website: string | null;
  avatarUrl: string | null;
  isAdmin: boolean;
};

type ProfileRow = {
  email: string | null;
  full_name: string | null;
  company: string | null;
  website: string | null;
  avatar_url: string | null;
};

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export const getAccountUser = cache(async (): Promise<AccountUser | null> => {
  const supabase = await createServerSupabaseClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims?.sub) return null;

  const claims = claimsData.claims;
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("email, full_name, company, website, avatar_url")
    .eq("id", claims.sub)
    .maybeSingle<ProfileRow>();

  if (error) {
    console.error("[auth:account] Profile lookup failed", { code: error.code });
    throw new Error("Account profile lookup failed", { cause: error });
  }

  // Metadata is a display fallback only. Authorization stays in the existing
  // admin helper (trusted profile role / verified Auth email allowlist).
  const metadata = claims.user_metadata;
  const admin = await getAdminUser();
  return {
    id: claims.sub,
    email: optionalString(claims.email) ?? optionalString(profile?.email) ?? "",
    fullName:
      optionalString(profile?.full_name) ??
      optionalString(metadata?.full_name) ??
      optionalString(metadata?.name),
    // A cleared profile field must stay cleared rather than resurrect signup metadata.
    company: profile ? optionalString(profile.company) : optionalString(metadata?.company),
    website: optionalString(profile?.website),
    avatarUrl:
      optionalString(profile?.avatar_url) ?? optionalString(metadata?.avatar_url),
    isAdmin: admin !== null,
  };
});

export async function requireAccountUser(nextPath = "/account"): Promise<AccountUser> {
  const user = await getAccountUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(safeWorkspacePath(nextPath, "/account"))}`);
  }
  return user;
}
