"use client";

import { useEffect, useState } from "react";

type NavItem = { id: string; title: string };

/**
 * Sticky table-of-contents rail beside the methodology sections. Highlights the
 * section currently in view (scroll-spy) and smooth-scrolls on click. Hidden on
 * narrow screens where the content stacks full-width.
 */
export function MethodologySectionNav({ items }: { items: NavItem[] }) {
	const [activeId, setActiveId] = useState(items[0]?.id ?? "");

	useEffect(() => {
		const sections = items
			.map((item) => document.getElementById(item.id))
			.filter((el): el is HTMLElement => el !== null);

		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((entry) => entry.isIntersecting)
					.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
				if (visible[0]) setActiveId(visible[0].target.id);
			},
			// Trip when a section's heading crosses the upper third of the viewport.
			{ rootMargin: "-110px 0px -65% 0px", threshold: 0 },
		);

		sections.forEach((section) => {
			observer.observe(section);
		});
		return () => observer.disconnect();
	}, [items]);

	return (
		<nav aria-label="Methodology sections" className="hidden lg:block">
			<ul className="sticky top-28 flex flex-col gap-3 text-sm font-medium">
				{items.map((item) => {
					const isActive = item.id === activeId;
					return (
						<li key={item.id}>
							<a
								href={`#${item.id}`}
								aria-current={isActive ? "true" : undefined}
								className={
									isActive
										? "font-semibold text-pesacheck-black"
										: "text-neutral-500 transition-colors hover:text-neutral-900"
								}
							>
								{item.title}
							</a>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
