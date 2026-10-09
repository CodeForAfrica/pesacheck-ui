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

/**
 * Openers of PesaCheck's standard footer boilerplate, one per publishing
 * language. Each article carries the footer in its own language, so matching
 * only the English one left every other language's footer in the body, where
 * its logos render at full article width.
 *
 * Kept to the opening words of the first text run: the rest of the sentence is
 * split across `<i>`/`<b>` tags and its apostrophes vary.
 */
const FOOTER_MARKERS = [
  "This post is part of an ongoing series of PesaCheck",
  "Cette publication fait partie d",
  "Chapisho hili ni miongoni mwa muendelezo",
  "Maxxansi kun qaama hojii dhugaa baasuu PesaCheck",
  "Qoraalkan ayaa qeyb ka ah taxane",
  "ይህ ልጥፍ በፌስቡክ",
];

/** Position of the earliest footer marker in `html`, or -1. */
function footerMarkerAt(html: string): number {
  const found = FOOTER_MARKERS.map((m) => html.indexOf(m)).filter(
    (i) => i >= 0,
  );
  return found.length > 0 ? Math.min(...found) : -1;
}

/**
 * Each top-level block of an (already-sanitized) footer: paragraphs, and the
 * `embed-block` divs and `figure`s that hold its images. Blocks are kept whole
 * — the social icons are an `<img>` with its caption ("Follow Us") as a nested
 * `<p>`, so taking paragraphs alone drops the icon and keeps a bare caption.
 *
 * A `div` match stops at the first `</div>`, which is safe because embed
 * blocks do not nest.
 */
function footerBlocks(html: string): string[] {
  const out: string[] = [];
  for (const match of html.matchAll(/<(p|div|figure)\b[^>]*>[\s\S]*?<\/\1>/g)) {
    const block = match[0].replace(/\s+/g, " ").trim();
    // Skip blocks with neither text nor an image, e.g. `<p> </p>` spacers.
    if (/<img\b/.test(block) || block.replace(/<[^>]+>/g, "").trim()) {
      out.push(block);
    }
  }
  return out;
}

export type RenderedBody = { bodyHtml?: string; footnotes: string[] };

/**
 * Render a body and split the trailing PesaCheck boilerplate into footnotes.
 * `bodyHtml` is the main article (footer removed); `footnotes` are the
 * boilerplate's blocks as **sanitized HTML** (links and images preserved —
 * rendered via `dangerouslySetInnerHTML` in `ArticleFootnotes`). When no
 * marker is found, the whole body stays in `bodyHtml`.
 */
export function renderArticleBody(
  html: string | null | undefined,
): RenderedBody {
  const clean = renderBody(html);
  if (!clean) return { footnotes: [] };

  const markerAt = footerMarkerAt(clean);
  if (markerAt === -1) return { bodyHtml: clean, footnotes: [] };

  // Cut at the <p> that opens the boilerplate so the band gets whole blocks.
  const footerStart = clean.lastIndexOf("<p", markerAt);
  if (footerStart === -1) return { bodyHtml: clean, footnotes: [] };

  // Non-English footers are preceded by an `<hr>`; the band replaces it.
  const bodyHtml =
    clean
      .slice(0, footerStart)
      .replace(/(\s*<hr\s*\/?>)+\s*$/, "")
      .trim() || undefined;
  return { bodyHtml, footnotes: footerBlocks(clean.slice(footerStart)) };
}
