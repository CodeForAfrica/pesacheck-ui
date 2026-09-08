import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { type RevalidateRequest, tagsForDelivery } from "@/lib/data/cache";
import { TENANT_CODE } from "@/lib/data/client";
import { offeredSecret } from "@/lib/revalidate-auth";

/**
 * On-demand cache revalidation. A Publisher webhook POSTs here when an
 * article, route or menu changes; the event maps to cache tags
 * (`lib/data/cache.ts`) and those pages are dropped. Without it, prerendered
 * pages wait out their 5-minute TTL.
 *
 * Setup and payload shapes: `docs/revalidation.md`.
 *
 * Config (see .env.example):
 * - REVALIDATE_SECRET  required — shared secret; without it the route is off
 */

export const dynamic = "force-dynamic";

const SECRET = process.env.REVALIDATE_SECRET;

/** Publisher's own headers on every webhook delivery. */
const EVENT_HEADER = "x-webhook-event";
const TENANT_HEADER = "x-webhook-tenant";

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Compare the offered secret in constant time. `timingSafeEqual` throws on a
 * length mismatch, so that case is answered first.
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

  // Webhooks are configured per tenant, so this should never differ. Checked
  // because a webhook pointed at the wrong site is otherwise silent.
  const tenant = str(request.headers.get(TENANT_HEADER));
  if (tenant && TENANT_CODE && tenant !== TENANT_CODE) {
    return NextResponse.json({ revalidated: false, reason: "other tenant" });
  }

  const event = str(request.headers.get(EVENT_HEADER));
  const tags = tagsForDelivery({ event, body });

  if (tags.length === 0) {
    // An unmapped event, a preview, or an unrecognised payload. Said plainly
    // so a webhook on the wrong event doesn't look like it is working.
    return NextResponse.json({
      revalidated: false,
      reason: event ? `no tags mapped for ${event}` : "no tags in payload",
    });
  }

  // "max" serves the stale page while the fresh one renders, so the first
  // reader after an edit doesn't wait on Hasura.
  for (const tag of tags) revalidateTag(tag, "max");

  return NextResponse.json({ revalidated: true, tags, now: Date.now() });
}
