import Link from "next/link";
import { BrowserPreview } from "@/components/browser-preview";
import { CatalogCard } from "@/components/catalog-card";
import { CtaSection } from "@/components/cta-section";
import { ArrowRight, ArrowUpRight, Chart, Check, Code, Layers, Sparkles, Star, Zap } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button, Container, Eyebrow, SectionHeading } from "@/components/ui";
import { featuredProducts, products } from "@/data/catalog";

const services = [
  { number: "01", title: "Strategy & positioning", text: "Sharp thinking before pixels. We find the clearest story, audience, and path to growth.", icon: Sparkles, className: "service-strategy" },
  { number: "02", title: "Product design", text: "Interfaces that feel obvious, distinct, and built around what your customers actually need.", icon: Layers, className: "service-design" },
  { number: "03", title: "Web development", text: "Fast, accessible, scalable builds made with modern technology and clean foundations.", icon: Code, className: "service-dev" },
  { number: "04", title: "Growth systems", text: "Analytics, experiments, and conversion improvements that compound after launch.", icon: Chart, className: "service-growth" },
];

const process = [
  ["01", "Discover", "We turn business context, customer insight, and constraints into a focused brief."],
  ["02", "Design", "Weekly working sessions keep ideas moving from rough direction to refined system."],
  ["03", "Build", "Design and engineering overlap, so the real product stays true to the idea."],
  ["04", "Grow", "We launch, measure, and keep improving the moments that matter."],
];

