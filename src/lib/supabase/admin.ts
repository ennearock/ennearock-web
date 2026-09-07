import "server-only";

import {
  createClient as createSupabaseClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

import { getSupabasePublicConfig } from "./env";

function serviceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || null;
}

function buildAdminClient(key: string) {
  const { url } = getSupabasePublicConfig();

  return createSupabaseClient(url, key, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}

export function createAdminClientIfConfigured(): SupabaseClient | null {
  const key = serviceRoleKey();
  return key ? buildAdminClient(key) : null;
}

export function createAdminClient(): SupabaseClient {
  const client = createAdminClientIfConfigured();

  if (!client) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. Use the authenticated server client with RLS, or configure this server-only key for a narrowly scoped trusted operation.",
    );
  }

  return client;
}

