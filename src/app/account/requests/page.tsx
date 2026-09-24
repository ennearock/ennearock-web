import type { Metadata } from "next";
import { NewRequestForm } from "@/components/account/account-forms";
import { AccountHeading, EmptyState, LoadErrorBanner, panelClass, RequestList, SectionTitle } from "@/components/account/account-ui";
import { getAccountData } from "@/lib/account/data";

export const metadata: Metadata = { title: "My requests" };

export default async function RequestsPage() {
  const { inquiries, loadError } = await getAccountData();
  return (
    <>
      <AccountHeading eyebrow="Keep the conversation moving" title="Your requests." description="Share a project brief or ask a question. Your submissions and their current status stay together in this space." />
      <LoadErrorBanner message={loadError} />
      <div className="grid items-start gap-6 xl:grid-cols-[1fr_1.15fr]">
        <section className={panelClass}><SectionTitle title="New request" /><NewRequestForm /></section>
        <section className={panelClass}>
          <SectionTitle title="Request history" />
          {loadError ? (
            <p className="py-7 text-sm text-[var(--muted)]">Your request history could not be loaded. Please try again later.</p>
          ) : inquiries.length ? (
            <RequestList inquiries={inquiries} />
          ) : (
            <EmptyState icon="mail" title="A fresh start.">Your submitted requests will appear here. Tell us what you have in mind using the form.</EmptyState>
          )}
          <p className="mt-6 border-t border-[var(--line)] pt-4 text-[11px] leading-5 text-[var(--muted)]">Showing your latest 100 requests and their status. Message replies are not available here.</p>
        </section>
      </div>
    </>
  );
}
