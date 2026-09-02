"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import {
  type DimensionRequest,
  HeaderSearchBar,
} from "@/components/layout/HeaderSearchBar";
import type {
  FilterDimension,
  FilterOptions,
} from "@/lib/data/fact-check-filters";
import { NAV_ICONS, NAV_LINKS, type NavLink } from "@/lib/site";

/**
 * Site header. The search bar + filter panel live in `HeaderSearchBar`; its
 * dropdown contents (`filterOptions`) are fetched from Superdesk by the root
 * layout, so the filters are live rather than hardcoded.
 */
export function Header({
  filterOptions,
  navLinks = NAV_LINKS,
}: {
  filterOptions: FilterOptions;
  navLinks?: NavLink[];
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openMobile, setOpenMobile] = useState<string | null>(null);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [dimensionRequest, setDimensionRequest] =
    useState<DimensionRequest | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  // Close the click-opened mega-menu when clicking anywhere outside the nav.
  useEffect(() => {
    if (!openMenu) return;
    const onDocClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [openMenu]);

  // "By Language"/"By Topic"/"By Country" mega-menu links: open the search
  // bar's filter panel with the matching dropdown expanded, rather than
  // navigating straight to a listing page (filters live only in the header
  // search bar, and apply by landing on `/search`). The nonce re-triggers the
  // request when the same dimension is picked twice.
  const openFilterDimension = (dimension: FilterDimension) => {
    setOpenMenu(null);
    setDimensionRequest((cur) => ({
      dimension,
      nonce: (cur?.nonce ?? 0) + 1,
    }));
  };

  return (
    <>
      {/* Dark overlay when search or the filter panel is open */}
      {overlayOpen && (
        <div className="fixed inset-0 z-40 bg-black/30" aria-hidden />
      )}
      <header className="sticky top-0 z-50 h-[90px] w-full border-b border-white/40 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-[1240px] items-center gap-4 px-5 sm:px-8 lg:px-10 [@media(min-width:1320px)]:px-0">
          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center"
            aria-label="PesaCheck home"
          >
            <Image
              src="/pesacheck-logo.png"
              alt="PesaCheck"
              width={190}
              height={39}
              priority
              className="-ml-4 h-auto w-auto grayscale"
            />
          </Link>

          {/* Search (centered, grows) */}
          {/*
            `HeaderSearchBar` reads the URL (`useSearchParams`), which
            client-renders the subtree up to the nearest Suspense boundary — the
            fallback keeps the header's layout stable while it hydrates.
          */}
          <Suspense
            fallback={
              <div className="mx-auto hidden h-[60px] w-full max-w-[640px] rounded-xl border border-neutral-300 bg-gradient-to-r from-[#f5f5f5] to-[#f5f5f5]/60 md:block" />
            }
          >
            <HeaderSearchBar
              options={filterOptions}
              variant="desktop"
              dimensionRequest={dimensionRequest}
              onOverlayChange={setOverlayOpen}
              onNavigate={() => setMenuOpen(false)}
            />
          </Suspense>

          {/* Desktop nav */}
          <nav
            ref={navRef}
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpenMenu(null);
            }}
            className="hidden shrink-0 items-center gap-5 text-sm font-semibold text-neutral-900 lg:flex"
          >
            {navLinks.map((l) =>
              l.menu ? (
                <div key={l.label}>
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={openMenu === l.label}
                    onClick={() =>
                      setOpenMenu((v) => (v === l.label ? null : l.label))
                    }
                    className="flex items-center gap-1 font-semibold transition-colors hover:text-pesacheck-blue"
                  >
                    {l.label}
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                      className={`transition-transform duration-200 ${openMenu === l.label ? "rotate-180" : ""}`}
                    >
                      <path
                        d="M6 9l6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {/* Full-width mega-menu panel */}
                  <div
                    role="menu"
                    aria-label={l.label}
                    className={`absolute left-0 top-full w-full border-b border-neutral-100 bg-white shadow-[0px_10px_10px_0px_rgba(0,0,0,0.08)] transition-opacity duration-150 ${
                      openMenu === l.label
                        ? "visible opacity-100"
                        : "pointer-events-none invisible opacity-0"
                    }`}
                  >
                    <div className="mx-auto flex max-w-[1240px] gap-10 px-5 py-[30px] sm:px-8 lg:px-10 [@media(min-width:1320px)]:px-0">
                      <div className="w-[340px] shrink-0">
                        <h3 className="text-md font-bold text-neutral-800">
                          {l.label}
                        </h3>
                        <p className="mt-2.5 text-sm font-medium leading-5 text-neutral-800">
                          {l.menu.description}
                        </p>
                      </div>
                      <ul
                        className={`grid grow auto-cols-fr grid-flow-col gap-x-6 gap-y-[15px] ${l.menu.rows === 2 ? "grid-rows-2" : "grid-rows-3"}`}
                      >
                        {l.menu.items.map((item) => {
                          const ItemIcon = NAV_ICONS[item.icon];
                          return (
                            <li key={`${item.label}-${item.href}`}>
                              <Link
                                href={item.href}
                                role="menuitem"
                                onClick={(e) => {
                                  setOpenMenu(null);
                                  if (item.filterDimension) {
                                    e.preventDefault();
                                    openFilterDimension(item.filterDimension);
                                  }
                                }}
                                className="flex items-center gap-2 text-sm font-medium text-neutral-900 transition-colors hover:text-pesacheck-blue"
                              >
                                <ItemIcon
                                  size={20}
                                  className="shrink-0"
                                  aria-hidden
                                />
                                {item.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <a
                  key={l.label}
                  href={l.href}
                  className="transition-colors hover:text-pesacheck-blue"
                >
                  {l.label}
                </a>
              ),
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="ml-auto flex size-10 items-center justify-center rounded-lg text-neutral-900 lg:hidden"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              {menuOpen ? (
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="border-t border-neutral-100 bg-white px-5 py-4 lg:hidden">
            <Suspense
              fallback={
                <div className="h-12 rounded-xl border border-neutral-300 bg-neutral-50 md:hidden" />
              }
            >
              <HeaderSearchBar
                options={filterOptions}
                variant="mobile"
                dimensionRequest={dimensionRequest}
                onNavigate={() => setMenuOpen(false)}
              />
            </Suspense>
            <nav className="flex flex-col gap-3 text-sm font-semibold text-neutral-900">
              {navLinks.map((l) =>
                l.menu ? (
                  <div key={l.label}>
                    <button
                      type="button"
                      aria-expanded={openMobile === l.label}
                      onClick={() =>
                        setOpenMobile((v) => (v === l.label ? null : l.label))
                      }
                      className="flex w-full items-center justify-between py-1"
                    >
                      <span>{l.label}</span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden
                        className={`transition-transform duration-200 ${openMobile === l.label ? "rotate-180" : ""}`}
                      >
                        <path
                          d="M6 9l6 6 6-6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    {openMobile === l.label && (
                      <ul className="mt-2 mb-1 flex flex-col gap-3 border-l border-neutral-100 pl-4">
                        {l.menu.items.map((item) => {
                          const ItemIcon = NAV_ICONS[item.icon];
                          return (
                            <li key={`${item.label}-${item.href}`}>
                              <Link
                                href={item.href}
                                onClick={(e) => {
                                  if (item.filterDimension) {
                                    e.preventDefault();
                                    openFilterDimension(item.filterDimension);
                                  } else {
                                    setMenuOpen(false);
                                  }
                                }}
                                className="flex items-center gap-2 font-medium text-neutral-700"
                              >
                                <ItemIcon
                                  size={20}
                                  className="shrink-0"
                                  aria-hidden
                                />
                                {item.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                ) : (
                  <a
                    key={l.label}
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="py-1"
                  >
                    {l.label}
                  </a>
                ),
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
