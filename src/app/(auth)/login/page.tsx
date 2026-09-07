import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { safeDashboardPath } from "@/lib/auth/paths";

export const metadata: Metadata = {
  title: "Sign in | Ennearock",
  description: "Sign in to your Ennearock studio workspace.",
};

type LoginPageProps = {
  searchParams: Promise<{
    authError?: string | string[];
    next?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const rawNext = params.next;
  const nextPath = safeDashboardPath(
    Array.isArray(rawNext) ? rawNext[0] : rawNext,
  );
  const rawAuthError = Array.isArray(params.authError)
    ? params.authError[0]
    : params.authError;
  const initialError =
    rawAuthError === "confirmation"
      ? "That confirmation link is invalid or has expired. Request a new email and try again."
      : undefined;

  return (
    <AuthShell mode="login">
      <AuthForm
        initialError={initialError}
        mode="login"
        nextPath={nextPath}
      />
    </AuthShell>
  );
}
