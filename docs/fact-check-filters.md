# Fact-check filters: taxonomy mapping

How the Region / Language / Topic filters (and `/search`) map to Superdesk
taxonomy, and how the dropdown options are derived. Backs
`lib/data/filter-options.ts`, `lib/data/fact-check-filters.ts` and the header
search bar.

## The taxonomy

Every editorial field is a `subject` entry in the article `metadata` jsonb:
`{ scheme: <vocabulary id>, code: <qcode>, name: <label> }`. The schemes present
on staging and their Superdesk labels:

| scheme (in data) | Superdesk label | select | used by |
| --- | --- | --- | --- |
| `countrymention1` | Primary country / "First country mentioned" | single | **Region** |
| `countries` | Countries mentioned | multi | — |
| `Harm_type` | Claim Topic | multi | **Topic**, content desks |
| `01harm` | Harm Type | multi | — |
| `claimtype` | Claim Type | multi | — |
| `claimformat` | Claim Format | multi | — |
| `GEC` | GEC category | multi | — |
| `Debunklang` | Debunk language | single | **Language** (primary) |
| `platform` | Primary platform | single | — |
| `content_type` | Content Type | single | article-type pages |
| `Debunk` | Verdict | single | verdict |

`swp_article_metadata.language` is a separate scalar column (ISO `en`/`fr`/`so`/
`am`/`om`/`sw`) — the desk/routing language, distinct from `Debunklang`.

## Filter dimensions

### Region → `countrymention1`
"First country mentioned" (single, ISO3 codes like `NGA`). Labels come from the
subject `name`.

### Topic → `Harm_type`
"Claim Topic" (multi; codes like `elections`, `employment`, `finance`, `gender`).

This is also what a **content desk** collects: `/fact-checks/<slug>` lists the
fact-checks carrying the desk's Claim Topics. Which desks exist is editorial,
not a fold of the topics in use. See "Content desks" below.

### Language → `Debunklang`, falling back to the article language
The Language filter is keyed on the Debunk language, and falls back to the
article language for any article that has none. The two use different code
systems and are reconciled at the presentation layer:

| | `Debunklang` (Debunk language) | `swp_article_metadata.language` (article) |
| --- | --- | --- |
| code form | vocabulary qcodes (`debunkeng`, `debunkful`, …) — non-ISO | ISO (`en`, `fr`, …) |
| storage | `subject` scheme | scalar column |
| values | English, Fulani, Oromo, … | the 6 desk languages |

Contract:
- **One list, deduped by language identity (display name), not code.**
  A debunk language whose label already appears as a desk language (e.g.
  "English") is dropped in favour of the ISO option, so its option keeps the
  fully-populated column code. Debunk-only languages (e.g. Fulani) keep their
  vocabulary code.
- **Filter match:** a selected code matches the article `language` column **OR**
  the `Debunklang` subject code. The two code systems don't overlap, so a
  desk-language code (`en`) only ever hits the column and a debunk-only code
  (`debunkful`) only ever hits the subject.

## How options are derived

Labelled options come from the taxonomy that published fact-checks carry:
distinct `(scheme, code)` across the corpus, with names resolved from the article
`metadata` (code as the fallback label). The controlled Superdesk vocabularies
are the complete source but are **not exposed by this GraphQL API** — the schema
is `swp_*` tables with no vocabulary table, and the normalized
`swp_article_metadata_subject` relation carries `scheme`/`code` but no display
name. So the option lists describe the taxonomy actually applied to content, and
grow as more content is tagged.

Sizing and caching are env-tunable:
- `TAXONOMY_SAMPLE_SIZE` — how many fact-checks are read to build the lists.
- `FILTER_OPTIONS_TTL_SECONDS` — how long a derived set is cached.

`FALLBACK_FILTER_OPTIONS` (`lib/fact-checks-content.ts`) is used only in degraded
mode, when the taxonomy read fails.

## Content desks

A content desk **gathers** Claim Topics (`lib/content-desks.ts`). PesaCheck
runs five — Climate, Elections, Gender, Health,
Public Finances — and `CONTENT_DESKS` is that list, in that order.
`/fact-checks/<slug>` lists the fact-checks carrying any of a desk's topics.

The catalog is editorial rather than derived, and three things follow from
that. A desk's name is its own (`Public Finances`, not the `finance` code's
label). A desk can gather more than one topic: Health lists both `health` and
`covid`, because Covid-19 is tagged as a topic but is not a desk. And a topic
nobody runs a desk for — `employment`, `politics` — has no page at all; its
fact-checks are still reachable through the Topic dropdown on `/fact-checks`.

Nothing about the row is read from Hasura. An earlier version folded the
catalog out of the Claim Topics published fact-checks carried, and that is
incompatible with a fixed list of five: the fold samples the newest
`TAXONOMY_SAMPLE_SIZE` tagged articles, and Public Finances — one published
fact-check, well outside that window — simply never appeared. A desk the row
is supposed to show is not something to discover. The cost of a desk whose
listing is thin is PesaCheck's to carry; the cost of a desk that silently
vanishes is a reader's.

Dropping that read also takes a Hasura round-trip off the home page and off
every desk page.

The thumbnails are curated for the same reason they always were: Superdesk
has no field for them.

Slugs this site no longer serves redirect rather than 404 (`RETIRED_DESKS`,
applied in `next.config.ts`): the desks dropped when the catalog was cut to
five, and the design-era URLs that predate slugs coming from topic codes.
`/fact-checks/covid` goes to the Health desk that now carries its fact-checks,
`/fact-checks/climate-change` to `/fact-checks/climate`, and the rest to the
full listing. They are 307s, not 308s — which desks PesaCheck runs is an
editorial decision that may change again, and a browser caches a 308 forever.

On a desk page the Topic dropdown composes with the desk as an intersection:
Claim Topic is multi-valued, so `/fact-checks/climate?topic=gender` asks for
fact-checks tagged both.

## Coverage

The country and language fields populate on most content; Claim Topic is applied
to a small fraction, so the Topic dropdown stays short — and the desk row with
it — until more content carries it. Existing articles are tagged going forward
rather than backfilled, so option lists, desks and filter results fill in over
time.

## Related / downstream

- **Vocabulary source:** exposing the Superdesk vocabularies to the frontend (a
  Hasura view over the content-config vocabularies, or a Superdesk REST proxy)
  would give complete, authoritative option lists independent of what content is
  tagged.
- **Search:** free-text search runs `_ilike '%term%'` across `title`/`lead`/`body`.
  `body` is stored as HTML, so a term can match markup (e.g. a link URL) rather
  than visible text; and the pattern is a sequential scan. A plain-text search
  column and a trigram/FTS index are the scaling path.
- **Verdict labels:** the `Debunk` scheme can carry qcodes not present in the
  live vocabulary, so verdict label resolution tolerates unknown codes.
- **Country codes:** `countrymention1` is the source for Region names/codes;
  `countries` carries an encoding artefact for Côte d'Ivoire and a DR Congo code
  mismatch, so it is not used for Region.
