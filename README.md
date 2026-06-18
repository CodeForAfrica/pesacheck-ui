# PesaCheck

Marketing and fact-check website for **PesaCheck** — Africa's largest indigenous fact-checking organisation, an initiative of [Code for Africa](https://codeforafrica.org). This is a Next.js implementation of the "Pesacheck UI - 2025" Figma design.

## Tech stack

- **[Next.js 16](https://nextjs.org)** (App Router) + **React 19**
- **TypeScript** (strict)
- **[Tailwind CSS v4](https://tailwindcss.com)** — configured via CSS (`@theme` in `app/globals.css`), no `tailwind.config.js`
- **ESLint 9** (`eslint-config-next`)
- **Inter** via `next/font/google`

> ⚠️ **This is not the Next.js you may know.** This project tracks a Next.js version with breaking changes from older releases. Before writing code, read the relevant guide in `node_modules/next/dist/docs/` and heed deprecation notices. See [`AGENTS.md`](AGENTS.md).

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Project structure

```
app/                 # App Router routes (one folder per page)
  layout.tsx         # Root layout — Header, Footer, BackToTop, fonts, metadata
  globals.css        # Tailwind import + design tokens (@theme)
  page.tsx           # Home
  about/             # About Us section (+ contact, faqs, funding,
                     #   methodology, our-ecosystem, principles)
  fact-checks/       # Fact-checks index + [desk] dynamic content-desk pages
  knowledge/         # Knowledge base
  tools/             # Tools (coming soon)
components/          # React components, grouped by area
  layout/            # Header (mega-menus), Footer, BackToTop
  home/  about/  fact-checks/  knowledge/  tools/
  ui/                # Shared primitives (StoryCard, Icon, Pagination, …)
lib/                 # Content & config — the single source of truth for copy
  site.ts            # Site-wide chrome: nav links, mega-menus, footer, socials
  content-desks.ts   # Canonical content-desk list (shared across pages)
  *-content.ts       # Per-page content
public/
  icons/             # SVG icons exported from Figma (rendered via ui/Icon)
  images/            # Page imagery, grouped by section
```

## Architecture notes

- **Content lives in `lib/`, not in components.** Page copy, nav structure, stats,
  and logos are defined as typed data in `lib/*-content.ts` (and `lib/site.ts` for
  shared chrome), then rendered by presentational components. `lib/content-desks.ts`
  is the canonical list of content desks, shared by the home page and the
  fact-checks pages.
- **Design tokens** (brand colours, typography scale) are sourced from the Figma
  variable definitions and declared in `app/globals.css` under `@theme`, exposing
  them as Tailwind utilities (e.g. `text-pesacheck-black`, `bg-pesacheck-blue`).
- **Icons** are flat SVGs in `public/icons/`, rendered through the lightweight
  `components/ui/Icon` wrapper (plain `<img>`, avoiding `next/image` overhead for
  sub-24px vectors).
- **Path alias:** `@/*` maps to the project root (see `tsconfig.json`).

## Building pages from Figma

This repo's pages are reproductions of the "Pesacheck UI - 2025" Figma file. To
turn a new Figma frame into a page, use the bundled **`figma-to-page`** skill
(`.claude/skills/figma-to-page/`), which reads a design node directly from Figma
and scaffolds it against this project's components, tokens, and conventions.

The skill talks to Figma over the **Dev Mode MCP server** that the Figma desktop
app exposes locally, so a little one-time setup is needed.

### 1. Enable the Figma MCP server

1. Install and open the **Figma desktop app** (the browser version does not expose
   the MCP server), then open the PesaCheck file.
2. Make sure your Figma plan/seat has **Dev Mode** access.
3. From the Figma menu, enable the local MCP server (**Preferences → Enable Dev
   Mode MCP Server**, or the equivalent toggle in your Figma version). When it's
   running it serves `http://localhost:3845`.
4. Keep the desktop app open with the file loaded for the whole session — the
   skill reads the node live; nothing works if Figma is closed.

The skill also relies on the Claude Preview MCP tools for its screenshot
verification gate, so make sure both MCPs are available in your Claude Code
session.

### 2. Copy a link to the node you want

In Figma, **select the frame/component** you want to build (a top-level page
frame, not a deep child), then right-click → **Copy link to selection** (or
**Copy/Paste as → Copy link**). The URL carries the node id you need:

```
https://www.figma.com/design/<file-key>/<file-name>?node-id=2866-1070
```

The `node-id` query parameter is what identifies the exact node.

### 3. Run the skill

In Claude Code, with the desktop app still open, invoke the skill with the copied
URL:

```
/figma-to-page https://www.figma.com/design/<file-key>/<name>?node-id=2866-1070
```

You can also just ask in plain language — *"build this Figma node as a page: <url>"*.
The skill reads the node, downloads its real assets, scaffolds the page sections
against `components/ui`, composes the route under `app/`, and finishes with a
lint/build/screenshot check comparing the result to the design.

See [`.claude/skills/figma-to-page/README.md`](.claude/skills/figma-to-page/README.md)
for the full procedure and what's automated vs. model-guided.

## Deployment

The app builds with `npm run build` and serves with `npm run start`. It can be
deployed to any Node host or to [Vercel](https://vercel.com/new).
