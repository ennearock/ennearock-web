/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { ComponentType } from "react";
import { BrowserPreview } from "@/components/browser-preview";
import { CatalogCard } from "@/components/catalog-card";
import { CtaSection } from "@/components/cta-section";
import { ArrowRight, ArrowUpRight, Chart, Check, Code, Layers, Sparkles, Star, Zap } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button, Container, Eyebrow, SectionHeading } from "@/components/ui";
import { getPublishedProducts, getSiteContent } from "@/lib/content/queries";

const servicePresentation: {
  icon: ComponentType<{ size?: number }>;
  className: string;
}[] = [
  { icon: Sparkles, className: "service-strategy" },
  { icon: Layers, className: "service-design" },
  { icon: Code, className: "service-dev" },
  { icon: Chart, className: "service-growth" },
];

function Lines({ text }: { text: string }) {
  return text.split("\n").map((line, index) => <span key={`${line}-${index}`}>{index > 0 ? <br /> : null}{line}</span>);
}

function SectionTitle({ title, accent }: { title: string; accent: string }) {
  return <><Lines text={title} /><br /><em><Lines text={accent} /></em></>;
}

function Price({ value }: { value: string }) {
  return value.startsWith("From ") ? <>From <strong>{value.slice(5)}</strong></> : <strong>{value}</strong>;
}

