"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { NAV_LINKS } from "@/lib/site";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 h-[90px] w-full border-b border-white/40 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[1440px] items-center gap-4 px-5 sm:px-8 lg:px-[100px]">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center" aria-label="PesaCheck home">
          <Image
            src="/images/header-logo/pesacheck-logo.png"
            alt="PesaCheck"
            width={190}
            height={39}
            priority
            className="h-[39px] w-auto mix-blend-exclusion"
          />
        </Link>

        {/* Search (centered, grows) */}
        <form
          role="search"
          onSubmit={(e) => e.preventDefault()}
          className="mx-auto hidden h-[60px] w-full max-w-[400px] items-center gap-1 rounded-[13px] border-[0.5px] border-neutral-300 bg-gradient-to-r from-[#f5f5f5] to-[#f5f5f5]/60 px-5 backdrop-blur-[5px] md:flex"
        >
          <Icon name="search" size={16} className="shrink-0 opacity-60" />
          <input
            type="search"
            placeholder="Quick Search"
            className="w-full bg-transparent text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
          />
        </form>

        {/* Desktop nav */}
        <nav className="hidden shrink-0 items-center gap-5 text-sm font-semibold text-neutral-900 lg:flex">
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} className="transition-colors hover:text-pesacheck-blue">
              {l.label}
            </a>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="ml-auto flex size-10 items-center justify-center rounded-lg text-neutral-900 lg:hidden"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            {menuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="border-t border-neutral-100 bg-white px-5 py-4 lg:hidden">
          <form role="search" onSubmit={(e) => e.preventDefault()} className="mb-4 flex h-12 items-center gap-2 rounded-[13px] border-[0.5px] border-neutral-300 bg-neutral-50 px-4 md:hidden">
            <Icon name="search" size={16} className="opacity-60" />
            <input type="search" placeholder="Quick Search" className="w-full bg-transparent text-sm font-medium placeholder:text-neutral-400 focus:outline-none" />
          </form>
          <nav className="flex flex-col gap-3 text-sm font-semibold text-neutral-900">
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} className="py-1">
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
