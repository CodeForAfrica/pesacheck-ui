# figma-to-page

Convert a Figma design node into a Next.js App Router page that matches this
project's structure (Next.js 16, Tailwind v4, Inter), at high fidelity.

## Usage

In Claude Code, with the Figma desktop app open (Dev Mode MCP running):

```
/figma-to-page https://www.figma.com/design/<key>/<name>?node-id=2866-1070
```

Or just ask: *"build this Figma node as a page: <url>"*. The skill reads the
node, extracts real assets, scaffolds tokens/primitives/sections against the
existing `components/ui` library, composes the page, and runs a
lint/build/preview-screenshot verification gate.

## What's deterministic vs guided

- **Deterministic (scripts):** asset download + naming, metadata parsing,
  section scaffolding, and the verify gate.
- **Guided (LLM + gate):** translating absolute-positioned Figma layers into
  clean responsive layout. The screenshot comparison gate is the quality check.

## Layout

- `SKILL.md` — the ordered procedure (start here).
- `reference/` — conventions, detailed procedure notes, Next.js 16 specifics.
- `scripts/`
  - `extract-assets.mjs` — design-context text → downloaded assets + JSON manifest.
  - `parse-metadata.mjs` — list a node's direct children (sections).
  - `scaffold-section.mjs` — generate a section component stub.

## Requirements

- Figma desktop app open with the file; Dev Mode MCP serving `http://localhost:3845`.
- Node 18+ (scripts use global `fetch`).
- Figma MCP + Claude Preview MCP tools available in the session.
