"use client";

import { type ElementType, useEffect, useRef } from "react";
import type { FilterSelection } from "@/lib/data/fact-check-filters";
import {
  FILTERS,
  type FilterDimension,
  type FilterOption,
  filterLabel,
} from "@/lib/fact-checks-content";

export type Selection = FilterSelection;

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
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

function Close({ className = "" }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Dropdown({
  dimension,
  label,
  icon: FilterIcon,
  options,
  selected,
  open,
  onToggleOpen,
  onToggleOption,
}: {
  dimension: FilterDimension;
  label: string;
  icon: ElementType;
  options: FilterOption[];
  selected: string[];
  open: boolean;
  onToggleOpen: () => void;
  onToggleOption: (dimension: FilterDimension, value: string) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  // Close this dropdown on any mousedown outside its button + options panel —
  // clicking elsewhere in the filter bar (chips, another dropdown, the heading)
  // or anywhere on the page dismisses it. Clicks on the button/options are
  // inside `ref` and handled by their own onClick.
  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onToggleOpen();
      }
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [open, onToggleOpen]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={onToggleOpen}
        className="flex h-11 items-center gap-2 rounded-[10px] border-[0.5px] border-neutral-300 bg-white px-[18px] text-sm font-medium text-neutral-900 transition-colors hover:border-pesacheck-blue"
      >
        <FilterIcon size={20} className="shrink-0" aria-hidden />
        {label}
        {selected.length > 0 && (
          <span className="flex size-5 items-center justify-center rounded-full bg-pesacheck-blue text-xs font-semibold text-white">
            {selected.length}
          </span>
        )}
        <Chevron open={open} />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={label}
          className="absolute left-0 top-full z-30 mt-2 max-h-72 w-56 overflow-auto rounded-[10px] border-[0.5px] border-neutral-200 bg-white p-1.5 shadow-[0px_10px_20px_0px_rgba(0,0,0,0.1)]"
        >
          {options.map((opt) => {
            const checked = selected.includes(opt.code);
            return (
              <li key={opt.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={checked}
                  onClick={() => onToggleOption(dimension, opt.code)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50"
                >
                  <span
                    className={`flex size-4 shrink-0 items-center justify-center rounded border ${
                      checked
                        ? "border-pesacheck-blue bg-pesacheck-blue text-white"
                        : "border-neutral-300"
                    }`}
                  >
                    {checked && <Check />}
                  </span>
                  {opt.label}
                </button>
              </li>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function FilterBar({
  selected,
  openDropdown,
  chips,
  onToggleDropdown,
  onToggleOption,
  onRemoveChip,
  onApply,
  onClear,
}: {
  selected: Selection;
  openDropdown: FilterDimension | null;
  chips: { dimension: FilterDimension; value: string }[];
  onToggleDropdown: (dimension: FilterDimension) => void;
  onToggleOption: (dimension: FilterDimension, value: string) => void;
  onRemoveChip: (dimension: FilterDimension, value: string) => void;
  onApply: () => void;
  onClear: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-[1030px] rounded-[20px] border-[0.5px] border-neutral-200 bg-white p-6 shadow-[0px_10px_30px_0px_rgba(2,29,51,0.08)] sm:p-8">
      <p className="text-center text-base font-bold text-gray-800">
        Filter By:
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
        {FILTERS.map((f) => (
          <Dropdown
            key={f.dimension}
            dimension={f.dimension}
            label={f.label}
            icon={f.icon}
            options={f.options}
            selected={selected[f.dimension]}
            open={openDropdown === f.dimension}
            onToggleOpen={() => onToggleDropdown(f.dimension)}
            onToggleOption={onToggleOption}
          />
        ))}
      </div>

      {/*
        Always render this row so its height is reserved up-front: selecting the
        first filter then reveals chips/actions in place instead of growing the
        card and shoving the listing down (`min-h` holds one row's worth of space).
      */}
      <div className="mt-5 flex min-h-[34px] flex-wrap items-center justify-center gap-3">
        {chips.length > 0 && (
          <>
            {chips.map((chip) => {
              const label = filterLabel(chip.dimension, chip.value);
              return (
                <span
                  key={`${chip.dimension}-${chip.value}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-pesacheck-blue py-[5px] pl-3 pr-2.5 text-sm font-medium text-white"
                >
                  {label}
                  <button
                    type="button"
                    aria-label={`Remove ${label} filter`}
                    onClick={() => onRemoveChip(chip.dimension, chip.value)}
                    className="text-white/80 transition-colors hover:text-white"
                  >
                    <Close />
                  </button>
                </span>
              );
            })}

            <button
              type="button"
              onClick={onApply}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-pesacheck-blue"
            >
              <Check />
              Apply Filters
            </button>
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#fc0d18] transition-colors hover:text-[#d00b15]"
            >
              <Close />
              Clear Filters
            </button>
          </>
        )}
      </div>
    </div>
  );
}
