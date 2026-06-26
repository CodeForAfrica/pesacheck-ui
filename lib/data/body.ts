import sanitizeHtml from "sanitize-html";

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL ?? "";

/** Matches `filename.ext` segments; the last one is the asset name. */
const FILENAME = /[^/.]*\.\w{3,4}/g;

/** Rewrite a publisher image src to `${MEDIA_URL}<filename>`. */
function rewriteImageSrc(src: string | undefined): string {
  if (!src) return "";
  const matches = src.match(FILENAME);
  if (!matches?.length) return src;
  return `${MEDIA_URL}${matches[matches.length - 1]}`;
}

const OPTIONS: sanitizeHtml.IOptions = {
  // Defaults + media/embeds. `script` is intentionally excluded.
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "iframe"]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    "*": ["class"],
    iframe: ["src", "allow", "allowfullscreen", "width", "height", "title"],
  },
  // Default schemes (http/https/mailto/tel) — keeps links working against both
  // staging (https) and the local stack (http) media hosts.
  transformTags: {
    img: (tagName, attribs) => ({
      tagName,
      attribs: { ...attribs, src: rewriteImageSrc(attribs.src) },
    }),
  },
};

/** Convert + sanitize an article body. Returns undefined for empty input. */
export function renderBody(
  html: string | null | undefined,
): string | undefined {
  if (!html) return undefined;
  const clean = sanitizeHtml(html, OPTIONS).trim();
  return clean || undefined;
}
