export type FilterDimension = "region" | "language" | "topic";

/** Selected option codes per dimension (e.g. `{ region: ["UGA"], … }`). */
export type FilterSelection = Record<FilterDimension, string[]>;

/**
 * One dropdown entry: the `code` is the real Superdesk taxonomy key sent to the
 * server (region → `countries` ISO3, topic → `01harm`, language → ISO code); the
 * `label` is what the reader sees. Both are derived from live Superdesk data —
 * see `lib/data/filter-options.ts`.
 */
export type FilterOption = { code: string; label: string };

/** The dropdown contents for every dimension. */
export type FilterOptions = Record<FilterDimension, FilterOption[]>;

export const FILTER_DIMENSIONS: FilterDimension[] = [
  "region",
  "language",
  "topic",
];

/**
 * The "no filters" selection. Deep-frozen because it's shared as the default
 * argument / fallback prop across call sites — freezing turns an accidental
 * in-place mutation (e.g. `filters.region.push(…)`) into a throw rather than
 * silent corruption of the singleton. Callers that need to mutate clone first.
 */
export const EMPTY_FILTERS: FilterSelection = freezeFilters({
  region: [],
  language: [],
  topic: [],
});

function freezeFilters(filters: FilterSelection): FilterSelection {
  for (const dim of FILTER_DIMENSIONS) Object.freeze(filters[dim]);
  return Object.freeze(filters);
}

/** True when no dimension has a selection. */
export function hasActiveFilters(filters: FilterSelection): boolean {
  return FILTER_DIMENSIONS.some((dim) => filters[dim].length > 0);
}

/** Total number of selected options across all dimensions. */
export function countActiveFilters(filters: FilterSelection): number {
  return FILTER_DIMENSIONS.reduce((n, dim) => n + filters[dim].length, 0);
}

/**
 * Resolve an option code to its display label using the live option lists.
 * Falls back to the raw code when the code isn't in the (sampled) options —
 * e.g. a hand-typed URL, or a taxonomy value older than the sample window.
 */
export function filterLabel(
  options: FilterOptions,
  dimension: FilterDimension,
  code: string,
): string {
  return options[dimension].find((o) => o.code === code)?.label ?? code;
}

/** Every selected option as `{ dimension, code, label }`, in dimension order. */
export function selectedFilterLabels(
  options: FilterOptions,
  filters: FilterSelection,
): { dimension: FilterDimension; code: string; label: string }[] {
  return FILTER_DIMENSIONS.flatMap((dimension) =>
    filters[dimension].map((code) => ({
      dimension,
      code,
      label: filterLabel(options, dimension, code),
    })),
  );
}

/** Subject schemes backing the relation-based dimensions. */
export const SUBJECT_SCHEME: Record<"region" | "topic", string> = {
  region: "countrymention1",
  topic: "Harm_type",
};

/**
 * Scheme carrying the debunk language, the primary source for the language
 * filter (`swp_article_metadata.language` is the fallback). Its codes are the
 * vocabulary's own (`debunkeng`, …), not ISO.
 */
export const DEBUNK_LANG_SCHEME = "Debunklang";

type SubjectClause = {
  swp_article_metadata: {
    swp_article_metadata_subjects: {
      scheme: { _eq: string };
      code?: { _in: string[] };
    };
  };
};
type LanguageColumnClause = {
  swp_article_metadata: { language: { _in: string[] } };
};
type LanguageClause = { _or: (LanguageColumnClause | SubjectClause)[] };
type RouteClause = {
  swp_route: { slug: { _eq: string } };
};
type SearchClause = {
  _or: { [column in "title" | "lead" | "body"]?: { _ilike: string } }[];
};
type WhereClause = SubjectClause | LanguageClause | RouteClause | SearchClause;
type SearchParams = Record<string, string | string[] | undefined>;

/**
 * Scheme carrying the editorial article type (Quick Read / Explainer /
 * Longform). Superdesk publishes it as a metadata subject like any other
 * taxonomy, so it filters the same way the region and topic dimensions do.
 */
export const CONTENT_TYPE_SCHEME = "content_type";

/** Narrows a listing beyond the filter dimensions the reader controls. */
export type FactCheckScope = {
  /** A content-desk route (`swp_route.slug`) — backs the desk pages. */
  routeSlug?: string;
  /**
   * Accepted `content_type` codes — backs the article-type pages. Several
   * codes per type because Superdesk's vocabulary and the site's page names
   * have drifted apart (a Quick Read is filed as `quickread` or `shortform`).
   */
  contentTypes?: string[];
  /**
   * Free-text query matched against title/lead/body — backs `/search`. This is
   * the one scope the reader types rather than the page choosing it.
   */
  search?: string;
};

