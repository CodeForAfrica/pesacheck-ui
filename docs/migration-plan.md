# PesaCheck — Migration Plan: hardcoded UI → Superdesk-backed data

Goal: take this Figma-built UI (all copy hardcoded in `lib/*-content.ts`) and
gradually replace the hardcoded content with real data fetched from Superdesk,
working against a **full local Superdesk stack** (editorial core + Publisher +
Hasura) built from the open-source projects.

## Guiding strategy: two parallel tracks

The local stack is the long pole (heavy to stand up, and we have no staging DB
dump — content must be authored locally). The frontend data layer does **not**
need to wait for it: the remote staging Hasura
(`https://pesacheckstaging-hasura.superdesk.org/v1/graphql`) is anonymous,
read-only, and speaks the **same `swp_*` schema** the local stack will. So:

- **Track A — Frontend data layer.** Build against the remote staging Hasura
  now. Prove the data contract page by page. Start immediately.
- **Track B — Local full stack.** Stand up Superdesk + Publisher + Hasura in
  Docker, author content, wire the pipeline. Proceeds independently.
- **Convergence.** When Track B is ready, the frontend repoints a single env
  var (`NEXT_PUBLIC_API_URL` + tenant code + media URL). No component changes.

The reference implementation for everything in Track A is the sibling repo
**`pesacheck-pwa-app-router`** — it already queries this exact schema in prod.

---

## Data source reference (Superdesk Publisher / Hasura)

> Everything an agent needs to find the data, reach it, and know what's in it.
> The frontend reads content **only** from the Publisher's Postgres, exposed as
> GraphQL by Hasura. Superdesk core (MongoDB) is the upstream editorial system of
> record; the frontend never touches it directly.

### Endpoints (staging)

| Service | URL | Auth | Use |
| --- | --- | --- | --- |
| **Hasura GraphQL** | `https://pesacheckstaging-hasura.superdesk.org/v1/graphql` | **none — anonymous, read-only** | All content reads. This is the primary data source. |
| Publisher REST API | `https://pesacheck-staging-publisher.superdesk.pro/api/v2` | JWT (`POST /api/v2/auth/` for token) | Search, auth/login, content push. Protected routes return `401 JWT Token not found`. |
| Publisher media | `https://pesacheck-staging-publisher.superdesk.pro/media/` | none (public GET) | Image/asset bytes. |
| Superdesk core | `https://pesacheck-staging.superdesk.pro` | session | Editorial app (authoring). Not read by the frontend. |
| SD auth check | `https://pesacheck-staging.superdesk.pro/api/macros` | token | Preview-auth check only (returns 401 unauth). |

- **Tenant:** every query MUST filter by `tenant_code = "e6lkum"` (the staging
  PesaCheck tenant). Without it you get other tenants' data or nothing.
- **Media URL pattern:** build image URLs as
  `${MEDIA_URL}${rendition.image.asset_id}.webp` (preferred when `variants`
  includes `"webp"`) else `.${file_extension}`. `MEDIA_URL` =
  `https://pesacheck-staging-publisher.superdesk.pro/media/`. See
  `pesacheck-pwa-app-router/services/helpers.ts:findRendition`.

### How to query (copy-paste)

```bash
curl -s -X POST https://pesacheckstaging-hasura.superdesk.org/v1/graphql \
  -H 'Content-Type: application/json' \
  -d '{"query":"query($t:String!){ swp_article(where:{tenant_code:{_eq:$t}, published_at:{_is_null:false}}, order_by:{published_at:desc}, limit:5){ title slug published_at } }","variables":{"t":"e6lkum"}}'
```

Introspection is enabled (`__type`, `__schema`) — use it to discover columns.

### What's in the Publisher (verified, tenant `e6lkum`)

Scale: **22 articles (all published), 22 routes, 7 content lists.** Small —
realistic to harvest wholesale.

**Core tables** (GraphQL root fields are the table name + `_aggregate`, `_by_pk`):

- `swp_article` — the article record. Key columns:
  `id, title, slug, lead, body, locale, route_id, feature_media, published_at,
  is_publishable, status, metadata (jsonb), tenant_code, template_name`.
  → **The fact-check verdict lives in `metadata`** (jsonb, returned by Hasura as a
  JSON-encoded **string** — parse it): `metadata.subject[]` → the element where
  `scheme === "Debunk"`; its `name`/`code` is the verdict (e.g. "False",
  "Altered", "Hoax"). **Verified** on staging — see Phase-1 notes below.
  Relations: `swp_route`, `swp_article_authors`, `swp_article_keywords`,
  `swp_article_metadata`, `swp_article_extra`, `swp_article_media`,
  `swp_article_feature_media`, `swp_article_related`, `swp_article_seo_metadata`,
  `swp_article_statistics`, `swp_slideshows`.
