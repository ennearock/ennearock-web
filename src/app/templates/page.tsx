import type { Metadata } from "next";

import { TemplateExplorer } from "@/components/catalog/template-explorer";
import { CtaSection } from "@/components/cta-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Container, Eyebrow } from "@/components/ui";
import { products } from "@/data/catalog";

export const metadata: Metadata = {
  title: "Website templates",
  description:
    "Browse production-ready SaaS, commerce, portfolio, AI, healthcare, and fintech templates by Ennearock.",
};

const templates = products.filter((product) => product.kind === "template");

export default function TemplatesPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden border-b border-[var(--line)] bg-background py-20 sm:py-24 lg:py-32">
          <div
            aria-hidden="true"
            className="absolute -right-28 -top-40 size-[430px] rounded-full border border-[#d6d1c5] sm:size-[560px]"
          />
          <div
            aria-hidden="true"
            className="absolute -right-7 -top-10 size-52 rounded-full bg-lime/70 blur-[1px] sm:size-72"
          />
          <Container className="relative grid items-end gap-12 lg:grid-cols-[1.25fr_.75fr]">
            <div>
              <Eyebrow>Launch-ready foundations</Eyebrow>
              <h1 className="mt-7 max-w-4xl text-[clamp(3.4rem,7.4vw,7rem)] font-medium leading-[0.88] tracking-[-0.075em]">
                Skip the blank page.
                <br />
                <span className="font-serif font-normal italic">
                  Keep the ambition.
                </span>
              </h1>
            </div>
            <div className="relative z-10 border-l border-[#bdb9ae] pl-6 lg:mb-2 lg:pl-9">
              <p className="max-w-md text-base leading-7 text-[var(--muted)]">
                Thoughtful design systems, real product flows, and clean code.
                Choose a strong direction, make it yours, and move from idea to
                launch in days.
              </p>
              <dl className="mt-8 grid max-w-md grid-cols-3 border-t border-[#bbb8ae] pt-5">
                <div>
                  <dt className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--muted)]">
                    Templates
                  </dt>
                  <dd className="mt-1 font-serif text-3xl">{templates.length}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--muted)]">
                    Starting at
                  </dt>
                  <dd className="mt-1 font-serif text-3xl">€89</dd>
                </div>
                <div>
                  <dt className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--muted)]">
                    Updates
                  </dt>
                  <dd className="mt-2 text-sm font-semibold">Included</dd>
                </div>
              </dl>
            </div>
          </Container>
        </section>

        <TemplateExplorer templates={templates} />

        <section className="bg-[var(--forest)] py-20 text-white sm:py-24">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
              <div>
                <Eyebrow light>What comes standard</Eyebrow>
                <h2 className="mt-6 max-w-md text-4xl font-medium leading-[1.02] tracking-[-0.055em] sm:text-5xl">
                  A real foundation,
                  <br />
                  <span className="font-serif font-normal italic">
                    not a screenshot pack.
                  </span>
                </h2>
              </div>
              <div className="grid gap-px overflow-hidden border border-white/15 bg-white/15 sm:grid-cols-2">
                {[
                  ["01", "Responsive by default", "Every screen is composed for desktop, tablet, and mobile from the start."],
                  ["02", "Built for adaptation", "Tokens, components, and sensible structure make the visual system easy to own."],
                  ["03", "Accessible interactions", "Keyboard navigation, focus states, and readable UI states are part of the build."],
                  ["04", "A clean handoff", "Documentation and organized source help you launch without reverse engineering."],
                ].map(([number, title, description]) => (
                  <article className="bg-[var(--forest)] p-7 sm:p-8" key={number}>
                    <span className="font-mono text-[9px] text-lime">{number}</span>
                    <h3 className="mt-9 text-lg font-semibold tracking-[-0.035em]">
                      {title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-white/60">
                      {description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </Container>
        </section>

        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
