import type { Metadata } from "next";
import Link from "next/link";
import { HomepageEditor } from "@/components/dashboard/homepage-editor";
import { Icon } from "@/components/dashboard/icon";
import { PageHeader } from "@/components/dashboard/page-header";
import { getDashboardSiteContent } from "../data";

export const metadata: Metadata = {
  title: "Homepage",
};

export default async function HomepageAdminPage() {
  const { content, setupMessage, updatedAt } = await getDashboardSiteContent();

  return (
    <div>
      <PageHeader
        eyebrow="Main page"
        title="Homepage content"
        description="Edit the existing Ennearock layout through focused fields, keeping its typography and responsive behavior intact."
        action={
          <Link
            className="inline-flex h-11 items-center gap-2 rounded-[12px] border border-[#d4d1c7] bg-white px-4 text-xs font-semibold transition hover:-translate-y-0.5 hover:border-[#bdbab0]"
            href="/"
            target="_blank"
          >
            View homepage <Icon className="h-4 w-4" name="external" />
          </Link>
        }
      />
      <HomepageEditor
        initialContent={content}
        setupMessage={setupMessage}
        updatedAt={updatedAt}
      />
    </div>
  );
}
