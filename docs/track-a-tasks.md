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
- [x] Test harness: **Vitest** (`pnpm test` / `test:watch`, `vitest.config.ts`
      with `@/*` alias + `NEXT_PUBLIC_MEDIA_URL` test env). `lib/data/map.test.ts`
      — 16 tests covering `findRendition`, `parseMetadata`, `findSubject`,
      `getVerdict` (fixtures mirror real staging fact-checks). All green.

**Carry-overs / notes for later PRs:**
- **Extend `map.test.ts`** as PR2/PR3 add `Story`/`Article` mappers and
  `convertBodyImages` — the test pattern is now established.
- **CI/pre-commit:** `pnpm test` is not yet wired into `lint-staged` or CI
  (only biome runs pre-commit). Hook it up when convenient.
- `migration` desk has no staging route → absent in live mode. Decide whether to
  create the route (Track B) or drop it from the curated catalog.
- Desk `image` source still TBD (currently curated local assets).
- Pre-existing console warning: duplicate React keys on story cards (placeholder
  `href` reused as key in `lib/*-content.ts`) — unrelated to this PR; fix when
  those cards get real data (PR 2a/2b) since slugs become unique then.

## PR 2a — Home listings (Spotlight / Latest / Trending) — Phase 2 ✅
- [x] `lib/data/queries/content-lists.ts` — `GET_CONTENT_LIST_ITEMS` ported from
      `contentListService.queries.js`, plus `metadata` (verdict) and `body`
      (readTime). One generic list query covers Spotlight/Trending/Top news.
- [x] `lib/data/stories.ts` — `getSpotlight()`, `getTrending()`, `getLatest()`
      returning `Story[]` via `mapStory`. List→section mapping (verified
      staging lists): Spotlight→`Homepage — Spotlight`, Trending→`Homepage —
      Trending`, Latest→`Top news` (no "Latest" curated list exists; "Top news"
      is the listed source). **Names use an EM DASH (—) — must match exactly.**
- [x] `lib/data/map.ts` — `mapStory` (+ `formatStoryDate`, `computeReadTime`,
      rendition picker). Maps `verdict`/`image`/`date`; computes `readTime` from
      body word count. Null-safe; `topic`/`region`/`language` left to PR4.
- [x] Refactor `Spotlight`, `LatestStories`, `TrendingStories` to accept an
      optional `stories?: Story[]` prop (default to static fallback). Spotlight/
      Latest derive feature+secondary+grid from the flat list.
- [x] `app/page.tsx` fetches all three in parallel, each with `?? fallback`.
- [x] Verify cards render (image, verdict badge, date, readTime) against staging
      — confirmed live in the browser. tsc + biome clean; 27 Vitest tests pass
      (11 new for `mapStory`/`formatStoryDate`/`computeReadTime`).