- `swp_route` — **routes/collections = content desks + sections.** Columns incl.
  `id, name, slug, type` (`type: "collection"` for listing pages, `"content"` for
  single CMS pages). Verified routes include the desks the Figma UI expects:
  `climate-change, gender, elections, public-finances, health`, language
  collections (`english, français, kiswahili, african-languages`), a
  `fact-checks` collection, and `content` pages (`about, methodology,
  principles-and-funding, contact-us`).
- `swp_content_list` (+ `swp_content_list_item`) — **homepage curation.** Verified
  lists map 1:1 to Figma home sections: `Homepage — Hero`, `Homepage —
  Spotlight`, `Homepage — Trending` (all `type: "manual"`), plus `Top news`,
  `Team members`. Fetch items via the list, ordered.
- `swp_article_metadata` — per-article editorial metadata:
  `byline, language, located, genre, priority, urgency, profile, guid` + taxonomy
  relations `swp_article_metadata_subjects` (scheme/code — topic/region),
  `swp_article_metadata_services`, `swp_article_metadata_places`.
  → **`language` and the subject taxonomy drive the Figma filters.** Note: this
  relation table mirrors the same `subject[]` taxonomy embedded in the
  `swp_article.metadata` jsonb column (above) — including the `Debunk` verdict
  scheme. The jsonb column is the path verified in Phase-1; the relation is the
  normalized alternative if you prefer joins over JSON parsing.
- `swp_article_extra` — **key/value custom fields**: `field_name, value, embed,
  description, discr`. → Holds homepage-curation blocks and source attribution,
  **not** the verdict. **Verified** distinct `field_name`s on staging: `banner,
  columns, stats, heading, intro, items, hero_*, originator, firstsource,
  firstsourcesocial, drafturl, archiveurl`. (Earlier drafts of this plan guessed
  the verdict lived here — it does not; see `swp_article.metadata` above.)
- `swp_author` (+ `swp_article_authors`) — bylined authors. Note: `swp_author`
  has **no** `tenant_code` filter; reach authors via the article relation.
- `swp_keyword` (+ `swp_article_keywords`) — tags/keywords (`name, slug`).
- `swp_image` (+ `swp_image_rendition`) — media. `swp_image.asset_id`,
  `file_extension`, `variants`; renditions carry `name, width, height` and the
  `swp_image` relation used to build the media URL.
- `swp_menu` — navigation menus (`swp_menu_by_pk`, nested).
- Others: `swp_slideshow(_item)`, `swp_redirect_route`, `swp_package_preview_token`,
  `swp_file`.

### Canonical queries to copy

The sibling repo **`pesacheck-pwa-app-router`** is a working production frontend
against this exact schema. Reuse, don't reinvent:

- `services/collectionService.queries.js` — latest, by-route, by-tag, by-author,
  by-subject listing queries (with pagination + aggregates).
- `services/articleService.ts` / `.queries.js` — single-article fetch.
- `services/routeService.*`, `menuService.*`, `contentListService.*` — routes,
  menus, curated lists.
- `services/helpers.ts` — `findRendition` (rendition → media URL).
- `services/articleBodyService.js` — `convertBodyImages` (rewrites body `<img>`
  src to `MEDIA_URL`; the non-S3 branch already matches our publisher `/media/`).
- `hasura_metadata.json` — the Hasura table/relationship/permission config; import
  it when standing up a local Hasura so the `swp_*` graph + anonymous role match.

### Local equivalents (Track B)

When the local stack is up, the same map applies with local hosts:
`NEXT_PUBLIC_API_URL=http://localhost:8080/v1/graphql`, a local `tenant_code`
(generated when you create the Publisher tenant), and
`NEXT_PUBLIC_MEDIA_URL=http://localhost:<publisher-port>/media/`.

---

## The seam (architecture)

Today: pages `import { SPOTLIGHT_FEATURE } from "@/lib/home-content"` — static
constants. We keep the **types** (`Story`, `Article`, `ContentDesk`, …) as the
contract and swap the *source* behind them, one page at a time.

Introduce a data-access layer that returns those same types:

```
lib/
  data/
    client.ts        # graphql-request client (reads NEXT_PUBLIC_API_URL)
    queries/         # GraphQL docs, ported from pesacheck-pwa-app-router/services/*.queries.js
    map.ts           # swp_article → Story / Article, rendition → image URL
    desks.ts         # getContentDesks(): ContentDesk[]
    stories.ts       # getSpotlight(), getFactChecks(filters), getByDesk(slug)
    article.ts       # getArticle(slug): Article
  *-content.ts       # KEEP as static fallback during transition
```

Because this is App Router (Next 16) with Server Components, fetching is just
`await` in an async page — no client-side query library needed for SSR. Pattern:

```tsx
// app/fact-checks/page.tsx  (Server Component)
import { getFactChecks } from "@/lib/data/stories";
import * as fallback from "@/lib/fact-checks-content";

export default async function Page() {
  const stories = (await getFactChecks().catch(() => null)) ?? fallback.GRID;
  return <FactChecksListing stories={stories} />;
}
```

Migrate by flipping each page from the `fallback` import to the `getX()` call.
A `DATA_SOURCE=static|hasura` env flag (or the `?? fallback` pattern above) lets
unconverted sections keep rendering throughout.

---

## Data contract: Figma types → Superdesk (Hasura `swp_*`)

Source of truth for queries/mappers: `pesacheck-pwa-app-router/services/`
(`collectionService.queries.js`, `articleService.ts`, `routeService.ts`,
`menuService.ts`, `helpers.ts`, `articleBodyService.js`).

| Figma field (`Story` / `Article`) | Superdesk source | Notes |
| --- | --- | --- |
| `image` | `swp_article.swp_image_renditions` → `${MEDIA_URL}${asset_id}.webp` | Reuse `helpers.ts:findRendition`; pick a rendition by name |
| `title` | `swp_article.title` (or SEO/subtitle) | |
| `excerpt` | `swp_article.lead` / description | |
| `verdict` ("False", "Altered", …) | **`swp_article.metadata` jsonb** → `subject[]` where `scheme === "Debunk"` → `.name` | **Verified** on staging. Parse `metadata` (Hasura returns it as a string). Title prefix (FAKE/SATIRE/…) is a separate editor convention and does **not** always match the `Debunk` code — use the structured tag, not the title. Null-safe: some articles have an empty `subject[]`. |
| `topic` / harm | `swp_article.metadata` `subject[]` where `scheme === "01harm"` or `"Harm_type"` (also `swp_route.name`) | Same array as verdict. Desks are still routes (see below). |
| `region` | `swp_article.metadata` `subject[]` where `scheme === "countries"` / `"countrymention1"` | **Verified** — same array as verdict. |
| `language` | article language field / language route | English/Français/Kiswahili exist as routes |
| `date` | `swp_article.published_at` | Format client-side |
| `readTime` | **computed** from body word count | No native field |
| `href` | route slug + article slug | cf. `swp_article_previous_relative_url` |
| `tags` (Article) | `swp_article_keywords` → `swp_keyword` | |
| `author` (Article) | `swp_article_authors` → `swp_author` | |
| body paragraphs / inline image | `swp_article.body` | Convert via `articleBodyService.js:convertBodyImages` (rewrites img src to MEDIA_URL — already the non-S3 branch) |
| `relatedStories` | `swp_article_related` | |
| `ContentDesk{name,slug}` | `swp_route` where `type: "collection"` | **Confirmed 1:1** on staging: climate-change, gender, elections, public-finances, health, … |
| `ContentDesk.image` | **TBD** | Routes carry no image — use a curated map or a representative article rendition |

### Already verified on staging (`tenant_code = e6lkum`)
- Routes match the Figma content desks almost exactly (Climate Change, Gender,
  Elections, Public Finances, Health) plus language collections.
- Marketing pages exist as `type: "content"` routes (About, Methodology,
  Principles & Funding, Contact) → can become CMS-driven later, not just static.

### Phase 1 discovery items
1. ~~**Verdict**~~ — ✅ **RESOLVED.** Lives in `swp_article.metadata` (jsonb) →
   `subject[]` → element where `scheme === "Debunk"`; `.name` is the verdict
   ("False", "Altered", "Hoax", …). **Not** in `swp_article_extra` (the original
   guess was wrong). Open sub-item: the full `Debunk` vocabulary can't be
   enumerated from staging (only ~5 real fact-checks, 3 distinct codes seen:
   `false`, `altered`, `hoax`) — confirm the complete set (does it include
   "Partly False" / "Misleading"?) against the Superdesk vocabulary config or
   `pesacheck-pwa-app-router`'s mapper before finalizing the verdict→label map.
