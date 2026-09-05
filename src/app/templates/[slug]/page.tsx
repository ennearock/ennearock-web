import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BrowserPreview } from "@/components/browser-preview";
import { CatalogCard } from "@/components/catalog-card";
import { CtaSection } from "@/components/cta-section";
import { ArrowRight, ArrowUpRight, Check } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button, Container, Pill } from "@/components/ui";
import { getProductBySlug, products } from "@/data/catalog";

type TemplateDetailProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return products
    .filter((product) => product.kind === "template")
    .map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: TemplateDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const template = getProductBySlug(slug);

  if (!template || template.kind !== "template") {
    return { title: "Template not found" };
  }

  return {
    title: template.name,
    description: `${template.tagline} ${template.description}`,
  };
}

export default async function TemplateDetailPage({ params }: TemplateDetailProps) {
  const { slug } = await params;
  const template = getProductBySlug(slug);

  if (!template || template.kind !== "template") notFound();

  const isComingSoon = template.status === "coming-soon";
  const relatedTemplates = products
    .filter(
      (product) =>
        product.kind === "template" &&
        product.id !== template.id &&
        (product.category === template.category || product.featured),
    )
    .slice(0, 3);
  const previewSurface =
    template.theme === "dark"
      ? "bg-[#263029]"
      : template.theme === "warm"
        ? "bg-[#e7d2b7]"
        : "bg-[#d9e1d7]";

  return (
    <>
      <SiteHeader />
      <main>
        <section className="border-b border-[var(--line)] bg-background py-8 sm:py-10">
          <Container>
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[var(--muted)]">
              <Link className="transition hover:text-foreground" href="/templates">
                Templates
              </Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page" className="text-foreground">
                {template.name}
              </span>
            </nav>
          </Container>
        </section>

        <section className="bg-background py-14 sm:py-20 lg:py-24">
          <Container className="grid items-center gap-12 lg:grid-cols-[.78fr_1.22fr] lg:gap-16">
            <div>
              <div className="flex flex-wrap gap-2">
                <Pill>{template.category}</Pill>
                {template.badge ? <Pill tone="lime">{template.badge}</Pill> : null}
              </div>
              <h1 className="mt-7 text-[clamp(3.25rem,6vw,6rem)] font-medium leading-[0.9] tracking-[-0.075em]">
                {template.name}
              </h1>
              <p className="mt-5 max-w-lg font-serif text-2xl italic leading-tight text-[var(--muted)] sm:text-3xl">
                {template.tagline}
              </p>
              <p className="mt-7 max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                {template.description}
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  arrow
                  href={`/contact?interest=${encodeURIComponent(template.slug)}`}
                  variant="lime"
                >
                  {isComingSoon ? "Join the waitlist" : `Get it for ${template.priceLabel}`}
                </Button>
                <Button href="/contact" variant="ghost">
                  Ask a question <ArrowUpRight size={17} />
                </Button>
              </div>
              <p className="mt-4 text-[10px] leading-5 text-[var(--muted)]">
                {isComingSoon
                  ? "We’ll let you know the moment this template is ready."
                  : "One-time purchase · Lifetime updates · Built for Next.js"}
              </p>
            </div>

            <div className={`relative overflow-hidden p-5 sm:p-10 lg:p-12 ${previewSurface}`}>
              <div
                aria-hidden="true"
                className="absolute -right-20 -top-20 size-52 rounded-full border border-white/30"
              />
              <div className="relative translate-y-2">
                <BrowserPreview
                  accent={template.accent}
                  title={template.name}
                  variant={template.category}
                />
              </div>
            </div>
          </Container>
        </section>

        <section className="border-y border-[var(--line)] bg-[#fffefa]">
          <Container className="grid grid-cols-2 sm:grid-cols-4">
            {[
              ...(template.metrics ?? []),
              { label: "Page groups", value: `${template.pages.length}` },
              { label: "License", value: "Lifetime" },
            ]
              .slice(0, 4)
              .map((metric) => (
                <div className="border-r border-[var(--line)] px-4 py-8 first:border-l sm:px-7" key={metric.label}>
                  <strong className="block font-serif text-3xl font-normal tracking-[-0.04em] sm:text-4xl">
                    {metric.value}
                  </strong>
                  <span className="mt-2 block font-mono text-[8px] uppercase tracking-[0.12em] text-[var(--muted)]">
                    {metric.label}
                  </span>
                </div>
              ))}
          </Container>
        </section>

        <section className="bg-[#fffefa] py-20 sm:py-28">
          <Container className="grid gap-14 lg:grid-cols-[.72fr_1.28fr] lg:gap-24">
            <div>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                Inside the template
              </span>
              <h2 className="mt-5 text-4xl font-medium leading-[1.02] tracking-[-0.055em] sm:text-5xl">
                Everything needed to turn direction into momentum.
              </h2>
              <p className="mt-6 max-w-lg text-sm leading-7 text-[var(--muted)]">
                A coherent page system, reusable interface patterns, and the
                essential product states are already considered. Your time goes
                into the details that make the brand yours.
              </p>
            </div>

            <div>
              <div className="grid gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2">
                {template.features.map((feature) => (
                  <div className="flex min-h-32 gap-4 bg-background p-6" key={feature}>
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-lime">
                      <Check size={15} />
                    </span>
                    <p className="pt-1 text-sm font-semibold leading-5">{feature}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 grid gap-10 sm:grid-cols-2">
                <div>
                  <h3 className="border-b border-[var(--line)] pb-3 text-sm font-semibold">
                    Page library
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {template.pages.map((page) => (
                      <li className="flex items-center justify-between text-sm text-[var(--muted)]" key={page}>
                        {page}
                        <ArrowRight size={14} />
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="border-b border-[var(--line)] pb-3 text-sm font-semibold">
                    Technology
                  </h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {template.stack.map((technology) => (
                      <li className="rounded-full border border-[var(--line)] px-3 py-2 font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--muted)]" key={technology}>
                        {technology}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {relatedTemplates.length ? (
          <section className="border-t border-[var(--line)] bg-background py-20 sm:py-28">
            <Container>
              <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                    Keep exploring
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
                    More launch-ready directions.
                  </h2>
                </div>
                <Link className="flex items-center gap-2 text-sm font-semibold" href="/templates">
                  View all templates <ArrowUpRight size={17} />
                </Link>
              </div>
              <div className="catalog-grid">
                {relatedTemplates.map((product) => (
                  <CatalogCard key={product.id} product={product} />
                ))}
                <span aria-hidden="true" className="hidden" />
              </div>
            </Container>
          </section>
        ) : null}

        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
