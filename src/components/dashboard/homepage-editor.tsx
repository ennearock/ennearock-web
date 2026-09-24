"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { saveHomepageAction } from "@/app/dashboard/actions";
import { BrandLockup } from "@/components/logo";
import type {
  PricingPlan,
  ProcessItem,
  ServiceItem,
  SiteContent,
} from "@/lib/content";
import { initialActionState, type ActionState } from "./admin-types";
import {
  EditorCard,
  Field,
  inputClassName,
  MetricListEditor,
  SetupNotice,
  StringListEditor,
  Toggle,
  useUnsavedChangesWarning,
} from "./editor-fields";
import { Icon } from "./icon";

type HomepageTab = "hero" | "sections" | "trust" | "pricing" | "cta";

const tabs: { id: HomepageTab; label: string; description: string; icon: "sparkles" | "templates" | "users" | "card" | "arrow-right" }[] = [
  { id: "hero", label: "Hero", description: "Announcement and opening", icon: "sparkles" },
  { id: "sections", label: "Sections", description: "Services, work, and process", icon: "templates" },
  { id: "trust", label: "Proof", description: "Metrics and testimonial", icon: "users" },
  { id: "pricing", label: "Pricing", description: "Offers and features", icon: "card" },
  { id: "cta", label: "Final CTA", description: "Closing invitation", icon: "arrow-right" },
];

type EditableSectionIntro = {
  eyebrow: string;
  title: string;
  accentTitle: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
};

function SectionIntroFields({
  value,
  onChange,
  includeLink = false,
}: {
  value: EditableSectionIntro;
  onChange: (value: EditableSectionIntro) => void;
  includeLink?: boolean;
}) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Eyebrow"><input className={inputClassName} maxLength={120} onChange={(event) => onChange({ ...value, eyebrow: event.target.value })} value={value.eyebrow} /></Field>
        <Field label="Regular heading"><input className={inputClassName} maxLength={180} onChange={(event) => onChange({ ...value, title: event.target.value })} value={value.title} /></Field>
      </div>
      <Field label="Serif accent heading"><input className={inputClassName} maxLength={180} onChange={(event) => onChange({ ...value, accentTitle: event.target.value })} value={value.accentTitle} /></Field>
      <Field label="Description"><textarea className={inputClassName + " min-h-28 resize-y py-3 leading-5"} maxLength={1000} onChange={(event) => onChange({ ...value, description: event.target.value })} value={value.description} /></Field>
      {includeLink ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Link label"><input className={inputClassName} maxLength={100} onChange={(event) => onChange({ ...value, ctaLabel: event.target.value })} value={value.ctaLabel ?? ""} /></Field>
          <Field label="Link destination"><input className={inputClassName} maxLength={500} onChange={(event) => onChange({ ...value, ctaHref: event.target.value })} value={value.ctaHref ?? ""} /></Field>
        </div>
      ) : null}
    </>
  );
}

function NamedItemsEditor<T extends ServiceItem | ProcessItem>({
  items,
  onChange,
  noun,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  noun: string;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div className="rounded-[14px] border border-[#e0ddd4] bg-[#faf9f5] p-4" key={index}>
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#858980]">{noun} {String(index + 1).padStart(2, "0")}</span>
            <button aria-label={"Remove " + noun + " " + (index + 1)} className="grid h-7 w-7 place-items-center rounded-[8px] text-[#9a7168] hover:bg-[#fae9e5] disabled:opacity-35" disabled={items.length === 1} onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))} type="button"><Icon className="h-3.5 w-3.5" name="trash" /></button>
          </div>
          <div className="grid gap-3 sm:grid-cols-[.75fr_1.25fr]">
            <input aria-label={noun + " title"} className="h-10 rounded-[10px] border border-[#d9d6cc] bg-white px-3 text-xs font-semibold outline-none focus:border-[#83985f]" maxLength={120} onChange={(event) => {
              const next = [...items];
              next[index] = { ...item, title: event.target.value };
              onChange(next);
            }} placeholder="Title" value={item.title} />
            <textarea aria-label={noun + " description"} className="min-h-20 resize-y rounded-[10px] border border-[#d9d6cc] bg-white px-3 py-2.5 text-xs leading-5 outline-none focus:border-[#83985f]" maxLength={500} onChange={(event) => {
              const next = [...items];
              next[index] = { ...item, description: event.target.value };
              onChange(next);
            }} placeholder="Description" value={item.description} />
          </div>
        </div>
      ))}
      <button className="inline-flex h-9 items-center gap-2 rounded-[10px] border border-dashed border-[#c7c4b9] px-3 text-[9px] font-semibold text-[#687752] hover:bg-[#f6f8ef] disabled:opacity-45" disabled={items.length >= 8} onClick={() => onChange([...items, { title: "", description: "" } as T])} type="button"><Icon className="h-3.5 w-3.5" name="plus" /> Add {noun}</button>
    </div>
  );
}