export default async function Home() {
  const [content, products] = await Promise.all([getSiteContent(), getPublishedProducts()]);
  const selectedTemplates = products.filter((item) => item.kind === "template" && item.featured).slice(0, 3);
  const caseStudies = products
    .filter((item) => item.kind === "project" && item.featured)
    .slice(0, 2);

  return <>
    {content.announcement.enabled ? <div className="announcement"><p><span>{content.announcement.badge}</span> {content.announcement.text}</p><Link href={content.announcement.linkHref}>{content.announcement.linkLabel} <ArrowRight size={15} /></Link></div> : null}
    <SiteHeader />
    <main>
      <section className="hero-section"><Container className="hero-grid">
        <div className="hero-copy"><Eyebrow>{content.hero.eyebrow}</Eyebrow><h1><Lines text={content.hero.title} /><br /><em><Lines text={content.hero.accentTitle} /></em></h1><p>{content.hero.description}</p><div className="hero-actions"><Button arrow href={content.hero.primaryCtaHref} variant="accent">{content.hero.primaryCtaLabel}</Button><Button href={content.hero.secondaryCtaHref} variant="ghost">{content.hero.secondaryCtaLabel} <ArrowUpRight size={17} /></Button></div><div className="hero-proof"><div className="avatar-stack">{content.hero.avatars.map((avatar, index) => <span key={`${avatar}-${index}`}>{avatar}</span>)}</div><p><strong>{content.hero.proofValue}</strong><br />{content.hero.proofText}</p></div></div>
        <div className="hero-stage"><div className="hero-stage-grid" /><div className="hero-preview-main"><BrowserPreview accent={content.hero.previewAccent} title={content.hero.previewTitle} variant="dashboard" /></div><div className="hero-float hero-float-status"><span className="pulse-dot" /><div><strong>{content.hero.statusTitle}</strong><small>{content.hero.statusText}</small></div><Check size={17} /></div><div className="hero-float hero-float-growth"><span><Chart size={18} /></span><div><small>{content.hero.growthLabel}</small><strong>{content.hero.growthValue}</strong></div><i>{content.hero.growthTrend}</i></div><div className="hero-stamp"><span>Strategy · Design · Code ·</span><Sparkles size={22} /></div></div>
      </Container><Container className="hero-bottom"><p>{content.hero.trustLabel}</p><div className="logo-cloud">{content.hero.clientNames.map((name, index) => <span className={index === 1 || index === 4 ? "logo-serif" : index === 3 ? "logo-wide" : undefined} key={`${name}-${index}`}>{name}</span>)}</div></Container></section>

      <section className="metrics-strip"><Container>{content.metrics.items.map((metric, index) => <div key={`${metric.label}-${index}`}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</Container></section>

      <section className="section templates-section"><Container><div className="section-topline"><SectionHeading eyebrow={content.templates.eyebrow} title={<SectionTitle title={content.templates.title} accent={content.templates.accentTitle} />} text={content.templates.description} /><Button href={content.templates.ctaHref} variant="outline">{content.templates.ctaLabel} <ArrowUpRight size={17} /></Button></div><div className="catalog-grid">{selectedTemplates.map((product, index) => <CatalogCard key={product.id} priority={index === 0} product={product} />)}</div></Container></section>

      <section className="section services-section" id="services"><Container><div className="services-intro"><SectionHeading eyebrow={content.services.eyebrow} light title={<SectionTitle title={content.services.title} accent={content.services.accentTitle} />} text={content.services.description} /><div className="services-note"><span><Zap size={20} /></span><p>{content.services.note}<br /><strong>{content.services.noteEmphasis}</strong></p></div></div><div className="services-grid">{content.services.items.map((service, index) => { const presentation = servicePresentation[index % servicePresentation.length]; const Icon = presentation.icon; return <article className={`service-card ${presentation.className}`} key={`${service.title}-${index}`}><div className="service-card-top"><span>{String(index + 1).padStart(2, "0")}</span><i><Icon size={25} /></i></div><div><h3>{service.title}</h3><p>{service.description}</p></div><Link aria-label={`Learn about ${service.title}`} href="/contact"><ArrowUpRight size={20} /></Link></article>; })}</div></Container></section>

      <section className="section work-section" id="about"><Container><div className="section-topline"><SectionHeading eyebrow={content.portfolio.eyebrow} title={<SectionTitle title={content.portfolio.title} accent={content.portfolio.accentTitle} />} text={content.portfolio.description} /><Link className="text-link" href={content.portfolio.ctaHref}>{content.portfolio.ctaLabel} <ArrowRight size={17} /></Link></div><div className="work-list">{caseStudies.map((project, index) => <article className="work-row" key={project.id}><div className="work-index">{String(index + 1).padStart(2, "0")}</div><Link aria-label={`View ${project.name} case study`} className={project.coverImageUrl ? "work-visual work-visual-image" : "work-visual"} href={`/projects/${project.slug}`}>{project.coverImageUrl ? <img alt="" className="work-cover-image" src={project.coverImageUrl} /> : <BrowserPreview accent={project.accent} title={project.name} variant={project.category} />}</Link><div className="work-copy"><div><span>{project.category} · {project.updatedAt.slice(0, 4)}</span><h3>{project.name}</h3><p>{project.description}</p></div><div className="work-metrics">{project.metrics?.slice(0, 2).map((metric) => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</div><Link href={`/projects/${project.slug}`}>Read case study <ArrowUpRight size={17} /></Link></div></article>)}</div></Container></section>

      <section className="section process-section"><Container><SectionHeading align="center" eyebrow={content.process.eyebrow} title={<SectionTitle title={content.process.title} accent={content.process.accentTitle} />} text={content.process.description} /><div className="process-grid">{content.process.items.map((item, index) => <article key={`${item.title}-${index}`}><div className="process-marker"><span>{String(index + 1).padStart(2, "0")}</span>{index < content.process.items.length - 1 ? <i /> : null}</div><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></Container></section>

      <section className="testimonial-section"><Container><div className="testimonial-panel"><div className="quote-mark">“</div><blockquote>{content.testimonial.quote}</blockquote><div className="testimonial-person"><span>{content.testimonial.initials}</span><p><strong>{content.testimonial.personName}</strong><br />{content.testimonial.personRole}</p></div><div className="testimonial-score"><span>{Array.from({ length: 5 }, (_, index) => <Star key={index} size={16} />)}</span><p>{content.testimonial.score} · {content.testimonial.source}</p></div></div></Container></section>

      <section className="section pricing-section" id="pricing"><Container><SectionHeading align="center" eyebrow={content.pricing.eyebrow} title={<SectionTitle title={content.pricing.title} accent={content.pricing.accentTitle} />} text={content.pricing.description} /><div className="pricing-grid">{content.pricing.plans.map((plan, index) => <article className={`pricing-card ${plan.featured ? "pricing-featured" : ""}`} key={`${plan.name}-${index}`}>{plan.featured ? <div className="popular-label">Most popular</div> : null}<div><span>{plan.name}</span><p>{plan.description}</p></div><h3><Price value={plan.price} /><small>{plan.suffix}</small></h3><ul>{plan.features.map((feature) => <li key={feature}><Check size={17} />{feature}</li>)}</ul><Button href={plan.ctaHref} variant={plan.featured ? "accent" : "outline"}>{plan.ctaLabel}</Button></article>)}</div><p className="pricing-note">{content.pricing.note} <Link href={content.pricing.noteLinkHref}>{content.pricing.noteLinkLabel}</Link> and we&apos;ll point you in the right direction.</p></Container></section>
      <CtaSection content={content.cta} />
    </main>
    <SiteFooter />
  </>;
}
