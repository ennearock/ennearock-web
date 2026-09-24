import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { authPageErrorMessage } from "@/lib/auth/page-errors";
import { getAccountUser } from "@/lib/auth/account";
import { authenticatedPath, safeWorkspacePath } from "@/lib/auth/paths";

export const metadata: Metadata = {
  title: "Create account | Ennearock",
  description: "Create your Ennearock client account.",
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
  const nextPath = safeWorkspacePath(
    Array.isArray(rawNext) ? rawNext[0] : rawNext,
  );
  const rawAuthError = Array.isArray(params.authError)
    ? params.authError[0]
    : params.authError;
  let initialError = authPageErrorMessage(rawAuthError);
  let account;
  try {
    account = await getAccountUser();
  } catch {
    initialError = authPageErrorMessage("account_setup");
  }
  if (account) redirect(authenticatedPath(nextPath, account.isAdmin));

  return (
    <AuthShell mode="signup" nextPath={nextPath}>
      <AuthForm
        initialError={initialError}
        mode="signup"
        nextPath={nextPath}
      />
    </AuthShell>
  );
}
