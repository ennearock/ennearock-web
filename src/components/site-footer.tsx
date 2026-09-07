import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import { Logo } from "@/components/logo";
import { Container } from "@/components/ui";
import { getSiteContent } from "@/lib/content/queries";

const footerLinks = [
  { title: "Explore", links: [["Templates", "/templates"], ["Product database", "/products"], ["Projects", "/projects"], ["Services", "/#services"], ["Pricing", "/#pricing"]] },
  { title: "Company", links: [["About", "/#about"], ["Contact", "/contact"], ["Sign in", "/login"], ["Dashboard", "/dashboard"]] },
];

export async function SiteFooter() {
  const { general } = await getSiteContent();

  return <footer className="site-footer"><Container>
    <div className="footer-top"><div className="footer-brand"><Logo inverse name={general.brandName} /><p>{general.brandDescription}</p><a className="footer-email" href={`mailto:${general.contactEmail}`}>{general.contactEmail} <ArrowUpRight size={18} /></a></div>
      <div className="footer-links-grid">{footerLinks.map((column) => <div className="footer-column" key={column.title}><p>{column.title}</p>{column.links.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</div>)}<div className="footer-column"><p>Social</p>{general.socials.map((social) => <a href={social.href} key={`${social.label}-${social.href}`} rel="noreferrer" target="_blank">{social.label}</a>)}</div></div>
    </div>
    <div className="footer-bottom"><p>© {new Date().getFullYear()} {general.copyright}</p><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div><p className="footer-location"><span /> {general.location}</p></div>
  </Container></footer>;
}
