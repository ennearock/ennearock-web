import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { Container } from "@/components/ui";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="overflow-hidden bg-[#f3f0e8]">
        <Container className="relative flex min-h-[70vh] items-center py-20 sm:py-28">
          <div className="absolute -right-24 top-1/2 grid h-[420px] w-[420px] -translate-y-1/2 grid-cols-3 gap-5 opacity-[0.055] sm:h-[560px] sm:w-[560px]">
            {Array.from({ length: 9 }, (_, index) => <span key={index} className={"rounded-[30%] bg-[#11140f] " + (index === 8 ? "translate-x-5 bg-[#7f9f43]" : "")} />)}
          </div>
          <div className="relative max-w-2xl">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#718153]">Error · 404</p>
            <h1 className="mt-6 text-[58px] font-medium leading-[0.9] tracking-[-0.075em] text-[#11140f] sm:text-[88px]">
              This page moved off the grid.
            </h1>
            <p className="mt-7 max-w-lg text-sm leading-7 text-[#65675f]">
              The address may be outdated, or the page may never have existed. The good work is still right where you left it.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#11140f] px-6 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#24483a]">
                Back to home <ArrowRight size={17} />
              </Link>
              <Link href="/templates" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#aaa99f] px-6 text-xs font-semibold text-[#11140f] transition hover:-translate-y-0.5 hover:border-[#11140f]">
                Browse templates <ArrowUpRight size={17} />
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-6 gap-y-3 border-t border-[#d4d0c5] pt-6 text-[10px] font-medium text-[#72756d]">
              <Link href="/projects" className="hover:text-[#11140f]">Projects</Link>
              <Link href="/contact" className="hover:text-[#11140f]">Contact the studio</Link>
              <a href="mailto:hello@ennearock.com" className="hover:text-[#11140f]">hello@ennearock.com</a>
            </div>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