function HomepageMiniPreview({ content }: { content: SiteContent }) {
  return (
    <div className="overflow-hidden rounded-[18px] border border-[#d8d5cb] bg-[#fffefa] shadow-[0_16px_45px_rgba(41,44,37,.08)]">
      {content.announcement.enabled ? (
        <div className="flex h-7 items-center justify-center bg-[#11130f] px-3 text-[6px] text-white">
          <span className="mr-2 rounded-full bg-[#c9f26b] px-1.5 py-0.5 font-bold uppercase text-[#11130f]">{content.announcement.badge}</span>
          <span className="truncate">{content.announcement.text}</span>
        </div>
      ) : null}
      <div className="flex h-10 items-center border-b border-[#dedbd1] px-4">
        <BrandLockup compact name={content.general.brandName} />
        <span className="ml-auto h-4 w-12 rounded-full bg-[#11130f]" />
      </div>
      <div className="relative min-h-[280px] overflow-hidden p-5">
        <span className="font-mono text-[6px] uppercase tracking-[0.13em] text-[#676b63]">{content.hero.eyebrow}</span>
        <h3 className="mt-5 max-w-[80%] text-[27px] font-medium leading-[.88] tracking-[-0.07em]">
          {content.hero.title.split("\n").map((line, index) => <span className="block" key={index}>{line}</span>)}
          <em className="mt-1 block font-serif font-normal text-[#7568f8]">{content.hero.accentTitle}</em>
        </h3>
        <p className="mt-4 max-w-[72%] text-[7px] leading-3 text-[#676b63]">{content.hero.description}</p>
        <span className="mt-5 inline-flex h-6 items-center rounded-full bg-[#c9f26b] px-3 text-[6px] font-bold">{content.hero.primaryCtaLabel}</span>
        <div className="absolute -bottom-12 -right-16 h-52 w-52 rounded-full border-[38px]" style={{ borderColor: content.hero.previewAccent + "55" }} />
        <div className="absolute bottom-5 right-5 h-28 w-28 rotate-[-4deg] rounded-[10px] border border-black/10 bg-white p-3 shadow-lg">
          <span className="block h-1.5 w-12 rounded-full bg-[#11130f]/20" />
          <span className="mt-4 block h-3 w-16 rounded bg-[#c9f26b]" />
          <span className="mt-2 block h-1 w-full rounded bg-[#11130f]/10" />
          <span className="mt-2 block h-8 w-full rounded bg-[#f0eee8]" />
        </div>
      </div>
    </div>
  );
}

