"use client";

import { type FormEvent, useState } from "react";

import { ArrowRight, Check, Mail } from "@/components/icons";

type SubmissionState =
  | { status: "idle" | "pending" }
  | { status: "sent"; message: string }
  | { status: "fallback"; mailto: string; message: string }
  | { status: "error"; message: string };

type ContactApiResponse = {
  delivered?: boolean;
  mailto?: string;
  message?: string;
  status?: string;
};

type ContactFormProps = {
  interestName?: string;
  interestSlug?: string;
};

const inputClassName =
  "mt-2 min-h-12 w-full rounded-none border border-[#cbc8bd] bg-[#fffefa] px-4 text-sm text-foreground outline-none transition placeholder:text-[#989990] focus:border-[var(--violet)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--violet)_16%,transparent)]";
const labelClassName = "text-xs font-semibold text-foreground";

export function ContactForm({ interestName, interestSlug }: ContactFormProps) {
  const [submission, setSubmission] = useState<SubmissionState>({ status: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setSubmission({ status: "pending" });

    try {
      const response = await fetch("/api/contact", {
        body: JSON.stringify(Object.fromEntries(formData.entries())),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const result = (await response.json().catch(() => null)) as ContactApiResponse | null;

      if (response.ok && result?.delivered === true) {
        form.reset();
        setSubmission({
          status: "sent",
          message:
            result.message ?? "Your message is on its way. We’ll reply within two business days.",
        });
        return;
      }

      if (
        response.ok &&
        result?.status === "fallback" &&
        typeof result.mailto === "string"
      ) {
        setSubmission({
          status: "fallback",
          mailto: result.mailto,
          message:
            result.message ??
            "Online delivery is not connected right now. You can open a prepared email instead.",
        });
        return;
      }

      setSubmission({
        status: "error",
        message:
          result?.message ??
          "We couldn’t process that message. Check the form and try again.",
      });
    } catch {
      setSubmission({
        status: "error",
        message:
          "We couldn’t reach the server. Please try again or email hello@ennearock.com.",
      });
    }
  }

  const isPending = submission.status === "pending";

  return (
    <div className="bg-white p-6 shadow-[0_24px_70px_rgba(17,20,15,0.08)] sm:p-9 lg:p-12">
      <div className="mb-9 flex items-start justify-between gap-5 border-b border-[var(--line)] pb-7">
        <div>
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Project brief
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
            Tell us what you’re building.
          </h2>
        </div>
        <span className="hidden size-11 shrink-0 items-center justify-center rounded-full bg-lime sm:flex">
          <Mail size={19} />
        </span>
      </div>

      {interestName ? (
        <div className="mb-7 flex items-center gap-3 border border-[#d5d0c4] bg-[#f4f1e8] px-4 py-3 text-xs">
          <span className="size-2 shrink-0 rounded-full bg-[var(--violet)]" />
          Asking about <strong>{interestName}</strong>
        </div>
      ) : null}

      <div aria-atomic="true" aria-live="polite">
        {submission.status === "sent" ? (
          <div className="mb-7 flex gap-4 border border-[#aad1b4] bg-[#edf7ef] p-4" role="status">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#4f9966] text-white">
              <Check size={16} />
            </span>
            <div>
              <p className="text-sm font-semibold">Message delivered</p>
              <p className="mt-1 text-xs leading-5 text-[#47614e]">{submission.message}</p>
            </div>
          </div>
        ) : null}

        {submission.status === "fallback" ? (
          <div className="mb-7 border border-[#d7bd7d] bg-[#fff8e4] p-4" role="status">
            <p className="text-sm font-semibold">One more step</p>
            <p className="mt-1 text-xs leading-5 text-[#6d5d34]">{submission.message}</p>
            <a
              className="mt-3 inline-flex items-center gap-2 border-b border-current pb-0.5 text-xs font-semibold"
              href={submission.mailto}
            >
              Open email to hello@ennearock.com <ArrowRight size={14} />
            </a>
          </div>
        ) : null}

        {submission.status === "error" ? (
          <div className="mb-7 border border-[#dca8a1] bg-[#fff0ed] p-4" role="alert">
            <p className="text-sm font-semibold">Message not sent</p>
            <p className="mt-1 text-xs leading-5 text-[#754c46]">{submission.message}</p>
          </div>
        ) : null}
      </div>

      <form aria-busy={isPending} className="space-y-6" onSubmit={handleSubmit}>
        {interestSlug ? <input name="interest" type="hidden" value={interestSlug} /> : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClassName} htmlFor="contact-name">
              Name <span aria-hidden="true">*</span>
            </label>
            <input
              autoComplete="name"
              className={inputClassName}
              id="contact-name"
              maxLength={80}
              minLength={2}
              name="name"
              placeholder="Your name"
              required
              type="text"
            />
          </div>
          <div>
            <label className={labelClassName} htmlFor="contact-email">
              Work email <span aria-hidden="true">*</span>
            </label>
            <input
              autoComplete="email"
              className={inputClassName}
              id="contact-email"
              maxLength={254}
              name="email"
              placeholder="you@company.com"
              required
              type="email"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClassName} htmlFor="contact-company">
              Company <span className="font-normal text-[var(--muted)]">(optional)</span>
            </label>
            <input
              autoComplete="organization"
              className={inputClassName}
              id="contact-company"
              maxLength={120}
              name="company"
              placeholder="Company or project"
              type="text"
            />
          </div>
          <div>
            <label className={labelClassName} htmlFor="contact-project-type">
              What can we help with? <span aria-hidden="true">*</span>
            </label>
            <select
              className={inputClassName}
              defaultValue={interestSlug ? "template" : ""}
              id="contact-project-type"
              name="projectType"
              required
            >
              <option disabled value="">
                Select a project type
              </option>
              <option value="website">Marketing website</option>
              <option value="web-app">Web application / SaaS</option>
              <option value="template">Template question</option>
              <option value="product-partnership">Product partnership</option>
              <option value="other">Something else</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClassName} htmlFor="contact-budget">
            Approximate budget <span aria-hidden="true">*</span>
          </label>
          <select
            className={inputClassName}
            defaultValue=""
            id="contact-budget"
            name="budget"
            required
          >
            <option disabled value="">
              Select a range
            </option>
            <option value="under-5k">Under €5k</option>
            <option value="5k-10k">€5k–€10k</option>
            <option value="10k-25k">€10k–€25k</option>
            <option value="25k-plus">€25k+</option>
            <option value="not-sure">Not sure yet</option>
          </select>
        </div>

        <div>
          <div className="flex items-end justify-between gap-4">
            <label className={labelClassName} htmlFor="contact-message">
              A little about the project <span aria-hidden="true">*</span>
            </label>
            <span className="text-[10px] text-[var(--muted)]">20–3,000 characters</span>
          </div>
          <textarea
            className={`${inputClassName} min-h-40 resize-y py-3 leading-6`}
            id="contact-message"
            maxLength={3000}
            minLength={20}
            name="message"
            placeholder="What are you making, where are you now, and what would a great outcome look like?"
            required
            rows={7}
          />
        </div>

        <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
          <label htmlFor="contact-website">Leave this field empty</label>
          <input
            autoComplete="off"
            id="contact-website"
            name="website"
            tabIndex={-1}
            type="text"
          />
        </div>

        <div className="flex flex-col gap-4 border-t border-[var(--line)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-sm text-[10px] leading-5 text-[var(--muted)]">
            We use these details only to review and reply to your inquiry. No
            mailing lists, no mystery follow-ups.
          </p>
          <button
            className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-foreground px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--forest)] disabled:cursor-wait disabled:opacity-65 disabled:hover:translate-y-0"
            disabled={isPending}
            type="submit"
          >
            {isPending ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                Sending securely…
              </>
            ) : (
              <>
                Send project brief <ArrowRight size={17} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