2. **Rendition names** — which rendition to request per card size (hero vs grid).
3. ~~**Region/topic taxonomy**~~ — ✅ **RESOLVED** (same `metadata.subject[]`
   array as verdict): region = `scheme:"countries"` / `"countrymention1"`,
   topic/harm = `scheme:"01harm"` / `"Harm_type"`. Other observed schemes:
   `claimtype`, `claimformat`, `platform`, `Debunklang`, `GEC`. Keyword fallback
   only if an article lacks the subject tag.
4. **Content-desk images** — decide curated map vs derived from articles.

---

## Track A — Frontend migration (phased)

Each phase keeps the static fallback; flip sections as they're proven.

- **Phase 1 — Foundation.** Add `graphql-request`; build `lib/data/client.ts`,
  `map.ts`, queries. Add `.env.local` pointing at remote staging Hasura. Resolve
  the 4 discovery items. Ship `getContentDesks()` first (lowest-risk, 1:1).
- **Phase 2 — Listings.** Home spotlight + `/fact-checks` grid from `swp_article`
  (the `Story` card). Wire `verdict`, `image`, `date`.
- **Phase 3 — Single article.** `/fact-checks/[slug]` → `Article`: body
  conversion, authors, tags, related stories.
- **Phase 4 — Filters & pagination.** region / language / topic wired to real
  taxonomy; offset pagination (cf. `collectionService`).
- **Phase 5 — Desk pages.** `/fact-checks/[desk]` from route collections.
- **Phase 6 (optional) — Marketing pages** from `type: "content"` routes.

### Config changes to this repo (Phase 1)
- `package.json`: add `graphql-request` (+ `graphql`).
- `.env.local`:
  ```
  NEXT_PUBLIC_API_URL=https://pesacheckstaging-hasura.superdesk.org/v1/graphql
  NEXT_PUBLIC_TENANT_CODE=e6lkum
  NEXT_PUBLIC_MEDIA_URL=https://pesacheck-staging-publisher.superdesk.pro/media/
  ```
- `next.config.ts`: add the media host to `images.remotePatterns`; if a CSP is
  added later, allow the Hasura + media origins in `connect-src`/`img-src`
  (mirror what `pesacheck-pwa-app-router/next.config.js` does).

---

## Track B — Local full Superdesk stack (seed core → flow to Publisher)

We build from the open-source projects (no staging access beyond public APIs).
Components: **Superdesk core** (editorial: Angular client + Python server + Mongo
+ Elasticsearch + Redis), **Superdesk Publisher** (Symfony/PHP + PostgreSQL),
**Hasura** (GraphQL over the Publisher Postgres). Budget ~8GB RAM.

### Why seed core (not push to Publisher directly)
Content is seeded by **authoring + publishing in core**, then letting Superdesk's
own pipeline transmit it to Publisher — the same path real editors use. The
payoff: core generates **image renditions** (the card/hero crops the frontend
relies on via `swp_image_rendition`) and the authentic article JSON **for free**.
Pushing straight to Publisher's API is lighter but means hand-crafting that
payload and renditions yourself. The cost of the core path is the wiring in
steps 4–5 below.

> **Publishing is the trigger.** Only *published* items flow to Publisher.
> Inserting rows straight into Mongo does **not** reach Publisher — there's no
> publish event. All seeding must go through the publish action.

### Setup
1. **Prereqs.** Docker + Docker Compose. Clone `superdesk/superdesk` and
   `superdesk/web-publisher`.
2. **Superdesk core.** Bring up via its bundled docker-compose; create an admin
   user; confirm the editorial UI loads. Run the prepopulate/init command to get
   default desks, stages, and users.
3. **Publisher.** Bring up Publisher + Postgres; create an **organization** and a
   **tenant** → note the generated `tenant_code` (local analogue of `e6lkum`).
   Note the organization **API key**. Media is served from Publisher's `/media/`.
4. **Wire core → Publisher (the publish pipeline).**
   - In **core**, register a **subscriber** with a **destination** whose
     transmitter targets Publisher's **content-push API**
     (`<publisher>/api/v2/content/push`), authenticated with the org API key /
     shared secret (this is what `WEBHOOK_TOP_SECRET_TOKEN` in the reference repo
     is for).
   - In **Publisher**, define **routing rules** so pushed articles are assigned
     to the routes/collections matching the Figma desk slugs
     (`climate-change`, `gender`, `elections`, …).
     ⚠️ **Most common failure:** articles push in successfully but appear nowhere
     because no routing rule placed them on a route the frontend reads. Verify a
     pushed article gets a `route_id` in Publisher.
