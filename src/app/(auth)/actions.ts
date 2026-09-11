"use server";

import { isAuthError } from "@supabase/supabase-js";
import { headers } from "next/headers";
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

function authErrorDetails(error: unknown) {
  if (isAuthError(error)) {
    return {
      code: error.code ?? "unknown_auth_error",
      status: error.status ?? null,
    };
  }

  return {
    code: error instanceof Error ? error.name : "unknown_error",
    status: null,
  };
}

function logAuthFailure(
  context: "login" | "logout" | "signup",
  error: unknown,
) {
  console.error(`[auth:${context}] request failed`, authErrorDetails(error));
}

async function safeSignOut(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
) {
  try {
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) logAuthFailure("logout", error);
  } catch (error) {
    logAuthFailure("logout", error);
  }
}

function loginErrorMessage(error: unknown) {
  const code = isAuthError(error) ? error.code : undefined;

  if (code === "email_not_confirmed") {
    return "Confirm your email address before signing in.";
  }

  if (code === "over_request_rate_limit") {
    return "Too many sign-in attempts. Wait a few minutes and try again.";
  }

  return "The email or password is incorrect.";
}

function signupErrorMessage(error: unknown) {
  const code = isAuthError(error) ? error.code : undefined;

  switch (code) {
    case "email_address_not_authorized":
      return "Supabase cannot send confirmation mail to this address with its default email service. Use a Supabase project-team email or configure custom SMTP.";
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "The confirmation-email limit has been reached. Wait an hour or configure custom SMTP in Supabase.";
    case "weak_password":
      return "Choose a stronger password that meets the Supabase password policy.";
    case "email_address_invalid":
    case "validation_failed":
      return "This email address cannot be used. Check it and try again.";
    case "email_exists":
    case "user_already_exists":
      return "If an account already exists for this email, sign in or request account help.";
    case "email_provider_disabled":
    case "signup_disabled":
      return "Email account creation is disabled in Supabase Auth.";
    case "unexpected_failure":
      return "The account could not be saved because the site's account database is not ready. The site owner needs to finish the database setup.";
    default:
      return "We could not create that account. Check the authentication setup and try again.";
  }
}

function validHttpOrigin(value: string | null | undefined) {
  if (!value) return null;

  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.origin : null;
  } catch {
    return null;
  }
}

async function confirmationRedirect() {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const requestOrigin = (await headers()).get("origin");
  const origin =
    validHttpOrigin(configuredSiteUrl) ?? validHttpOrigin(requestOrigin);

  if (!origin) return undefined;

  return new URL("/auth/confirm", origin).toString();
}

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = credentialsFrom(formData);
  if (!isCredentials(parsed)) return parsed;

  let supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>;

  try {
    supabase = await createServerSupabaseClient();
  } catch (error) {
    logAuthFailure("login", error);
    return errorState("Authentication is not configured correctly yet.");
  }

  let signInError: unknown;

  try {
    const { error } = await supabase.auth.signInWithPassword(parsed);
    signInError = error;
  } catch (error) {
    logAuthFailure("login", error);
    return errorState("The authentication service is temporarily unavailable.");
  }

  if (signInError) {
    logAuthFailure("login", signInError);
    return errorState(loginErrorMessage(signInError));
  }

  let admin;

  try {
    admin = await getAdminUser();
  } catch (error) {
    logAuthFailure("login", error);
    await safeSignOut(supabase);
    return errorState("The admin workspace is temporarily unavailable.");
  }

  if (!admin) {
    await safeSignOut(supabase);
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
  const emailRedirectTo = await confirmationRedirect();
  let supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>;

  try {
    supabase = await createServerSupabaseClient();
  } catch (error) {
    logAuthFailure("signup", error);
    return errorState("Authentication is not configured correctly yet.");
  }

  let signupResult;

  try {
    signupResult = await supabase.auth.signUp({
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
  } catch (error) {
    logAuthFailure("signup", error);
    return errorState("The authentication service is temporarily unavailable.");
  }

  const { data, error } = signupResult;

  if (error) {
    logAuthFailure("signup", error);
    return errorState(signupErrorMessage(error));
  }

  if (!data.session) {
    return {
      message: "Check your email to confirm the account, then sign in.",
      status: "success",
    };
  }

  let admin;

  try {
    admin = await getAdminUser();
  } catch (error) {
    logAuthFailure("signup", error);
    await safeSignOut(supabase);
    return errorState("Your account was created, but the admin workspace is unavailable.");
  }

  if (!admin) {
    await safeSignOut(supabase);
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
