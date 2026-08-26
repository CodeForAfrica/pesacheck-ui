"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { LuSlidersHorizontal } from "react-icons/lu";
import { SearchFilterPanel } from "@/components/layout/SearchFilterPanel";
import {
  countActiveFilters,
  EMPTY_FILTERS,
  FILTER_DIMENSIONS,
  type FilterDimension,
  type FilterOptions,
  type FilterSelection,
  filtersToQuery,
  parseFilterParams,
} from "@/lib/data/fact-check-filters";

/** URL params owned by the search bar — the ones "Clear" resets. */
const SEARCH_PARAMS = ["q", "page", ...FILTER_DIMENSIONS];

/** sessionStorage key holding the page a `/search` visit was launched from. */
const SEARCH_ORIGIN_KEY = "search-origin";

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function cloneSelection(sel: FilterSelection): FilterSelection {
  return {
    region: [...sel.region],
    language: [...sel.language],
    topic: [...sel.topic],
  };
}

/** A dimension the header nav asked us to open, re-triggered by `nonce`. */
export type DimensionRequest = { dimension: FilterDimension; nonce: number };

/**
 * The header's search field + filter panel.
 *
 * State is seeded from the URL (`?q=` and the filter params) and re-synced on
 * every navigation, so the bar always reflects what the page is actually showing
 * — which is also what makes "Clear filters" able to reset the page (it strips
 * those params from the current URL) rather than only clearing the dropdowns.
 *
 * The desktop and mobile bars are separate instances with independent state;
 * only one is reachable at a viewport width, and each seeds itself from the URL,
 * so they can't disagree about what's applied.
 *
 * Reading the URL with `useSearchParams` makes this subtree client-rendered on
 * prerendered routes, so `Header` wraps it in a `<Suspense>` boundary.
 */
