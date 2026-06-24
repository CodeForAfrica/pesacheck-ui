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

const client = new GraphQLClient(API_URL);

export function gql<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  return client.request<T>(query, variables);
}
