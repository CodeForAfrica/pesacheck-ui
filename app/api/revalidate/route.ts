import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import {
  type ChangedRow,
  tagsForArticle,
  tagsForTable,
} from "@/lib/data/cache";
import { TENANT_CODE } from "@/lib/data/client";

/**
 * On-demand revalidation endpoint — how a Superdesk edit reaches the site
 * without waiting for a TTL.
 *
 * Pages are prerendered and cached (see `revalidate` in each page and the tags
 * in `lib/data/cache.ts`), so an edit is otherwise invisible for up to five
 * minutes. A Hasura event trigger on the `swp_*` tables POSTs here the moment a
 * row changes; `tagsForTable` maps the changed row to cache tags and this drops
 * exactly the pages built from them. Everything else stays cached.
 *
 * Setup, payload shapes and the Superdesk alternative: `docs/revalidation.md`.
 *
 * Config (see .env.example):
 * - REVALIDATE_SECRET  required — shared secret; without it the route is off
 */

// Reads a shared secret from the request and revalidates a global cache, so
// there is nothing here worth prerendering or caching.
export const dynamic = "force-dynamic";

const SECRET = process.env.REVALIDATE_SECRET;

/** What a Hasura event trigger posts, narrowed to the parts we read. */
type HasuraPayload = {
  table?: { name?: unknown };
  event?: { data?: { new?: ChangedRow | null; old?: ChangedRow | null } };
};

/** Manual/webhook shape: name the tags (or the article) outright. */
type DirectPayload = {
  tags?: unknown;
  slug?: unknown;
};

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Compare against the configured secret without leaking its length or content
 * through timing. Node's `timingSafeEqual` throws on a length mismatch, so
 * that case is answered before it runs.
 */
function authorized(request: Request): boolean {
  if (!SECRET) return false;

  const header = request.headers.get("x-revalidate-secret") ?? "";
  const bearer = request.headers.get("authorization")?.replace(/^Bearer /, "");
  const offered = Buffer.from(header || bearer || "");
  const expected = Buffer.from(SECRET);

  return (
    offered.length === expected.length && timingSafeEqual(offered, expected)
  );
}

/** Tags a caller asked for outright, rather than through a table event. */
function directTags(body: DirectPayload): string[] {
  const named = Array.isArray(body.tags)
    ? body.tags.map(str).filter(Boolean)
    : [];
  const slug = str(body.slug);

  return slug ? [...named, ...tagsForArticle(slug)] : named;
}

export async function POST(request: Request) {
  if (!SECRET) {
    return NextResponse.json(
      { error: "Revalidation is not configured (REVALIDATE_SECRET unset)." },
      { status: 503 },
    );
  }
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: HasuraPayload & DirectPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const table = str(body.table?.name);
  const row = body.event?.data?.new ?? body.event?.data?.old ?? {};

  // Hasura triggers fire for every tenant on the shared Publisher database.
  // Another tenant's article can't change any page of ours, so drop it rather
  // than rebuild the site on someone else's edit.
  const rowTenant = str(row.tenant_code);
  if (rowTenant && TENANT_CODE && rowTenant !== TENANT_CODE) {
    return NextResponse.json({ revalidated: false, reason: "other tenant" });
  }

  const tags = [
    ...new Set([
      ...(table ? tagsForTable(table, row) : []),
      ...directTags(body),
    ]),
  ];

  if (tags.length === 0) {
    // A table nobody reads, or a payload we don't recognise. Not an error —
    // triggers get added faster than this map does — but worth saying plainly
    // so a misconfigured trigger doesn't look like it is working.
    return NextResponse.json({
      revalidated: false,
      reason: table ? `no tags mapped for ${table}` : "no tags in payload",
    });
  }

  // "max": serve the stale page while the fresh one renders, rather than
  // making the reader who arrives first wait for Hasura.
  for (const tag of tags) revalidateTag(tag, "max");

  return NextResponse.json({ revalidated: true, tags, now: Date.now() });
}