export function HeaderSearchBar({
  options,
  variant,
  dimensionRequest,
  onOverlayChange,
  onNavigate,
}: {
  options: FilterOptions;
  variant: "desktop" | "mobile";
  /** Set when a mega-menu link ("By Language", …) should open a dropdown. */
  dimensionRequest?: DimensionRequest | null;
  /** Reports whether the page-dimming overlay should be shown. */
  onOverlayChange?: (open: boolean) => void;
  /** Called after a navigation, so the header can close its menus. */
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlKey = searchParams.toString();

  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [selection, setSelection] = useState<FilterSelection>(() =>
    parseFilterParams(Object.fromEntries(searchParams.entries())),
  );
  const [searchFocused, setSearchFocused] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<FilterDimension | null>(
    null,
  );
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Re-seed from the URL after any navigation (applying filters, back/forward,
  // or a "Clear" that stripped them), so the bar never shows stale state.
  useEffect(() => {
    const params = new URLSearchParams(urlKey);
    setQuery(params.get("q") ?? "");
    setSelection(parseFilterParams(Object.fromEntries(params.entries())));
  }, [urlKey]);

  useEffect(() => {
    onOverlayChange?.(searchFocused || panelOpen);
  }, [searchFocused, panelOpen, onOverlayChange]);

  // A mega-menu link ("By Language"/"By Topic"/"By Country") opens the panel
  // with that dropdown expanded instead of navigating to a listing page.
  useEffect(() => {
    if (!dimensionRequest) return;
    setPanelOpen(true);
    setOpenDropdown(dimensionRequest.dimension);
  }, [dimensionRequest]);

  const close = useCallback(() => {
    setSearchFocused(false);
    setPanelOpen(false);
    setOpenDropdown(null);
  }, []);

  // Close the search + filter panel on any click outside it. (Not `onBlur` —
  // that fires before a filter option's `onClick`, closing the panel before
  // the click can register.)
  useEffect(() => {
    if (!searchFocused && !panelOpen) return;
    const onDocMouseDown = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [searchFocused, panelOpen, close]);

  const activeFilterCount = countActiveFilters(selection);

  // Every header search action — typing a query, applying filters, or both —
  // lands on `/search` with whichever params are set.
  const goToSearch = () => {
    const params = new URLSearchParams(filtersToQuery(selection));
    if (query.trim()) params.set("q", query.trim());
    // Remember where the search started so "Clear filters" can return there
    // instead of stranding the reader on the empty `/search` screen. A search
    // refined from `/search` itself keeps the original origin.
    if (pathname !== "/search") {
      try {
        sessionStorage.setItem(
          SEARCH_ORIGIN_KEY,
          `${pathname}${urlKey ? `?${urlKey}` : ""}`,
        );
      } catch {}
    }
    const qs = params.toString();
    close();
    onNavigate?.();
    router.push(qs ? `/search?${qs}` : "/search");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim() || activeFilterCount > 0) goToSearch();
  };

  const toggleFilterOption = (dimension: FilterDimension, value: string) => {
    setSelection((cur) => {
      const next = cloneSelection(cur);
      next[dimension] = next[dimension].includes(value)
        ? next[dimension].filter((v) => v !== value)
        : [...next[dimension], value];
      return next;
    });
  };

  /**
   * "Clear filters" resets the *page*, not just the dropdowns (issue #60). On
   * `/search` that means leaving the search entirely: the reader is sent back to
   * the page they searched from (or home, if that's unknown) rather than being
   * left on the empty search screen. On any other page the search params are
   * stripped in place, preserving unrelated ones.
   */
  const clearFilters = () => {
    setSelection(EMPTY_FILTERS);
    setQuery("");
    setOpenDropdown(null);

    if (pathname === "/search") {
      let origin = "/";
      try {
        origin = sessionStorage.getItem(SEARCH_ORIGIN_KEY) ?? "/";
        sessionStorage.removeItem(SEARCH_ORIGIN_KEY);
      } catch {}
      close();
      onNavigate?.();
      router.push(origin);
      return;
    }

    const params = new URLSearchParams(urlKey);
    const applied = SEARCH_PARAMS.filter((key) => params.has(key));
    if (applied.length === 0) return;
    for (const key of applied) params.delete(key);

    close();
    onNavigate?.();
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const toggleDropdown = (dimension: FilterDimension) =>
    setOpenDropdown((cur) => (cur === dimension ? null : dimension));

  const togglePanel = () =>
    setPanelOpen((v) => {
      if (v) setOpenDropdown(null);
      return !v;
    });

  const filterButton = (
    <button
      type="button"
      onClick={togglePanel}
      aria-haspopup="true"
      aria-expanded={panelOpen}
      className={`flex shrink-0 items-center gap-1.5 border-l border-neutral-300 pl-3 text-sm font-semibold transition-colors ${
        activeFilterCount > 0
          ? "text-pesacheck-blue"
          : "text-neutral-700 hover:text-pesacheck-blue"
      }`}
    >
      <LuSlidersHorizontal size={16} aria-hidden />
      Filter
      {activeFilterCount > 0 && (
        <span className="flex size-5 items-center justify-center rounded-full bg-pesacheck-blue text-xs font-semibold text-white">
          {activeFilterCount}
        </span>
      )}
      <Chevron open={panelOpen} />
    </button>
  );

  const panel = (
    <SearchFilterPanel
      options={options}
      selected={selection}
      openDropdown={openDropdown}
      onToggleDropdown={toggleDropdown}
      onToggleOption={toggleFilterOption}
      onClear={clearFilters}
      onApply={goToSearch}
    />
  );

  if (variant === "mobile") {
    return (
      <div ref={containerRef}>
        <form
          onSubmit={handleSubmit}
          className="flex h-12 items-center gap-2 rounded-xl border border-neutral-300 bg-neutral-50 px-4 md:hidden"
        >
          <FiSearch size={16} className="opacity-60" aria-hidden />
          <input
            type="search"
            name="q"
            placeholder="Quick Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm font-medium placeholder:text-neutral-400 focus:outline-none"
          />
          {filterButton}
        </form>
        {panelOpen && <div className="mb-4 mt-4 md:hidden">{panel}</div>}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative z-50 mx-auto hidden w-full max-w-[640px] md:block"
    >
      <form
        onSubmit={handleSubmit}
        className={`flex h-[60px] w-full items-center gap-1 rounded-xl border bg-gradient-to-r from-[#f5f5f5] to-[#f5f5f5]/60 px-5 backdrop-blur-[5px] transition-colors duration-200 ${
          searchFocused || panelOpen
            ? "border-pesacheck-blue"
            : "border-neutral-300"
        }`}
      >
        <FiSearch size={16} className="shrink-0 opacity-60" aria-hidden />
        <input
          type="search"
          name="q"
          placeholder="Quick Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          className="w-full bg-transparent text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
        />
        {filterButton}
      </form>

      {panelOpen && (
        <div className="absolute left-0 top-full z-50 mt-3 w-full">{panel}</div>
      )}
    </div>
  );
}
