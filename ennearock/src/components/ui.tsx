import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "@/components/icons";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`site-container ${className}`}>{children}</div>;
}

type ButtonProps = { href: string; children: ReactNode; variant?: "ink" | "lime" | "outline" | "ghost" | "white"; className?: string; arrow?: boolean; };

export function Button({ href, children, variant = "ink", className = "", arrow = false }: ButtonProps) {
  const external = href.startsWith("http") || href.startsWith("mailto:");
  const content = <><span>{children}</span>{arrow ? <ArrowRight size={18} /> : null}</>;
  if (external) return <a className={`button button-${variant} ${className}`} href={href} rel={href.startsWith("http") ? "noreferrer" : undefined} target={href.startsWith("http") ? "_blank" : undefined}>{content}</a>;
  return <Link className={`button button-${variant} ${className}`} href={href}>{content}</Link>;
}

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <div className={`eyebrow ${light ? "eyebrow-light" : ""}`}><span className="eyebrow-dot" />{children}</div>;
}

export function SectionHeading({ eyebrow, title, text, align = "left", light = false }: { eyebrow: string; title: ReactNode; text?: string; align?: "left" | "center"; light?: boolean; }) {
  return <div className={`section-heading section-heading-${align} ${light ? "section-heading-light" : ""}`}><Eyebrow light={light}>{eyebrow}</Eyebrow><h2>{title}</h2>{text ? <p>{text}</p> : null}</div>;
}

export function Pill({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "lime" | "violet" | "dark" }) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
}
