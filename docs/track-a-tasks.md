# Track A — Frontend data layer: task breakdown & progress

Companion to [`migration-plan.md`](./migration-plan.md). Track A swaps hardcoded
`lib/*-content.ts` for live data from staging Hasura, keeping the static content
as a fallback. This doc is the **progress tracker** — check items off as PRs land.

> **Data source:** remote staging Hasura
> `https://pesacheckstaging-hasura.superdesk.org/v1/graphql`, anonymous/read-only,
> `tenant_code = "e6lkum"`. Verdict lives in `swp_article.metadata` (jsonb) →
> `subject[]` where `scheme === "Debunk"` (see migration-plan Phase-1 notes).

## Are the phases = PRs? (complexity verdict)

Mostly yes — **one PR per phase, with two exceptions** found by inspecting the code:

1. **Components take no props; they import content directly.** e.g.
   `components/home/Spotlight.tsx` does `import { SPOTLIGHT_* } from "@/lib/home-content"`.
   Converting a section is therefore a **prop-lifting refactor** (fetch in the
   async server page, pass data down), not a one-line import swap. The `?? fallback`
   pattern in the plan applies at the **page** level — pages must be refactored to
   own the data and feed components.
2. **`FactChecksExplorer` is a `"use client"` component** (filters use `useState`/
   `useMemo`). Client components can't fetch server-side, so its data **must** be
   fetched in a server parent and threaded in as props. This makes **Phase 2
   bigger than one PR** → split into 2a (home listings) and 2b (fact-checks grid).

Everything else is a clean single PR. Routing has one quirk to handle (below).

### Routing reality (differs from the plan)
The plan assumed `/fact-checks/[slug]`. Actual structure:
- `app/fact-checks/[desk]/page.tsx` — **overloaded**: `generateStaticParams`
  registers both desk slugs *and* article slugs as `[desk]`, so this route renders
  **either** a desk landing page **or** an article. Phase 3/5 must keep this
  dual behavior (or disambiguate it) when wiring live data.
- `app/fact-checks/[desk]/[slug]/page.tsx` — the canonical desk+article route.

---

