# Caching and revalidation

How an edit in Superdesk reaches the live site, and what to check when it
doesn't. Companion to [`superdesk-setup.md`](./superdesk-setup.md) (the content
side) and `AGENTS.md` (the data layer).

The site is prerendered: pages are built once and served from cache, so a
Superdesk edit is not visible until something invalidates that cache. Two
mechanisms do, and they are meant to overlap.

| | What triggers it | How fast | Covers |
| --- | --- | --- | --- |
| **Tag revalidation** | a Publisher webhook POSTs `/api/revalidate` | seconds | articles, content desks, menus |
| **Time (ISR)** | nothing — every page carries `revalidate = 300` | ≤ 5 min | everything, including what the webhook can't see |

The TTL is the backstop, and it is load-bearing rather than ceremonial.
Publisher delivers a webhook once, with no retry and no delivery log, and it
has **no event for content lists** — so a curation change (reordering the
homepage hero, adding someone to the Team list) reaches the site on the TTL
alone. Article, route and menu edits are near-instant; everything else is at
most five minutes late. Either way the failure mode is slow, not frozen, which
is the thing this replaces.

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

### A cached read caches failures too

Next declines to cache a non-200 response, so a 5xx from Hasura or Cloudflare
is retried on the next render. **A GraphQL error is not a non-200**: Hasura
answers a statement timeout or a validation error with HTTP 200 and an `errors`
body, `graphql-request` throws on it, and Next — seeing a 200 — stores it under
that read's tags for the full TTL.

The visible effect is a page stuck on its static fallback for up to five
minutes after Hasura has recovered, which reads exactly like unfinished
curation. It clears in one of two ways: the TTL expires, or a webhook
revalidates the tag, which drops the poisoned entry along with everything else
carrying it. Republishing the article is therefore a legitimate way to force
recovery.

This is the price of tagging: an uncached read cannot be revalidated on demand,
because there is nothing stored for the tag to point at. Worth knowing before
raising `DEFAULT_REVALIDATE` — a longer TTL is also a longer window in which a
one-second Hasura blip keeps showing design copy.

## The endpoint

`POST /api/revalidate`, authenticated with the `REVALIDATE_SECRET` shared
secret. Without the secret configured the route answers `503` and the site runs
on TTLs alone.

**The secret travels in the URL** — `?secret=…`. Publisher's webhook form has
three fields (events, URL, enabled) and no way to add a header, so there is
nowhere else to put it. Use a value that is *only* this secret's: it will show
up in access logs and proxy traces, and while the worst an attacker can do with
it is force re-renders, that is not a secret to share with anything else. The
route also accepts `x-revalidate-secret` or `Authorization: Bearer` for callers
that can set headers — a manual `curl`, a monitor.

Use `openssl rand -hex 32`. Hex needs no escaping anywhere, so the value stays
identical across the Publisher form, the environment variable and any `curl`
you paste it into.

Base64 also works — the endpoint reads the query parameter without
form-decoding it, so a `+` matches as a `+` rather than arriving as a space.
The one shape that cannot work is a secret containing a literal **space**:
Next re-serializes the query before the handler sees it, turning `%20` into
`+`, so such a secret authenticates by header and always fails by URL. Hex
sidesteps it.

Publisher sends the event in a header and the changed entity as the body:

```
POST /api/revalidate?secret=…
X-WEBHOOK-EVENT: article[published]
X-WEBHOOK-TENANT: 123abc

{ "id": 42, "title": "…", "slug": "an-article-slug", "route": {…}, … }
```

`tagsForEvent` in `lib/data/cache.ts` maps the event to tags; only `slug` is
read from the body. A **direct** shape also works, for a manual poke:

```json
{ "slug": "an-article-slug" }
{ "tags": ["content-lists", "navigation"] }
```

Answers are deliberately explicit about doing nothing, so a misconfigured
webhook cannot look like a working one:

| Response | Meaning |
| --- | --- |
| `{"revalidated": true, "tags": [...]}` | those tags were dropped |
| `{"revalidated": false, "reason": "other tenant"}` | `X-WEBHOOK-TENANT` isn't ours — a webhook pointed at the wrong site |
| `{"revalidated": false, "reason": "no tags mapped for X"}` | subscribed to an event no page depends on |
| `401` | wrong or missing secret |
| `503` | `REVALIDATE_SECRET` is not set |

