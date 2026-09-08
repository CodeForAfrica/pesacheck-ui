/**
 * GraphQL client for the Superdesk Publisher schema, exposed by Hasura.
 *
 *
 * Usage (Server Components only — fetching happens during SSR):
 *   const data = await gql<Shape>(SOME_QUERY, { variables }, { tags: [...] });
 */
import { GraphQLClient } from "graphql-request";
import { DEFAULT_REVALIDATE } from "@/lib/data/cache";

/**
 * Throw at module load rather than degrade quietly: a missing value means
 * every page silently serves its static fallback.
 *
 * Callers pass the value, not the name — Next inlines
 * `process.env.NEXT_PUBLIC_X` by textual substitution, and a dynamic
 * `process.env[name]` lookup is not inlined.
 */
function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`${name} is not set. Copy .env.example to .env.local.`);
  }
  return value;
}

const API_URL = required(
  "NEXT_PUBLIC_API_URL",
  process.env.NEXT_PUBLIC_API_URL,
);

/**
 * Tenant every query must filter by (without it you get other tenants' data).
 *
 * Required rather than defaulted to `""`: an empty tenant is not an error to
 * Hasura, it just matches no rows, so the site would fall back everywhere
 * with nothing thrown and nothing logged.
 */
export const TENANT_CODE = required(
  "NEXT_PUBLIC_TENANT_CODE",
  process.env.NEXT_PUBLIC_TENANT_CODE,
);

/**
 * Shared secret sent on every request so Cloudflare lets our server-side calls through.
 * A WAF rule on the GraphQL host skips bot protection when this header matches.
 * Server-only (not NEXT_PUBLIC_): the value must never reach the browser bundle.
 * Absent in local dev, where no challenge applies.
 */
const PRESHARED_AUTH = process.env.EDGE_PRESHARED_AUTH;

const HEADERS: Record<string, string> = PRESHARED_AUTH
  ? { "x-preshared-auth": PRESHARED_AUTH }
  : {};

export type GqlCacheOptions = {
  /** Cache tags for this read — see `lib/data/cache.ts`. */
  tags?: string[];
  /** Seconds before the response is refetched anyway; `0` disables caching. */
  revalidate?: number;
};

/**
 * Run a query against Hasura, caching the response under `tags`.
 *
 * Caching has to be explicit: since Next 15 an unconfigured `fetch` is not
 * cached, and Next only auto-caches GET. GraphQL is POST, so `next.revalidate`
 * must be set for the response to be stored and its tags to mean anything.
 *
 * A client is built per call because `next` options can only be attached
 * through the client's own `fetch`. It holds no connection, so this costs an
 * object rather than a round trip.
 */
export function gql<T>(
  query: string,
  variables?: Record<string, unknown>,
  options: GqlCacheOptions = {},
): Promise<T> {
  const { tags = [], revalidate = DEFAULT_REVALIDATE } = options;

  // The data cache is live in development, so `next dev` would re-render
  // every request from cached data — an edit taking minutes to appear
  // locally. `next start` runs as production and caches normally.
  const ttl = process.env.NODE_ENV === "development" ? 0 : revalidate;

  const client = new GraphQLClient(API_URL, {
    headers: HEADERS,
    fetch: (input: string | URL | Request, init?: RequestInit) =>
      fetch(input, { ...init, next: { tags, revalidate: ttl } }),
  });

  return client.request<T>(query, variables);
}