export default function Home() {
  const selectedTemplates = featuredProducts.filter((item) => item.kind === "template").slice(0, 3);
  const caseStudies = products.filter((item) => item.kind === "project").slice(0, 2);

  return <>
    <div className="announcement"><p><span>New</span> Six launch-ready templates just landed.</p><Link href="/templates">Explore the collection <ArrowRight size={15} /></Link></div>
    <SiteHeader />
    <main>
      <section className="hero-section"><Container className="hero-grid">
        <div className="hero-copy"><Eyebrow>Independent digital product studio</Eyebrow><h1>We build digital<br />products that <em>pull<br />their weight.</em></h1><p>Strategy, design, and engineering for ambitious teams who want to move quickly without blending in.</p><div className="hero-actions"><Button arrow href="/contact" variant="lime">Start a project</Button><Button href="/templates" variant="ghost">Browse templates <ArrowUpRight size={17} /></Button></div><div className="hero-proof"><div className="avatar-stack"><span>MA</span><span>JL</span><span>SK</span><span>+8</span></div><p><strong>4.9/5</strong><br />from founders worldwide</p></div></div>
        <div className="hero-stage"><div className="hero-stage-grid" /><div className="hero-preview-main"><BrowserPreview accent="#c8f36a" title="Nexa" variant="dashboard" /></div><div className="hero-float hero-float-status"><span className="pulse-dot" /><div><strong>Launch ready</strong><small>All systems operational</small></div><Check size={17} /></div><div className="hero-float hero-float-growth"><span><Chart size={18} /></span><div><small>Conversion rate</small><strong>+38.4%</strong></div><i>↗ 12.6%</i></div><div className="hero-stamp"><span>Strategy · Design · Code ·</span><Sparkles size={22} /></div></div>
      </Container><Container className="hero-bottom"><p>Trusted by ambitious teams at</p><div className="logo-cloud"><span>northstar</span><span className="logo-serif">Morrow</span><span>VERTEX</span><span className="logo-wide">Arc & Co.</span><span className="logo-serif">formly</span></div></Container></section>

      <section className="metrics-strip"><Container>{[["32", "Products shipped"], ["14", "Design awards"], ["97%", "On-time launches"], ["6 yrs", "Building together"]].map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</Container></section>

      <section className="section templates-section"><Container><div className="section-topline"><SectionHeading eyebrow="Ready to launch" title={<>A head start that doesn&apos;t<br /><em>look like one.</em></>} text="Production-ready templates with the polish of a custom build. Pick a direction, make it yours, and launch in days." /><Button href="/templates" variant="outline">View all templates <ArrowUpRight size={17} /></Button></div><div className="catalog-grid">{selectedTemplates.map((product, index) => <CatalogCard key={product.id} priority={index === 0} product={product} />)}</div></Container></section>

      <section className="section services-section" id="services"><Container><div className="services-intro"><SectionHeading eyebrow="What we do" light title={<>One senior team,<br /><em>every layer covered.</em></>} text="No handoffs, no black boxes. The people in the room are the people doing the work—from first idea to final deploy." /><div className="services-note"><span><Zap size={20} /></span><p>Small by design.<br /><strong>Senior by default.</strong></p></div></div><div className="services-grid">{services.map((service) => { const Icon = service.icon; return <article className={`service-card ${service.className}`} key={service.number}><div className="service-card-top"><span>{service.number}</span><i><Icon size={25} /></i></div><div><h3>{service.title}</h3><p>{service.text}</p></div><Link aria-label={`Learn about ${service.title}`} href="/contact"><ArrowUpRight size={20} /></Link></article>; })}</div></Container></section>

      <section className="section work-section" id="about"><Container><div className="section-topline"><SectionHeading eyebrow="Selected work" title={<>Built to move the<br /><em>business forward.</em></>} text="Pretty is part of it. The real goal is a digital product that changes what is possible for the business behind it." /><Link className="text-link" href="/projects">See all projects <ArrowRight size={17} /></Link></div><div className="work-list">{caseStudies.map((project, index) => <article className="work-row" key={project.id}><div className="work-index">0{index + 1}</div><Link className="work-visual" href={`/projects/${project.slug}`}><BrowserPreview accent={project.accent} title={project.name} variant={project.category} /></Link><div className="work-copy"><div><span>{project.category} · {project.updatedAt.slice(0, 4)}</span><h3>{project.name}</h3><p>{project.description}</p></div><div className="work-metrics">{project.metrics?.slice(0, 2).map((metric) => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</div><Link href={`/projects/${project.slug}`}>Read case study <ArrowUpRight size={17} /></Link></div></article>)}</div></Container></section>

      <section className="section process-section"><Container><SectionHeading align="center" eyebrow="How we work" title={<>Clear process.<br /><em>No theatre.</em></>} text="A focused four-part rhythm that protects momentum, makes decisions visible, and leaves room for the good surprises." /><div className="process-grid">{process.map(([number, title, text], index) => <article key={number}><div className="process-marker"><span>{number}</span>{index < process.length - 1 ? <i /> : null}</div><h3>{title}</h3><p>{text}</p></article>)}</div></Container></section>

      <section className="testimonial-section"><Container><div className="testimonial-panel"><div className="quote-mark">“</div><blockquote>Ennearock didn&apos;t just make the product look better. They helped us explain it, simplify it, and finally turn interest into action.</blockquote><div className="testimonial-person"><span>AK</span><p><strong>Amelia Klein</strong><br />Co-founder, Northstar</p></div><div className="testimonial-score"><span>{Array.from({ length: 5 }, (_, index) => <Star key={index} size={16} />)}</span><p>5.0 · Clutch review</p></div></div></Container></section>

      <section className="section pricing-section" id="pricing"><Container><SectionHeading align="center" eyebrow="Simple ways to start" title={<>Choose your level<br /><em>of momentum.</em></>} text="Start with a proven foundation or bring us in for the full journey. Either way, you work with the same senior team." /><div className="pricing-grid"><article className="pricing-card"><div><span>Templates</span><p>For founders ready to build it themselves.</p></div><h3>From <strong>€89</strong><small>one time</small></h3><ul>{["Complete page library", "Figma source included", "Lifetime updates", "Setup documentation"].map((item) => <li key={item}><Check size={17} />{item}</li>)}</ul><Button href="/templates" variant="outline">Browse templates</Button></article><article className="pricing-card pricing-featured"><div className="popular-label">Most popular</div><div><span>Launch sprint</span><p>For teams that need a sharp new site, fast.</p></div><h3>From <strong>€4.8k</strong><small>2–4 weeks</small></h3><ul>{["Strategy & direction", "Custom visual system", "Up to 8 key pages", "Development & launch"].map((item) => <li key={item}><Check size={17} />{item}</li>)}</ul><Button href="/contact" variant="lime">Book a discovery call</Button></article><article className="pricing-card"><div><span>Product partnership</span><p>For ambitious products that need a full team.</p></div><h3><strong>Let&apos;s talk</strong><small>custom scope</small></h3><ul>{["Product strategy", "UX & interface design", "Full-stack engineering", "Ongoing growth support"].map((item) => <li key={item}><Check size={17} />{item}</li>)}</ul><Button href="/contact" variant="outline">Tell us your idea</Button></article></div><p className="pricing-note">Not sure where to start? <Link href="/contact">Tell us what you&apos;re working on</Link> and we&apos;ll point you in the right direction.</p></Container></section>
      <CtaSection />
    </main>
    <SiteFooter />
  </>;
}
