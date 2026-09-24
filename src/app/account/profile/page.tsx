import type { Metadata } from "next";
import { ProfileForm } from "@/components/account/account-forms";
import { AccountHeading, LoadErrorBanner, panelClass, SectionTitle } from "@/components/account/account-ui";
import { Icon } from "@/components/dashboard/icon";
import { getAccountData } from "@/lib/account/data";

export const metadata: Metadata = { title: "My profile" };

export default async function ProfilePage() {
  const { user, loadError } = await getAccountData();
  return <><AccountHeading eyebrow="Account details" title="A little about you." description="Keep your contact details current so the Ennearock team has the right context for your work." /><LoadErrorBanner message={loadError} /><div className="grid items-start gap-6 xl:grid-cols-[1.5fr_1fr]"><section className={panelClass}><SectionTitle title="Your profile" /><ProfileForm user={user} /></section><aside className="rounded-[22px] bg-ink p-6 text-white sm:p-7"><Icon className="mb-5 h-6 w-6 text-accent" name="shield" /><h2 className="text-lg font-medium tracking-tight">Personal, not public.</h2><p className="mt-3 text-xs leading-6 text-white/60">These details belong to your client account. Editing your profile does not change the public website or grant administration access.</p><div className="mt-6 border-t border-white/15 pt-5"><p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/45">Signed in as</p><p className="mt-2 break-all text-sm">{user.email}</p></div></aside></div></>;
}
