import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { authPageErrorMessage } from "@/lib/auth/page-errors";
import { safeDashboardPath } from "@/lib/auth/paths";

export const metadata: Metadata = {
  title: "Create account | Ennearock",
  description: "Create your Ennearock studio workspace.",
};

type SignupPageProps = {
  searchParams: Promise<{
    authError?: string | string[];
    next?: string | string[];
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;
  const rawNext = params.next;
  const nextPath = safeDashboardPath(
    Array.isArray(rawNext) ? rawNext[0] : rawNext,
  );
  const rawAuthError = Array.isArray(params.authError)
    ? params.authError[0]
    : params.authError;

  return (
    <AuthShell mode="signup">
      <AuthForm
        initialError={authPageErrorMessage(rawAuthError)}
        mode="signup"
        nextPath={nextPath}
      />
    </AuthShell>
  );
}
