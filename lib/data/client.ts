/**
 * GraphQL client for the Superdesk Publisher schema, exposed by Hasura.
 *
 *
 * Usage (Server Components only — fetching happens during SSR):
 *   const data = await gql<Shape>(SOME_QUERY, { variables }, { tags: [...] });
 */
import { GraphQLClient } from "graphql-request";
import { DEFAULT_REVALIDATE } from "@/lib/data/cache";

const CONFIGURED_API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!CONFIGURED_API_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL is not set. Copy .env.example to .env.local.",
  );
}

const API_URL: string = CONFIGURED_API_URL;

/** Tenant every query must filter by (without it you get other tenants' data). */
export const TENANT_CODE = process.env.NEXT_PUBLIC_TENANT_CODE ?? "";

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
  /**
   * Cache tags for this read — see `lib/data/cache.ts`. Next records them on
   * the cached response and on any page prerendered from it, which is what
   * lets `/api/revalidate` refresh exactly the affected pages.
   */
  tags?: string[];
  /**
   * Seconds before the cached response is refetched anyway. The backstop for a
   * webhook that never arrived; pass `0` to opt a read out of caching.
   */
  revalidate?: number;
};

/**
 * Run a query against Hasura, caching the response under `tags`.
 *
 * Caching is explicit rather than inherited: since Next 15 an un-configured
 * `fetch` is not cached at all, and Next only auto-caches GET — GraphQL is
 * POST, so `next.revalidate` has to be set for the response to be stored (and
 * therefore for its tags to mean anything).
 *
 * The `next` options can only be attached through the client's own `fetch`, so
 * a client is built per call. It holds no connection or state, so this costs an
 * object, not a round trip.
 */
export function gql<T>(
  query: string,
  variables?: Record<string, unknown>,
  options: GqlCacheOptions = {},
): Promise<T> {
  const { tags = [], revalidate = DEFAULT_REVALIDATE } = options;

  const client = new GraphQLClient(API_URL, {
    headers: HEADERS,
    fetch: (input: string | URL | Request, init?: RequestInit) =>
      fetch(input, { ...init, next: { tags, revalidate } }),
  });

  return client.request<T>(query, variables);
}
