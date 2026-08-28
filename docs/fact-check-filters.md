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
| `Harm_type` | Claim Topic | multi | **Topic** |
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
- **One list, normalized by language identity (display name), not code.**
  `debunkeng` and `en` both mean "English" → one option. (A shared ISO code
  isn't available because `Debunklang` is non-ISO.)
- **Per-article fallback:** an article's effective language = its `Debunklang`
  value if tagged, else its article `language`.
- **Filter match:** selecting a language matches `Debunklang = <lang>` **OR**
  `(no Debunklang AND article language = <lang>)`.
- Debunk-only languages (e.g. Fulani) come solely from `Debunklang`.

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

## Coverage

The country and language fields populate on most content; Claim Topic is applied
to a small fraction, so the Topic dropdown stays short until more content carries
it. Existing articles are tagged going forward rather than backfilled, so option
lists and filter results fill in over time.

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