export type FactCheckWhere = {
  tenant_code: { _eq: string };
  published_at: { _is_null: false };
  _and: WhereClause[];
};

/** Columns a free-text query is matched against (case-insensitively). */
const SEARCH_COLUMNS = ["title", "lead", "body"] as const;

/**
 * Escape a user-supplied term for a SQL `LIKE` pattern: `%` and `_` are
 * wildcards and `\` is the escape character, so all three must be escaped
 * before the term is wrapped in `%…%`.
 */
function likePattern(term: string): string {
  const escaped = term.replace(/[\\%_]/g, (ch) => `\\${ch}`);
  return `%${escaped}%`;
}

/**
 * Build the `swp_article_bool_exp` for a page of fact-checks under `tenantCode`,
 * narrowed by `filters`. The `Debunk` clause is always present (it's what makes
 * an article a fact-check); each active dimension adds one more `_and` clause.
 * Inactive dimensions are omitted entirely — an empty `_in: []` would match
 * nothing in Hasura, so we never emit one.
 *
 * `scope` narrows the listing further: `routeSlug` to one content desk
 * (`getByDesk`), `contentTypes` to one article type (`getByContentType`), and
 * `search` to a free-text query (`searchFactChecks`). All are still fact-check
 * listings, so the `Debunk` clause stays and each is one more `_and` clause on
 * top — the search clause being an `_or` across `title`/`lead`/`body`, so a
 * query and the reader's filters compose.
 */
export function buildFactCheckWhere(
  filters: FilterSelection,
  tenantCode: string,
  scope: FactCheckScope = {},
): FactCheckWhere {
  const and: WhereClause[] = [
    {
      swp_article_metadata: {
        swp_article_metadata_subjects: { scheme: { _eq: "Debunk" } },
      },
    },
  ];

  if (scope.routeSlug) {
    and.push({ swp_route: { slug: { _eq: scope.routeSlug } } });
  }

  if (scope.contentTypes && scope.contentTypes.length > 0) {
    and.push({
      swp_article_metadata: {
        swp_article_metadata_subjects: {
          scheme: { _eq: CONTENT_TYPE_SCHEME },
          code: { _in: scope.contentTypes },
        },
      },
    });
  }

  const search = scope.search?.trim();
  if (search) {
    const pattern = likePattern(search);
    and.push({
      _or: SEARCH_COLUMNS.map((column) => ({ [column]: { _ilike: pattern } })),
    });
  }

  for (const dim of ["region", "topic"] as const) {
    const codes = filters[dim];
    if (codes.length > 0) {
      and.push({
        swp_article_metadata: {
          swp_article_metadata_subjects: {
            scheme: { _eq: SUBJECT_SCHEME[dim] },
            code: { _in: codes },
          },
        },
      });
    }
  }

  if (filters.language.length > 0) {
    // Language matches the debunk language or the article language: desk-language
    // codes (`en`) resolve on the column, debunk-only codes (`debunkful`) on the
    // `Debunklang` subject. The two code systems don't overlap, so each selected
    // code only ever hits the side it belongs to.
    and.push({
      _or: [
        { swp_article_metadata: { language: { _in: filters.language } } },
        {
          swp_article_metadata: {
            swp_article_metadata_subjects: {
              scheme: { _eq: DEBUNK_LANG_SCHEME },
              code: { _in: filters.language },
            },
          },
        },
      ],
    });
  }

  return {
    tenant_code: { _eq: tenantCode },
    published_at: { _is_null: false },
    _and: and,
  };
}

function parseCsv(value: string | string[] | undefined): string[] {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parseFilterParams(params: SearchParams): FilterSelection {
  return {
    region: parseCsv(params.region),
    language: parseCsv(params.language),
    topic: parseCsv(params.topic),
  };
}

/** Serialize active dimensions to query params (omits empty dimensions). */
export function filtersToQuery(
  filters: FilterSelection,
): Record<string, string> {
  const query: Record<string, string> = {};
  for (const dim of FILTER_DIMENSIONS) {
    if (filters[dim].length > 0) query[dim] = filters[dim].join(",");
  }
  return query;
}
