import { CONTENT_DESKS, type ContentDesk } from "@/lib/content-desks";
import { gql, TENANT_CODE } from "@/lib/data/client";
import { GET_COLLECTION_ROUTES } from "@/lib/data/queries/routes";

type RoutesResponse = {
  swp_route: { id: number; name: string; slug: string; type: string }[];
};

/**
 * Fetch content desks from Hasura, in the curated order, with curated images and
 * live names. Throws on network/GraphQL error — callers use `?? CONTENT_DESKS`.
 *
 * Content desks ARE routes (`swp_route` where type="collection"). But routes
 * carry no image, so we keep the curated images/order/labels from
 * `lib/content-desks` as the catalog; the backend drives which desks appear (a
 * desk shows only if a matching collection route exists). Display names stay
 * curated — staging route names have inconsistent casing ("health" vs "Gender").
 *
 * Known gap: the Figma "migration" desk has no route on staging, so it drops out
 */
export async function getContentDesks(): Promise<ContentDesk[]> {
  const { swp_route } = await gql<RoutesResponse>(GET_COLLECTION_ROUTES, {
    tenant: TENANT_CODE,
  });

  const liveSlugs = new Set(swp_route.map((r) => r.slug));

  return CONTENT_DESKS.filter((desk) => liveSlugs.has(desk.slug));
}
