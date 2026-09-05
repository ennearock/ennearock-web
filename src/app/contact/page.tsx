import type { Metadata } from "next";
import Link from "next/link";

import { ContactForm } from "@/components/contact/contact-form";
import { Clock, Globe, Mail } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Container, Eyebrow } from "@/components/ui";
import { getProductBySlug } from "@/data/catalog";

export const metadata: Metadata = {
  title: "Start a project",
  description:
    "Tell Ennearock about your website, web application, or product idea. Get a thoughtful reply from the team within two business days.",
};

type ContactPageProps = {
  searchParams: Promise<{ interest?: string | string[] }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { interest: rawInterest } = await searchParams;
  const interestSlug = Array.isArray(rawInterest) ? rawInterest[0] : rawInterest;
  const interest = interestSlug ? getProductBySlug(interestSlug) : undefined;

  return (
    <>
      <SiteHeader />
      <main className="bg-background">
        <section className="relative overflow-hidden border-b border-[var(--line)] py-20 sm:py-24 lg:py-28">
          <div
            aria-hidden="true"
            className="absolute -right-48 -top-60 size-[600px] rounded-full border border-[#d1cdc1]"
          />
          <div
            aria-hidden="true"
            className="absolute right-8 top-16 size-28 rounded-full bg-lime sm:right-20 sm:size-40"
          />
          <Container className="relative grid gap-12 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
            <div>
              <Eyebrow>Start a conversation</Eyebrow>
              <h1 className="mt-7 max-w-4xl text-[clamp(3.6rem,7.2vw,6.9rem)] font-medium leading-[0.88] tracking-[-0.075em]">
                Bring the idea.
                <br />
                <span className="font-serif font-normal italic">We’ll find the way.</span>
              </h1>
            </div>
            <p className="relative z-10 max-w-lg border-l border-[#bcb8ad] pl-7 text-base leading-7 text-[var(--muted)] lg:mb-2">
              Share the rough version. A senior member of our team will read it,
              ask the useful questions, and come back with a clear next step.
            </p>
          </Container>
        </section>

        <section className="py-16 sm:py-20 lg:py-28">
          <Container className="grid gap-10 lg:grid-cols-[.62fr_1.38fr] lg:gap-16">
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="bg-[var(--forest)] p-7 text-white sm:p-9">
                <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-lime">
                  Direct line
                </p>
                <a
                  className="mt-5 inline-flex items-center gap-3 border-b border-white/30 pb-2 text-lg font-semibold tracking-[-0.025em] transition hover:border-lime hover:text-lime"
                  href="mailto:hello@ennearock.com"
                >
                  hello@ennearock.com <Mail size={17} />
                </a>

                <div className="mt-10 space-y-0 border-y border-white/15">
                  <div className="flex gap-4 border-b border-white/15 py-5">
                    <Clock className="mt-0.5 shrink-0 text-lime" size={19} />
                    <div>
                      <p className="text-xs font-semibold">Reply within two business days</p>
                      <p className="mt-1 text-[10px] leading-5 text-white/55">
                        Usually sooner. Always from a real person.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 py-5">
                    <Globe className="mt-0.5 shrink-0 text-lime" size={19} />
                    <div>
                      <p className="text-xs font-semibold">Paris · Working worldwide</p>
                      <p className="mt-1 text-[10px] leading-5 text-white/55">
                        Remote-friendly collaboration across time zones.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-9">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/45">
                    What happens next
                  </p>
                  <ol className="mt-5 space-y-5">
                    {[
                      ["01", "We review the context"],
                      ["02", "We shape the right first step"],
                      ["03", "We meet for a focused 30 minutes"],
                    ].map(([number, label]) => (
                      <li className="flex items-center gap-4 text-xs" key={number}>
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/25 font-mono text-[8px] text-lime">
                          {number}
                        </span>
                        {label}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <p className="mt-6 px-1 text-xs leading-6 text-[var(--muted)]">
                Looking for a faster foundation? Browse our{" "}
                <Link className="font-semibold text-foreground underline underline-offset-4" href="/templates">
                  production-ready templates
                </Link>
                .
              </p>
            </aside>

            <ContactForm
              interestName={interest?.name}
              interestSlug={interest?.slug}
            />
          </Container>
        </section>

        <section className="border-t border-[var(--line)] bg-[#fffefa] py-14">
          <Container className="grid gap-8 text-center sm:grid-cols-3 sm:text-left">
            {[
              ["Small by design", "You work directly with the people doing the thinking and making."],
              ["Clear from day one", "Scope, rhythm, and decisions stay visible throughout the engagement."],
              ["Built for outcomes", "We connect product choices to the business result they need to create."],
            ].map(([title, description], index) => (
              <article className="sm:border-l sm:border-[var(--line)] sm:pl-6" key={title}>
                <span className="font-mono text-[8px] text-[var(--muted)]">0{index + 1}</span>
                <h2 className="mt-3 text-sm font-semibold">{title}</h2>
                <p className="mt-2 text-xs leading-5 text-[var(--muted)]">{description}</p>
              </article>
            ))}
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
