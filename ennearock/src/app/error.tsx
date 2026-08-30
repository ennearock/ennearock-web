"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight } from "@/components/icons";
import { Logo } from "@/components/logo";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <main className="grid min-h-screen place-items-center bg-[#f3f0e8] px-5 py-16"><div className="w-full max-w-xl text-center"><Logo /><p className="mt-16 font-mono text-[10px] font-semibold uppercase tracking-[.18em] text-[#738155]">Something slipped off course</p><h1 className="mt-5 text-5xl font-semibold tracking-[-.065em] sm:text-7xl">Let&apos;s get you<br />moving again.</h1><p className="mx-auto mt-6 max-w-md text-sm leading-7 text-[#676a61]">The page hit an unexpected problem. Your work is safe—try the request once more or head back to the studio.</p><div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><button className="button button-lime" onClick={reset} type="button">Try again <ArrowRight size={17} /></button><Link className="button button-outline" href="/">Back to home</Link></div>{error.digest ? <p className="mt-8 font-mono text-[8px] text-[#9a9c94]">Reference: {error.digest}</p> : null}</div></main>;
}
