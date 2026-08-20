/**
 * GraphQL client for the Superdesk Publisher schema, exposed by Hasura.
 *
 *
 * Usage (Server Components only — fetching happens during SSR):
 *   const data = await gql<Shape>(SOME_QUERY, { variables });
 */
import { GraphQLClient } from "graphql-request";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL is not set. Copy .env.example to .env.local.",
  );
}

/** Tenant every query must filter by (without it you get other tenants' data). */
export const TENANT_CODE = process.env.NEXT_PUBLIC_TENANT_CODE ?? "";

/**
 * Shared secret sent on every request so Cloudflare lets our server-side calls through.
 * A WAF rule on the GraphQL host skips bot protection when this header matches.
 * Server-only (not NEXT_PUBLIC_): the value must never reach the browser bundle.
 * Absent in local dev, where no challenge applies.
 */
const PRESHARED_AUTH = process.env.EDGE_PRESHARED_AUTH;

const client = new GraphQLClient(API_URL, {
  headers: PRESHARED_AUTH ? { "x-preshared-auth": PRESHARED_AUTH } : {},
});

export function gql<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  return client.request<T>(query, variables);
}
