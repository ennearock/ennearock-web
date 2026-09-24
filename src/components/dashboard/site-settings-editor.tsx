"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { saveGeneralAction } from "@/app/dashboard/actions";
import { BrandLockup } from "@/components/logo";
import type { GeneralContent } from "@/lib/content";
import { initialActionState, type ActionState } from "./admin-types";
import {
  EditorCard,
  Field,
  inputClassName,
  SetupNotice,
  useUnsavedChangesWarning,
} from "./editor-fields";
import { Icon } from "./icon";

export function SiteSettingsEditor({
  initialValue,
  setupMessage,
  updatedAt,
}: {
  initialValue: GeneralContent;
  setupMessage?: string | null;
  updatedAt?: string | null;
}) {
  const [value, setValue] = useState(initialValue);
  const [dirty, setDirty] = useState(false);
  const [state, formAction, pending] = useActionState(
    async (previousState: ActionState, formData: FormData) => {
      const result = await saveGeneralAction(previousState, formData);
      if (result.status === "success") setDirty(false);
      return result;
    },
    initialActionState,
  );

  function update<K extends keyof GeneralContent>(
    key: K,
    nextValue: GeneralContent[K],
  ) {
    setValue((current) => ({ ...current, [key]: nextValue }));
    setDirty(true);
  }

  useUnsavedChangesWarning(dirty);

  return (
    <form action={formAction} aria-busy={pending}>
      <input name="payload" type="hidden" value={JSON.stringify(value)} />
      <fieldset className="contents" disabled={pending}>
      <div className="mt-5">
        <SetupNotice message={setupMessage} />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_310px]">
        <div className="space-y-5">
          <EditorCard
            description="These details appear in the footer and anywhere the studio is introduced."
            title="Brand & contact"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Brand name">
                <input
                  className={inputClassName}
                  maxLength={80}
                  onChange={(event) => update("brandName", event.target.value)}
                  required
                  value={value.brandName}
                />
              </Field>
              <Field label="Contact email">
                <input
                  className={inputClassName}
                  maxLength={254}
                  onChange={(event) => update("contactEmail", event.target.value)}
                  required
                  type="email"
                  value={value.contactEmail}
                />
              </Field>
            </div>
            <Field label="Brand description" hint={value.brandDescription.length + "/1,000"}>
              <textarea
                className={inputClassName + " min-h-28 resize-y py-3 leading-5"}
                maxLength={1000}
                onChange={(event) => update("brandDescription", event.target.value)}
                value={value.brandDescription}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Location">
                <input className={inputClassName} maxLength={160} onChange={(event) => update("location", event.target.value)} value={value.location} />
              </Field>
              <Field label="Copyright line" hint="The year is added automatically">
                <input className={inputClassName} maxLength={180} onChange={(event) => update("copyright", event.target.value)} value={value.copyright} />
              </Field>
            </div>
          </EditorCard>

          <EditorCard
            description="Control the two utility actions on the right side of the main navigation."
            title="Header actions"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Login label"><input className={inputClassName} maxLength={80} onChange={(event) => update("headerLoginLabel", event.target.value)} value={value.headerLoginLabel} /></Field>
              <Field label="Login destination"><input className={inputClassName} maxLength={500} onChange={(event) => update("headerLoginHref", event.target.value)} value={value.headerLoginHref} /></Field>
              <Field label="Primary action label"><input className={inputClassName} maxLength={100} onChange={(event) => update("headerCtaLabel", event.target.value)} value={value.headerCtaLabel} /></Field>
              <Field label="Primary action destination"><input className={inputClassName} maxLength={500} onChange={(event) => update("headerCtaHref", event.target.value)} value={value.headerCtaHref} /></Field>
            </div>
          </EditorCard>

          <EditorCard
            description="Links appear in the Social column of the footer. Use full https URLs."
            title="Social links"
          >
            <div className="space-y-3">
              {value.socials.map((social, index) => (
                <div className="grid grid-cols-[.55fr_1fr_auto] items-center gap-2" key={index}>
                  <input aria-label={"Social link " + (index + 1) + " label"} className="h-10 min-w-0 rounded-[10px] border border-[var(--line)] px-3 text-xs outline-none focus:border-[var(--focus)]" maxLength={80} onChange={(event) => {
                    const socials = [...value.socials];
                    socials[index] = { ...social, label: event.target.value };
                    update("socials", socials);
                  }} placeholder="LinkedIn" value={social.label} />
                  <input aria-label={"Social link " + (index + 1) + " URL"} className="h-10 min-w-0 rounded-[10px] border border-[var(--line)] px-3 text-xs outline-none focus:border-[var(--focus)]" maxLength={500} onChange={(event) => {
                    const socials = [...value.socials];
                    socials[index] = { ...social, href: event.target.value };
                    update("socials", socials);
                  }} placeholder="https://…" type="url" value={social.href} />
                  <button aria-label={"Remove " + social.label} className="grid h-9 w-9 place-items-center rounded-[9px] text-[#9a7168] hover:bg-[#fae9e5] disabled:opacity-35" disabled={value.socials.length === 1} onClick={() => update("socials", value.socials.filter((_, itemIndex) => itemIndex !== index))} type="button"><Icon className="h-3.5 w-3.5" name="trash" /></button>
                </div>
              ))}
            </div>
            <button className="inline-flex h-9 items-center gap-2 rounded-[10px] border border-dashed border-[var(--line)] px-3 text-[9px] font-semibold text-ink hover:bg-surface-muted disabled:opacity-45" disabled={value.socials.length >= 8} onClick={() => update("socials", [...value.socials, { label: "", href: "https://" }])} type="button"><Icon className="h-3.5 w-3.5" name="plus" /> Add social link</button>
          </EditorCard>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-[90px] xl:self-start">
          <section className="overflow-hidden rounded-[18px] border border-[var(--line)] bg-panel p-5 text-white">
            <div className="flex items-center gap-3">
              <BrandLockup inverse name={value.brandName || "ennearock"} />
            </div>
            <p className="mt-7 text-[11px] leading-5 text-white/50">{value.brandDescription || "Your studio description"}</p>
            <a className="mt-5 inline-flex items-center gap-2 border-b border-white/30 pb-1 text-[10px] font-semibold text-accent" href={"mailto:" + value.contactEmail}>{value.contactEmail || "hello@example.com"} <Icon className="h-3.5 w-3.5" name="arrow-right" /></a>
            <div className="mt-7 border-t border-white/10 pt-4"><p className="text-[8px] uppercase tracking-[0.12em] text-white/30">Location</p><p className="mt-2 text-[10px] text-white/70">{value.location || "Working worldwide"}</p></div>
          </section>
          <section className="rounded-[18px] border border-[var(--line)] bg-white p-5">
            <p className="text-xs font-semibold">Global content</p>
            <p className="mt-2 text-[9px] leading-5 text-[var(--muted)]">Updates are shared by the header, footer, and contact touchpoints.</p>
            <div className="mt-4 border-t border-[var(--line)] pt-4"><p className="text-[8px] uppercase tracking-[0.12em] text-[var(--muted)]">Last database update</p><p className="mt-2 text-[10px] font-medium">{updatedAt ? new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(updatedAt)) : "Using built-in defaults"}</p></div>
            <Link className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-[10px] border border-[var(--line)] text-[9px] font-semibold" href="/" target="_blank">Open live site <Icon className="h-3.5 w-3.5" name="external" /></Link>
          </section>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-background/95 px-4 py-3 shadow-[0_-12px_40px_rgba(19,20,24,.08)] backdrop-blur-xl lg:left-[276px]">
        <div className="mx-auto flex max-w-[1430px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="text-[10px] font-semibold">Site settings {dirty ? "have unsaved changes" : "are up to date"}</p><p aria-live="polite" className={"mt-1 truncate text-[9px] " + (state.status === "error" ? "text-[#9a4f41]" : "text-[var(--muted)]")}>{pending ? "Publishing settings…" : state.message || "Published changes are reflected across the website."}</p></div><div className="flex gap-2"><Link className="inline-flex h-10 items-center justify-center rounded-[10px] border border-[var(--line)] bg-white px-4 text-[10px] font-semibold" href="/" target="_blank">View site</Link><button className="inline-flex h-10 items-center gap-2 rounded-[10px] bg-ink px-5 text-[10px] font-semibold text-white disabled:cursor-wait disabled:opacity-55" disabled={pending} type="submit"><Icon className="h-3.5 w-3.5" name="arrow-up" /> {pending ? "Publishing…" : "Save & publish"}</button></div></div>
      </div>
      </fieldset>
    </form>
  );
}
