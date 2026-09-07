import { SiteHeaderClient } from "@/components/site-header-client";
import { getSiteContent } from "@/lib/content/queries";

export async function SiteHeader() {
  const { general } = await getSiteContent();
  return <SiteHeaderClient content={general} />;
}
