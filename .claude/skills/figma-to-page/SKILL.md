---
name: figma-to-page
description: >-
  Convert a Figma design node into a Next.js App Router page that matches this
  project's structure and conventions. Use when the user provides a Figma
  design URL (figma.com/design/...?node-id=...) and wants it built as a page,
  section, or component — e.g. "build this Figma page", "convert this node to a
  page", "turn this frame into Next.js". Covers reading the node via the Figma
  MCP, extracting real assets, scaffolding tokens/primitives/sections, composing
  the page, and verifying fidelity with a lint/build/preview-screenshot gate.
---

# Figma → Next.js page

Turn a Figma node URL into a high-fidelity, responsive Next.js page that matches
this repo's conventions. The procedure below is deterministic where it can be
(scripts do the mechanical work) and LLM-guided where it must be (translating
absolute-positioned Figma layers into responsive layout). The **verification
gate** — not the prompt — is what makes the visual result reliable; never skip it.

## Prerequisites

- The **Figma desktop app** must be open with the file, and its **Dev Mode MCP
  server** running (assets are served from `http://localhost:3845/assets/...`).
- Figma MCP tools (load via ToolSearch if deferred):
  `mcp__figma-desktop__get_metadata`, `get_screenshot`, `get_design_context`,
  `get_variable_defs`.
- Preview MCP tools for the gate: `mcp__Claude_Preview__preview_start`,
  `preview_screenshot`, `preview_resize`, `preview_eval`, `preview_console_logs`.

## Convert the URL to a node id

From `figma.com/design/<fileKey>/<name>?node-id=2866-1070`, the node id is
`2866:1070` (replace the `-` between the two numbers with `:`). All Figma MCP
calls take this id.

## Procedure

Work one section at a time; do not try to one-shot a whole page. Use the
TaskCreate tool to track the phases below.

### 0. Confirm scope (ask before building)
These four choices materially change the output, so confirm them up front with
`AskUserQuestion` (skip any the user already specified):
1. **Responsiveness** — pixel-match desktop only, or responsive with
   mobile/tablet breakpoints? (Figma frames are desktop-only.)
2. **Assets** — export real photos/logos/illustrations, or placeholders + real
   icons only?
3. **Interactivity** — build working carousels/tabs/search/menus, or static
   visual only?
4. **Target route** — which `app/<route>/page.tsx` does this node map to? (The
   Home node → `app/page.tsx`.)

### 1. Understand the node
1. `get_screenshot(nodeId)` — the visual source of truth for the gate.
2. `get_metadata(nodeId)` — the structure. It is often large; if it exceeds the
   token limit it is saved to a file. Parse it for the **direct children** (the
   sections) with their ids, names, x/y, width/height. See
   `reference/parse-metadata.md` for a ready-to-run parser. Designs are usually
   absolutely positioned, so identify sections by y-position bands + group names.
3. `get_variable_defs(nodeId)` — the design tokens (colors, font, type scale).
   Compare against `app/globals.css`; add any missing tokens there (see
   `reference/conventions.md`).

### 2. Extract assets (deterministic)
For each section node, call `get_design_context(nodeId)` and save the returned
reference code to `/tmp/figma-ref/<slug>.txt`. If the response comes back as
metadata only (the node is too large), call it again with `forceCode: true`, or
drill into smaller child nodes. Then run the extractor on it:

```bash
node .claude/skills/figma-to-page/scripts/extract-assets.mjs \
  --section <slug> --input /tmp/figma-ref/<slug>.txt
```

It parses every `http://localhost:3845/assets/...` URL, downloads each once
(SVGs → `public/icons/`, rasters → `public/images/<slug>/`), names files from
the Figma variable names, verifies non-empty, and prints a JSON manifest. The
SVG→icons rule misroutes logo/illustration SVGs (e.g. brand/partner logos) —
review the manifest and pass those names via `--svg-as-image <name,...>` to
route them to `public/images/<slug>/` instead. For a large page, delegate steps
1–2 to a subagent (see `reference/procedure.md`, "Asset extraction subagent") so
the bulky design-context dumps stay out of context — have it return only the
manifest.

### 3. Scaffold tokens, primitives, sections
- **Tokens & font**: ensure `app/globals.css` `@theme` and `app/layout.tsx`
  (Inter via `next/font/google`) match the design. Already done for this repo —
  reuse them.
- **Shared chrome (do NOT rebuild)**: Header, Footer, and back-to-top already
  live in `components/layout/` and render from the root `app/layout.tsx`;
  site-wide data is in `lib/site.ts`. A new `page.tsx` returns only its unique
  sections and inherits the chrome for free. Wire `NAV_LINKS` hrefs to real
  routes as pages are added. See `reference/conventions.md`, "Shared chrome
  across pages".
- **Primitives**: reuse `components/ui/*` (`StoryCard`, `VerdictBadge`,
  `MetaRow`, `Icon`, `SectionHeading`/`Container`). Only add a primitive when a
  pattern genuinely repeats and none fits.
- **Data**: put page-specific repeating content in `lib/<page>-content.ts` as
  typed arrays so markup stays DRY; site-wide content goes in `lib/site.ts`.
- **Sections**: scaffold one component file per section under
  `components/<page>/` with:

```bash
node .claude/skills/figma-to-page/scripts/scaffold-section.mjs \
  --page <page> --name <SectionName>
```

Then translate each section's reference code into JSX + Tailwind using the
tokens. Convert absolute positions into flex/grid; add `sm`/`md`/`lg`
breakpoints (stack grids, collapse nav to a hamburger, make card rows horizontal
scroll on mobile). Keep components Server Components; add `'use client'` only to
interactive leaves (carousels, tabs, search, menus, back-to-top).

### 4. Compose the page
Create `app/<route>/page.tsx` (or `app/page.tsx` for the home node) that imports
the section components in order. The "Home" node maps to `app/page.tsx`; confirm
the route for other nodes.

### 5. Verify (the gate — required)
1. `preview_start` (uses `.claude/launch.json`; create it if missing — see
   `reference/conventions.md`).
2. `preview_resize` to 1440 wide, `preview_screenshot`, and compare against the
   `get_screenshot` from step 1. Iterate until faithful.
3. `preview_resize` to `mobile`/`tablet`; confirm stacking, hamburger, carousels.
4. Click-test interactivity via `preview_eval`.
5. `preview_console_logs(level: error)` → must be empty.
6. `npm run lint` (clean) and `npm run build` (passes). Note: Next 16 does **not**
   lint during build — run lint separately.

## Reference files (read as needed)

- `reference/procedure.md` — detailed step notes, subagent prompt, gotchas seen.
- `reference/conventions.md` — file layout, primitives, Server/Client rules,
  tokens, `launch.json`.
- `reference/nextjs-16.md` — Next.js 16 specifics (read project docs in
  `node_modules/next/dist/docs/` before writing framework code, per AGENTS.md).

## Scripts

- `scripts/extract-assets.mjs` — design-context text → downloaded assets + manifest.
- `scripts/scaffold-section.mjs` — generate a section component stub.
- `scripts/parse-metadata.mjs` — list a node's direct children (id/name/pos/size).
