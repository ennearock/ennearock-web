import type { Metadata } from "next";
import type { ReactNode } from "react";
import { logoutAction } from "@/app/(auth)/actions";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireAdmin } from "@/lib/auth/admin";

export const metadata: Metadata = {
  title: {
    default: "Website admin | Ennearock",
    template: "%s | Ennearock",
  },
  description: "Manage Ennearock's portfolio and website content.",
};

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const admin = await requireAdmin("/dashboard");

  return (
    <DashboardShell
      logoutAction={logoutAction}
      user={{
        name: admin.fullName ?? "Ennearock admin",
        email: admin.email,
        avatarUrl: admin.avatarUrl,
      }}
    >
      {children}
    </DashboardShell>
  );
}
