import type { Metadata } from "next";
import { CtaSection } from "@/components/cta-section";
import { ProductDatabase } from "@/components/products/product-database";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Container, Eyebrow } from "@/components/ui";
import { products } from "@/data/catalog";

export const metadata: Metadata = {
  title: "Product database",
  description: "Browse Ennearock's complete database of website templates and client projects.",
};

export default function ProductsPage() {
  const templates = products.filter((item) => item.kind === "template").length;
  const projects = products.filter((item) => item.kind === "project").length;

  return <>
    <SiteHeader />
    <main className="bg-[#f3f0e8]">
      <section className="border-b border-[#d4d0c5] pb-16 pt-20 sm:pb-20 sm:pt-28"><Container>
        <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
          <div><Eyebrow>Open product database</Eyebrow><h1 className="mt-7 max-w-4xl text-[clamp(50px,7vw,94px)] font-[570] leading-[.9] tracking-[-.075em]">Everything we build,<br /><em className="font-serif font-normal">in one clear view.</em></h1><p className="mt-7 max-w-xl text-sm leading-7 text-[#666960] sm:text-base">A living library of launch-ready templates and selected client work. Search the stack, compare the details, and find the right starting point.</p></div>
          <div className="grid grid-cols-3 border border-[#cfcbc0] bg-[#fffefa] lg:min-w-[370px]">{[[products.length.toString(), "All products"], [templates.toString(), "Templates"], [projects.toString(), "Case studies"]].map(([value, label]) => <div className="border-r border-[#dedad0] p-5 last:border-r-0" key={label}><strong className="font-serif text-3xl font-normal">{value}</strong><span className="mt-2 block text-[8px] uppercase tracking-[.1em] text-[#85877f]">{label}</span></div>)}</div>
        </div>
      </Container></section>
      <section className="py-12 sm:py-16"><Container><ProductDatabase initialProducts={products} /></Container></section>
      <CtaSection />
    </main>
    <SiteFooter />
  </>;
}
