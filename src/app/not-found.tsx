import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { Container } from "@/components/ui";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="overflow-hidden bg-[#f5f6f8]">
        <Container className="relative flex min-h-[70vh] items-center py-20 sm:py-28">
          <div className="absolute -right-24 top-1/2 grid h-[420px] w-[420px] -translate-y-1/2 grid-cols-3 gap-5 opacity-[0.055] sm:h-[560px] sm:w-[560px]">
            {Array.from({ length: 9 }, (_, index) => <span key={index} className={"rounded-[30%] bg-[#131418] " + (index === 8 ? "translate-x-5 bg-[#898f9b]" : "")} />)}
          </div>
          <div className="relative max-w-2xl">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#747985]">Error · 404</p>
            <h1 className="mt-6 text-[58px] font-medium leading-[0.9] tracking-[-0.075em] text-[#131418] sm:text-[88px]">
              This page moved off the grid.
            </h1>
            <p className="mt-7 max-w-lg text-sm leading-7 text-[#626670]">
              The address may be outdated, or the page may never have existed. The good work is still right where you left it.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#131418] px-6 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#1c1e24]">
                Back to home <ArrowRight size={17} />
              </Link>
              <Link href="/templates" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#a1a7b2] px-6 text-xs font-semibold text-[#131418] transition hover:-translate-y-0.5 hover:border-[#131418]">
                Browse templates <ArrowUpRight size={17} />
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-6 gap-y-3 border-t border-[#d7dae0] pt-6 text-[10px] font-medium text-[#747985]">
              <Link href="/projects" className="hover:text-[#131418]">Projects</Link>
              <Link href="/contact" className="hover:text-[#131418]">Contact the studio</Link>
              <a href="mailto:hello@ennearock.com" className="hover:text-[#131418]">hello@ennearock.com</a>
            </div>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
