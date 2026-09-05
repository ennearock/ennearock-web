"use client";

import { FormEvent, useState } from "react";
import { Icon, type IconName } from "@/components/dashboard/icon";
import { PageHeader } from "@/components/dashboard/page-header";

type Tab = "profile" | "team" | "notifications" | "security";

const tabs: { id: Tab; label: string; icon: IconName }[] = [
  { id: "profile", label: "Profile", icon: "settings" },
  { id: "team", label: "Team", icon: "users" },
  { id: "notifications", label: "Notifications", icon: "bell" },
  { id: "security", label: "Security", icon: "shield" },
];

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={onChange} className={"relative h-6 w-11 rounded-full transition " + (checked ? "bg-[#789646]" : "bg-[#d4d2ca]")}><span className={"absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition " + (checked ? "left-6" : "left-1")} /></button>;
}

const fieldClass = "mt-2 h-11 w-full rounded-[11px] border border-[#d9d6cc] bg-white px-3.5 text-xs outline-none transition placeholder:text-[#aaa9a2] focus:border-[#83985f] focus:ring-4 focus:ring-[#c9f26b]/20";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [saved, setSaved] = useState(false);
  const [members, setMembers] = useState(["Sofia K.", "Julien D.", "Maya R."]);
  const [preferences, setPreferences] = useState({ feedback: true, milestones: true, digest: false, marketing: false });

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  function invite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("invite") || "");
    if (email) setMembers((current) => [...current, email]);
    event.currentTarget.reset();
  }

  return (
    <div className="space-y-7">
      <PageHeader eyebrow="Workspace controls" title="Settings" description="Manage your identity, team access, notifications, and account security." />

      {saved ? <div className="fixed bottom-5 right-5 z-[70] flex items-center gap-2 rounded-[13px] bg-[#11130f] px-4 py-3 text-xs font-medium text-white shadow-2xl" role="status"><span className="grid h-5 w-5 place-items-center rounded-full bg-[#c9f26b] text-[#11130f]"><Icon name="check" className="h-3 w-3" /></span> Changes saved</div> : null}

      <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav className="h-fit rounded-[18px] border border-[#dedbd1] bg-white p-2 lg:sticky lg:top-[90px]" aria-label="Settings sections">
          <div className="flex gap-1 overflow-x-auto lg:block lg:space-y-1">
            {tabs.map((tab) => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={"flex h-10 shrink-0 items-center gap-2.5 rounded-[10px] px-3 text-[11px] font-semibold transition lg:w-full " + (activeTab === tab.id ? "bg-[#11130f] text-white" : "text-[#6f736a] hover:bg-[#f2f0e9] hover:text-[#11130f]")}><Icon name={tab.icon} className="h-4 w-4" />{tab.label}</button>)}
          </div>
        </nav>

        <div>
          {activeTab === "profile" ? (
            <form onSubmit={save} className="overflow-hidden rounded-[22px] border border-[#dedbd1] bg-white">
              <div className="border-b border-[#e8e5dd] p-5 sm:px-7"><h2 className="text-sm font-semibold">Profile & studio</h2><p className="mt-1 text-[10px] text-[#898d84]">These details appear across your client workspace.</p></div>
              <div className="space-y-7 p-5 sm:p-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center"><div className="grid h-20 w-20 place-items-center rounded-[20px] bg-[#dfd8c8] text-lg font-bold">ZM</div><div><div className="flex gap-2"><button type="button" className="h-9 rounded-[10px] bg-[#11130f] px-3.5 text-[10px] font-semibold text-white">Upload photo</button><button type="button" className="h-9 rounded-[10px] border border-[#d9d6cc] px-3.5 text-[10px] font-semibold text-[#656960]">Remove</button></div><p className="mt-2 text-[9px] text-[#999c94]">JPG or PNG. Max 2 MB.</p></div></div>
                <div className="grid gap-4 sm:grid-cols-2"><label className="text-[10px] font-semibold text-[#44483f]">First name<input className={fieldClass} defaultValue="Zakaria" required /></label><label className="text-[10px] font-semibold text-[#44483f]">Last name<input className={fieldClass} defaultValue="B." required /></label></div>
                <label className="block text-[10px] font-semibold text-[#44483f]">Work email<input type="email" className={fieldClass} defaultValue="zakaria@ennearock.com" required /></label>
                <div className="grid gap-4 sm:grid-cols-2"><label className="text-[10px] font-semibold text-[#44483f]">Studio name<input className={fieldClass} defaultValue="Ennearock Studio" /></label><label className="text-[10px] font-semibold text-[#44483f]">Role<input className={fieldClass} defaultValue="Founder & Creative Director" /></label></div>
                <label className="block text-[10px] font-semibold text-[#44483f]">Bio<textarea className="mt-2 min-h-28 w-full resize-y rounded-[11px] border border-[#d9d6cc] bg-white p-3.5 text-xs leading-5 outline-none focus:border-[#83985f] focus:ring-4 focus:ring-[#c9f26b]/20" defaultValue="We design and build digital products for ambitious companies." /></label>
              </div>
              <div className="flex justify-end gap-2 border-t border-[#e8e5dd] bg-[#faf9f5] px-5 py-4 sm:px-7"><button type="reset" className="h-10 rounded-[10px] border border-[#d8d5cb] bg-white px-4 text-[10px] font-semibold">Cancel</button><button type="submit" className="h-10 rounded-[10px] bg-[#11130f] px-4 text-[10px] font-semibold text-white">Save changes</button></div>
            </form>
          ) : null}

          {activeTab === "team" ? (
            <section className="overflow-hidden rounded-[22px] border border-[#dedbd1] bg-white">
              <div className="border-b border-[#e8e5dd] p-5 sm:px-7"><h2 className="text-sm font-semibold">Team members</h2><p className="mt-1 text-[10px] text-[#898d84]">{members.length + 1} of 8 seats are in use.</p></div>
              <form onSubmit={invite} className="flex flex-col gap-2 border-b border-[#e8e5dd] bg-[#faf9f5] p-5 sm:flex-row sm:px-7"><label className="sr-only" htmlFor="invite-email">Email address</label><input id="invite-email" name="invite" type="email" required placeholder="teammate@studio.com" className="h-10 flex-1 rounded-[10px] border border-[#d9d6cc] bg-white px-3 text-xs outline-none focus:border-[#83985f]" /><button className="h-10 rounded-[10px] bg-[#11130f] px-4 text-[10px] font-semibold text-white">Send invitation</button></form>
              <div className="divide-y divide-[#eeece6]">
                {[["Zakaria B.", "zakaria@ennearock.com", "Owner"], ...members.map((member, index) => [member, member.includes("@") ? member : member.toLowerCase().replace(" ", ".") + "@ennearock.com", index === 0 ? "Admin" : "Member"])].map(([name, email, role], index) => (
                  <div key={email} className="flex items-center gap-3 px-5 py-4 sm:px-7"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#e6e1d5] text-[9px] font-bold">{name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</span><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">{name}</p><p className="mt-1 truncate text-[9px] text-[#8c9087]">{email}</p></div><span className="rounded-full bg-[#f0eee8] px-2.5 py-1 font-mono text-[8px] text-[#666a61]">{role}</span>{index > 0 ? <button onClick={() => setMembers((current) => current.filter((member) => !email.startsWith(member.toLowerCase().replace(" ", ".")) && member !== email))} className="grid h-8 w-8 place-items-center rounded-lg text-[#a0a39b] hover:bg-[#fae9e5] hover:text-[#a64d3c]" aria-label={"Remove " + name}><Icon name="trash" className="h-3.5 w-3.5" /></button> : <span className="w-8" />}</div>
                ))}
              </div>
            </section>
          ) : null}

          {activeTab === "notifications" ? (
            <form onSubmit={save} className="overflow-hidden rounded-[22px] border border-[#dedbd1] bg-white">
              <div className="border-b border-[#e8e5dd] p-5 sm:px-7"><h2 className="text-sm font-semibold">Notification preferences</h2><p className="mt-1 text-[10px] text-[#898d84]">Choose what deserves your attention.</p></div>
              <div className="divide-y divide-[#eeece6] px-5 sm:px-7">
                {[
                  ["feedback", "Client feedback", "When a client comments or requests a change."],
                  ["milestones", "Milestone decisions", "Approvals, delays, and completed deliverables."],
                  ["digest", "Weekly studio digest", "A Monday summary of revenue, capacity, and delivery."],
                  ["marketing", "Product updates", "New Ennearock templates, features, and events."],
                ].map(([key, label, note]) => {
                  const setting = key as keyof typeof preferences;
                  return <div key={key} className="flex items-center justify-between gap-5 py-5"><div><p className="text-xs font-semibold">{label}</p><p className="mt-1 text-[10px] leading-5 text-[#858980]">{note}</p></div><Toggle checked={preferences[setting]} onChange={() => setPreferences((current) => ({ ...current, [setting]: !current[setting] }))} label={"Toggle " + label} /></div>;
                })}
              </div>
              <div className="flex justify-end border-t border-[#e8e5dd] bg-[#faf9f5] px-5 py-4 sm:px-7"><button className="h-10 rounded-[10px] bg-[#11130f] px-4 text-[10px] font-semibold text-white">Save preferences</button></div>
            </form>
          ) : null}

          {activeTab === "security" ? (
            <div className="space-y-4">
              <form onSubmit={save} className="overflow-hidden rounded-[22px] border border-[#dedbd1] bg-white">
                <div className="border-b border-[#e8e5dd] p-5 sm:px-7"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-[12px] bg-[#edf5db] text-[#5d773e]"><Icon name="lock" className="h-[18px] w-[18px]" /></span><div><h2 className="text-sm font-semibold">Password</h2><p className="mt-1 text-[10px] text-[#898d84]">Last updated 94 days ago.</p></div></div></div>
                <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-7"><label className="text-[10px] font-semibold text-[#44483f]">Current password<input type="password" minLength={8} required className={fieldClass} /></label><span className="hidden sm:block" /><label className="text-[10px] font-semibold text-[#44483f]">New password<input type="password" minLength={8} required className={fieldClass} /></label><label className="text-[10px] font-semibold text-[#44483f]">Confirm password<input type="password" minLength={8} required className={fieldClass} /></label></div>
                <div className="flex justify-end border-t border-[#e8e5dd] bg-[#faf9f5] px-5 py-4 sm:px-7"><button className="h-10 rounded-[10px] bg-[#11130f] px-4 text-[10px] font-semibold text-white">Update password</button></div>
              </form>
              <section className="rounded-[22px] border border-[#dedbd1] bg-white p-5 sm:p-7"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-2"><h2 className="text-sm font-semibold">Two-factor authentication</h2><span className="rounded-full bg-[#fff0c7] px-2 py-1 font-mono text-[7px] uppercase tracking-[0.1em] text-[#795a1c]">Recommended</span></div><p className="mt-2 text-[10px] leading-5 text-[#858980]">Add an extra layer of security with an authenticator app.</p></div><button className="h-10 shrink-0 rounded-[10px] border border-[#d4d1c7] bg-white px-4 text-[10px] font-semibold">Set up 2FA</button></div></section>
              <section className="rounded-[22px] border border-[#e8c7c0] bg-[#fffaf8] p-5 sm:p-7"><h2 className="text-sm font-semibold text-[#7b3329]">Danger zone</h2><div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-lg text-[10px] leading-5 text-[#8c625b]">Deleting this workspace permanently removes projects, templates, invoices, and team access.</p><button className="h-10 shrink-0 rounded-[10px] border border-[#d99f93] px-4 text-[10px] font-semibold text-[#93493b] hover:bg-[#f8e5e1]">Delete workspace</button></div></section>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
