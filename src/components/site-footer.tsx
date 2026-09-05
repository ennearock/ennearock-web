import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import { Logo } from "@/components/logo";
import { Container } from "@/components/ui";

const footerLinks = [
  { title: "Explore", links: [["Templates", "/templates"], ["Product database", "/products"], ["Projects", "/projects"], ["Services", "/#services"], ["Pricing", "/#pricing"]] },
  { title: "Company", links: [["About", "/#about"], ["Contact", "/contact"], ["Sign in", "/login"], ["Dashboard", "/dashboard"]] },
];

export function SiteFooter() {
  return <footer className="site-footer"><Container>
    <div className="footer-top"><div className="footer-brand"><Logo inverse /><p>Digital products engineered for clarity, momentum, and measurable growth.</p><a className="footer-email" href="mailto:hello@ennearock.com">hello@ennearock.com <ArrowUpRight size={18} /></a></div>
      <div className="footer-links-grid">{footerLinks.map((column) => <div className="footer-column" key={column.title}><p>{column.title}</p>{column.links.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</div>)}<div className="footer-column"><p>Social</p><a href="https://www.linkedin.com" rel="noreferrer" target="_blank">LinkedIn</a><a href="https://www.instagram.com" rel="noreferrer" target="_blank">Instagram</a><a href="https://github.com" rel="noreferrer" target="_blank">GitHub</a><a href="https://www.behance.net" rel="noreferrer" target="_blank">Behance</a></div></div>
    </div>
    <div className="footer-bottom"><p>© {new Date().getFullYear()} Ennearock Studio. Built with intention.</p><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div><p className="footer-location"><span /> Paris · Working worldwide</p></div>
  </Container></footer>;
}