**Notes:**
- Staging rendition names are `thumbnail|viewImage|baseImage|original|square`
  (not prod's `400x240`) — the picker prefers `viewImage` and falls back to any
  resolvable rendition, then a local placeholder.
- The duplicate-React-key warning now only fires for the **Hero preview**
  carousel (`HERO_PREVIEW`, still static — out of PR2a scope). Spotlight/
  Trending/Latest no longer warn (live hrefs are unique).
- Card href = `/fact-checks/<route-slug>/<article-slug>` — forward-compatible
  with the canonical `[desk]/[slug]` route (wired to live data in PR3/PR5).
- **Language filter:** curated lists are polluted with non-article entries
  (team-member profiles on the `team` route). The query filters items
  server-side to `LANGUAGE_ROUTE_SLUGS` (`english|français|kiswahili|
  african-languages`) via a nested `swp_article.swp_route.slug` `_in`. No column
  distinguishes language routes from other collections, so the set is editorial
  (mirrors migration-plan; PR4 reuses it for the language filter).

## PR 2b — Fact-checks grid — Phase 2 ✅
Heavier: client-component data lifting.
- [x] `lib/data/queries/fact-checks.ts` — `GET_FACT_CHECK_ARTICLES`: one page of
      published fact-checks (newest first) + an `_aggregate` total count. Filters
      **server-side** to the `Debunk` verdict via the normalized
      `swp_article_metadata.swp_article_metadata_subjects` relation, with
      `$limit`/`$offset`. Selects the same fields as `GET_CONTENT_LIST_ITEMS` so
      `mapStory` consumes the rows unchanged.
- [x] `lib/data/stories.ts` — `getFactChecks(page): FactCheckListing` (`{ stories,
      page, totalPages }`), `FACT_CHECKS_PAGE_SIZE = 10`. **A fact-check is
      defined by carrying a `Debunk` verdict**, enforced in the query (the only
      signal separating fact-checks from homepage content-blocks + editorial test
      stubs that share `route`/`profile`). Route-agnostic, so it keeps working
      once fact-checks land on topic desks (staging desks are empty; everything
      sits on `english`).
- [x] `app/fact-checks/page.tsx` made async; reads `?page=`, fetches that DB page
      with the `?? fallback` pattern (static pool, paged identically).
- [x] `FactChecksExplorer` (client) takes `stories` + `page`/`totalPages`;
      pagination navigates by `?page=N` (server re-fetch) — never loads the corpus
      client-side.
- [x] `app/fact-checks/[desk]/page.tsx` (PR5 placeholder) passes the static pool
      on a single page so it compiles + hides pagination.
- [x] Verify against staging: grid renders live fact-checks (verdict badges,
      dates, readTime, real media). **Server pagination proven** end-to-end by
      temporarily setting page size to 2 (5 items → 3 pages): each page is a
      distinct DB slice, `?page=N` drives the fetch, boundary disables "Next".
      Restored to 10. tsc + biome clean; 27 Vitest tests pass.

**Notes:**
- **Why server-side verdict filter (not the verified jsonb path):** the jsonb
  `metadata` column is exposed by Hasura as an opaque `String` (no jsonb
  operators), so it can't filter or paginate server-side. Pagination at scale
  (prod: tens of thousands of fact-checks) forces the normalized relation —
  which the reference prod app also uses (`GET_COLLECTION_BY_METADATA_QUERY`).
- **Relation vs jsonb divergence:** the relation drops `altered-yvonne` on
  staging (its `swp_article_metadata` is `null` though the jsonb carries the
  verdict — a staging integrity gap). All relation-matched articles still carry
  the jsonb verdict *name*, so `mapStory`'s badge is unaffected. The French
  "FAUX" article (no structured `Debunk` tag) is also absent. Both are staging
  artifacts; production data is consistently pipelined.
- Filters remain **static** (region/language/topic from `fact-checks-content`)
  and now operate **client-side on the current page only**: staged chips show
  but `applied` starts empty, so the full server page is visible on load. Live
  `Story`s carry no taxonomy yet, so "Apply Filters" narrows to empty — expected.
  PR4 makes filtering server-side, layering filter params onto the same `?page=`
  URL the pagination already uses.

## PR 3 — Single article — Phase 3 ✅
- [x] `lib/data/queries/article.ts` — `GET_ARTICLE_BY_SLUG` (port of
      `articleService.queries.js`, **by slug** not id): body, metadata, route,
      `swp_article_metadata{byline}`, feature-media renditions, authors, keywords,
      related (selecting the same fields `mapStory` consumes).
- [x] `lib/data/article.ts` — `getArticle(slug): Article` (throws when absent so
      the page's `?? fallback` fires).
- [x] Port `convertBodyImages` into `lib/data/body.ts:renderBody` — rewrites
      `<img>` src → `MEDIA_URL` **inside a `sanitize-html` `transformTags` pass**
      (no `jsdom`), then sanitizes. Hardened vs the reference: **drops `<script>`**.
      New deps: `sanitize-html` + `@types/sanitize-html`.
- [x] `lib/data/map.ts` — `mapArticle`: authors→`author` (join names, fallback
      jsonb/relation byline, then "PesaCheck"), keywords→`tags`, related→`Story[]`
      (reuses `mapStory`), verdict via `getVerdict`, `readTime`/`date` reuse PR2a
      helpers. Live articles are `format:"short"` with structured paragraph fields
      empty and the rendered HTML in the new `Article.bodyHtml`. The appended
      footer boilerplate is split out of the body into `footnotes[]` (see notes).
- [x] `ArticleBodyShort` renders `bodyHtml` (sanitized) via `dangerouslySetInnerHTML`
      in a prose container when present, else the static slots/paragraphs path.
      New `ArticleView` component holds the long/short dispatch, shared by both
      article routes; it hides Related Stories / footnotes when empty.
- [x] Wired `app/fact-checks/[desk]/[slug]/page.tsx` **and** the article branch of
      the overloaded `app/fact-checks/[desk]/page.tsx` to `getArticle` with static
      fallback. Article lookup by slug is canonical — the `[desk]` segment is **not**
      validated against curated desks (live articles sit on language routes like
      `english`). `dynamicParams` default (true) renders live slugs not in
      `generateStaticParams` on demand.
- [x] Verified against staging: `false-equating-somalia-and-al-shabab-is-untrue`
      renders the short layout with verdict badge, date/readTime, "PesaCheck"
      author, and the live body with **working evidence links**. Static slug
      (`flooding-not-from-limpopo`) still renders from the fallback (structured
      slots + related). tsc + biome clean; 50 Vitest tests (12 new for
      `mapArticle`/`renderBody`).

**Notes / carry-overs:**
- **Footnotes — there is NO `body_footer` field.** Verified: the whole Hasura
  schema has zero `footer`/`footnote` fields, `swp_article` has no such column,
  and the complete `swp_article_extra` vocabulary tenant-wide carries none
  (`archiveurl, banner, columns, drafturl, firstsource, firstsourcesocial,
  heading, hero_*, intro, items, originator, stats`). `body_footer` is a
  **Superdesk core** field, but the Publisher→Hasura pipeline doesn't expose it
  (Publisher REST is JWT-gated and isn't the frontend's data source). The footer
  boilerplate is **appended into `body`** on publish, always opening with "This
  post is part of an ongoing series of PesaCheck…". `lib/data/body.ts:
  renderArticleBody` splits the body at that marker → `bodyHtml` (main) +
  `footnotes[]` (boilerplate paragraphs, rendered in the grey band). **English
  marker only**; translated/markerless bodies keep the footer inline (graceful
  fallback). Footnotes carry **sanitized inline HTML** (production footers
  hyperlink "report"/"methodology"), rendered via `dangerouslySetInnerHTML` in
  `ArticleFootnotes` — the same path as the body; static footnotes are plain text
  (valid HTML).
- **Staging sparsity:** no real staging fact-check carries feature media, authors,
  or keywords — only the rich HTML body + verdict. So live articles render with no
  hero image (short layout shows none anyway), author "PesaCheck", no tags, no
  related. Mapper + pages are fully null-safe; PR 5/data backfill will populate these.
- **Sanitizer allowlist** (`lib/data/body.ts`): defaults + `img`/`iframe`, default
  URL schemes (so http local-stack media works post-convergence), `<script>`
  dropped. Twitter/embed scripts therefore degrade to text/links — revisit if
  interactive embeds are needed.
- **Short-form feature image not shown:** per the chosen layout, `ArticleHeroShort`
  has no hero image; `Article.image` is still mapped (used for metadata/related).
  Inline body images come through the rendered HTML.
- **Pre-existing duplicate-React-key warning** still fires from static placeholder
  story cards in a global component (documented since PR1) — unrelated to PR3;
  fix when that placeholder content gets real data.

## PR 4 — Filters — Phase 4 (depends on 2b) ✅
> Offset pagination already shipped in PR 2b (server-side `limit`/`offset` +
> `_aggregate`, driven by `?page=`). PR 4 makes **filtering** server-side and
> wires it onto that same URL mechanism.
- [x] Map filter dimensions to real taxonomy: `region` → `subject[countries]`
      (ISO3), `topic` → `subject[01harm]`, `language` →
      `swp_article_metadata.language` (ISO code, route-agnostic). `mapStory` now
      populates `topic`/`region`/`language` display labels on `Story` from jsonb.
- [x] `lib/data/fact-check-filters.ts` (NEW) — `buildFactCheckWhere` (typed
      `swp_article_bool_exp`), `parseFilterParams`/`filtersToQuery` URL helpers,
      `FilterSelection`/`FilterDimension` types. Unit-tested (Vitest).
- [x] Editorial `{code,label}` option lists in `fact-checks-content` (replaced
      the `string[]` REGIONS/LANGUAGES/TOPICS); `DEFAULT_FILTERS` retired so the
      page loads showing the full grid. `filterLabel(dim, code)` resolves chips.
- [x] `getFactChecks(page, filters)` folds filters into the same `where` +
      aggregate (so `totalPages` reflects them). `GET_FACT_CHECK_ARTICLES` now
      takes a `$where` variable instead of an interpolated string.
- [x] `FactChecksExplorer` is now **URL-driven**: client-side `matches()` removed;
      Apply/Clear/pagination navigate by `?region=…&topic=…&language=…&page=N`
      (codes, comma-separated). Page re-keys the explorer on applied filters so
      navigation resets the staged selection.
- [x] Verified against staging: full grid = 5; `topic=polit_harm` → 2;
      `region=ZAF` → 1; `region=ZAF ∧ topic=polit_harm` → 0 (AND); `language=en`
      → 5, `fr` → 0. Interactive Apply + Clear + URL state restoration all work.
      `pnpm test` (60), tsc, biome clean.

**Notes:**
- **Why editorial options (not live-derived, contra the original plan item):** the
  normalized subject relation exposes only `scheme`/`code` — no display `name`
  (jsonb-only), no reverse relation to article, no tenant scope — so a scoped,
  labeled option list can't be queried. Codes/labels are curated like
  `LANGUAGE_ROUTE_SLUGS`. Filtering itself is fully server-side & scalable.
- **`_and` semantics:** AND across dimensions = separate `swp_article_metadata`
  clauses in `_and`; OR within a dimension = `code: { _in }`. Never emit an empty
  `_in: []` (Hasura matches nothing) → inactive dimensions are omitted.
- **`TaxonomyRow` (`components/ui/MetaRow.tsx`)** made null-safe: it now renders
  only the dimensions present (live articles may carry just some), falling back to
  the Figma placeholders only when nothing is supplied. Previously every live card
  showed `Topic · Region · Language` literals; populating real taxonomy exposed a
  placeholder leak for articles missing a dimension (e.g. no country tag).
- **`SearchExplorer`** (static `/search`, out of scope) adapted to compile: it
  resolves option codes→labels when filtering the label-tagged static pool.
- Fallback (`staticPage`) **ignores filters** by design — degraded mode only.

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
- **Test pure mappers:** add cases to `lib/data/map.test.ts` (Vitest) for any new
  mapper logic — pure functions only; no live-Hasura or component tests.
- **Convergence (Track B):** when local stack is ready, only env vars change.
