"use client";

import { useEffect, type ReactNode } from "react";
import { Icon } from "./icon";
import type { PortfolioMetric } from "./admin-types";

export const inputClassName =
  "mt-2 min-h-11 w-full rounded-[11px] border border-[var(--line)] bg-white px-3.5 text-xs text-ink outline-none transition placeholder:text-[var(--muted)] hover:border-[var(--line)] focus:border-[var(--focus)] focus:ring-4 focus:ring-[var(--focus)]/20 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-[var(--muted)]";

export function useUnsavedChangesWarning(dirty: boolean) {
  useEffect(() => {
    function warnBeforeLeaving(event: BeforeUnloadEvent) {
      if (!dirty) return;
      event.preventDefault();
    }

    function confirmClientNavigation(event: MouseEvent) {
      if (
        !dirty ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const element = event.target instanceof Element ? event.target : null;
      const link = element?.closest<HTMLAnchorElement>("a[href]");
      const href = link?.getAttribute("href") ?? "";

      if (
        !link ||
        link.target === "_blank" ||
        link.hasAttribute("download") ||
        href.startsWith("#")
      ) {
        return;
      }

      if (!window.confirm("Discard your unsaved changes?")) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }

    window.addEventListener("beforeunload", warnBeforeLeaving);
    document.addEventListener("click", confirmClientNavigation, true);
    return () => {
      window.removeEventListener("beforeunload", warnBeforeLeaving);
      document.removeEventListener("click", confirmClientNavigation, true);
    };
  }, [dirty]);
}

export function EditorCard({
  children,
  title,
  description,
  aside,
}: {
  children: ReactNode;
  title: string;
  description?: string;
  aside?: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[22px] border border-[var(--line)] bg-white">
      <div className="flex items-start justify-between gap-4 border-b border-[var(--line)] px-5 py-4 sm:px-7 sm:py-5">
        <div>
          <h2 className="text-sm font-semibold tracking-[-0.02em]">{title}</h2>
          {description ? (
            <p className="mt-1 max-w-2xl text-[10px] leading-5 text-[var(--muted)]">
              {description}
            </p>
          ) : null}
        </div>
        {aside}
      </div>
      <div className="space-y-6 p-5 sm:p-7">{children}</div>
    </section>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-[10px] font-semibold text-ink">
      <span className="flex items-end justify-between gap-4">
        <span>{label}</span>
        {hint ? (
          <span className="text-right text-[8px] font-normal text-[var(--muted)]">
            {hint}
          </span>
        ) : null}
      </span>
      {children}
    </label>
  );
}

export function Toggle({
  checked,
  label,
  description,
  onChange,
}: {
  checked: boolean;
  label: string;
  description?: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-5 rounded-[14px] border border-[var(--line)] bg-background px-4 py-3.5">
      <div>
        <p className="text-[11px] font-semibold">{label}</p>
        {description ? (
          <p className="mt-1 text-[9px] leading-4 text-[var(--muted)]">{description}</p>
        ) : null}
      </div>
      <button
        aria-checked={checked}
        aria-label={label}
        className={
          "relative h-6 w-11 shrink-0 rounded-full transition " +
          (checked ? "bg-ink" : "bg-surface-muted")
        }
        onClick={() => onChange(!checked)}
        role="switch"
        type="button"
      >
        <span
          className={
            "absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition " +
            (checked ? "left-6" : "left-1")
          }
        />
      </button>
    </div>
  );
}

export function StringListEditor({
  values,
  onChange,
  addLabel = "Add item",
  placeholder = "Add a concise item",
  maxItems = 12,
  multiline = false,
}: {
  values: string[];
  onChange: (values: string[]) => void;
  addLabel?: string;
  placeholder?: string;
  maxItems?: number;
  multiline?: boolean;
}) {
  const safeValues = values.length ? values : [""];

  return (
    <div className="space-y-2.5">
      {safeValues.map((value, index) => (
        <div className="flex items-center gap-2" key={index}>
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[9px] bg-surface-muted font-mono text-[8px] text-[var(--muted)]">
            {String(index + 1).padStart(2, "0")}
          </span>
          {multiline ? (
            <textarea
              className="min-h-24 min-w-0 flex-1 resize-y rounded-[10px] border border-[var(--line)] bg-white px-3 py-2.5 text-xs leading-5 outline-none focus:border-[var(--focus)] focus:ring-4 focus:ring-[var(--focus)]/20"
              maxLength={2000}
              onChange={(event) => {
                const next = [...safeValues];
                next[index] = event.target.value;
                onChange(next);
              }}
              placeholder={placeholder}
              value={value}
            />
          ) : (
            <input
              className="h-10 min-w-0 flex-1 rounded-[10px] border border-[var(--line)] bg-white px-3 text-xs outline-none focus:border-[var(--focus)] focus:ring-4 focus:ring-[var(--focus)]/20"
              maxLength={180}
              onChange={(event) => {
                const next = [...safeValues];
                next[index] = event.target.value;
                onChange(next);
              }}
              placeholder={placeholder}
              value={value}
            />
          )}
          <button
            aria-label={"Remove item " + (index + 1)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-[9px] text-[#9a7168] hover:bg-[#fae9e5] hover:text-[#8f3f31] disabled:cursor-not-allowed disabled:opacity-35"
            disabled={safeValues.length === 1}
            onClick={() => onChange(safeValues.filter((_, itemIndex) => itemIndex !== index))}
            type="button"
          >
            <Icon className="h-3.5 w-3.5" name="trash" />
          </button>
        </div>
      ))}
      <button
        className="inline-flex h-9 items-center gap-2 rounded-[10px] border border-dashed border-[var(--line)] px-3 text-[9px] font-semibold text-ink hover:border-[var(--focus)] hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-45"
        disabled={safeValues.length >= maxItems}
        onClick={() => onChange([...safeValues, ""])}
        type="button"
      >
        <Icon className="h-3.5 w-3.5" name="plus" /> {addLabel}
      </button>
    </div>
  );
}

export function MetricListEditor({
  values,
  onChange,
}: {
  values: PortfolioMetric[];
  onChange: (values: PortfolioMetric[]) => void;
}) {
  const safeValues = values.length ? values : [{ label: "", value: "" }];

  return (
    <div className="space-y-2.5">
      {safeValues.map((metric, index) => (
        <div className="grid grid-cols-[1fr_.65fr_auto] items-center gap-2" key={index}>
          <input
            aria-label={"Metric " + (index + 1) + " label"}
            className="h-10 min-w-0 rounded-[10px] border border-[var(--line)] px-3 text-xs outline-none focus:border-[var(--focus)]"
            maxLength={60}
            onChange={(event) => {
              const next = [...safeValues];
              next[index] = { ...metric, label: event.target.value };
              onChange(next);
            }}
            placeholder="Conversion"
            value={metric.label}
          />
          <input
            aria-label={"Metric " + (index + 1) + " value"}
            className="h-10 min-w-0 rounded-[10px] border border-[var(--line)] px-3 text-xs font-semibold outline-none focus:border-[var(--focus)]"
            maxLength={24}
            onChange={(event) => {
              const next = [...safeValues];
              next[index] = { ...metric, value: event.target.value };
              onChange(next);
            }}
            placeholder="+31%"
            value={metric.value}
          />
          <button
            aria-label={"Remove metric " + (index + 1)}
            className="grid h-9 w-9 place-items-center rounded-[9px] text-[#9a7168] hover:bg-[#fae9e5] disabled:opacity-35"
            disabled={safeValues.length === 1}
            onClick={() => onChange(safeValues.filter((_, itemIndex) => itemIndex !== index))}
            type="button"
          >
            <Icon className="h-3.5 w-3.5" name="trash" />
          </button>
        </div>
      ))}
      <button
        className="inline-flex h-9 items-center gap-2 rounded-[10px] border border-dashed border-[var(--line)] px-3 text-[9px] font-semibold text-ink hover:bg-surface-muted disabled:opacity-45"
        disabled={safeValues.length >= 4}
        onClick={() => onChange([...safeValues, { label: "", value: "" }])}
        type="button"
      >
        <Icon className="h-3.5 w-3.5" name="plus" /> Add metric
      </button>
    </div>
  );
}

export function SetupNotice({ message }: { message?: string | null }) {
  if (!message) return null;

  return (
    <div className="flex gap-3 rounded-[16px] border border-[#e1c88c] bg-[#fff8e7] px-4 py-3.5 text-[#68572f]" role="status">
      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#f2ddaa]">
        <Icon className="h-3.5 w-3.5" name="database" />
      </span>
      <div>
        <p className="text-[11px] font-semibold">Content storage needs setup</p>
        <p className="mt-1 text-[10px] leading-5">{message}</p>
      </div>
    </div>
  );
}
