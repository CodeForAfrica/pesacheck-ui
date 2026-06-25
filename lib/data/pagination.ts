/**
 * Parse a 1-based `?page=` query value defensively. Anything that isn't a
 * positive integer — missing, `NaN`, `0`, negative, an array of values — falls
 * back to page 1.
 */
export function parsePageParam(raw: string | string[] | undefined): number {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const n = Number.parseInt(value ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

/** Total pages needed for `count` items at `pageSize`. Always ≥ 1. */
export function totalPages(count: number, pageSize: number): number {
  if (pageSize <= 0) return 1;
  return Math.max(1, Math.ceil(Math.max(0, count) / pageSize));
}

/** 0-based DB offset for a 1-based page. Sub-1 pages clamp to the first page. */
export function pageOffset(page: number, pageSize: number): number {
  return (Math.max(1, Math.floor(page)) - 1) * pageSize;
}

/** Clamp a requested page into the valid `[1, total]` range. */
export function clampPage(page: number, total: number): number {
  return Math.min(Math.max(1, Math.floor(page)), Math.max(1, total));
}
