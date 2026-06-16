# Project conventions for generated pages

Match these exactly so every converted page looks like the rest of the codebase.

## File layout
```
app/<route>/page.tsx          # Server Component, composes sections in order
                              # (the Home node → app/page.tsx)
components/<page>/*.tsx        # one component per section (Header, Hero, ...)
components/ui/*.tsx            # shared primitives (reused across pages)
lib/<page>-content.ts         # typed content arrays for repeating data
public/icons/*.svg            # vector icons
public/images/<section>/*     # photos, logos, screenshots
```
Imports use the `@/*` alias (see `tsconfig.json`), e.g. `@/components/ui/StoryCard`.

## Shared chrome across pages
Header, Footer, back-to-top, the nav, and social/footer content are **site-wide**
— they must not be rebuilt per page or they will drift. This is already wired up:
- **`Header`, `Footer`, `BackToTop` live in `components/layout/`** and are
  rendered from the root **`app/layout.tsx`**, which also provides the
  `<main className="flex-1">` wrapper. Each `page.tsx` returns **only its unique
  sections** (a fragment), never the chrome.
- **Site-wide content lives in `lib/site.ts`** (`NAV_LINKS`, `FOOTER_NAV`,
  `LEGAL`, `ALLIES`, `PARTNERS`, `SOCIAL_ICONS`, `ABOUT_BLURB`, `FOOTER_ABOUT`).
  Reserve `lib/<page>-content.ts` for page-specific data only.
- When adding a new page: create `app/<route>/page.tsx` returning its sections —
  the chrome comes for free. **Wire navigation to real routes** by updating
  `NAV_LINKS` hrefs from `#anchors` to `/route` paths as pages land.
- If a non-chrome section repeats across pages (e.g. a CTA band), promote it to
  `components/shared/` and drive it from `lib/site.ts`.

## Shared primitives (reuse, don't re-invent)
- `components/ui/SectionHeading.tsx` — `SectionHeading` (blue accent bar + title +
  divider) and `Container` (`mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-0`).
- `components/ui/StoryCard.tsx` — image card with verdict badge + arrow overlay,
  taxonomy row, title, optional excerpt, date row. Props control aspect/sizes.
- `components/ui/VerdictBadge.tsx` — translucent pill (`bg-black/30`).
- `components/ui/MetaRow.tsx` — `TaxonomyRow` (Topic·Region·Language) and
  `DateRow` (calendar·clock).
- `components/ui/Icon.tsx` — renders `/public/icons/<name>.svg` as a sized `<img>`.

## Design tokens
Tokens live in `app/globals.css` under `@theme` and are sourced from Figma
`get_variable_defs`. Use the token utilities, not raw hex:
`bg-pesacheck-blue` (#0B2AEA), `text-pesacheck-black` (#021D33),
`pesacheck-purple`, `primary-50/100/300`, `neutral-50…900`, plus `text-xs/sm/md/xl`.
Font is **Inter** via `next/font/google` in `app/layout.tsx` (`--font-inter`).
If `get_variable_defs` surfaces a new color/size, add it to the `@theme` block.

## Server vs Client
Everything is a Server Component by default. Add `'use client'` only to the
interactive leaf components: carousels, tabs, search inputs, the mobile menu,
back-to-top. Keep static sections server-rendered.

## Responsiveness
Figma frames are desktop-only (~1440px, 1240px content). Pixel-match desktop,
then add breakpoints: stack multi-column grids at `sm`/`md`, collapse the nav to
a hamburger below `lg`, turn fixed-width card rows into horizontal scroll
(`overflow-x-auto` + `snap-x`) on small screens.

## Asset notes
- White-on-transparent logos are invisible on light backgrounds — apply
  `mix-blend-exclusion` (this is how the Figma footer renders them).
- Use `next/image` (`fill` + `sizes`, or fixed `width`/`height`) for photos;
  plain `<img>` is fine for tiny inline SVG icons via the `Icon` component.
- Large source PNGs (maps, screenshots) are optimized by `next/image` on demand;
  flag very large files (>2 MB) to the user for optional pre-compression.
- `extract-assets.mjs` routes every `.svg` to `public/icons/`. Logo/illustration
  SVGs belong in `public/images/` — review the manifest and pass them via
  `--svg-as-image <name,...>`.

## Accessibility
- Give images meaningful `alt` derived from the Figma layer name; use `alt=""`
  (decorative) for background/overlay art so it's skipped by screen readers.
- Icon-only buttons (carousel arrows, mobile menu toggle, back-to-top) must have
  an `aria-label`; the `Icon` component is `aria-hidden` by default.
- Use real semantic elements: `<header>`/`<nav>`/`<main>`/`<footer>`, `<button>`
  for actions, `<a>` for navigation, and a single `<h1>` per page (the hero).
- Interactive controls need a visible focus ring (e.g. `focus-visible:ring-2
  focus-visible:ring-pesacheck-blue`).

## launch.json (for the preview gate)
If `.claude/launch.json` is missing, create:
```json
{
  "version": "0.0.1",
  "configurations": [
    { "name": "dev", "runtimeExecutable": "npm", "runtimeArgs": ["run", "dev"], "port": 3000 }
  ]
}
```
`preview_start` needs port 3000 free; stop any manual `next dev` first.
