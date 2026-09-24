"use client";

import { useActionState, useState } from "react";
import { createProjectAction, createRequestAction, saveProfileAction } from "@/app/account/actions";
import { Icon } from "@/components/dashboard/icon";
import type { ActionState } from "@/lib/account/types";
import { actionClass, inputClass } from "./account-ui";

const initialState: ActionState = { status: "idle", message: "" };

function FormFeedback({ state, id }: { state: ActionState; id: string }) {
  return <div aria-live="polite" aria-atomic="true" id={id}>{state.message ? <p className="mt-4 flex items-start gap-2 rounded-xl border border-[var(--line)] bg-background p-3 text-xs leading-5"><Icon className="mt-0.5 h-4 w-4 shrink-0" name={state.status === "success" ? "check" : "help"} /><span>{state.message}</span></p> : null}</div>;
}

export function NewProjectForm() {
  const [name, setName] = useState("");
  const [state, formAction, pending] = useActionState(async (previous: ActionState, data: FormData) => {
    const result = await createProjectAction(previous, data);
    if (result.status === "success") setName("");
    return result;
  }, initialState);

  return <form action={formAction} aria-describedby="project-feedback"><label className="block text-xs font-medium" htmlFor="project-name">Project name</label><input autoComplete="off" className={inputClass} disabled={pending} id="project-name" maxLength={100} minLength={2} name="name" onChange={(event) => setName(event.target.value)} placeholder="e.g. My new website" required value={name} /><p className="mt-3 text-[11px] leading-5 text-[var(--muted)]">Creates a private draft in your account. It does not place an order, purchase a service or publish a website.</p><button className={`${actionClass} mt-5 w-full`} disabled={pending} type="submit"><Icon className="h-4 w-4" name="plus" />{pending ? "Creating…" : "Create project draft"}</button><FormFeedback id="project-feedback" state={state} /></form>;
}

export function NewRequestForm() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [state, formAction, pending] = useActionState(async (previous: ActionState, data: FormData) => {
    const result = await createRequestAction(previous, data);
    if (result.status === "success") { setSubject(""); setMessage(""); }
    return result;
  }, initialState);

  return <form action={formAction} aria-describedby="request-feedback"><fieldset className="space-y-5" disabled={pending}><div><label className="block text-xs font-medium" htmlFor="request-subject">Subject</label><input className={inputClass} id="request-subject" maxLength={160} minLength={3} name="subject" onChange={(event) => setSubject(event.target.value)} placeholder="What would you like to discuss?" required value={subject} /></div><div><label className="block text-xs font-medium" htmlFor="request-message">Your request</label><textarea aria-describedby="request-message-help" className={`${inputClass} min-h-44 resize-y`} id="request-message" maxLength={3000} minLength={20} name="message" onChange={(event) => setMessage(event.target.value)} placeholder="Tell us about your project, your question or the support you need." required rows={7} value={message} /><div className="mt-2 flex justify-between gap-3 text-[10px] text-[var(--muted)]" id="request-message-help"><span>At least 20 characters. Do not include passwords.</span><span className="shrink-0">{message.length}/3000</span></div></div><button className={`${actionClass} w-full`} disabled={pending} type="submit"><Icon className="h-4 w-4" name="arrow-right" />{pending ? "Saving…" : "Submit request"}</button></fieldset><FormFeedback id="request-feedback" state={state} /><p className="mt-4 text-[11px] leading-5 text-[var(--muted)]">Your request is saved to your client space for the Ennearock team. This is not a live chat.</p></form>;
}

type ProfileFields = { fullName: string | null; company: string | null; website: string | null; email: string };

export function ProfileForm({ user }: { user: ProfileFields }) {
  const [fields, setFields] = useState({ fullName: user.fullName ?? "", company: user.company ?? "", website: user.website ?? "" });
  const [state, formAction, pending] = useActionState(saveProfileAction, initialState);

  return <form action={formAction} aria-describedby="profile-feedback"><fieldset className="space-y-5" disabled={pending}><div><label className="block text-xs font-medium" htmlFor="profile-name">Full name</label><input autoComplete="name" className={inputClass} id="profile-name" maxLength={80} minLength={2} name="fullName" onChange={(event) => setFields({ ...fields, fullName: event.target.value })} required value={fields.fullName} /></div><div><label className="block text-xs font-medium" htmlFor="profile-email">Email address</label><input aria-describedby="profile-email-help" autoComplete="email" className={`${inputClass} cursor-not-allowed opacity-70`} id="profile-email" readOnly type="email" value={user.email} /><p className="mt-2 text-[11px] leading-5 text-[var(--muted)]" id="profile-email-help">This is your sign-in email and cannot be changed here.</p></div><div className="grid gap-5 sm:grid-cols-2"><div><label className="block text-xs font-medium" htmlFor="profile-company">Company <span className="font-normal text-[var(--muted)]">(optional)</span></label><input autoComplete="organization" className={inputClass} id="profile-company" maxLength={120} name="company" onChange={(event) => setFields({ ...fields, company: event.target.value })} value={fields.company} /></div><div><label className="block text-xs font-medium" htmlFor="profile-website">Website <span className="font-normal text-[var(--muted)]">(optional)</span></label><input autoComplete="url" className={inputClass} id="profile-website" maxLength={500} name="website" onChange={(event) => setFields({ ...fields, website: event.target.value })} pattern="https?://.+" placeholder="https://example.com" type="url" value={fields.website} /></div></div><button className={actionClass} disabled={pending} type="submit">{pending ? "Saving…" : "Save profile"}<Icon className="h-4 w-4" name="check" /></button></fieldset><FormFeedback id="profile-feedback" state={state} /></form>;
}
