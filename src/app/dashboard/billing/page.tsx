"use client";

import { useState } from "react";
import { Icon } from "@/components/dashboard/icon";
import { PageHeader } from "@/components/dashboard/page-header";

const invoices = [
  { id: "INV-1048", date: "Aug 24, 2026", amount: "€79.00", status: "Paid" },
  { id: "INV-1031", date: "Jul 24, 2026", amount: "€79.00", status: "Paid" },
  { id: "INV-1016", date: "Jun 24, 2026", amount: "€79.00", status: "Paid" },
  { id: "INV-0994", date: "May 24, 2026", amount: "€79.00", status: "Paid" },
];

export default function BillingPage() {
  const [annual, setAnnual] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);
  const [downloaded, setDownloaded] = useState("");

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Workspace finance"
        title="Billing"
        description="Manage your plan, payment method, invoices, and current workspace usage."
        action={<button onClick={() => setPlanOpen(true)} className="inline-flex h-11 items-center gap-2 rounded-[12px] bg-[#11130f] px-4 text-xs font-semibold text-white hover:-translate-y-0.5 hover:bg-[#2a2e25]"><Icon name="sparkles" className="h-4 w-4" /> Change plan</button>}
      />

      <section className="relative overflow-hidden rounded-[24px] bg-[#151813] p-6 text-white sm:p-8">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#c9f26b]/20 blur-[80px]" />
        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2"><span className="rounded-full bg-[#c9f26b] px-2.5 py-1 font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-[#11130f]">Current plan</span><span className="text-[10px] text-white/35">Renews Sep 24, 2026</span></div>
            <h2 className="mt-5 text-[34px] font-semibold tracking-[-0.055em]">Studio Pro</h2>
            <p className="mt-2 max-w-lg text-xs leading-5 text-white/45">Unlimited projects and templates, advanced analytics, custom domains, and priority support for your whole team.</p>
          </div>
          <div className="flex items-end gap-2"><span className="text-[40px] font-semibold tracking-[-0.06em]">€79</span><span className="mb-2 text-xs text-white/40">/ month</span></div>
        </div>
        <div className="relative mt-8 grid gap-3 sm:grid-cols-3">
          {[["Team members", "6 / 8", 75], ["Active projects", "4 / unlimited", 42], ["Storage", "18.4 / 50 GB", 37]].map(([label, value, amount]) => (
            <div key={String(label)} className="rounded-[16px] border border-white/[0.08] bg-white/[0.045] p-4">
              <div className="flex items-center justify-between text-[10px]"><span className="text-white/45">{label}</span><span className="font-mono text-white/75">{value}</span></div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[#c9f26b]" style={{ width: amount + "%" }} /></div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(310px,.75fr)]">
        <section className="rounded-[22px] border border-[#dedbd1] bg-white">
          <div className="flex items-center justify-between border-b border-[#e7e4db] p-5 sm:px-6"><div><h2 className="text-sm font-semibold">Billing history</h2><p className="mt-1 text-[10px] text-[#8a8e85]">Receipts are also sent to your billing email.</p></div><button className="hidden items-center gap-1 text-[10px] font-semibold text-[#64764c] hover:text-[#11130f] sm:flex">Download all <Icon name="download" className="h-3.5 w-3.5" /></button></div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left">
              <thead><tr className="border-b border-[#eeece6] font-mono text-[8px] uppercase tracking-[0.14em] text-[#9a9d95]"><th className="px-6 py-3 font-medium">Invoice</th><th className="px-4 py-3 font-medium">Date</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 text-right font-medium">Amount</th><th className="px-6 py-3" /></tr></thead>
              <tbody>{invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-[#f0eee8] last:border-0 hover:bg-[#faf9f5]">
                  <td className="px-6 py-4 text-xs font-semibold">{invoice.id}</td><td className="px-4 py-4 text-[10px] text-[#74786f]">{invoice.date}</td><td className="px-4 py-4"><span className="rounded-full bg-[#e6f2de] px-2.5 py-1 font-mono text-[8px] font-semibold uppercase tracking-[0.1em] text-[#436837]">{invoice.status}</span></td><td className="px-4 py-4 text-right text-xs font-semibold">{invoice.amount}</td>
                  <td className="px-6 py-4 text-right"><button onClick={() => setDownloaded(invoice.id)} className="inline-flex items-center gap-1.5 text-[9px] font-semibold text-[#687852] hover:text-[#11130f]">{downloaded === invoice.id ? "Ready ✓" : "PDF"}<Icon name="download" className="h-3 w-3" /></button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </section>

        <section className="rounded-[22px] border border-[#dedbd1] bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between"><div><h2 className="text-sm font-semibold">Payment method</h2><p className="mt-1 text-[10px] text-[#8a8e85]">Used for monthly renewals.</p></div><button className="text-[10px] font-semibold text-[#64764c] hover:text-[#11130f]">Edit</button></div>
          <div className="mt-6 rounded-[17px] bg-[#f2f0e9] p-4">
            <div className="flex items-center gap-3"><span className="grid h-10 w-14 place-items-center rounded-[9px] bg-[#11130f] font-mono text-[9px] font-bold text-white">VISA</span><div><p className="text-xs font-semibold">•••• 4242</p><p className="mt-1 text-[9px] text-[#858980]">Expires 08 / 29</p></div><Icon name="check" className="ml-auto h-4 w-4 text-[#709142]" /></div>
          </div>
          <div className="mt-5 border-t border-[#ebe9e2] pt-5"><p className="text-[10px] font-semibold">Billing address</p><p className="mt-2 text-[10px] leading-5 text-[#7f837a]">Ennearock Studio<br />Paris, Île-de-France<br />France</p></div>
        </section>
      </div>

      {planOpen ? (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-black/45 p-4 backdrop-blur-sm">
          <button className="absolute inset-0" onClick={() => setPlanOpen(false)} aria-label="Close plan dialog" />
          <div role="dialog" aria-modal="true" aria-labelledby="plan-title" className="relative w-full max-w-3xl rounded-[24px] bg-[#f7f5ef] p-5 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between"><div><p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-[#71805b]">Workspace plans</p><h2 id="plan-title" className="mt-2 text-2xl font-semibold tracking-[-0.045em]">Choose the room you need</h2></div><button onClick={() => setPlanOpen(false)} className="grid h-9 w-9 place-items-center rounded-xl border border-[#dedbd1] bg-white" aria-label="Close"><Icon name="close" className="h-4 w-4" /></button></div>
            <div className="mt-5 flex w-fit rounded-[11px] bg-[#eae7df] p-1 text-[10px] font-semibold"><button onClick={() => setAnnual(false)} className={"rounded-[8px] px-3 py-2 " + (!annual ? "bg-white shadow-sm" : "text-[#858980]")}>Monthly</button><button onClick={() => setAnnual(true)} className={"rounded-[8px] px-3 py-2 " + (annual ? "bg-white shadow-sm" : "text-[#858980]")}>Yearly <span className="text-[#648044]">−20%</span></button></div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {[["Solo", annual ? "€23" : "€29", "For independent makers", false], ["Studio Pro", annual ? "€63" : "€79", "For collaborative studios", true], ["Scale", annual ? "€127" : "€159", "For multi-team agencies", false]].map(([name, price, note, current]) => (
                <div key={String(name)} className={"rounded-[18px] border p-5 " + (current ? "border-[#90ab58] bg-[#f0f7df]" : "border-[#dddacf] bg-white")}><div className="flex items-center justify-between"><p className="text-sm font-semibold">{name}</p>{current ? <span className="rounded-full bg-[#11130f] px-2 py-1 font-mono text-[7px] uppercase tracking-[0.1em] text-white">Current</span> : null}</div><p className="mt-4 text-3xl font-semibold tracking-[-0.05em]">{price}<span className="text-[10px] font-normal text-[#858980]"> /mo</span></p><p className="mt-2 text-[10px] text-[#7f837a]">{note}</p><button onClick={() => setPlanOpen(false)} className={"mt-6 h-10 w-full rounded-[10px] text-[10px] font-semibold " + (current ? "bg-[#dceabf] text-[#4b612e]" : "bg-[#11130f] text-white")}>{current ? "Your plan" : "Select plan"}</button></div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
