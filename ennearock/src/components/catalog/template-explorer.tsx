"use client";

import { useMemo, useState } from "react";

import { CatalogCard } from "@/components/catalog-card";
import { Search } from "@/components/icons";
import { categories, type Product } from "@/data/catalog";

type SortOption = "featured" | "newest" | "price-low" | "price-high";

const sortOptions: { label: string; value: SortOption }[] = [
  { label: "Featured first", value: "featured" },
  { label: "Recently updated", value: "newest" },
  { label: "Price: low to high", value: "price-low" },
  { label: "Price: high to low", value: "price-high" },
];

export function TemplateExplorer({ templates }: { templates: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [sort, setSort] = useState<SortOption>("featured");

  const visibleTemplates = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const matches = templates.filter((template) => {
      const matchesCategory =
        category === "All" || template.category === category;
      const matchesQuery =
        !normalizedQuery ||
        [
          template.name,
          template.tagline,
          template.description,
          template.category,
          ...template.stack,
          ...template.features,
        ]
          .join(" ")
          .toLocaleLowerCase()
          .includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });

    return matches.toSorted((left, right) => {
      if (sort === "price-low") return left.price - right.price;
      if (sort === "price-high") return right.price - left.price;
      if (sort === "newest") {
        return Date.parse(right.updatedAt) - Date.parse(left.updatedAt);
      }

      return Number(right.featured) - Number(left.featured);
    });
  }, [category, query, sort, templates]);

  function resetFilters() {
    setQuery("");
    setCategory("All");
    setSort("featured");
  }

  return (
    <section
      aria-labelledby="template-collection-title"
      className="bg-[#fffefa] py-20 sm:py-24 lg:py-28"
    >
      <div className="site-container">
        <div className="border-b border-[var(--line)] pb-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                Curated collection
              </p>
              <h2
                className="mt-3 text-3xl font-semibold tracking-[-0.055em] sm:text-4xl"
                id="template-collection-title"
              >
                Find your starting point.
              </h2>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              <div className="relative min-w-0 sm:w-72">
                <label className="sr-only" htmlFor="template-search">
                  Search templates
                </label>
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                  size={17}
                />
                <input
                  autoComplete="off"
                  className="h-12 w-full rounded-full border border-[var(--line)] bg-white pl-11 pr-11 text-sm outline-none transition placeholder:text-[#92948c] focus:border-[var(--violet)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--violet)_18%,transparent)]"
                  id="template-search"
                  maxLength={80}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by name, stack, feature…"
                  type="search"
                  value={query}
                />
                {query ? (
                  <button
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-lg text-[var(--muted)] transition hover:bg-[#ece9e0] hover:text-foreground"
                    onClick={() => setQuery("")}
                    type="button"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                ) : null}
              </div>

              <label className="sr-only" htmlFor="template-sort">
                Sort templates
              </label>
              <select
                className="h-12 rounded-full border border-[var(--line)] bg-white px-5 text-sm font-medium outline-none transition focus:border-[var(--violet)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--violet)_18%,transparent)]"
                id="template-sort"
                onChange={(event) => setSort(event.target.value as SortOption)}
                value={sort}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            aria-label="Filter templates by category"
            className="mt-7 flex gap-2 overflow-x-auto pb-1"
            role="group"
          >
            {categories.map((item) => {
              const active = item === category;

              return (
                <button
                  aria-pressed={active}
                  className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                    active
                      ? "border-foreground bg-foreground text-white"
                      : "border-[var(--line)] bg-transparent text-[var(--muted)] hover:border-foreground hover:text-foreground"
                  }`}
                  key={item}
                  onClick={() => setCategory(item)}
                  type="button"
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        <div
          aria-atomic="true"
          aria-live="polite"
          className="mb-8 mt-5 flex items-center justify-between gap-4 text-xs text-[var(--muted)]"
        >
          <p>
            <strong className="font-semibold text-foreground">
              {visibleTemplates.length}
            </strong>{" "}
            {visibleTemplates.length === 1 ? "template" : "templates"}
          </p>
          {query || category !== "All" ? (
            <button
              className="border-b border-current pb-0.5 font-semibold text-foreground transition hover:text-[var(--violet)]"
              onClick={resetFilters}
              type="button"
            >
              Reset filters
            </button>
          ) : null}
        </div>

        {visibleTemplates.length ? (
          <div className="catalog-grid">
            {visibleTemplates.map((template, index) => (
              <CatalogCard
                key={template.id}
                priority={index < 2}
                product={template}
              />
            ))}
            <span aria-hidden="true" className="hidden" />
          </div>
        ) : (
          <div className="flex min-h-80 flex-col items-center justify-center border border-dashed border-[#bbb8ae] bg-[#f5f2ea] px-6 text-center">
            <span className="mb-5 flex size-12 items-center justify-center rounded-full bg-white text-[var(--muted)] shadow-sm">
              <Search size={20} />
            </span>
            <h3 className="text-xl font-semibold tracking-[-0.035em]">
              Nothing matches just yet.
            </h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--muted)]">
              Try another category or a broader search. Every template is built
              to adapt well beyond its starting industry.
            </p>
            <button
              className="mt-6 rounded-full bg-foreground px-5 py-3 text-xs font-semibold text-white transition hover:bg-[var(--forest)]"
              onClick={resetFilters}
              type="button"
            >
              Show all templates
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
