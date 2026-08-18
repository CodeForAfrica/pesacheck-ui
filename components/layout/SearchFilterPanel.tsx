"use client";

import { type ElementType, useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";
import { LuCheck } from "react-icons/lu";
import type {
  FilterDimension,
  FilterSelection,
} from "@/lib/data/fact-check-filters";
import { FILTERS, type FilterOption } from "@/lib/fact-checks-content";

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
        className="flex h-[52px] items-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 text-sm font-semibold text-neutral-900 transition-colors hover:border-pesacheck-blue"
      >
        <FilterIcon
          size={20}
          className="shrink-0 text-neutral-500"
          aria-hidden
        />
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
          className="absolute left-0 top-full z-30 mt-2 max-h-72 w-56 overflow-auto rounded-xl border border-neutral-200 bg-white p-1.5 shadow-[0px_10px_20px_0px_rgba(0,0,0,0.1)]"
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

/**
 * The header search bar's filter panel — dropdowns to stage a selection, plus
 * explicit "Clear filters" / "Apply filters" actions (filters only take
 * effect, navigating to `/search`, once applied).
 */
export function SearchFilterPanel({
  selected,
  openDropdown,
  onToggleDropdown,
  onToggleOption,
  onClear,
  onApply,
}: {
  selected: FilterSelection;
  openDropdown: FilterDimension | null;
  onToggleDropdown: (dimension: FilterDimension) => void;
  onToggleOption: (dimension: FilterDimension, value: string) => void;
  onClear: () => void;
  onApply: () => void;
}) {
  return (
    <div className="w-full rounded-xl border border-neutral-200 bg-white p-6 shadow-[0px_20px_40px_0px_rgba(2,29,51,0.12)]">
      <div className="flex flex-wrap items-center gap-3">
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

      <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-5">
        <button
          type="button"
          onClick={onClear}
          className="flex items-center gap-1.5 text-sm font-semibold text-neutral-900 transition-colors hover:text-neutral-600"
        >
          <FiX size={16} aria-hidden />
          Clear filters
        </button>

        <button
          type="button"
          onClick={onApply}
          className="flex items-center gap-2 rounded-xl bg-pesacheck-blue px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-pesacheck-blue/90"
        >
          <LuCheck size={16} aria-hidden />
          Apply filters
        </button>
      </div>
    </div>
  );
}
