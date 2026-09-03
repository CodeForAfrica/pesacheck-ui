import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { type RevalidateRequest, tagsForDelivery } from "@/lib/data/cache";
import { TENANT_CODE } from "@/lib/data/client";
import { offeredSecret } from "@/lib/revalidate-auth";

/**
 * On-demand revalidation endpoint — how a Superdesk edit reaches the site
 * without waiting for a TTL.
 *
 * Pages are prerendered and cached (see `revalidate` in each page and the tags
 * in `lib/data/cache.ts`), so an edit is otherwise invisible for up to five
 * minutes. A Publisher webhook POSTs here when an article, route or menu
 * changes; `tagsForEvent` maps the event to cache tags and this drops exactly
 * the pages built from them. Everything else stays cached.
 *
 * Setup and payload shapes: `docs/revalidation.md`.
 *
 * Config (see .env.example):
 * - REVALIDATE_SECRET  required — shared secret; without it the route is off
 */

// Reads a shared secret from the request and revalidates a global cache, so
// there is nothing here worth prerendering or caching.
export const dynamic = "force-dynamic";

const SECRET = process.env.REVALIDATE_SECRET;

/** Publisher's own headers on every webhook delivery. */
const EVENT_HEADER = "x-webhook-event";
const TENANT_HEADER = "x-webhook-tenant";

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Compare the offered secret (see `lib/revalidate-auth.ts` for where it comes
 * from) without leaking its length or content through timing. Node's
 * `timingSafeEqual` throws on a length mismatch, so that case is answered
 * before it runs.
 */
function authorized(request: Request): boolean {
  if (!SECRET) return false;

  const offered = Buffer.from(offeredSecret(request.url, request.headers));
  const expected = Buffer.from(SECRET);

  return (
    offered.length === expected.length && timingSafeEqual(offered, expected)
  );
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

  let body: RevalidateRequest["body"];
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Publisher webhooks are configured per tenant, so this should never differ.
  // Checked anyway: a webhook pointed at the wrong site is otherwise silent,
  // and rebuilding our pages on another tenant's edit would be invisible too.
  const tenant = str(request.headers.get(TENANT_HEADER));
  if (tenant && TENANT_CODE && tenant !== TENANT_CODE) {
    return NextResponse.json({ revalidated: false, reason: "other tenant" });
  }

  const event = str(request.headers.get(EVENT_HEADER));
  const tags = tagsForDelivery({ event, body });

  if (tags.length === 0) {
    // An event nobody maps, a preview, or a payload we don't recognise. Not an
    // error — but worth saying plainly, so a webhook subscribed to the wrong
    // event doesn't look like it is working.
    return NextResponse.json({
      revalidated: false,
      reason: event ? `no tags mapped for ${event}` : "no tags in payload",
    });
  }

  // "max": serve the stale page while the fresh one renders, rather than
  // making the reader who arrives first wait for Hasura.
  for (const tag of tags) revalidateTag(tag, "max");

  return NextResponse.json({ revalidated: true, tags, now: Date.now() });
}
