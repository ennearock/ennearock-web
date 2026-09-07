import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";
import { SiteSettingsEditor } from "@/components/dashboard/site-settings-editor";
import { getDashboardSiteContent } from "../data";

export const metadata: Metadata = {
  title: "Site settings",
};

export default async function SiteSettingsPage() {
  const { content, setupMessage, updatedAt } = await getDashboardSiteContent();

  return (
    <div>
      <PageHeader
        eyebrow="Global information"
        title="Site settings"
        description="Manage the brand, contact details, header actions, and social links used throughout Ennearock."
      />
      <SiteSettingsEditor
        initialValue={content.general}
        setupMessage={setupMessage}
        updatedAt={updatedAt}
      />
    </div>
  );
}
