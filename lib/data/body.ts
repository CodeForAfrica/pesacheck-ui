import sanitizeHtml from "sanitize-html";

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL ?? "";

const UPLOAD_MARKER = "/upload-raw/";

/**
 * Rewrite a Superdesk `upload-raw` image src to the public media host.
 *
 * Publisher bodies embed superdesk-internal URLs that vary by environment:
 *   staging:  …/api/upload-raw/2026081813/6a8442c47f5b7187fc090a55   (date dir, no ext)
 *   local:    …/api/upload-raw/6a84522d02f9c19201447b02.png          (ext, no date dir)
 *
 * Non-`upload-raw` srcs (external evidence images, embeds) are left untouched.
 */
function rewriteImageSrc(src: string | undefined): string {
  if (!src) return "";
  const at = src.indexOf(UPLOAD_MARKER);
  if (at === -1) return src;

  // Everything after `/upload-raw/`, minus any query/hash.
  let assetPath = src.slice(at + UPLOAD_MARKER.length).split(/[?#]/)[0];
  if (!assetPath) return src;

  // Split off a trailing file extension if the last segment has one.
  let ext = "webp";
  const dot = assetPath.lastIndexOf(".");
  if (dot > assetPath.lastIndexOf("/")) {
    ext = assetPath.slice(dot + 1);
    assetPath = assetPath.slice(0, dot);
  }

  const assetId = assetPath.replace(/\//g, "_");
  return `${MEDIA_URL}${assetId}.${ext}`;
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

/** Opener of PesaCheck's standard footer boilerplate. */
const FOOTER_MARKER = "This post is part of an ongoing series of PesaCheck";

/**
 * Inner HTML of each `<p>` in an (already-sanitized) fragment, whitespace
 * collapsed. Tags are kept so footnote links (`<a href>`, `<br>`, `<b>`) survive
 * — footers often hyperlink "report" / "methodology".
 */
function paragraphHtml(html: string): string[] {
  const out: string[] = [];
  for (const match of html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)) {
    const inner = match[1].replace(/\s+/g, " ").trim();
    if (inner) out.push(inner);
  }
  return out;
}

export type RenderedBody = { bodyHtml?: string; footnotes: string[] };

/**
 * Render a body and split the trailing PesaCheck boilerplate into footnotes.
 * `bodyHtml` is the main article (footer removed); `footnotes` are the boilerplate
 * paragraphs as **sanitized HTML** (links preserved — rendered via
 * `dangerouslySetInnerHTML` in `ArticleFootnotes`). When the marker is absent, the
 * whole body stays in `bodyHtml`.
 */
export function renderArticleBody(
  html: string | null | undefined,
): RenderedBody {
  const clean = renderBody(html);
  if (!clean) return { footnotes: [] };

  const markerAt = clean.indexOf(FOOTER_MARKER);
  if (markerAt === -1) return { bodyHtml: clean, footnotes: [] };

  // Cut at the <p> that opens the boilerplate so the band gets whole paragraphs.
  const footerStart = clean.lastIndexOf("<p", markerAt);
  if (footerStart === -1) return { bodyHtml: clean, footnotes: [] };

  const bodyHtml = clean.slice(0, footerStart).trim() || undefined;
  return { bodyHtml, footnotes: paragraphHtml(clean.slice(footerStart)) };
}
