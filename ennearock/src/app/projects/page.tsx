import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { projects } from "./project-data";
import { ProjectVisual } from "./project-visual";

export const metadata: Metadata = {
  title: "Selected projects",
  description:
    "Explore digital products and web experiences designed and developed by Ennearock for ambitious teams.",
  openGraph: {
    title: "Selected projects — Ennearock",
    description:
      "Strategy, product design, and engineering brought together in a collection of focused client work.",
  },
};

export default function ProjectsPage() {
  return (
    <main id="main-content">
      <section className="border-b border-[#d4d0c5] bg-background">
        <div className="mx-auto grid min-h-[34rem] w-full max-w-[1280px] items-end gap-12 px-4 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_21rem] lg:px-8 lg:pb-24 lg:pt-28">
          <div>
            <p className="mb-7 flex items-center gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[#5f625a]">
              <span className="h-2 w-2 rounded-full bg-[#c8f36a] ring-4 ring-[#c8f36a]/25" />
              Selected client work
            </p>
            <h1 className="max-w-[850px] text-[clamp(3.5rem,8.4vw,7.4rem)] font-medium leading-[0.86] tracking-[-0.075em] text-ink">
              Work built for the
              <span className="block font-serif font-normal italic tracking-[-0.06em] text-[#7568f8]">
                move after launch.
              </span>
            </h1>
          </div>
          <div className="border-l border-[#bab7ad] pl-6 lg:mb-2 lg:pl-8">
            <p className="max-w-xs text-sm leading-7 text-[#5d6058]">
              We turn complex ideas into useful digital products—combining
              strategy, design, and engineering from the first decision to the
              final deploy.
            </p>
            <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.15em] text-[#7c7e76]">
              {String(projects.length).padStart(2, "0")} case studies · 2026
            </p>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="project-list-title"
        className="bg-[#fffefa] py-20 sm:py-28 lg:py-36"
      >
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-8">
          <div className="mb-12 flex items-end justify-between border-b border-[#d4d0c5] pb-5 sm:mb-16">
            <h2
              className="text-sm font-semibold tracking-[-0.03em] text-ink"
              id="project-list-title"
            >
              Selected engagements
            </h2>
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#7c7e76]">
              Outcome over output
            </span>
          </div>

          <div className="space-y-24 sm:space-y-32 lg:space-y-40">
            {projects.map((project, index) => (
              <article
                className="grid items-stretch gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(19rem,.65fr)] lg:gap-12 xl:gap-20"
                key={project.id}
              >
                <Link
                  aria-label={"Read the " + project.name + " case study"}
                  className={
                    "group block overflow-hidden outline-offset-4 " +
                    (index % 2 === 1 ? "lg:order-2" : "")
                  }
                  href={"/projects/" + project.slug}
                >
                  <div className="transition-transform duration-500 ease-out group-hover:scale-[1.012] motion-reduce:transition-none">
                    <ProjectVisual project={project} />
                  </div>
                </Link>

                <div
                  className={
                    "flex flex-col border-t border-[#bdbab0] pt-5 " +
                    (index % 2 === 1 ? "lg:order-1" : "")
                  }
                >
                  <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.14em] text-[#70736a]">
                    <span>
                      {String(index + 1).padStart(2, "0")} /{" "}
                      {String(projects.length).padStart(2, "0")}
                    </span>
                    <span>
                      {project.category} · {project.updatedAt.slice(0, 4)}
                    </span>
                  </div>

                  <div className="my-9 sm:my-12">
                    <h3 className="text-4xl font-medium leading-none tracking-[-0.06em] text-ink sm:text-5xl">
                      <Link
                        className="transition-colors hover:text-[#7568f8] motion-reduce:transition-none"
                        href={"/projects/" + project.slug}
                      >
                        {project.name}
                      </Link>
                    </h3>
                    <p className="mt-5 max-w-sm font-serif text-xl italic leading-7 text-[#55584f]">
                      {project.tagline}
                    </p>
                    <p className="mt-6 max-w-sm text-[13px] leading-7 text-[#666960]">
                      {project.description}
                    </p>
                  </div>

                  <dl className="mt-auto grid grid-cols-2 border-y border-[#d4d0c5] py-5">
                    {project.metrics?.slice(0, 2).map((metric) => (
                      <div
                        className="border-l border-[#d4d0c5] pl-5 first:border-l-0 first:pl-0"
                        key={metric.label}
                      >
                        <dd className="font-serif text-3xl tracking-[-0.05em] text-ink">
                          {metric.value}
                        </dd>
                        <dt className="mt-1 font-mono text-[8px] uppercase tracking-[0.12em] text-[#777a71]">
                          {metric.label}
                        </dt>
                      </div>
                    ))}
                  </dl>

                  <Link
                    className="group mt-7 inline-flex w-fit items-center gap-3 text-xs font-semibold text-ink"
                    href={"/projects/" + project.slug}
                  >
                    Read case study
                    <span className="grid h-8 w-8 place-items-center rounded-full border border-[#aaa89f] transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-white motion-reduce:transition-none">
                      <ArrowUpRight size={15} />
                    </span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#30352e] bg-ink text-white">
        <div className="mx-auto grid w-full max-w-[1280px] sm:grid-cols-3 sm:px-8">
          {[
            [
              "01",
              "Start with the business",
              "We define the change the product needs to create before deciding what to make.",
            ],
            [
              "02",
              "Keep one senior team",
              "Strategy, design, and development stay in the same conversation from brief to launch.",
            ],
            [
              "03",
              "Measure what moves",
              "Every experience is shaped around useful behavior and outcomes the team can see.",
            ],
          ].map(([number, title, body]) => (
            <article
              className="border-b border-[#30352e] px-4 py-10 last:border-b-0 sm:border-b-0 sm:border-l sm:px-7 sm:py-14 sm:first:border-l-0 lg:px-10"
              key={number}
            >
              <span className="font-mono text-[9px] text-[#c8f36a]">
                {number}
              </span>
              <h2 className="mt-10 text-xl font-medium tracking-[-0.04em]">
                {title}
              </h2>
              <p className="mt-4 max-w-xs text-xs leading-6 text-[#aeb2a9]">
                {body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#fffefa] py-20 sm:py-28">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-8">
          <div className="relative overflow-hidden bg-[#7568f8] px-6 py-12 text-white sm:px-12 sm:py-16 lg:grid lg:grid-cols-[1fr_auto] lg:items-end lg:px-16 lg:py-20">
            <div className="absolute -right-16 -top-52 h-96 w-96 rounded-full border border-white/20" />
            <div className="absolute -right-4 -top-32 h-72 w-72 rounded-full border border-white/15" />
            <div className="relative">
              <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/70">
                Your project could be next
              </p>
              <h2 className="mt-6 max-w-3xl text-[clamp(2.7rem,6vw,5.4rem)] font-medium leading-[0.92] tracking-[-0.065em]">
                Bring us the ambitious, complicated bit.
              </h2>
            </div>
            <Link
              className="relative mt-10 inline-flex min-h-14 items-center justify-center gap-4 rounded-full bg-lime px-7 text-sm font-semibold text-ink transition-transform hover:-translate-y-1 motion-reduce:transition-none lg:ml-16 lg:mt-0"
              href="/contact"
            >
              Start a project <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

