# Fact-check filters: taxonomy mapping & decisions

Backs the Region / Language / Topic filters (and `/search`) shipped in
`lib/data/filter-options.ts`, `lib/data/fact-check-filters.ts` and the header
search bar. Written after the PR #97 review
(<https://github.com/CodeForAfrica/pesacheck-ui/pull/97>), which challenged the
taxonomy the filters were built against. This records what the real Superdesk
data says, the decisions taken on each review thread, and what is deliberately
deferred.

**Verified against staging** (2026-08-28): 11,429 published `Debunk`
fact-checks for the PesaCheck tenant. Source of truth for field semantics is the
Superdesk content-config, cross-checked with the superproject ingest plan
(<https://github.com/CodeForAfrica/pesacheck-superdesk-superproject/pull/6>).

## The taxonomy, as it really is

Every editorial field is a `subject` entry in the article `metadata` jsonb:
`{ scheme: <vocabulary id>, code: <qcode>, name: <label> }`. The full set of
schemes on staging and their Superdesk labels:

| scheme (in data) | Superdesk label | select | in our filters? |
| --- | --- | --- | --- |
| `countrymention1` | Primary country / "First country mentioned" | single | **Region** |
| `countries` | Countries mentioned | multi | (alt. region source) |
| `Harm_type` | **Claim Topic** | multi | **Topic** |
| `01harm` | Harm Type | multi | no (legacy; PR wrongly used for Topic) |
| `claimtype` | Claim Type | multi | no |
| `claimformat` | Claim Format | multi | no |
| `GEC` | GEC category | multi | no |
| `Debunklang` | Debunk language | single | **Language** (primary) |
| `platform` | Primary platform | single | no |
| `content_type` | Content Type | single | article-type pages |
| `Debunk` | Verdict | single | verdict (not a reader filter) |

`swp_article_metadata.language` is a **separate scalar column** (ISO `en`/`fr`/
`so`/`am`/`om`/`sw`) — the desk/routing language, distinct from `Debunklang`.

## Decisions (per PR #97 review thread)

### Region → `countrymention1` (not `countries`)
"First country mentioned" (single, ISO3 codes like `NGA`). The PR originally
keyed off `countries`; the reviewer asked for the primary-country field.
`countries` (multi) stays available as an alternative but is not the chosen
source. Region labels come from the subject `name`.

### Topic → `Harm_type` (not `01harm`)
"Claim Topic" (multi; codes like `elections`, `employment`, `finance`,
`gender`). The PR used `01harm` ("Harm Type"), a different, legacy field. Confirmed
via the fully-tagged reference article and the superproject profile mapping.

### Language → `Debunklang`, falling back to the article language
Reviewer decision (thread r3871863426): *"use debunk language and fall back to
the article language when that isn't available."* The two fields do **not** share
a code system and must not be conflated (superproject PR #6, Phase 2):

| | `Debunklang` (Debunk language) | `swp_article_metadata.language` (article) |
| --- | --- | --- |
| code form | vocabulary qcodes (`debunkeng`, `debunkful`, …) — **not ISO** | ISO (`en`, `fr`, …) |
| storage | `subject` scheme | scalar column |
| coverage | ~0% now → 84% forward (PR #6) | ~100% |
| values | English, Fulani, Oromo, … | the 6 desk languages |

Implementation contract:
- **One list, normalized by language *identity* (display name), not code.**
  `debunkeng` and `en` both mean "English" → collapse to one option. ISO can't be
  the key because `Debunklang` is not ISO (PR #6 keeps it deliberately non-ISO).
- **Per-article fallback:** an article's effective language = its `Debunklang`
  value if tagged, else its article `language`.
- **Filter semantics:** selecting a language matches
  `Debunklang = <lang>` **OR** `(no Debunklang AND article language = <lang>)`.
- Debunk-only languages (e.g. Fulani) surface only from `Debunklang`; today the
  fallback carries ~100% of the list because `Debunklang` is barely populated.

## Data reality — why the dropdowns are sparse

The intended fields are defined but almost unpopulated: on staging today only
**~2 articles** (test stubs) carry `countrymention1` / `Harm_type` / `Debunklang`.
Per superproject PR #6 the ingest mapping is **forward-only; backfill is deferred**,
so the 11,429 existing fact-checks stay untagged. Projected coverage once the
mapping lands (still forward-only):

| Field | scheme | projected coverage |
| --- | --- | --- |
| Primary country | `countrymention1` | 98.8% |
| Countries mentioned | `countries` | 97.0% |
| Debunk language | `Debunklang` | 84.4% |
| **Claim topic** | `Harm_type` | **6.6%** |

So Region/Language fill in well over time; **Topic stays sparse for a long
while** regardless of what we build — a data limit, not a code one.

## Options source (the reviewer's core critique)

The "last 300 articles" sample was arbitrary and cannot produce a complete or
unbiased option list (a French-heavy or Kenya-heavy recent window would under-list
languages/regions). The **authoritative source is the Superdesk vocabulary**, and
it is **not exposed by this GraphQL API** — the Hasura schema is 27 `swp_*`
tables with no vocabulary table, and the normalized `swp_article_metadata_subject`
carries only `scheme`/`code` (no display name). So today, labelled options can
only come from sampling article `metadata`.

**Chosen approach (option A):** correct the mappings and derive options from the
article corpus (they grow as content is tagged), and file a follow-up to expose
the vocabularies to the frontend (a Hasura view over the content-config
vocabularies, or a Superdesk REST proxy). Prefer aggregating distinct
`(scheme, code)` over the whole corpus (via the subject relation) to a fixed
recency sample, resolving names from a metadata sample with code fallback.

## Config

`TAXONOMY_SAMPLE_SIZE` and `FILTER_OPTIONS_TTL_SECONDS` (`lib/data/filter-options.ts`)
must be overridable by env var — tuning the sample size or cache TTL should not
need a redeploy.

## Deferred / out of scope for this PR (documented, not fixed)

- **Vocabulary source integration** — the real fix for complete/correct option
  lists (see above). Cross-repo.
- **Backfill** of the 11,429 existing fact-checks — owned by superproject PR #6
  (deliberately forward-only for now).
- **Search precision + scale** — `_ilike '%term%'` runs against `body` (raw HTML),
  so it matches link URLs and tag attributes (e.g. `kasongo` hits ~2/9 results only
  inside a source-link URL), and it is a sequential scan across 11,429 rows. The
  fix (a plain-text search column and/or a `pg_trgm`/FTS index, and reconsidering
  whether `body` belongs in the OR) is **DB-side** and not in scope here. `lead`
  is the article standfirst and is legitimately searchable.
- **Upstream data defects** (superproject PR #6, Phase 0), which the frontend must
  tolerate:
  - Verdict qcodes `true` / `misleading` / `mixture` are emitted but absent from
    the live `Debunk` vocabulary (350 posts) — verdict label resolution must
    degrade gracefully on unknown codes.
  - `countrymention1` miscodes DR Congo as `COG` (should be `COD`).
  - `countries` contains mojibake for Côte d'Ivoire (`CÃ´te d'Ivoire`) — a reason
    `countrymention1` (spelled correctly) is the safer Region source.

## PR #97 review — resolution summary

| Thread | Resolution |
| --- | --- |
| Region uses wrong field | Region → `countrymention1` |
| Topic uses wrong field | Topic → `Harm_type` ("Claim Topic") |
| Is Language = Debunk Language? | Use `Debunklang`, fall back to article language (see contract above) |
| `lead` / missing columns / `kasongo` | `lead` = standfirst (keep); `body` HTML matching + scale deferred to DB work |
| Scale understated (11k) | Confirmed 11,429; DB-side, deferred |
| `TTL` / sample size not configurable | Make both env-tunable |
| "last 300" arbitrary / biased | Correct; the real source is the vocabulary (not in Hasura) — follow-up |
