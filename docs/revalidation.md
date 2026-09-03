# Caching and revalidation

How an edit in Superdesk reaches the live site, and what to check when it
doesn't. Companion to [`superdesk-setup.md`](./superdesk-setup.md) (the content
side) and `AGENTS.md` (the data layer).

The site is prerendered: pages are built once and served from cache, so a
Superdesk edit is not visible until something invalidates that cache. Two
mechanisms do, and they are meant to overlap.

| | What triggers it | How fast | Covers |
| --- | --- | --- | --- |
| **Tag revalidation** | Hasura POSTs `/api/revalidate` when a row changes | seconds | the pages that actually read the changed row |
| **Time (ISR)** | nothing — every page carries `revalidate = 300` | ≤ 5 min | everything, including edits the webhook missed |

The TTL is the backstop. If the webhook is misconfigured, unreachable, or the
edit touched a table nobody mapped, the site is still at most five minutes
behind — it degrades to slow, not broken. That is deliberate: a silent
never-updates failure is the thing this replaces.

## Cache tags

Every read declares what it belongs to. `lib/data/cache.ts` holds the
vocabulary; `gql()` takes them as its third argument:

```ts
await gql<Shape>(QUERY, { tenant: TENANT_CODE, slug }, { tags: [TAGS.article(slug)] });
```

| Tag | Set by | Busted by |
| --- | --- | --- |
| `article:<slug>` | `getRawArticle` | that article changing |
| `articles` | the fact-check grids, search, desk listings | any article changing |
| `content-list:<name>` | `getContentListArticles` | that list changing |
| `content-lists` | the same call, collectively | any article or list changing |
| `routes` | `getContentDesks` | a route changing |
| `navigation` | `getSiteMenus` | a menu changing |
| `filter-options` | `getFilterOptions` | nothing automatic — hourly TTL |

Next records a read's tags on the cached response **and** on every page
prerendered from it, so `revalidateTag("article:x")` drops both. You can see
what a page ended up carrying:

```bash
cat .next/server/app/fact-checks/climate-change/<slug>.meta
```

Two rules worth keeping when adding a query:

- **Tag generously.** An over-broad tag costs a re-render; a too-narrow one
  costs an edit that never appears, which nobody notices until a reader does.
  This is why any article change busts every listing rather than trying to work
  out which listings contained it.
- **Nothing read in the root layout should carry `articles`.** The layout
  renders on every page, so its tags land on every page — Privacy Policy
  included. `getFilterOptions` is in the layout and derives from article
  taxonomy, which is exactly why it has its own tag instead: otherwise one
  article edit would rebuild the entire site and tagging would buy nothing.

### Why the reads are explicitly cached

Since Next 15 an unconfigured `fetch` is not cached at all, and Next only
auto-caches `GET`. GraphQL is `POST`, so `lib/data/client.ts` sets
`next: { tags, revalidate }` on every request — without an explicit cache
config the response would never be stored, and a tag on an unstored response
means nothing.

`getFilterOptions` is the exception to the pattern: it wraps its query in
`unstable_cache`, and fetch tags raised inside that callback are **not**
collected. Its tag is declared on the `unstable_cache` options instead. Any
future wrapper needs the same treatment.

## The endpoint

`POST /api/revalidate`, authenticated with the `REVALIDATE_SECRET` shared
secret sent as `x-revalidate-secret` (or `Authorization: Bearer`). Without the
secret configured the route answers `503` and the site runs on TTLs alone.

It accepts two payload shapes.

**Hasura event trigger** — mapped by table name:

```json
{ "table": { "name": "swp_article" },
  "event": { "op": "UPDATE", "data": { "new": { "slug": "…", "tenant_code": "…" } } } }
```

**Direct** — for a manual poke, or a webhook you shape yourself:

```json
{ "slug": "an-article-slug" }
{ "tags": ["content-lists", "navigation"] }
```

Answers are deliberately explicit about doing nothing, so a misconfigured
trigger cannot look like a working one:

| Response | Meaning |
| --- | --- |
| `{"revalidated": true, "tags": [...]}` | those tags were dropped |
| `{"revalidated": false, "reason": "other tenant"}` | the row belongs to another tenant on the shared Publisher database |
| `{"revalidated": false, "reason": "no tags mapped for X"}` | a trigger exists on a table `tagsForTable` doesn't know |
| `401` | wrong or missing secret |
| `503` | `REVALIDATE_SECRET` is not set |

