import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import { BrowserPreview } from "@/components/browser-preview";
import { Pill } from "@/components/ui";
import type { Product } from "@/data/catalog";

export function CatalogCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const href = product.kind === "project" ? `/projects/${product.slug}` : `/templates/${product.slug}`;
  return (
    <article className={`catalog-card catalog-card-${product.theme}`} data-priority={priority || undefined}>
      <Link aria-label={`View ${product.name}`} className="catalog-visual" href={href}>
        <BrowserPreview accent={product.accent} compact title={product.name} variant={product.category} />
        <span className="catalog-open"><ArrowUpRight size={20} /></span>
      </Link>
      <div className="catalog-meta">
        <div className="catalog-title-row"><div><h3><Link href={href}>{product.name}</Link></h3><p>{product.tagline}</p></div><strong>{product.kind === "project" ? "Case study" : product.priceLabel}</strong></div>
        <div className="catalog-tags"><Pill>{product.category}</Pill>{product.badge ? <Pill tone="lime">{product.badge}</Pill> : null}<span>{product.stack.slice(0, 2).join(" · ")}</span></div>
      </div>
    </article>
  );
}
