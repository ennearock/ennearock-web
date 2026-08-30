import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function ProjectsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-lime px-5 py-3 text-sm font-semibold text-ink shadow-lg transition-transform focus:translate-y-0 motion-reduce:transition-none"
        href="#main-content"
      >
        Skip to content
      </a>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}

