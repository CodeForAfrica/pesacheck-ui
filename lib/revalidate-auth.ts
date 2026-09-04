/**
 * Where `/api/revalidate` looks for its shared secret.
 *
 * Publisher's webhook form has three fields — events, URL, enabled — and no
 * way to add a header, so the secret has to travel in the URL. The header
 * forms exist for callers that can set one: a manual `curl`, a monitor.
 */

/** Header a caller can use instead of the query string. */
const SECRET_HEADER = "x-revalidate-secret";

/**
 * Read the `secret` query parameter **without** form-decoding it.
 *
 * `URLSearchParams` implements `application/x-www-form-urlencoded`, where `+`
 * means a space. A URL is not a form: Publisher sends whatever string an
 * editor typed into the URL field, so a secret containing `+` — anything
 * base64, say — would arrive as a space and never match. That failure is
 * particularly nasty because the header path decodes nothing and still works,
 * so a `curl` test "proves" the secret is right while every webhook 401s.
 *
 * Percent escapes are still decoded, so a secret pasted in either form works.
 * A malformed escape (`%zz`) is treated as literal rather than throwing.
 *
 * One thing this cannot undo: Next re-serializes the query before a route
 * handler sees `request.url`, and that step turns `%20` into `+`. So a secret
 * containing a literal space can only ever arrive by header — which is no
 * loss, since a space cannot be typed into Publisher's URL field either. Hex
 * avoids the whole question; see `docs/revalidation.md`.
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
 * Returns `""` when it offers none — which never matches a configured secret,
 * since an unset secret disables the endpoint outright.
 */
export function offeredSecret(url: string, headers: Headers): string {
  return (
    secretFromQuery(url) ||
    headers.get(SECRET_HEADER) ||
    headers.get("authorization")?.replace(/^Bearer /, "") ||
    ""
  );
}
