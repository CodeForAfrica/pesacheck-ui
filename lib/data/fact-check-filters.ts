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
  region: "countries",
  topic: "01harm",
};

type SubjectClause = {
  swp_article_metadata: {
    swp_article_metadata_subjects: {
      scheme: { _eq: string };
      code?: { _in: string[] };
    };
  };
};
type LanguageClause = {
  swp_article_metadata: { language: { _in: string[] } };
};
type RouteClause = {
  swp_route: { slug: { _eq: string } };
};
type SearchClause = {
  _or: { [column in "title" | "lead" | "body"]?: { _ilike: string } }[];
};
type WhereClause = SubjectClause | LanguageClause | RouteClause | SearchClause;
type SearchParams = Record<string, string | string[] | undefined>;

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

export type FactCheckWhereOptions = {
  /** Scope to one content-desk route (`swp_route.slug`) — powers desk pages. */
  routeSlug?: string;
  /** Free-text query matched against title/lead/body — powers `/search`. */
  search?: string;
};

/**
 * Build the `swp_article_bool_exp` for a page of fact-checks under `tenantCode`,
 * narrowed by `filters`. The `Debunk` clause is always present (it's what makes
 * an article a fact-check); each active dimension adds one more `_and` clause.
 * Inactive dimensions are omitted entirely — an empty `_in: []` would match
 * nothing in Hasura, so we never emit one.
 *
 * `options.routeSlug` scopes the listing to a single content-desk route
 * (`swp_route.slug`) — this is what powers the desk pages (`getByDesk`). Desks
 * are still fact-check listings, so the `Debunk` clause stays; the route is just
 * one more `_and` clause on top.
 *
 * `options.search` adds a free-text clause (`title`/`lead`/`body` `_ilike`),
 * which is what powers `/search`. It's OR-ed across those columns and AND-ed
 * with everything else, so a query and filters compose.
 */
export function buildFactCheckWhere(
  filters: FilterSelection,
  tenantCode: string,
  options: FactCheckWhereOptions = {},
): FactCheckWhere {
  const and: WhereClause[] = [
    {
      swp_article_metadata: {
        swp_article_metadata_subjects: { scheme: { _eq: "Debunk" } },
      },
    },
  ];

  if (options.routeSlug) {
    and.push({ swp_route: { slug: { _eq: options.routeSlug } } });
  }

  const search = options.search?.trim();
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
    and.push({
      swp_article_metadata: { language: { _in: filters.language } },
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
