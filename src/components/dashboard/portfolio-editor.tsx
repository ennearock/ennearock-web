"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useActionState,
  useMemo,
  useState,
  useTransition,
} from "react";
import {
  deletePortfolioAction,
  savePortfolioAction,
} from "@/app/dashboard/actions";
import {
  initialActionState,
  type ActionState,
  type PortfolioDraft,
} from "./admin-types";
import { CoverImageField } from "./cover-image-field";
import {
  EditorCard,
  Field,
  inputClassName,
  MetricListEditor,
  SetupNotice,
  StringListEditor,
  Toggle,
  useUnsavedChangesWarning,
} from "./editor-fields";
import { Icon } from "./icon";

type EditorTab = "basics" | "story" | "proof" | "seo";

const tabs: { id: EditorTab; label: string; icon: "edit" | "projects" | "sparkles" | "globe" }[] = [
  { id: "basics", label: "Basics & media", icon: "edit" },
  { id: "story", label: "Case study", icon: "projects" },
  { id: "proof", label: "Proof & delivery", icon: "sparkles" },
  { id: "seo", label: "SEO & placement", icon: "globe" },
];

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function ProjectPreview({ project }: { project: PortfolioDraft }) {
  return (
    <div className="overflow-hidden rounded-[18px] border border-[var(--line)] bg-white shadow-[0_16px_45px_rgba(19,20,24,.08)]">
      <div className="relative h-52 overflow-hidden" style={{ backgroundColor: project.accent }}>
        {project.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img alt="" className="h-full w-full object-cover" src={project.coverImageUrl} />
        ) : (
          <>
            <span className="absolute -right-12 -top-20 h-56 w-56 rounded-full border-[40px] border-white/20" />
            <span className="absolute bottom-5 left-5 right-5 rounded-[12px] border border-black/10 bg-white/35 p-4 backdrop-blur-sm">
              <span className="block h-1.5 w-20 rounded-full bg-black/20" />
              <span className="mt-3 block h-1 w-full rounded-full bg-black/10" />
              <span className="mt-2 block h-1 w-2/3 rounded-full bg-black/10" />
            </span>
          </>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-ink/90 px-2.5 py-1 font-mono text-[8px] font-semibold uppercase tracking-[0.1em] text-white">
          {project.category || "Category"}
        </span>
      </div>
      <div className="p-5">
        <p className="font-mono text-[8px] uppercase tracking-[0.13em] text-[var(--muted)]">
          Portfolio preview
        </p>
        <h3 className="mt-3 text-xl font-semibold tracking-[-0.045em]">
          {project.name || "Untitled project"}
        </h3>
        <p className="mt-2 font-serif text-[15px] italic leading-5 text-[var(--muted)]">
          {project.tagline || "Your project tagline will appear here."}
        </p>
        <div className="mt-5 grid grid-cols-2 border-t border-[var(--line)] pt-4">
          {(project.metrics.length ? project.metrics : [{ label: "Outcome", value: "—" }])
            .slice(0, 2)
            .map((metric, index) => (
              <div className={index ? "border-l border-[var(--line)] pl-4" : ""} key={index}>
                <p className="font-serif text-2xl tracking-[-0.04em]">{metric.value || "—"}</p>
                <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.1em] text-[var(--muted)]">
                  {metric.label || "Metric"}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export function PortfolioEditor({
  initialProject,
  setupMessage,
}: {
  initialProject: PortfolioDraft;
  setupMessage?: string | null;
}) {
  const router = useRouter();
  const wasNew = initialProject.id === null;
  const [project, setProject] = useState(initialProject);
  const [activeTab, setActiveTab] = useState<EditorTab>("basics");
  const [dirty, setDirty] = useState(false);
  const [slugTouched, setSlugTouched] = useState(!wasNew);
  const [coverUploading, setCoverUploading] = useState(false);
  const [state, formAction, pending] = useActionState(
    async (previousState: ActionState, formData: FormData) => {
      const result = await savePortfolioAction(previousState, formData);
      if (result.status === "success") {
        setProject((current) => ({
          ...current,
          id: result.id ?? current.id,
          slug: result.slug ?? current.slug,
          published: result.published ?? current.published,
        }));
        setDirty(false);
        if (wasNew && result.id) {
          router.replace("/dashboard/portfolio/" + result.id);
        }
      }
      return result;
    },
    initialActionState,
  );
  const [deleting, startDelete] = useTransition();
  const [deleteMessage, setDeleteMessage] = useState("");

  function update<K extends keyof PortfolioDraft>(
    key: K,
    value: PortfolioDraft[K],
  ) {
    setProject((current) => ({ ...current, [key]: value }));
    setDirty(true);
  }

  useUnsavedChangesWarning(dirty);

  const readiness = useMemo(
    () => [
      [Boolean(project.name && project.slug), "Project name and URL"],
      [Boolean(project.tagline && project.description), "Tagline and summary"],
      [Boolean(project.client && project.duration && project.engagement), "Client and engagement"],
      [Boolean(project.story.intro), "Story introduction"],
      [Boolean(project.story.challenge.title && project.story.challenge.body.some(Boolean)), "Challenge section"],
      [Boolean(project.story.solution.title && project.story.solution.body.some(Boolean)), "Solution section"],
    ] as [boolean, string][],
    [project],
  );
  const readyCount = readiness.filter(([ready]) => ready).length;

  function removeProject() {
    if (!project.id) return;
    if (!window.confirm('Delete "' + project.name + '"? This permanently removes the project.')) return;
    setDeleteMessage("");
    startDelete(async () => {
      const result = await deletePortfolioAction(project.id ?? "");
      if (result.status === "success") {
        router.push("/dashboard/portfolio");
        router.refresh();
        return;
      }
      setDeleteMessage(result.message);
    });
  }

  return (
    <form
      action={formAction}
      aria-busy={pending || coverUploading}
      onKeyDown={(event) => {
        if (
          !pending &&
          !coverUploading &&
          (event.ctrlKey || event.metaKey) &&
          event.key === "Enter"
        ) {
          event.preventDefault();
          event.currentTarget.requestSubmit();
        }
      }}
    >
      <input name="payload" type="hidden" value={JSON.stringify(project)} />
      <fieldset className="contents" disabled={pending || coverUploading}>

      <SetupNotice message={setupMessage} />

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="min-w-0">
          <nav
            aria-label="Project editor sections"
            className="mb-4 flex gap-1 overflow-x-auto rounded-[14px] border border-[var(--line)] bg-white p-1.5"
          >
            {tabs.map((tab) => (
              <button
                aria-current={activeTab === tab.id ? "page" : undefined}
                className={
                  "flex h-10 shrink-0 items-center gap-2 rounded-[10px] px-3 text-[10px] font-semibold transition sm:flex-1 sm:justify-center " +
                  (activeTab === tab.id
                    ? "bg-ink text-white"
                    : "text-[var(--muted)] hover:bg-surface-muted hover:text-ink")
                }
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                type="button"
              >
                <Icon className="h-3.5 w-3.5" name={tab.icon} /> {tab.label}
              </button>
            ))}
          </nav>

          {activeTab === "basics" ? (
            <div className="space-y-5">
              <EditorCard
                description="The essentials used on portfolio cards, the project page, and search previews."
                title="Project identity"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Project name" hint="Required · 120 characters">
                    <input
                      autoFocus={wasNew}
                      className={inputClassName}
                      maxLength={120}
                      onChange={(event) => {
                        const name = event.target.value;
                        setProject((current) => ({
                          ...current,
                          name,
                          slug: wasNew && !slugTouched ? slugify(name) : current.slug,
                        }));
                        setDirty(true);
                      }}
                      placeholder="Northstar Operations"
                      required
                      value={project.name}
                    />
                  </Field>
                  <Field label="URL slug" hint="lowercase-and-hyphens">
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3.5 top-[17px] text-[9px] text-[var(--muted)]">/projects/</span>
                      <input
                        className={inputClassName + " pl-[70px]"}
                        maxLength={80}
                        onChange={(event) => {
                          setSlugTouched(true);
                          update("slug", slugify(event.target.value));
                        }}
                        pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                        required
                        value={project.slug}
                      />
                    </div>
                  </Field>
                </div>
                <Field label="Tagline" hint="One memorable sentence">
                  <input
                    className={inputClassName}
                    maxLength={180}
                    onChange={(event) => update("tagline", event.target.value)}
                    placeholder="One shared view for a fast-moving operations team."
                    value={project.tagline}
                  />
                </Field>
                <Field label="Project summary" hint={project.description.length + "/1,200"}>
                  <textarea
                    className={inputClassName + " min-h-32 resize-y py-3 leading-5"}
                    maxLength={1200}
                    onChange={(event) => update("description", event.target.value)}
                    placeholder="Explain what was built and why it mattered."
                    value={project.description}
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Field label="Category">
                    <select className={inputClassName} onChange={(event) => update("category", event.target.value)} value={project.category}>
                      {["SaaS", "E-commerce", "Portfolio", "AI", "Healthcare", "Fintech"].map((category) => <option key={category} value={category}>{category}</option>)}
                    </select>
                  </Field>
                  <Field label="Visual theme">
                    <select className={inputClassName} onChange={(event) => update("theme", event.target.value as PortfolioDraft["theme"])} value={project.theme}>
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="warm">Warm</option>
                    </select>
                  </Field>
                  <Field label="Accent color">
                    <span className="relative block">
                      <input className={inputClassName + " pr-12 font-mono uppercase"} maxLength={7} onChange={(event) => update("accent", event.target.value)} pattern="#[0-9A-Fa-f]{6}" value={project.accent} />
                      <input aria-label="Pick accent color" className="absolute right-2 top-[15px] h-7 w-8 cursor-pointer rounded border-0 bg-transparent p-0" onChange={(event) => update("accent", event.target.value.toUpperCase())} type="color" value={/^#[0-9A-Fa-f]{6}$/.test(project.accent) ? project.accent : "#E2E5EB"} />
                    </span>
                  </Field>
                  <Field label="Display order" hint="Lower appears first">
                    <input className={inputClassName} max={10000} min={0} onChange={(event) => update("sortOrder", Number(event.target.value))} type="number" value={project.sortOrder} />
                  </Field>
                </div>
              </EditorCard>

              <EditorCard description="Shown in the project header beside the case-study introduction." title="Client & engagement">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Client"><input className={inputClassName} maxLength={120} onChange={(event) => update("client", event.target.value)} placeholder="Distributed consultancy" value={project.client} /></Field>
                  <Field label="Timeline"><input className={inputClassName} maxLength={80} onChange={(event) => update("duration", event.target.value)} placeholder="14 weeks" value={project.duration} /></Field>
                </div>
                <Field label="Engagement"><input className={inputClassName} maxLength={180} onChange={(event) => update("engagement", event.target.value)} placeholder="Product strategy, UX & engineering" value={project.engagement} /></Field>
              </EditorCard>

              <EditorCard description="Upload a landscape image or paste a hosted URL. Without one, Ennearock uses the project accent artwork." title="Cover image">
                <CoverImageField accent={project.accent} onChange={(value) => update("coverImageUrl", value)} onUploadingChange={setCoverUploading} value={project.coverImageUrl} />
              </EditorCard>
            </div>
          ) : null}

          {activeTab === "story" ? (
            <div className="space-y-5">
              <EditorCard description="The opening context shown beside the project title." title="Story introduction">
                <Field label="Introduction" hint={project.story.intro.length + "/2,000"}>
                  <textarea className={inputClassName + " min-h-36 resize-y py-3 leading-6"} maxLength={2000} onChange={(event) => {
                    update("story", { ...project.story, intro: event.target.value });
                  }} placeholder="Set the scene: what changed, what the client needed, and what you made together." value={project.story.intro} />
                </Field>
              </EditorCard>

              <EditorCard description="Frame the business or customer problem before explaining the response." title="The opportunity">
                <Field label="Challenge heading"><input className={inputClassName} maxLength={180} onChange={(event) => update("story", { ...project.story, challenge: { ...project.story.challenge, title: event.target.value } })} placeholder="The work moved quickly. The system around it did not." value={project.story.challenge.title} /></Field>
                <Field label="Challenge paragraphs">
                  <StringListEditor addLabel="Add paragraph" maxItems={6} multiline onChange={(body) => update("story", { ...project.story, challenge: { ...project.story.challenge, body } })} placeholder="Describe the context and constraints…" values={project.story.challenge.body} />
                </Field>
              </EditorCard>

              <EditorCard description="Explain the product decision and how the work came together." title="The response">
                <Field label="Solution heading"><input className={inputClassName} maxLength={180} onChange={(event) => update("story", { ...project.story, solution: { ...project.story.solution, title: event.target.value } })} placeholder="One shared rhythm, designed into the product." value={project.story.solution.title} /></Field>
                <Field label="Solution paragraphs">
                  <StringListEditor addLabel="Add paragraph" maxItems={6} multiline onChange={(body) => update("story", { ...project.story, solution: { ...project.story.solution, body } })} placeholder="Describe the approach and key decisions…" values={project.story.solution.body} />
                </Field>
              </EditorCard>

              <EditorCard description="Keep each outcome concrete and easy to scan." title="The impact">
                <StringListEditor addLabel="Add outcome" maxItems={8} onChange={(outcomes) => update("story", { ...project.story, outcomes })} placeholder="A measurable or meaningful result" values={project.story.outcomes} />
              </EditorCard>
            </div>
          ) : null}

          {activeTab === "proof" ? (
            <div className="space-y-5">
              <EditorCard description="The first two metrics are highlighted on cards and the project page." title="Outcome metrics">
                <MetricListEditor onChange={(metrics) => update("metrics", metrics)} values={project.metrics} />
              </EditorCard>
              <EditorCard description="Short capability statements shown in the dark project section." title="Features delivered">
                <StringListEditor addLabel="Add feature" maxItems={12} onChange={(features) => update("features", features)} placeholder="Role-aware workspaces" values={project.features} />
              </EditorCard>
              <EditorCard description="Name the important screens or product areas in the system." title="Pages & product areas">
                <StringListEditor addLabel="Add page" maxItems={12} onChange={(pages) => update("pages", pages)} placeholder="Workspace" values={project.pages} />
              </EditorCard>
              <EditorCard description="Technologies appear as compact tags near the end of the case study." title="Technology stack">
                <StringListEditor addLabel="Add technology" maxItems={16} onChange={(stack) => update("stack", stack)} placeholder="Next.js" values={project.stack} />
              </EditorCard>
            </div>
          ) : null}

          {activeTab === "seo" ? (
            <div className="space-y-5">
              <EditorCard description="Search engines fall back to the project name and summary when these are empty." title="Search preview">
                <Field label="SEO title" hint={project.seoTitle.length + "/70"}><input className={inputClassName} maxLength={70} onChange={(event) => update("seoTitle", event.target.value)} placeholder={project.name || "Project name · Ennearock"} value={project.seoTitle} /></Field>
                <Field label="SEO description" hint={project.seoDescription.length + "/180"}><textarea className={inputClassName + " min-h-28 resize-y py-3 leading-5"} maxLength={180} onChange={(event) => update("seoDescription", event.target.value)} placeholder={project.description || "A concise project description for search and social cards."} value={project.seoDescription} /></Field>
                <div className="rounded-[14px] border border-[var(--line)] bg-background p-4">
                  <p className="text-[10px] text-[#3f6fb1]">ennearock.com › projects › {project.slug || "project"}</p>
                  <p className="mt-1 text-[17px] text-[#263f75]">{project.seoTitle || project.name || "Untitled project"}</p>
                  <p className="mt-1 line-clamp-2 text-[10px] leading-5 text-[var(--muted)]">{project.seoDescription || project.description || "Your project description will appear here."}</p>
                </div>
              </EditorCard>
              <EditorCard description="Featured projects are eligible for the Selected Work section on the homepage." title="Homepage placement">
                <Toggle checked={project.featured} description="Only published projects can appear on the public homepage." label="Feature on homepage" onChange={(checked) => update("featured", checked)} />
              </EditorCard>
              {project.id ? (
                <EditorCard description="Deleting removes the project and its public case-study page. Uploaded files are not removed automatically." title="Danger zone">
                  <div className="flex flex-col gap-4 rounded-[14px] border border-[#e4c3bc] bg-[#fff9f7] p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div><p className="text-[11px] font-semibold text-[#7b3329]">Delete this project</p><p className="mt-1 text-[9px] leading-4 text-[#8c625b]">This action cannot be undone.</p></div>
                    <button className="h-10 shrink-0 rounded-[10px] border border-[#d99f93] px-4 text-[10px] font-semibold text-[#93493b] hover:bg-[#f8e5e1] disabled:opacity-50" disabled={deleting} onClick={removeProject} type="button">{deleting ? "Deleting…" : "Delete project"}</button>
                  </div>
                  {deleteMessage ? <p className="text-[10px] text-[#93493b]" role="alert">{deleteMessage}</p> : null}
                </EditorCard>
              ) : null}
            </div>
          ) : null}
        </div>

        <aside className="space-y-4 xl:sticky xl:top-[90px] xl:self-start">
          <ProjectPreview project={project} />
          <section className="rounded-[18px] border border-[var(--line)] bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold">Ready to publish</p>
              <span className="rounded-full bg-[var(--line)] px-2 py-1 font-mono text-[8px] text-[var(--muted)]">{readyCount}/{readiness.length}</span>
            </div>
            <div className="mt-4 space-y-2.5">
              {readiness.map(([ready, label]) => (
                <div className="flex items-center gap-2.5" key={label}>
                  <span className={"grid h-5 w-5 place-items-center rounded-full " + (ready ? "bg-surface-muted text-[#52702f]" : "bg-surface-muted text-[var(--muted)]")}><Icon className="h-3 w-3" name={ready ? "check" : "clock"} /></span>
                  <span className={"text-[9px] " + (ready ? "text-ink" : "text-[var(--muted)]")}>{label}</span>
                </div>
              ))}
            </div>
            {project.published ? (
              <Link className="mt-5 inline-flex h-9 w-full items-center justify-center gap-2 rounded-[10px] border border-[var(--line)] text-[9px] font-semibold" href={"/projects/" + project.slug} target="_blank">Open live page <Icon className="h-3.5 w-3.5" name="external" /></Link>
            ) : null}
          </section>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-background/95 px-4 py-3 shadow-[0_-12px_40px_rgba(19,20,24,.08)] backdrop-blur-xl lg:left-[276px]">
        <div className="mx-auto flex max-w-[1430px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className={"h-2 w-2 rounded-full " + (project.published ? "bg-ink" : "bg-[var(--line)]")} />
              <p className="text-[10px] font-semibold">{project.published ? "Published" : "Draft"}{dirty ? " · Unsaved changes" : " · All changes saved"}</p>
            </div>
            <p aria-live="polite" className={"mt-1 truncate text-[9px] " + (state.status === "error" ? "text-[#9a4f41]" : "text-[var(--muted)]")}>{coverUploading ? "Uploading the cover…" : pending ? "Saving your changes…" : state.message || "Use Ctrl/⌘ + Enter to submit the current form."}</p>
          </div>
          <div className="flex gap-2">
            <Link className="inline-flex h-10 items-center justify-center rounded-[10px] border border-[var(--line)] bg-white px-4 text-[10px] font-semibold" href="/dashboard/portfolio">Back</Link>
            <button className="h-10 rounded-[10px] border border-[var(--line)] bg-white px-4 text-[10px] font-semibold disabled:cursor-wait disabled:opacity-55" disabled={pending} name="intent" type="submit" value="save">{project.published ? "Save changes" : "Save draft"}</button>
            {project.published ? (
              <button className="h-10 rounded-[10px] bg-[var(--muted)] px-4 text-[10px] font-semibold text-white disabled:opacity-55" disabled={pending} name="intent" type="submit" value="unpublish">Unpublish</button>
            ) : (
              <button className="inline-flex h-10 items-center gap-2 rounded-[10px] bg-ink px-4 text-[10px] font-semibold text-white disabled:cursor-wait disabled:opacity-55" disabled={pending} name="intent" type="submit" value="publish"><Icon className="h-3.5 w-3.5" name="arrow-up" /> Publish</button>
            )}
          </div>
        </div>
      </div>
      </fieldset>
    </form>
  );
}
