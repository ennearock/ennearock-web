"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "@/components/icons";
import type { Product } from "@/data/catalog";

type KindFilter = "all" | Product["kind"];

function destination(product: Product) {
  return product.kind === "template" ? `/templates/${product.slug}` : `/projects/${product.slug}`;
}

function StatusPill({ status }: { status: Product["status"] }) {
  const label = status === "case-study" ? "Published" : status === "coming-soon" ? "Coming soon" : "Available";
  const className = status === "coming-soon" ? "bg-[#e9ebef] text-[#626670]" : status === "case-study" ? "bg-[#e2e5eb] text-[#50555f]" : "bg-[#e5f2dc] text-[#3e6636]";
  return <span className={`inline-flex rounded-full px-2.5 py-1 font-mono text-[8px] font-semibold uppercase tracking-[.1em] ${className}`}>{label}</span>;
}

export function ProductDatabase({ initialProducts }: { initialProducts: Product[] }) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<KindFilter>("all");
  const [sort, setSort] = useState("updated");

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const filtered = initialProducts.filter((product) => {
      const matchesKind = kind === "all" || product.kind === kind;
      const haystack = `${product.name} ${product.category} ${product.tagline} ${product.stack.join(" ")}`.toLowerCase();
      return matchesKind && (!normalized || haystack.includes(normalized));
    });

    return [...filtered].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "price") return b.price - a.price;
      return b.updatedAt.localeCompare(a.updatedAt);
    });
  }, [initialProducts, kind, query, sort]);

  const filters: { label: string; value: KindFilter }[] = [
    { label: "All products", value: "all" },
    { label: "Templates", value: "template" },
    { label: "Client projects", value: "project" },
  ];

  return <div>
    <div className="flex flex-col gap-3 border-y border-[#d7dae0] py-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex gap-1 overflow-x-auto rounded-full bg-[#e2e5eb] p-1">
        {filters.map((filter) => <button className={`whitespace-nowrap rounded-full px-4 py-2 text-[11px] font-semibold transition ${kind === filter.value ? "bg-[#131418] text-white" : "text-[#626670] hover:bg-white/70 hover:text-[#131418]"}`} key={filter.value} onClick={() => setKind(filter.value)} type="button">{filter.label}<span className="ml-2 font-mono text-[8px] opacity-60">{filter.value === "all" ? initialProducts.length : initialProducts.filter((item) => item.kind === filter.value).length}</span></button>)}
      </div>
      <div className="flex gap-2">
        <label className="relative min-w-0 flex-1 lg:w-64 lg:flex-none"><span className="sr-only">Search products</span><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={16} /><input className="h-10 w-full rounded-full border border-[#c9ced7] bg-[#ffffff] pl-9 pr-4 text-xs outline-none placeholder:text-[var(--muted)] focus:border-[#596579] focus:ring-4 focus:ring-[#e2e5eb]/25" onChange={(event) => setQuery(event.target.value)} placeholder="Search products" type="search" value={query} /></label>
        <label><span className="sr-only">Sort products</span><select className="h-10 rounded-full border border-[#c9ced7] bg-[#ffffff] px-4 text-[11px] font-semibold outline-none focus:border-[#596579]" onChange={(event) => setSort(event.target.value)} value={sort}><option value="updated">Recently updated</option><option value="name">Name</option><option value="price">Highest price</option></select></label>
      </div>
    </div>

    <div className="mt-5 flex items-center justify-between"><p className="font-mono text-[9px] uppercase tracking-[.14em] text-[var(--muted)]">{visible.length} records</p><p className="hidden text-[10px] text-[var(--muted)] sm:block">Live catalog · Synced with product API</p></div>

    <div className="mt-4 hidden overflow-hidden border border-[#d7dae0] bg-[#ffffff] md:block">
      <table className="w-full border-collapse text-left">
        <thead><tr className="border-b border-[#d7dae0] bg-[#e2e5eb] font-mono text-[8px] uppercase tracking-[.13em] text-[var(--muted)]"><th className="px-5 py-3 font-medium">Product</th><th className="px-4 py-3 font-medium">Type</th><th className="px-4 py-3 font-medium">Category</th><th className="px-4 py-3 font-medium">Stack</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 text-right font-medium">Price</th><th className="w-14 px-4 py-3"><span className="sr-only">Open</span></th></tr></thead>
        <tbody>{visible.map((product) => <tr className="group border-b border-[#e9ebef] last:border-0 hover:bg-[#f5f6f8]" key={product.id}>
          <td className="px-5 py-4"><div className="flex items-center gap-3"><span className="h-9 w-9 shrink-0 rounded-[9px] border border-black/10" style={{ background: product.accent }} /><div><Link className="text-xs font-semibold hover:underline" href={destination(product)}>{product.name}</Link><p className="mt-1 max-w-[230px] truncate text-[9px] text-[var(--muted)]">{product.tagline}</p></div></div></td>
          <td className="px-4 py-4 font-mono text-[9px] capitalize text-[#626670]">{product.kind}</td><td className="px-4 py-4 text-[10px] text-[#50555f]">{product.category}</td><td className="px-4 py-4"><div className="flex flex-wrap gap-1">{product.stack.slice(0, 2).map((item) => <span className="rounded-full bg-[#e9ebef] px-2 py-1 text-[8px] text-[#626670]" key={item}>{item}</span>)}</div></td><td className="px-4 py-4"><StatusPill status={product.status} /></td><td className="px-4 py-4 text-right font-mono text-[10px] font-semibold">{product.price ? product.priceLabel : "—"}</td><td className="px-4 py-4"><Link aria-label={`Open ${product.name}`} className="grid h-8 w-8 place-items-center rounded-full border border-[#c9ced7] opacity-60 transition hover:bg-[#131418] hover:text-white group-hover:opacity-100" href={destination(product)}><ArrowUpRight size={14} /></Link></td>
        </tr>)}</tbody>
      </table>
    </div>

    <div className="mt-4 grid gap-3 md:hidden">{visible.map((product) => <Link className="rounded-2xl border border-[#d7dae0] bg-[#ffffff] p-4" href={destination(product)} key={product.id}><div className="flex items-start gap-3"><span className="h-11 w-11 shrink-0 rounded-xl border border-black/10" style={{ background: product.accent }} /><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><div><h2 className="text-sm font-semibold">{product.name}</h2><p className="mt-1 text-[10px] text-[var(--muted)]">{product.category} · {product.kind}</p></div><ArrowUpRight className="shrink-0" size={17} /></div><p className="mt-3 text-[11px] leading-5 text-[var(--muted)]">{product.tagline}</p><div className="mt-4 flex items-center justify-between"><StatusPill status={product.status} /><strong className="font-mono text-[10px]">{product.price ? product.priceLabel : "Case study"}</strong></div></div></div></Link>)}</div>

    {!visible.length ? <div className="my-6 rounded-2xl border border-dashed border-[#b8bec8] py-16 text-center"><Search className="mx-auto text-[var(--muted)]" /><h2 className="mt-4 text-sm font-semibold">No matching products</h2><p className="mt-2 text-xs text-[var(--muted)]">Try a broader search or another collection.</p></div> : null}
  </div>;
}
