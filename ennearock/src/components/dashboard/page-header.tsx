import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? (
          <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#74806f]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-[30px] font-semibold tracking-[-0.045em] text-[#11130f] sm:text-[36px]">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#676b63] sm:text-[15px]">
          {description}
        </p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
