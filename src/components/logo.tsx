import Link from "next/link";

export function LogoMark({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`logo-mark ${className}`}>{Array.from({ length: 9 }, (_, index) => <span className={index === 8 ? "logo-stone logo-stone-accent" : "logo-stone"} key={index} />)}</span>;
}

export function Logo({ inverse = false, href = "/" }: { inverse?: boolean; href?: string }) {
  return <Link aria-label="Ennearock home" className={`brand-lockup ${inverse ? "brand-lockup-inverse" : ""}`} href={href}><LogoMark /><span>ennearock</span></Link>;
}
