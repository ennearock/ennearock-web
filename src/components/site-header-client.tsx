"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Close, Menu } from "@/components/icons";
import { Logo } from "@/components/logo";
import type { GeneralContent } from "@/lib/content";

const navigation = [
  { href: "/templates", label: "Templates" },
  { href: "/products", label: "Catalog" },
  { href: "/projects", label: "Projects" },
  { href: "/#services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeaderClient({ content }: { content: GeneralContent }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return <header className="site-header">
    <div className="site-container header-inner">
      <Logo name={content.brandName} />
      <nav aria-label="Main navigation" className="desktop-nav">{navigation.map((item) => <Link className={!item.href.includes("#") && pathname.startsWith(item.href) ? "nav-link nav-link-active" : "nav-link"} href={item.href} key={item.href}>{item.label}</Link>)}</nav>
      <div className="header-actions"><Link className="header-login" href={content.headerLoginHref}>{content.headerLoginLabel}</Link><Link className="button button-ink header-cta" href={content.headerCtaHref}>{content.headerCtaLabel} <ArrowUpRight size={17} /></Link></div>
      <button
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="menu-button"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {open ? <Close /> : <Menu />}
      </button>
    </div>
    <div className={`mobile-menu ${open ? "mobile-menu-open" : ""}`}><nav aria-label="Mobile navigation" className="site-container mobile-nav">
      {navigation.map((item, index) => <Link href={item.href} key={item.href} onClick={() => setOpen(false)}><span>0{index + 1}</span>{item.label}<ArrowUpRight /></Link>)}
      <div className="mobile-actions"><Link className="button button-outline" href={content.headerLoginHref} onClick={() => setOpen(false)}>{content.headerLoginLabel}</Link><Link className="button button-accent" href={content.headerCtaHref} onClick={() => setOpen(false)}>{content.headerCtaLabel} <ArrowUpRight size={18} /></Link></div>
    </nav></div>
  </header>;
}