Revalidation uses the `"max"` profile — stale-while-revalidate. The reader who
arrives first gets the old page and the fresh one renders behind them, rather
than waiting on Hasura.

### Which events map to what

| Publisher event | Tags | Why |
| --- | --- | --- |
| `article[created\|updated\|published\|unpublished\|canceled]` | `article:<slug>`, `articles`, `content-lists` | the article's page, and everything that lists it |
| `article[preview]` | none | renders an unpublished draft; must never reach the live cache |
| `route[created\|updated\|deleted]` | `routes`, `articles` | which desks exist, and which desk a listing sits under |
| `menu[created\|updated\|deleted]` | `navigation` | header and footer link rows |
| `package[*]` | none | the incoming Superdesk item, before Publisher has made an article of it — the `article[*]` event that follows is the one carrying a slug |

An article event with no slug in the body still busts the listings. A listing
refresh beats nothing.

## Setting up the webhook

1. Generate a secret — `openssl rand -hex 32` — and set `REVALIDATE_SECRET` in
   the site's environment. Until it is set the endpoint answers `503`.
2. Add the webhook in Publisher, pointing at
   `https://<site>/api/revalidate?secret=<the secret>`. Click-path, the events
   to subscribe to, and how to verify it: **[Webhooks — telling the site an
   edit happened](./superdesk-setup.md#webhooks--telling-the-site-an-edit-happened)**
   in `superdesk-setup.md`.

Webhooks are tenant-scoped entities in Publisher, so there is one set per
tenant and no cross-tenant noise.

### Why the TTL stays

Two properties of Publisher's webhooks make time-based revalidation
load-bearing rather than ceremonial:

- **No content-list event.** Reordering a curated list fires nothing, so
  curation changes land on the TTL. An *article* edit does bust
  `content-lists`, so the common case — a title or image changing everywhere it
  appears — is still immediate.
- **Single-attempt delivery.** `WebhookHandler` sends one request through
  Symfony Messenger with no retry, and Publisher keeps no delivery log. A
  webhook lost to a deploy or a timeout is simply lost. Publisher's messenger
  consumer also has to be running, or webhooks queue and never send at all.

If either gap starts to matter, the alternative considered and set aside was a
**Hasura event trigger** on the `swp_*` tables — it fires on the row the site
actually reads, so it covers content lists, and it has retries and invocation
logs. It was ruled out deliberately: creating one needs the Hasura admin secret
(the served console is disabled) plus write access to Publisher's database, so
it is the platform operator's setup rather than the editorial team's. Revisiting
it would mean a second payload parser in the endpoint; the tags themselves would
not change.

## Checking it works

Locally, tag revalidation only means something against a production build —
`next dev` renders every request fresh, so nothing is ever stale there.

```bash
pnpm build && pnpm start
```

Then send what Publisher would send:

```bash
curl -s -X POST "localhost:3000/api/revalidate?secret=$REVALIDATE_SECRET" \
  -H 'content-type: application/json' \
  -H 'x-webhook-event: article[published]' \
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
2. **It showed design copy for a few minutes, then fixed itself.** A Hasura
   error was cached for the TTL — see *A cached read caches failures too*
   above. Nothing to fix on the site; look at Hasura for the original error.
3. **It was a curation change.** Content lists have no Publisher event; the
   TTL is the only thing that refreshes them. Expected, not a fault.
4. **The webhook didn't fire, or fired and failed.** Publisher keeps no
   delivery log, so this is diagnosed from the site's side: the endpoint logs
   nothing either, but your host's access log will show the `POST` and its
   status. No request at all means the webhook is disabled, subscribed to the
   wrong event, or Publisher's messenger consumer isn't running. A `401` means
   the `?secret=` doesn't match the deployed `REVALIDATE_SECRET`.
5. **The tag was too narrow.** Read the page's `.meta`, and check the tag the
   endpoint reported is in it.
6. **Multiple instances.** Tag revalidation invalidates the cache of the
   instance handling it. On Vercel that cache is shared, so one call is enough.
   Self-hosted behind more than one replica, each holds its own `.next/cache`
   and would need a shared cache handler — otherwise revalidation only reaches
   whichever replica the webhook landed on.
