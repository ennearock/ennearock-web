import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, Check } from "@/components/icons";
import {
  getProject,
  getProjectStory,
  projects,
} from "../project-data";
import { ProjectVisual } from "../project-visual";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return {
      title: "Project not found",
    };
  }

  return {
    title: project.name,
    description: project.description,
    openGraph: {
      title: project.name + " — Ennearock case study",
      description: project.description,
      type: "article",
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  const story = getProjectStory(project.slug);
  const currentIndex = projects.findIndex((item) => item.id === project.id);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <main id="main-content">
      <article>
        <header className="bg-background">
          <div className="mx-auto w-full max-w-[1280px] px-4 pb-14 pt-10 sm:px-8 sm:pb-20 sm:pt-14 lg:pb-24">
            <Link
              className="group inline-flex items-center gap-3 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[#686b63]"
              href="/projects"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full border border-[#b8b5ab] transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-white motion-reduce:transition-none">
                <ArrowRight className="rotate-180" size={14} />
              </span>
              All projects
            </Link>

            <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,.55fr)] lg:items-end lg:gap-16">
              <div>
                <p className="mb-7 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#73766d]">
                  {project.category} · Case study · {project.updatedAt.slice(0, 4)}
                </p>
                <h1 className="max-w-5xl text-[clamp(4rem,10vw,8.8rem)] font-medium leading-[0.82] tracking-[-0.08em] text-ink">
                  {project.name}
                </h1>
              </div>
              <div className="border-l border-[#bab7ad] pl-6 lg:pb-2 lg:pl-8">
                <p className="font-serif text-2xl italic leading-8 tracking-[-0.025em] text-[#474a43]">
                  {project.tagline}
                </p>
                <p className="mt-6 text-[13px] leading-7 text-[#666960]">
                  {story.intro}
                </p>
              </div>
            </div>

            <dl className="mt-14 grid border-y border-[#c9c6bc] sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
              {[
                ["Client", story.client],
                ["Engagement", story.engagement],
                ["Timeline", story.duration],
                ["Launch", project.updatedAt.slice(0, 4)],
              ].map(([label, value], index) => (
                <div
                  className={
                    "border-b border-[#c9c6bc] py-5 last:border-b-0 sm:px-6 " +
                    (index % 2 === 1 ? "sm:border-l" : "") +
                    (index === 0 ? " lg:border-l-0" : " lg:border-l") +
                    " lg:border-b-0"
                  }
                  key={label}
                >
                  <dt className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#797b73]">
                    {label}
                  </dt>
                  <dd className="mt-2 text-xs font-medium leading-5 text-ink">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </header>

        <section aria-label={project.name + " product preview"} className="bg-background px-0 sm:px-8">
          <div className="mx-auto max-w-[1440px]">
            <ProjectVisual project={project} size="hero" />
          </div>
        </section>

        <section className="bg-[#fffefa] py-20 sm:py-28 lg:py-36">
          <div className="mx-auto grid w-full max-w-[1280px] gap-12 px-4 sm:px-8 lg:grid-cols-[15rem_1fr] lg:gap-24">
            <div>
              <p className="sticky top-28 flex items-center gap-3 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-[#6e7168]">
                <span className="h-2 w-2 rounded-full bg-[#c8f36a]" />
                The opportunity
              </p>
            </div>
            <div>
              <h2 className="max-w-4xl text-[clamp(2.6rem,5.5vw,5.2rem)] font-medium leading-[0.95] tracking-[-0.065em] text-ink">
                {story.challenge.title}
              </h2>
              <div className="mt-12 grid gap-7 border-t border-[#ccc8bd] pt-8 sm:grid-cols-2 sm:gap-10">
                {story.challenge.body.map((paragraph) => (
                  <p className="text-[13px] leading-7 text-[#60635b]" key={paragraph}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-ink py-20 text-white sm:py-28 lg:py-36">
          <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-8">
            <div className="grid gap-12 lg:grid-cols-[15rem_1fr] lg:gap-24">
              <p className="flex items-center self-start gap-3 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-[#b0b4aa]">
                <span className="h-2 w-2 rounded-full bg-[#7568f8]" />
                The response
              </p>
              <div>
                <h2 className="max-w-4xl text-[clamp(2.6rem,5.5vw,5.2rem)] font-medium leading-[0.95] tracking-[-0.065em]">
                  {story.solution.title}
                </h2>
                <div className="mt-12 grid gap-7 border-t border-[#383d36] pt-8 sm:grid-cols-2 sm:gap-10">
                  {story.solution.body.map((paragraph) => (
                    <p className="text-[13px] leading-7 text-[#adb1a8]" key={paragraph}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-20 grid gap-px overflow-hidden border border-[#343932] bg-[#343932] sm:grid-cols-2 lg:mt-28 lg:grid-cols-4">
              {project.features.map((feature, index) => (
                <div className="min-h-52 bg-[#191d18] p-6 sm:p-7" key={feature}>
                  <span className="font-mono text-[8px] tracking-[0.14em] text-[#c8f36a]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-20 max-w-[12rem] text-lg font-medium leading-6 tracking-[-0.04em]">
                    {feature}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-background py-20 sm:py-28 lg:py-36">
          <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-8">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-24">
              <div>
                <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-[#6e7168]">
                  Built as a system
                </p>
                <h2 className="mt-7 max-w-xl text-[clamp(2.8rem,5vw,5rem)] font-medium leading-[0.94] tracking-[-0.065em] text-ink">
                  Every screen had a job to do.
                </h2>
              </div>
              <div className="border-t border-[#bdbab0]">
                {project.pages.map((page, index) => (
                  <div
                    className="grid grid-cols-[2.5rem_1fr_auto] items-center border-b border-[#c9c6bc] py-6 sm:grid-cols-[4rem_1fr_auto]"
                    key={page}
                  >
                    <span className="font-mono text-[8px] text-[#85877f]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-lg font-medium tracking-[-0.04em] text-ink sm:text-xl">
                      {page}
                    </h3>
                    <ArrowUpRight className="text-[#8b8e85]" size={16} />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-20 grid gap-8 border-t border-[#bdbab0] pt-8 lg:mt-28 lg:grid-cols-[1fr_2fr]">
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#73766d]">
                Technology
              </p>
              <ul className="flex flex-wrap gap-2" aria-label="Technology stack">
                {project.stack.map((technology) => (
                  <li
                    className="rounded-full border border-[#bcb9af] px-4 py-2 font-mono text-[9px] uppercase tracking-[0.08em] text-[#4f524b]"
                    key={technology}
                  >
                    {technology}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="border-y border-[#d4d0c5] bg-[#fffefa]">
          <div className="mx-auto grid w-full max-w-[1280px] lg:grid-cols-[.72fr_1.28fr] lg:px-8">
            <div className="border-b border-[#d4d0c5] px-4 py-16 sm:px-8 lg:border-b-0 lg:border-r lg:px-0 lg:py-24 lg:pr-16">
              <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-[#73766d]">
                The impact
              </p>
              <dl className="mt-12 grid grid-cols-2 gap-6">
                {project.metrics?.slice(0, 2).map((metric) => (
                  <div key={metric.label}>
                    <dd className="font-serif text-5xl tracking-[-0.055em] text-ink sm:text-6xl">
                      {metric.value}
                    </dd>
                    <dt className="mt-3 font-mono text-[8px] uppercase tracking-[0.13em] text-[#74776e]">
                      {metric.label}
                    </dt>
                  </div>
                ))}
              </dl>
            </div>
            <div className="px-4 py-16 sm:px-8 lg:py-24 lg:pl-20 lg:pr-0">
              <h2 className="max-w-xl text-3xl font-medium leading-tight tracking-[-0.055em] text-ink sm:text-4xl">
                A product that keeps earning its place.
              </h2>
              <ul className="mt-10 space-y-5">
                {story.outcomes.map((outcome) => (
                  <li className="flex max-w-xl gap-4 text-[13px] leading-6 text-[#595c54]" key={outcome}>
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#dff6ab] text-[#263319]">
                      <Check size={14} />
                    </span>
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </article>

      {nextProject ? (
        <section className="bg-background py-20 sm:py-28">
          <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-8">
            <p className="mb-7 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-[#74776e]">
              Next case study
            </p>
            <Link
              className="group grid gap-7 border-t border-[#bdbab0] pt-7 lg:grid-cols-[1fr_auto] lg:items-end"
              href={"/projects/" + nextProject.slug}
            >
              <span>
                <span className="block text-[clamp(3.3rem,8vw,7.4rem)] font-medium leading-[0.9] tracking-[-0.075em] text-ink transition-colors group-hover:text-[#7568f8] motion-reduce:transition-none">
                  {nextProject.name}
                </span>
                <span className="mt-5 block font-serif text-lg italic text-[#686b63]">
                  {nextProject.tagline}
                </span>
              </span>
              <span className="grid h-16 w-16 place-items-center rounded-full bg-lime text-ink transition-transform group-hover:rotate-6 group-hover:scale-105 motion-reduce:transition-none sm:h-20 sm:w-20">
                <ArrowUpRight size={28} />
              </span>
            </Link>
          </div>
        </section>
      ) : null}

      <section className="bg-[#7568f8] py-16 text-white sm:py-20">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-4 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/70">
              Have a brief in mind?
            </p>
            <h2 className="mt-6 max-w-3xl text-[clamp(2.6rem,5vw,4.8rem)] font-medium leading-[0.94] tracking-[-0.065em]">
              Let’s make the next version real.
            </h2>
          </div>
          <Link
            className="inline-flex min-h-14 w-fit items-center justify-center gap-4 rounded-full bg-lime px-7 text-sm font-semibold text-ink transition-transform hover:-translate-y-1 motion-reduce:transition-none"
            href="/contact"
          >
            Start a project <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
