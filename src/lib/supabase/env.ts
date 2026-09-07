export type SupabasePublicConfig = {
  publishableKey: string;
  url: string;
};

function requiredValue(value: string | undefined, name: string) {
  const normalized = value?.trim();

  if (!normalized) {
    throw new Error(
      `Missing ${name}. Add it to your local and deployment environment before using Supabase.`,
    );
  }

  return normalized;
}

export function getSupabasePublicConfig(): SupabasePublicConfig {
  return {
    publishableKey: requiredValue(
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    ),
    url: requiredValue(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      "NEXT_PUBLIC_SUPABASE_URL",
    ).replace(/\/$/, ""),
  };
}