export function HomepageEditor({
  initialContent,
  setupMessage,
  updatedAt,
}: {
  initialContent: SiteContent;
  setupMessage?: string | null;
  updatedAt?: string | null;
}) {
  const [content, setContent] = useState(initialContent);
  const [activeTab, setActiveTab] = useState<HomepageTab>("hero");
  const [dirty, setDirty] = useState(false);
  const [state, formAction, pending] = useActionState(
    async (previousState: ActionState, formData: FormData) => {
      const result = await saveHomepageAction(previousState, formData);
      if (result.status === "success") setDirty(false);
      return result;
    },
    initialActionState,
  );

  function update<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setContent((current) => ({ ...current, [key]: value }));
    setDirty(true);
  }

  useUnsavedChangesWarning(dirty);

  const completedSections = useMemo(() => {
    const values = [content.hero.title, content.services.title, content.portfolio.title, content.process.title, content.testimonial.quote, content.pricing.title, content.cta.title];
    return values.filter((value) => value.trim()).length;
  }, [content]);

  return (
    <form action={formAction} aria-busy={pending}>
      <input name="payload" type="hidden" value={JSON.stringify(content)} />
      <fieldset className="contents" disabled={pending}>
      <SetupNotice message={setupMessage} />

      <div className="mt-5 grid gap-5 xl:grid-cols-[220px_minmax(0,1fr)_300px]">
        <nav aria-label="Homepage editor sections" className="h-fit rounded-[18px] border border-[#dedbd1] bg-white p-2 xl:sticky xl:top-[90px]">
          <div className="flex gap-1 overflow-x-auto xl:block xl:space-y-1">
            {tabs.map((tab) => (
              <button className={"flex min-h-11 shrink-0 items-center gap-2.5 rounded-[11px] px-3 text-left text-[10px] font-semibold transition xl:w-full " + (activeTab === tab.id ? "bg-[#11130f] text-white" : "text-[#6f736a] hover:bg-[#f2f0e9] hover:text-[#11130f]")} key={tab.id} onClick={() => setActiveTab(tab.id)} type="button">
                <Icon className="h-4 w-4 shrink-0" name={tab.icon} />
                <span><span className="block">{tab.label}</span><span className={"mt-0.5 hidden text-[8px] font-normal xl:block " + (activeTab === tab.id ? "text-white/42" : "text-[#aaa9a2]")}>{tab.description}</span></span>
              </button>
            ))}
          </div>
        </nav>

        <div className="min-w-0 space-y-5">
          {activeTab === "hero" ? (
            <>
              <EditorCard description="A compact message above the navigation. Disable it when there is no timely update." title="Announcement bar" aside={<Toggle checked={content.announcement.enabled} label="Show bar" onChange={(enabled) => update("announcement", { ...content.announcement, enabled })} />}>
                <div className="grid gap-4 sm:grid-cols-[.35fr_1fr]">
                  <Field label="Badge"><input className={inputClassName} maxLength={30} onChange={(event) => update("announcement", { ...content.announcement, badge: event.target.value })} value={content.announcement.badge} /></Field>
                  <Field label="Message"><input className={inputClassName} maxLength={180} onChange={(event) => update("announcement", { ...content.announcement, text: event.target.value })} value={content.announcement.text} /></Field>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Link label"><input className={inputClassName} maxLength={100} onChange={(event) => update("announcement", { ...content.announcement, linkLabel: event.target.value })} value={content.announcement.linkLabel} /></Field>
                  <Field label="Link destination"><input className={inputClassName} maxLength={500} onChange={(event) => update("announcement", { ...content.announcement, linkHref: event.target.value })} value={content.announcement.linkHref} /></Field>
                </div>
              </EditorCard>

              <EditorCard description="The first message visitors see. Line breaks in the two title fields are preserved." title="Hero copy">
                <Field label="Eyebrow"><input className={inputClassName} maxLength={120} onChange={(event) => update("hero", { ...content.hero, eyebrow: event.target.value })} value={content.hero.eyebrow} /></Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Main title"><textarea className={inputClassName + " min-h-24 resize-y py-3 text-lg leading-6"} maxLength={220} onChange={(event) => update("hero", { ...content.hero, title: event.target.value })} value={content.hero.title} /></Field>
                  <Field label="Serif accent title"><textarea className={inputClassName + " min-h-24 resize-y py-3 font-serif text-lg italic leading-6"} maxLength={180} onChange={(event) => update("hero", { ...content.hero, accentTitle: event.target.value })} value={content.hero.accentTitle} /></Field>
                </div>
                <Field label="Description" hint={content.hero.description.length + "/1,000"}><textarea className={inputClassName + " min-h-28 resize-y py-3 leading-5"} maxLength={1000} onChange={(event) => update("hero", { ...content.hero, description: event.target.value })} value={content.hero.description} /></Field>
              </EditorCard>

              <EditorCard description="Keep the primary action focused and use the secondary action for browsing." title="Hero actions">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Primary label"><input className={inputClassName} maxLength={100} onChange={(event) => update("hero", { ...content.hero, primaryCtaLabel: event.target.value })} value={content.hero.primaryCtaLabel} /></Field>
                  <Field label="Primary destination"><input className={inputClassName} maxLength={500} onChange={(event) => update("hero", { ...content.hero, primaryCtaHref: event.target.value })} value={content.hero.primaryCtaHref} /></Field>
                  <Field label="Secondary label"><input className={inputClassName} maxLength={100} onChange={(event) => update("hero", { ...content.hero, secondaryCtaLabel: event.target.value })} value={content.hero.secondaryCtaLabel} /></Field>
                  <Field label="Secondary destination"><input className={inputClassName} maxLength={500} onChange={(event) => update("hero", { ...content.hero, secondaryCtaHref: event.target.value })} value={content.hero.secondaryCtaHref} /></Field>
                </div>
              </EditorCard>

              <EditorCard description="Small details around the product preview build confidence without competing with the headline." title="Hero proof & preview">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Field label="Proof value"><input className={inputClassName} maxLength={30} onChange={(event) => update("hero", { ...content.hero, proofValue: event.target.value })} value={content.hero.proofValue} /></Field>
                  <Field label="Proof text"><input className={inputClassName} maxLength={120} onChange={(event) => update("hero", { ...content.hero, proofText: event.target.value })} value={content.hero.proofText} /></Field>
                  <Field label="Preview name"><input className={inputClassName} maxLength={80} onChange={(event) => update("hero", { ...content.hero, previewTitle: event.target.value })} value={content.hero.previewTitle} /></Field>
                  <Field label="Preview accent"><input className={inputClassName + " font-mono uppercase"} maxLength={7} onChange={(event) => update("hero", { ...content.hero, previewAccent: event.target.value })} pattern="#[0-9A-Fa-f]{6}" value={content.hero.previewAccent} /></Field>
                  <Field label="Status title"><input className={inputClassName} maxLength={100} onChange={(event) => update("hero", { ...content.hero, statusTitle: event.target.value })} value={content.hero.statusTitle} /></Field>
                  <Field label="Status text"><input className={inputClassName} maxLength={120} onChange={(event) => update("hero", { ...content.hero, statusText: event.target.value })} value={content.hero.statusText} /></Field>
                  <Field label="Growth label"><input className={inputClassName} maxLength={100} onChange={(event) => update("hero", { ...content.hero, growthLabel: event.target.value })} value={content.hero.growthLabel} /></Field>
                  <Field label="Growth value"><input className={inputClassName} maxLength={30} onChange={(event) => update("hero", { ...content.hero, growthValue: event.target.value })} value={content.hero.growthValue} /></Field>
                  <Field label="Growth trend"><input className={inputClassName} maxLength={30} onChange={(event) => update("hero", { ...content.hero, growthTrend: event.target.value })} value={content.hero.growthTrend} /></Field>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Avatar initials"><StringListEditor addLabel="Add avatar" maxItems={6} onChange={(avatars) => update("hero", { ...content.hero, avatars })} placeholder="ZM" values={content.hero.avatars} /></Field>
                  <div><Field label="Trust label"><input className={inputClassName} maxLength={120} onChange={(event) => update("hero", { ...content.hero, trustLabel: event.target.value })} value={content.hero.trustLabel} /></Field><div className="mt-4"><Field label="Client names"><StringListEditor addLabel="Add client" maxItems={8} onChange={(clientNames) => update("hero", { ...content.hero, clientNames })} placeholder="northstar" values={content.hero.clientNames} /></Field></div></div>
                </div>
              </EditorCard>
            </>
          ) : null}

          {activeTab === "sections" ? (
            <>
              <EditorCard description="Introduces the launch-ready template collection." title="Templates section"><SectionIntroFields includeLink onChange={(value) => update("templates", value as SiteContent["templates"])} value={content.templates} /></EditorCard>
              <EditorCard description="Explain the studio's capabilities, then keep each service concise." title="Services section">
                <SectionIntroFields onChange={(value) => update("services", { ...content.services, ...value })} value={content.services} />
                <div className="grid gap-4 sm:grid-cols-2"><Field label="Side note"><input className={inputClassName} maxLength={120} onChange={(event) => update("services", { ...content.services, note: event.target.value })} value={content.services.note} /></Field><Field label="Emphasized note"><input className={inputClassName} maxLength={120} onChange={(event) => update("services", { ...content.services, noteEmphasis: event.target.value })} value={content.services.noteEmphasis} /></Field></div>
                <NamedItemsEditor items={content.services.items} noun="service" onChange={(items) => update("services", { ...content.services, items })} />
              </EditorCard>
              <EditorCard description="This heading sits above the projects marked Featured in Portfolio." title="Selected work section"><SectionIntroFields includeLink onChange={(value) => update("portfolio", value as SiteContent["portfolio"])} value={content.portfolio} /></EditorCard>
              <EditorCard description="Keep the working rhythm clear and sequential." title="Process section">
                <SectionIntroFields onChange={(value) => update("process", { ...content.process, ...value })} value={content.process} />
                <NamedItemsEditor items={content.process.items} noun="step" onChange={(items) => update("process", { ...content.process, items })} />
              </EditorCard>
            </>
          ) : null}

          {activeTab === "trust" ? (
            <>
              <EditorCard description="Four compact outcomes shown in the dark strip below the hero." title="Studio metrics"><MetricListEditor onChange={(items) => update("metrics", { items })} values={content.metrics.items} /></EditorCard>
              <EditorCard description="A single, strong client voice works better than a carousel here." title="Client testimonial">
                <Field label="Quote" hint={content.testimonial.quote.length + "/1,200"}><textarea className={inputClassName + " min-h-40 resize-y py-3 font-serif text-base italic leading-6"} maxLength={1200} onChange={(event) => update("testimonial", { ...content.testimonial, quote: event.target.value })} value={content.testimonial.quote} /></Field>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Field label="Person"><input className={inputClassName} maxLength={100} onChange={(event) => update("testimonial", { ...content.testimonial, personName: event.target.value })} value={content.testimonial.personName} /></Field>
                  <Field label="Role & company"><input className={inputClassName} maxLength={140} onChange={(event) => update("testimonial", { ...content.testimonial, personRole: event.target.value })} value={content.testimonial.personRole} /></Field>
                  <Field label="Initials"><input className={inputClassName} maxLength={4} onChange={(event) => update("testimonial", { ...content.testimonial, initials: event.target.value.toUpperCase() })} value={content.testimonial.initials} /></Field>
                  <Field label="Score"><input className={inputClassName} maxLength={12} onChange={(event) => update("testimonial", { ...content.testimonial, score: event.target.value })} value={content.testimonial.score} /></Field>
                  <Field label="Review source"><input className={inputClassName} maxLength={100} onChange={(event) => update("testimonial", { ...content.testimonial, source: event.target.value })} value={content.testimonial.source} /></Field>
                </div>
              </EditorCard>
            </>
          ) : null}

          {activeTab === "pricing" ? (
            <>
              <EditorCard description="Introduce the ways a prospective client can begin." title="Pricing section intro"><SectionIntroFields onChange={(value) => update("pricing", { ...content.pricing, ...value })} value={content.pricing} /></EditorCard>
              <EditorCard description="Edit the three offer cards. Mark one plan as featured to give it the dark treatment." title="Offers">
                <div className="space-y-4">
                  {content.pricing.plans.map((plan, index) => (
                    <div className="rounded-[16px] border border-[#dedbd1] bg-[#faf9f5] p-4 sm:p-5" key={index}>
                      <div className="mb-4 flex items-center justify-between"><span className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#858980]">Offer {String(index + 1).padStart(2, "0")}</span><button aria-label={"Remove offer " + (index + 1)} className="grid h-8 w-8 place-items-center rounded-lg text-[#9a7168] hover:bg-[#fae9e5] disabled:opacity-35" disabled={content.pricing.plans.length === 1} onClick={() => update("pricing", { ...content.pricing, plans: content.pricing.plans.filter((_, itemIndex) => itemIndex !== index) })} type="button"><Icon className="h-3.5 w-3.5" name="trash" /></button></div>
                      <div className="grid gap-4 sm:grid-cols-2"><Field label="Name"><input className={inputClassName} maxLength={100} onChange={(event) => { const plans = [...content.pricing.plans]; plans[index] = { ...plan, name: event.target.value }; update("pricing", { ...content.pricing, plans }); }} value={plan.name} /></Field><Field label="Price"><input className={inputClassName} maxLength={60} onChange={(event) => { const plans = [...content.pricing.plans]; plans[index] = { ...plan, price: event.target.value }; update("pricing", { ...content.pricing, plans }); }} value={plan.price} /></Field><Field label="Suffix"><input className={inputClassName} maxLength={60} onChange={(event) => { const plans = [...content.pricing.plans]; plans[index] = { ...plan, suffix: event.target.value }; update("pricing", { ...content.pricing, plans }); }} value={plan.suffix} /></Field><Field label="Description"><input className={inputClassName} maxLength={240} onChange={(event) => { const plans = [...content.pricing.plans]; plans[index] = { ...plan, description: event.target.value }; update("pricing", { ...content.pricing, plans }); }} value={plan.description} /></Field><Field label="Button label"><input className={inputClassName} maxLength={100} onChange={(event) => { const plans = [...content.pricing.plans]; plans[index] = { ...plan, ctaLabel: event.target.value }; update("pricing", { ...content.pricing, plans }); }} value={plan.ctaLabel} /></Field><Field label="Button destination"><input className={inputClassName} maxLength={500} onChange={(event) => { const plans = [...content.pricing.plans]; plans[index] = { ...plan, ctaHref: event.target.value }; update("pricing", { ...content.pricing, plans }); }} value={plan.ctaHref} /></Field></div>
                      <div className="mt-4"><Field label="Features"><StringListEditor addLabel="Add feature" maxItems={8} onChange={(features) => { const plans = [...content.pricing.plans]; plans[index] = { ...plan, features }; update("pricing", { ...content.pricing, plans }); }} placeholder="Included deliverable" values={plan.features} /></Field></div>
                      <div className="mt-4"><Toggle checked={plan.featured} description="Use the emphasized card treatment." label="Featured offer" onChange={(featured) => { const plans = content.pricing.plans.map((item, itemIndex) => ({ ...item, featured: itemIndex === index ? featured : featured ? false : item.featured })); update("pricing", { ...content.pricing, plans }); }} /></div>
                    </div>
                  ))}
                </div>
                <button className="inline-flex h-9 items-center gap-2 rounded-[10px] border border-dashed border-[#c7c4b9] px-3 text-[9px] font-semibold text-[#687752] hover:bg-[#f6f8ef] disabled:opacity-45" disabled={content.pricing.plans.length >= 4} onClick={() => update("pricing", { ...content.pricing, plans: [...content.pricing.plans, { name: "New offer", description: "", price: "Let's talk", suffix: "custom scope", features: [""], ctaLabel: "Start a conversation", ctaHref: "/contact", featured: false } as PricingPlan] })} type="button"><Icon className="h-3.5 w-3.5" name="plus" /> Add offer</button>
              </EditorCard>
              <EditorCard title="Pricing note"><div className="grid gap-4 sm:grid-cols-3"><Field label="Prompt"><input className={inputClassName} maxLength={160} onChange={(event) => update("pricing", { ...content.pricing, note: event.target.value })} value={content.pricing.note} /></Field><Field label="Link label"><input className={inputClassName} maxLength={160} onChange={(event) => update("pricing", { ...content.pricing, noteLinkLabel: event.target.value })} value={content.pricing.noteLinkLabel} /></Field><Field label="Link destination"><input className={inputClassName} maxLength={500} onChange={(event) => update("pricing", { ...content.pricing, noteLinkHref: event.target.value })} value={content.pricing.noteLinkHref} /></Field></div></EditorCard>
            </>
          ) : null}

          {activeTab === "cta" ? (
            <EditorCard description="The final invitation before the footer. Keep it direct and specific." title="Closing call to action">
              <div className="grid gap-4 sm:grid-cols-2"><Field label="Eyebrow"><input className={inputClassName} maxLength={120} onChange={(event) => update("cta", { ...content.cta, eyebrow: event.target.value })} value={content.cta.eyebrow} /></Field><Field label="Regular heading"><input className={inputClassName} maxLength={180} onChange={(event) => update("cta", { ...content.cta, title: event.target.value })} value={content.cta.title} /></Field></div>
              <Field label="Serif accent heading"><input className={inputClassName + " font-serif italic"} maxLength={180} onChange={(event) => update("cta", { ...content.cta, accentTitle: event.target.value })} value={content.cta.accentTitle} /></Field>
              <Field label="Description"><textarea className={inputClassName + " min-h-28 resize-y py-3 leading-5"} maxLength={1000} onChange={(event) => update("cta", { ...content.cta, description: event.target.value })} value={content.cta.description} /></Field>
              <div className="grid gap-4 sm:grid-cols-2"><Field label="Button label"><input className={inputClassName} maxLength={100} onChange={(event) => update("cta", { ...content.cta, linkLabel: event.target.value })} value={content.cta.linkLabel} /></Field><Field label="Button destination"><input className={inputClassName} maxLength={500} onChange={(event) => update("cta", { ...content.cta, linkHref: event.target.value })} value={content.cta.linkHref} /></Field></div>
            </EditorCard>
          ) : null}
        </div>

        <aside className="space-y-4 xl:sticky xl:top-[90px] xl:self-start">
          <HomepageMiniPreview content={content} />
          <section className="rounded-[18px] border border-[#dedbd1] bg-white p-5">
            <div className="flex items-center justify-between"><p className="text-xs font-semibold">Homepage health</p><span className="rounded-full bg-[#eef7dc] px-2 py-1 font-mono text-[8px] text-[#4d692d]">{completedSections}/7</span></div>
            <p className="mt-3 text-[9px] leading-5 text-[#858980]">Structured fields preserve the existing responsive layout and visual rhythm.</p>
            <div className="mt-4 border-t border-[#ebe8e0] pt-4"><p className="text-[8px] uppercase tracking-[0.12em] text-[#999c94]">Last database update</p><p className="mt-2 text-[10px] font-medium">{updatedAt ? new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(updatedAt)) : "Using built-in defaults"}</p></div>
            <Link className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-[10px] border border-[#d8d5cb] text-[9px] font-semibold" href="/" target="_blank">Open live homepage <Icon className="h-3.5 w-3.5" name="external" /></Link>
          </section>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#d7d4ca] bg-[#f8f6f0]/95 px-4 py-3 shadow-[0_-12px_40px_rgba(31,34,28,.08)] backdrop-blur-xl lg:left-[276px]">
        <div className="mx-auto flex max-w-[1430px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0"><p className="text-[10px] font-semibold">Homepage {dirty ? "has unsaved changes" : "is up to date"}</p><p aria-live="polite" className={"mt-1 truncate text-[9px] " + (state.status === "error" ? "text-[#9a4f41]" : "text-[#74786f]")}>{pending ? "Publishing homepage…" : state.message || "Changes become visible after publishing."}</p></div>
          <div className="flex gap-2"><Link className="inline-flex h-10 items-center justify-center rounded-[10px] border border-[#d4d1c7] bg-white px-4 text-[10px] font-semibold" href="/" target="_blank">View site</Link><button className="inline-flex h-10 items-center gap-2 rounded-[10px] bg-[#11130f] px-5 text-[10px] font-semibold text-white disabled:cursor-wait disabled:opacity-55" disabled={pending} type="submit"><Icon className="h-3.5 w-3.5" name="arrow-up" /> {pending ? "Publishing…" : "Save & publish"}</button></div>
        </div>
      </div>
      </fieldset>
    </form>
  );
}
