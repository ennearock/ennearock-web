import type { Metadata } from "next";
import type { ReactNode } from "react";
import { logoutAction } from "@/app/(auth)/actions";
import { AccountShell } from "@/components/account/account-shell";
import { requireAccountUser } from "@/lib/auth/account";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Client space | Ennearock", template: "%s | Ennearock" },
  description: "Your personal Ennearock workspace for projects, requests and account details.",
  robots: { index: false, follow: false },
};

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const user = await requireAccountUser("/account");
  return <AccountShell logoutAction={logoutAction} user={{ fullName: user.fullName, email: user.email, isAdmin: user.isAdmin }}>{children}</AccountShell>;
}
