import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { safeDashboardPath } from "@/lib/auth/paths";

export const metadata: Metadata = {
  title: "Create account | Ennearock",
  description: "Create your Ennearock studio workspace.",
};

type SignupPageProps = {
  searchParams: Promise<{ next?: string | string[] }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const rawNext = (await searchParams).next;
  const nextPath = safeDashboardPath(
    Array.isArray(rawNext) ? rawNext[0] : rawNext,
  );

  return (
    <AuthShell mode="signup">
      <AuthForm mode="signup" nextPath={nextPath} />
    </AuthShell>
  );
}
