import "server-only";

import { cache } from "react";

import type { AccountData, Inquiry, Project } from "@/lib/account/types";
import { requireAccountUser } from "@/lib/auth/account";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// React cache only deduplicates reads during this server render. Private account
// data must never be put into a shared Next.js data cache.
export const getAccountData = cache(async (): Promise<AccountData> => {
  const user = await requireAccountUser();
  const empty: AccountData = { user, projects: [], inquiries: [], loadError: null };

  try {
    const supabase = await createServerSupabaseClient();
    const [projects, inquiries] = await Promise.all([
      supabase
        .from("user_projects")
        .select("id, name, status, custom_domain, updated_at")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(100),
      supabase
        .from("contact_inquiries")
        .select("id, subject, message, status, created_at, updated_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(100),
    ]);

    return {
      user,
      projects: projects.error ? [] : ((projects.data ?? []) as Project[]),
      inquiries: inquiries.error ? [] : ((inquiries.data ?? []) as Inquiry[]),
      loadError:
        projects.error || inquiries.error
          ? "Some workspace data could not be loaded. Please refresh to try again."
          : null,
    };
  } catch {
    return { ...empty, loadError: "Your workspace could not be loaded. Please try again." };
  }
});
