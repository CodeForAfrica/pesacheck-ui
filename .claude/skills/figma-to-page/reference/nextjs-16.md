# Next.js 16 specifics

AGENTS.md warns this is a modified Next.js with breaking changes. **Before
writing framework code, read the relevant guide in
`node_modules/next/dist/docs/`** and heed deprecation notices. Notes that
affected this build:

- **`next build` no longer runs the linter** (Next 16). Run `npm run lint`
  separately as part of the verification gate.
- **Instant navigation**: the docs repeatedly hint to `export const
  unstable_instant` from a route for instant client-side navigations. This
  matters for multi-route navigation, **not** for a single static page — skip it
  unless building cross-page nav.
- **Images**: standard `next/image` conventions apply. Local files under
  `public/` are referenced from `/` (e.g. `/images/hero/hero-bg.png`). Use
  `fill` + `sizes` for responsive cover images; static imports auto-provide
  width/height.
- **Fonts**: `next/font/google` self-hosts. This repo uses `Inter` with a
  `--font-inter` CSS variable wired into the Tailwind `--font-sans` token.
- **Tailwind v4**: configured via `@import "tailwindcss"` + an `@theme` block in
  `app/globals.css` (no `tailwind.config.js`). Define colors as `--color-*` and
  type sizes as `--text-*` / `--text-*--line-height`.
- **App Router**: pages are `app/<route>/page.tsx`; layouts `layout.tsx`;
  non-routed component folders can live anywhere outside `app/` (this repo uses
  top-level `components/` and `lib/`).

When in doubt about a framework API, grep the local docs for deprecation
markers first:
```bash
grep -rniE "deprecat|no longer|removed in|unstable_|must now" \
  node_modules/next/dist/docs/01-app/01-getting-started/
```
