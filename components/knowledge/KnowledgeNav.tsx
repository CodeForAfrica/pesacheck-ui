"use client";

import { useEffect, useState } from "react";

type NavItem = { id: string; label: string };

/**
 * Sticky sidebar nav for the Knowledge sections. Scroll-links to each section
 * and highlights the one currently in view via an IntersectionObserver
 * scroll-spy. Collapses to a horizontal scrollable tab row on small screens.
 */
export function KnowledgeNav({ items }: { items: NavItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    for (const { id } of items) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="Knowledge sections"
      className="flex gap-4 overflow-x-auto pb-2 lg:sticky lg:top-28 lg:flex-col lg:gap-3 lg:self-start lg:overflow-visible lg:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {items.map((item) => {
        const isActive = active === item.id;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-current={isActive ? "true" : undefined}
            className={`shrink-0 text-sm font-medium transition-colors lg:text-base ${
              isActive
                ? "font-semibold text-pesacheck-blue"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