## PR 0 — (this) planning & discovery ✅
- [x] Validate verdict location → `swp_article.metadata.subject[Debunk]`
- [x] Correct `migration-plan.md` (verdict, taxonomy, risks, first steps)
- [x] Break Track A into PRs (this doc)
- [ ] Confirm full `Debunk` verdict vocabulary vs Figma labels (open item from
      migration-plan Phase-1 #1) — check `pesacheck-pwa-app-router`'s mapper

## PR 1 — Foundation + proof-of-seam (Content Desks) — Phase 1
Lowest-risk vertical slice: stand up the data layer and convert the one 1:1 row.
- [x] Add deps: `graphql-request`, `graphql`
- [x] `.env.local` (+ `.env.example`): `NEXT_PUBLIC_API_URL`,
      `NEXT_PUBLIC_TENANT_CODE=e6lkum`, `NEXT_PUBLIC_MEDIA_URL` (+ `!.env.example`
      gitignore exception so the example is committed)
- [x] `next.config.ts`: add media host to `images.remotePatterns`
- [x] `lib/data/client.ts` — graphql-request client reading `NEXT_PUBLIC_API_URL`
- [x] `lib/data/queries/routes.ts` — collection-routes query
- [x] `lib/data/map.ts` — `findRendition` (rendition→URL), `findSubject(meta, scheme)`,
      `getVerdict`, `parseMetadata` helpers
- [x] `lib/data/desks.ts` — `getContentDesks(): ContentDesk[]`. Inclusion/order
      driven by live collection routes; images + display names stay curated
      (routes carry no image; staging names have inconsistent casing).
- [x] Convert **Content Desks** end-to-end: `app/page.tsx` (now async) fetches →
      passes to `components/home/ContentDesks` (refactored to accept props) →
      `ContentDesksRow` (optional `desks` prop, defaults to static) with
      `?? CONTENT_DESKS` fallback.
- [x] Verify against staging: row renders **6 live desks** (Migration absent —
      no backing route; would be 7 if static). tsc + biome clean.

**Carry-overs / notes for later PRs:**
- `migration` desk has no staging route → absent in live mode. Decide whether to
  create the route (Track B) or drop it from the curated catalog.
- Desk `image` source still TBD (currently curated local assets).
- Pre-existing console warning: duplicate React keys on story cards (placeholder
  `href` reused as key in `lib/*-content.ts`) — unrelated to this PR; fix when
  those cards get real data (PR 2a/2b) since slugs become unique then.

## PR 2a — Home listings (Spotlight / Latest / Trending) — Phase 2
- [ ] `lib/data/queries/` — content-list queries (Hero, Spotlight, Trending,
      Top news) ported from `contentListService.queries.js`
- [ ] `lib/data/stories.ts` — `getSpotlight()`, `getTrending()`, `getLatest()`
      returning `Story[]`; map `verdict`/`image`/`date`; compute `readTime`
- [ ] Refactor `Spotlight`, `LatestStories`, `TrendingStories` to accept props
- [ ] `app/page.tsx` fetches and passes data with `?? fallback`
- [ ] Verify cards render (image, verdict, date) against staging

## PR 2b — Fact-checks grid — Phase 2
Heavier: client-component data lifting.
- [ ] `lib/data/stories.ts` — `getFactChecks(): Story[]` (published articles)
- [ ] Make `app/fact-checks/page.tsx` async, fetch grid data
- [ ] Refactor `FactChecksExplorer` (client) to receive `stories` as a prop
      instead of importing `lib/fact-checks-content`
- [ ] Keep static `GRID` as `?? fallback`
- [ ] Verify grid renders against staging (filters still static for now)

## PR 3 — Single article — Phase 3
- [ ] `lib/data/queries/` — single-article query (`articleService.queries.js`):
      body, authors, tags, related, renditions
- [ ] `lib/data/article.ts` — `getArticle(slug): Article`
- [ ] Port `articleBodyService.js:convertBodyImages` (rewrite `<img>` src → MEDIA_URL)
- [ ] Map authors (`swp_article_authors`), tags (`swp_article_keywords`),
      related (`swp_article_related`), verdict, `readTime`
- [ ] Wire `app/fact-checks/[desk]/[slug]/page.tsx` to `getArticle` with fallback
- [ ] **Handle the overloaded `[desk]` route**: keep article-or-desk dispatch
      working when fetching live (article lookup by slug vs desk lookup)
- [ ] Verify a real fact-check (e.g. `false-equating-somalia-and-al-shabab-is-untrue`)

## PR 4 — Filters & pagination — Phase 4 (depends on 2b)
- [ ] Map filter dimensions to real taxonomy: `region` → `subject[countries]`,
      `topic` → `subject[01harm]`/route, `language` → article language/route
- [ ] Derive filter option lists from live data (replace hardcoded `REGIONS`/
      `LANGUAGES`/`TOPICS` in `fact-checks-content`)
- [ ] Offset pagination (cf. `collectionService` + `_aggregate` for counts)
- [ ] Decide client-side filter vs server query params; verify filtering works

## PR 5 — Desk pages — Phase 5 (depends on 3 for route dispatch)
- [ ] `lib/data/stories.ts` — `getByDesk(slug): Story[]` (by route collection)
- [ ] Wire desk branch of `app/fact-checks/[desk]/page.tsx` to live data + fallback
- [ ] Verify each desk slug lists its articles

## PR 6 — Marketing pages (optional) — Phase 6
- [ ] Fetch `type:"content"` routes (About, Methodology, Principles, Contact)
- [ ] Wire `app/about/*` pages with static fallback
- [ ] Verify content renders

---

## Dependency order
```
PR1 (foundation) ─┬─ PR2a (home listings)
                  ├─ PR2b (fact-checks grid) ── PR4 (filters/pagination)
                  └─ PR3 (single article) ───── PR5 (desk pages)
                                                 PR6 (marketing, independent)
```
PR1 must land first. PR2a / PR2b / PR3 can then proceed in parallel.

## Cross-cutting conventions (set in PR1, reused everywhere)
- **Fallback pattern:** pages own data; `const data = (await getX().catch(() => null)) ?? fallback`.
- **Keep `lib/*-content.ts`** as the typed fallback through the whole track.
- **Types are the contract:** mappers return the existing `Story` / `Article` /
  `ContentDesk` shapes unchanged.
- **Verdict:** always via `getVerdict(metadata)`; tolerate missing (empty `subject[]`).
- **Convergence (Track B):** when local stack is ready, only env vars change.
