import { ArrowUpRight } from "@/components/icons";
import { Container, Eyebrow } from "@/components/ui";
import Link from "next/link";

export function CtaSection() {
  return <section className="cta-section"><Container><div className="cta-panel">
    <div><Eyebrow light>Have a project in mind?</Eyebrow><h2>Let&apos;s make something<br /><em>worth remembering.</em></h2></div>
    <div className="cta-side"><p>Tell us where you want to go. We&apos;ll bring a senior product team and a clear way to get there.</p><Link className="cta-circle" href="/contact"><span>Start a<br />project</span><ArrowUpRight size={26} /></Link></div>
    <span className="cta-orbit cta-orbit-one" /><span className="cta-orbit cta-orbit-two" />
  </div></Container></section>;
}
