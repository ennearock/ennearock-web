import type { Project } from "@/data/catalog";

interface ProjectVisualProps {
  project: Project;
  size?: "card" | "hero";
}

export function ProjectVisual({ project, size = "card" }: ProjectVisualProps) {
  const isCommerce = project.category === "E-commerce";
  const sizeClass =
    size === "hero"
      ? "min-h-[30rem] sm:min-h-[38rem] lg:min-h-[46rem]"
      : "aspect-[4/3] min-h-[20rem]";

  return (
    <div
      aria-label={"A stylized preview of the " + project.name + " digital product"}
      className={
        "relative isolate w-full overflow-hidden " +
        sizeClass +
        (isCommerce ? " bg-[#d9c0a5]" : " bg-[#253229]")
      }
      role="img"
    >
      <div aria-hidden="true" className="absolute inset-0">
        {isCommerce ? (
          <CommercePreview name={project.name} size={size} />
        ) : (
          <OperationsPreview name={project.name} size={size} />
        )}
      </div>
    </div>
  );
}

function OperationsPreview({
  name,
  size,
}: {
  name: string;
  size: "card" | "hero";
}) {
  const chartBars = [
    ["42", "h-[42%]"],
    ["66", "h-[66%]"],
    ["48", "h-[48%]"],
    ["82", "h-[82%]"],
    ["64", "h-[64%]"],
    ["91", "h-[91%]"],
    ["78", "h-[78%]"],
  ];
  const frameClass =
    size === "hero"
      ? "inset-x-[5%] bottom-0 top-[10%] rounded-t-[1.75rem] sm:inset-x-[8%] sm:top-[12%]"
      : "inset-x-[7%] bottom-0 top-[12%] rounded-t-2xl";

  return (
    <>
      <div className="absolute -left-24 top-1/4 h-64 w-64 rounded-full bg-[#ffb547]/10 blur-3xl" />
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-[#ffb547]/20" />
      <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full border border-[#ffb547]/10" />
      <div
        className={
          "absolute overflow-hidden border border-white/15 bg-[#f6f4ed] shadow-2xl shadow-black/40 " +
          frameClass
        }
      >
        <div className="flex h-9 items-center gap-1.5 border-b border-black/10 bg-white px-4 sm:h-11">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ff6b5f]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#ffbd45]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#62c554]" />
          <span className="ml-3 truncate text-[7px] font-semibold tracking-[-0.02em] text-[#1b221c] sm:text-[9px]">
            {name}
          </span>
          <span className="ml-auto h-4 w-4 rounded-full bg-[#d8e1d7]" />
        </div>
        <div className="grid h-full grid-cols-[2.9rem_1fr] bg-[#f4f3ee] sm:grid-cols-[4.75rem_1fr]">
          <div className="border-r border-black/10 bg-[#182019] px-2 py-4 sm:px-3 sm:py-5">
            <span className="mb-5 block h-5 w-5 rounded-md bg-[#ffb547] sm:h-7 sm:w-7" />
            <div className="space-y-3">
              {["w-full", "w-4/5", "w-full", "w-3/5"].map((width, index) => (
                <div className="flex items-center gap-1.5" key={width + "-" + index}>
                  <span className="h-1.5 w-1.5 shrink-0 rounded-sm bg-white/30" />
                  <span className={"h-1 rounded-full bg-white/20 " + width} />
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-hidden p-3 sm:p-6">
            <div className="mb-4 flex items-end justify-between sm:mb-7">
              <div>
                <span className="block h-1 w-10 rounded-full bg-[#9ba096] sm:w-16" />
                <span className="mt-2 block h-3 w-24 rounded-full bg-[#1c231d] sm:h-4 sm:w-40" />
              </div>
              <span className="h-6 w-16 rounded-full bg-[#182019] sm:h-8 sm:w-24" />
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {["12", "08", "96%"].map((value, index) => (
                <div className="border border-black/10 bg-white p-2 sm:p-4" key={value}>
                  <span className="block text-[5px] uppercase tracking-[0.12em] text-[#8a8e85] sm:text-[7px]">
                    {index === 2 ? "On track" : "Active"}
                  </span>
                  <strong className="mt-2 block text-xs font-medium tracking-[-0.05em] text-[#182019] sm:text-xl">
                    {value}
                  </strong>
                </div>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-[1.35fr_.65fr] gap-2 sm:mt-3 sm:gap-3">
              <div className="relative min-h-24 overflow-hidden border border-black/10 bg-white p-3 sm:min-h-44 sm:p-5">
                <span className="block h-1 w-14 rounded-full bg-[#1c231d]/20" />
                <div className="absolute inset-x-3 bottom-3 flex h-[58%] items-end gap-1 sm:inset-x-5 sm:bottom-5 sm:gap-2">
                  {chartBars.map(([height, heightClass], index) => (
                    <span
                      className={
                        "flex-1 rounded-t-sm " +
                        heightClass +
                        " " +
                        (index === 5 ? "bg-[#ffb547]" : "bg-[#dce4d8]")
                      }
                      key={height}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-1.5 border border-black/10 bg-white p-2.5 sm:space-y-3 sm:p-4">
                {["AL", "MR", "JS", "YK"].map((initials, index) => (
                  <div
                    className="flex items-center gap-1.5 border-b border-black/5 pb-1.5 last:border-0"
                    key={initials}
                  >
                    <span
                      className={
                        "grid h-4 w-4 place-items-center rounded-full text-[4px] font-bold sm:h-6 sm:w-6 sm:text-[6px] " +
                        (index === 0 ? "bg-[#ffb547]" : "bg-[#e6e9e1]")
                      }
                    >
                      {initials}
                    </span>
                    <span className="h-1 flex-1 rounded-full bg-[#d7dad3]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function CommercePreview({
  name,
  size,
}: {
  name: string;
  size: "card" | "hero";
}) {
  const frameClass =
    size === "hero"
      ? "inset-x-[5%] bottom-0 top-[9%] sm:inset-x-[8%] sm:top-[12%]"
      : "inset-x-[7%] bottom-0 top-[12%]";

  return (
    <>
      <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-[#f4e8d8]/45 blur-2xl" />
      <div className="absolute -bottom-32 -right-28 h-80 w-80 rounded-full border border-[#6e392c]/20" />
      <div
        className={
          "absolute overflow-hidden bg-[#f6efe5] shadow-2xl shadow-[#5d382a]/25 " +
          frameClass
        }
      >
        <div className="flex h-11 items-center border-b border-[#35231d]/10 px-4 sm:h-14 sm:px-7">
          <strong className="font-serif text-[9px] uppercase tracking-[0.18em] text-[#30221d] sm:text-xs">
            {name}
          </strong>
          <div className="ml-auto flex items-center gap-3 text-[5px] uppercase tracking-[0.12em] text-[#66534b] sm:gap-6 sm:text-[7px]">
            <span>Collection</span>
            <span>Stories</span>
            <span className="grid h-5 w-5 place-items-center rounded-full border border-[#30221d]/30">2</span>
          </div>
        </div>
        <div className="grid h-[64%] grid-cols-[.9fr_1.1fr] border-b border-[#35231d]/10">
          <div className="flex flex-col justify-center px-4 sm:px-8 lg:px-12">
            <span className="text-[5px] uppercase tracking-[0.2em] text-[#9b5a43] sm:text-[7px]">Objects for quiet rituals</span>
            <span className="mt-2 block max-w-48 font-serif text-lg leading-[.95] tracking-[-0.05em] text-[#30221d] sm:mt-4 sm:text-3xl lg:text-5xl">
              Shape a slower home.
            </span>
            <span className="mt-3 h-px w-12 bg-[#30221d] sm:mt-6 sm:w-20" />
          </div>
          <div className="relative overflow-hidden bg-[#c77756]">
            <div className="absolute inset-x-[16%] bottom-[12%] top-[12%] rounded-[46%_46%_28%_28%] bg-[#ecd7bf] shadow-xl shadow-[#6f3524]/20" />
            <div className="absolute left-[43%] top-[5%] h-[28%] w-[14%] rounded-t-full bg-[#ecd7bf]" />
            <div className="absolute bottom-[5%] left-[5%] h-16 w-16 rounded-full border border-[#f5dfc8]/40 sm:h-28 sm:w-28" />
            <div className="absolute right-[4%] top-[8%] h-12 w-12 rounded-full border border-[#f5dfc8]/40 sm:h-20 sm:w-20" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-px bg-[#35231d]/10">
          {["Clay", "Linen", "Light"].map((label, index) => (
            <div className="flex items-center gap-2 bg-[#f6efe5] p-2 sm:gap-3 sm:p-4" key={label}>
              <span
                className={
                  "h-7 w-7 shrink-0 rounded-sm sm:h-11 sm:w-11 " +
                  (index === 0
                    ? "bg-[#bb7255]"
                    : index === 1
                      ? "bg-[#d9c7ae]"
                      : "bg-[#efe2cc]")
                }
              />
              <span>
                <b className="block text-[5px] font-medium uppercase tracking-[0.12em] text-[#30221d] sm:text-[7px]">{label}</b>
                <i className="mt-1 block h-px w-5 bg-[#30221d]/25 sm:w-8" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
