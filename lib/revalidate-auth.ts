/**
 * Where `/api/revalidate` looks for its shared secret.
 *
 * Publisher's webhook form takes only events, URL and enabled — no headers —
 * so the secret travels in the URL. The header forms are for callers that can
 * set one, such as a manual `curl`.
 */

/** Header a caller can use instead of the query string. */
const SECRET_HEADER = "x-revalidate-secret";

/**
 * Read the `secret` query parameter without form-decoding it.
 *
 * `URLSearchParams` follows `application/x-www-form-urlencoded`, where `+`
 * means a space — so a base64 secret would arrive with its `+` turned into a
 * space and never match. Percent escapes are still decoded; a malformed one
 * (`%zz`) is treated as literal rather than throwing.
 *
 * Next re-serializes the query before a route handler sees `request.url`,
 * turning `%20` into `+`, so a secret containing a literal space can only
 * arrive by header. Hex avoids the question — see `docs/revalidation.md`.
 */
function secretFromQuery(url: string): string {
  const query = url.split("?", 2)[1];
  if (!query) return "";

  for (const pair of query.split("&")) {
    const eq = pair.indexOf("=");
    if (eq === -1) continue;
    if (pair.slice(0, eq) !== "secret") continue;

    const raw = pair.slice(eq + 1);
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }
  return "";
}

/**
 * The secret a request offers, from the query string or either header form.
 * `""` when it offers none, which never matches a configured secret.
 */
export function offeredSecret(url: string, headers: Headers): string {
  return (
    secretFromQuery(url) ||
    headers.get(SECRET_HEADER) ||
    headers.get("authorization")?.replace(/^Bearer /, "") ||
    ""
  );
}