5. **Hasura.** Run a Hasura container against the Publisher Postgres. **Import
   `pesacheck-pwa-app-router/hasura_metadata.json`** to expose the `swp_*` tables
   and grant the **anonymous role** read access (so the browser can query, same
   as staging).
6. **Seed content.** Either author + publish a few fact-checks by hand in the
   core UI, or script it against the core REST API (sketch below). Each item must
   reach the **published** state. Then verify they appear via a Hasura query
   filtered by the local `tenant_code`.
7. **Repoint frontend.** `.env.local` →
   `NEXT_PUBLIC_API_URL=http://localhost:8080/v1/graphql`,
   local `NEXT_PUBLIC_TENANT_CODE`,
   `NEXT_PUBLIC_MEDIA_URL=http://localhost:<publisher-port>/media/`.

### Seed script sketch (core REST API)
Automates "create → publish" so the pipeline carries items to Publisher. Pseudo:

```
# 1. Authenticate → session token
POST /api/auth_db { username, password }            → token

# 2. For each sample fact-check:
POST /api/archive {                                  # create draft on a desk/stage
  type: "text", headline, slug, body_html,
  byline, subject: [...taxonomy...], task: { desk, stage },
  associations: { featuremedia: <uploaded image> }   # → renditions on publish
}                                                    → item _id, _etag

# 3. (optional) attach media first:
POST /api/archive  (type:"picture", multipart)       # upload → use as featuremedia

# 4. Publish (this is what flows to Publisher):
PATCH /api/archive/<id>/publish  (If-Match: <_etag>) { state: "published" }
```

Notes:
- Send `If-Match: <_etag>` on every PATCH (Superdesk uses optimistic concurrency).
- `associations.featuremedia` is what makes core generate the renditions.
- Map sample articles' `subject`/desk to the taxonomy the frontend filters on
  (resolve in Phase 1 discovery first, so verdict/region/topic land correctly).
- Keep the script idempotent (skip if slug already published) so reruns are safe.

### Lighter fallback
If the core→Publisher wiring (step 4) blocks you, fall back to **Publisher +
Hasura only**, seeded via Publisher's content-push API directly or its demo
fixtures — same `swp_*` contract, no editorial core. You lose payload/rendition
fidelity but unblock frontend work.

---

## Risks & open questions
- ~~**Verdict & taxonomy modeling**~~ — ✅ located in `swp_article.metadata`
  jsonb (`subject[]`, `scheme:"Debunk"` for verdict; `countries`/`01harm` for
  region/topic). Residual risks: (a) the **full `Debunk` vocabulary** is
  unconfirmed (small staging sample) — verify against Superdesk config /
  `pesacheck-pwa-app-router`; (b) **data completeness** — some published articles
  have an empty `subject[]` (no verdict tag), so the mapper must be null-safe and
  the UI must tolerate a missing verdict; (c) **don't parse the title prefix** —
  the FAKE/SATIRE/… label in headlines doesn't reliably match the `Debunk` code.
- **No staging DB dump** → realistic local data must be authored/seeded; Track A
  against remote staging mitigates this for dev in the meantime.
- **core → Publisher wiring** (subscriber + routing rules) is the most failure-
  prone step. Validate one published article end-to-end before bulk seeding.
- **`readTime`** and **content-desk images** have no direct source — compute /
  curate.
- **Rendition mismatch** — local/staging may expose different rendition names than
  prod; keep the rendition picker tolerant with fallbacks.
- **Version drift** — exact menu/command names for subscribers, routing rules, and
  prepopulate differ across Superdesk/Publisher versions; confirm against the
  versions you clone.

## Suggested first concrete steps
1. ✅ Done — verdict/taxonomy located in `swp_article.metadata` (`subject[]`:
   `Debunk` = verdict, `countries`/`01harm` = region/topic). Remaining: confirm
   the full `Debunk` vocabulary (item #1 above) and write the parse-`metadata` +
   `findSubject(scheme)` helper as part of `lib/data/map.ts`.
2. Scaffold `lib/data/` (client + `getContentDesks` + mapper) and convert the
   Content Desks row end-to-end as the proof-of-seam (against remote staging).
3. In parallel, stand up core + Publisher + Hasura and validate **one**
   hand-published article flowing all the way to a Hasura query before scripting
   the bulk seed.