Revalidation uses the `"max"` profile — stale-while-revalidate. The reader who
arrives first gets the old page and the fresh one renders behind them, rather
than waiting on Hasura.

## Setting up the Hasura trigger

Generate a secret (`openssl rand -hex 32`), set `REVALIDATE_SECRET` in the
site's environment, then in the Hasura console under **Events → Create**, one
trigger per table:

| Table | Operations | Why |
| --- | --- | --- |
| `swp_article` | insert, update, delete | the article's page and every listing |
| `swp_content_list` | insert, update, delete | a list renamed or removed |
| `swp_content_list_item` | insert, update, delete | curation reordered |
| `swp_route` | insert, update, delete | which content desks exist |
| `swp_menu` | insert, update, delete | header and footer links |

For each: webhook URL `https://<site>/api/revalidate`, and add the header
`x-revalidate-secret` with the same value (as a static value, or from an env
var on the Hasura instance). Leave the payload defaults — the route reads
`table.name` and `event.data.new`.

Triggers fire for **every** tenant on the shared Publisher database. The route
drops rows whose `tenant_code` isn't ours rather than rebuilding the site on
another tenant's edit, so this costs a request, not a render.

The child tables (`swp_article_extra`, `swp_article_metadata`) are mapped but
not in the list above: their rows carry no slug, so they can only refresh
listings. Publisher rewrites the `swp_article` row whenever Superdesk
republishes, and that event names the slug, so `swp_article` covers them.

## Superdesk-side alternatives

The trigger sits on Hasura because that is what the site actually reads — it
fires on the row the query returns, whatever wrote it. Two Superdesk-side
options exist if the Hasura console is ever out of reach:

- **Publisher webhooks** (Publisher settings) fire on publish/unpublish events.
  They report the Superdesk event rather than the Publisher row, so they miss
  anything that changes content without a publish — curation, menus, routes —
  and they fire before the row is guaranteed to be readable through Hasura.
- **Superdesk subscribers** are a distribution mechanism (who receives
  published content, through which transport), not a change feed for the
  website. Publisher is itself one of these subscribers. Adding an HTTP push
  subscriber to hit this endpoint would work, but it duplicates the delivery
  path that already ends in the rows Hasura serves.

Either can post `{"slug": "…"}` or `{"tags": [...]}` to the same endpoint with
the same secret — the direct payload shape exists for exactly this.

## Checking it works

Locally, tag revalidation only means something against a production build —
`next dev` renders every request fresh, so nothing is ever stale there.

```bash
pnpm build && pnpm start
```

```bash
curl -s -X POST localhost:3000/api/revalidate \
  -H 'content-type: application/json' \
  -H "x-revalidate-secret: $REVALIDATE_SECRET" \
  -d '{"slug":"flooding-not-from-limpopo"}'
```

The `.meta` file for a page carrying that tag is rewritten on the next request
to it; a page that doesn't carry the tag keeps its build-time timestamp. That
comparison — one page's cache entry changing while its neighbour's doesn't — is
the thing worth checking, because a response of `{"revalidated": true}` only
says the tags were dropped, not that they were the right ones.

## When an edit still doesn't show

In order of likelihood:

1. **More than five minutes have passed and it's still stale.** Then it isn't
   caching — the TTL would have caught it. Check the query, or whether the page
   is silently falling back to `lib/*-content.ts` (see *Fallback behaviour* in
   `superdesk-setup.md`; a broken query looks exactly like unfinished
   curation).
2. **The trigger didn't fire.** Hasura's console shows per-trigger invocation
   logs with the response body. A `401` there means the header doesn't match
   the deployed secret; `no tags mapped` means the table isn't in
   `tagsForTable`.
3. **The tag was too narrow.** Read the page's `.meta`, and check the tag the
   endpoint reported is in it.
4. **Multiple instances.** Tag revalidation invalidates the cache of the
   instance handling it. On Vercel that cache is shared, so one call is enough.
   Self-hosted behind more than one replica, each holds its own `.next/cache`
   and would need a shared cache handler — otherwise revalidation only reaches
   whichever replica the webhook landed on.
