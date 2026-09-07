import { ArrowUpRight } from "@/components/icons";
import { Container, Eyebrow } from "@/components/ui";
import type { CtaContent } from "@/lib/content";
import { getSiteContent } from "@/lib/content/queries";
import Link from "next/link";

function Lines({ text }: { text: string }) {
  return text.split("\n").map((line, index) => <span key={`${line}-${index}`}>{index > 0 ? <br /> : null}{line}</span>);
}

export async function CtaSection({ content }: { content?: CtaContent } = {}) {
  const cta = content ?? (await getSiteContent()).cta;

  return <section className="cta-section"><Container><div className="cta-panel">
    <div><Eyebrow light>{cta.eyebrow}</Eyebrow><h2><Lines text={cta.title} /><br /><em><Lines text={cta.accentTitle} /></em></h2></div>
    <div className="cta-side"><p>{cta.description}</p><Link className="cta-circle" href={cta.linkHref}><span><Lines text={cta.linkLabel} /></span><ArrowUpRight size={26} /></Link></div>
    <span className="cta-orbit cta-orbit-one" /><span className="cta-orbit cta-orbit-two" />
  </div></Container></section>;
}
