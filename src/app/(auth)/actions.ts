"use server";

import { redirect } from "next/navigation";

import { getAdminUser } from "@/lib/auth/admin";
import { safeDashboardPath } from "@/lib/auth/paths";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AuthActionState = {
  message: string;
  status: "error" | "idle" | "success";
};

type Credentials = {
  email: string;
  password: string;
};

function errorState(message: string): AuthActionState {
  return { message, status: "error" };
}

function credentialsFrom(formData: FormData): Credentials | AuthActionState {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return errorState("Enter a valid email address.");
  }

  if (password.length < 8 || password.length > 128) {
    return errorState("Password must be between 8 and 128 characters.");
  }

  return { email, password };
}

function isCredentials(value: Credentials | AuthActionState): value is Credentials {
  return "email" in value;
}

function confirmationRedirect(nextPath: string) {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configuredSiteUrl) return undefined;

  try {
    const siteUrl = new URL(configuredSiteUrl);
    if (!["http:", "https:"].includes(siteUrl.protocol)) return undefined;

    const confirmationUrl = new URL("/auth/confirm", siteUrl);
    confirmationUrl.searchParams.set("next", nextPath);
    return confirmationUrl.toString();
  } catch {
    return undefined;
  }
}

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = credentialsFrom(formData);
  if (!isCredentials(parsed)) return parsed;

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword(parsed);

  if (error) {
    return errorState("The email or password is incorrect.");
  }

  const admin = await getAdminUser();
  if (!admin) {
    await supabase.auth.signOut();
    return errorState("This account is not authorized for the admin workspace.");
  }

  redirect(safeDashboardPath(formData.get("next")));
}

export async function signupAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = credentialsFrom(formData);
  if (!isCredentials(parsed)) return parsed;

  const fullName = String(formData.get("name") ?? "").trim();
  const company = String(formData.get("organization") ?? "").trim();

  if (fullName.length < 2 || fullName.length > 80) {
    return errorState("Enter a name between 2 and 80 characters.");
  }

  if (company.length < 2 || company.length > 120) {
    return errorState("Enter a studio name between 2 and 120 characters.");
  }

  if (formData.get("terms") !== "accepted") {
    return errorState("Accept the Terms and Privacy Policy to create an account.");
  }

  const nextPath = safeDashboardPath(formData.get("next"));
  const emailRedirectTo = confirmationRedirect(nextPath);
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.email,
    password: parsed.password,
    options: {
      data: {
        company,
        full_name: fullName,
      },
      ...(emailRedirectTo ? { emailRedirectTo } : {}),
    },
  });

  if (error) {
    return errorState("We could not create that account. Try again shortly.");
  }

  if (!data.session) {
    return {
      message: "Check your email to confirm the account, then sign in.",
      status: "success",
    };
  }

  const admin = await getAdminUser();
  if (!admin) {
    await supabase.auth.signOut();
    return errorState(
      "Your account was created but has not been granted admin access.",
    );
  }

  redirect(nextPath);
}

export async function logoutAction(): Promise<void> {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/login");
}
