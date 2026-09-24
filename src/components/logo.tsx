import Image from "next/image";
import Link from "next/link";

export function LogoMark({
  className = "",
  size = 40,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <span
      aria-hidden="true"
      className={`logo-mark ${className}`}
      style={{ width: size, height: size }}
    >
      <span className="logo-mark-viewport">
        <Image
          alt=""
          className="logo-mark-image"
          draggable={false}
          height={1024}
          loading="eager"
          sizes={`${Math.ceil(size * 1.92)}px`}
          src="/brand/ennearock-logo.png"
          width={1536}
        />
      </span>
    </span>
  );
}

export function BrandLockup({
  inverse = false,
  name = "ennearock",
  compact = false,
  subtitle,
}: {
  inverse?: boolean;
  name?: string;
  compact?: boolean;
  subtitle?: string;
}) {
  return (
    <span className={`brand-lockup ${inverse ? "brand-lockup-inverse" : ""} ${compact ? "brand-lockup-compact" : ""}`}>
      <LogoMark size={compact ? 24 : 40} />
      <span className="brand-label">
        <span className="brand-name">{name}</span>
        {subtitle ? <span className="brand-subtitle">{subtitle}</span> : null}
      </span>
    </span>
  );
}

export function Logo({
  inverse = false,
  href = "/",
  name = "ennearock",
  className = "",
}: {
  inverse?: boolean;
  href?: string;
  name?: string;
  className?: string;
}) {
  return (
    <Link aria-label={`${name} home`} className={`brand-link ${className}`} href={href}>
      <BrandLockup inverse={inverse} name={name} />
    </Link>
  );
}
