import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Inline markup supported in content copy (see `lib/methodology-content.ts`
 * et al): markdown-style links — `[label](href)` — and bold — `**text**`,
 * which may itself contain links. Content stays as plain strings; this is
 * deliberately the only inline markup the content layer supports.
 */
const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;
const BOLD_PATTERN = /\*\*([^*]+(?:\*(?!\*)[^*]*)*)\*\*/g;

/** Renders link tokens within a plain (non-bold) run of text. */
function renderLinks(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let cursor = 0;

  for (const match of text.matchAll(LINK_PATTERN)) {
    const [token, label, href] = match;
    if (match.index > cursor) nodes.push(text.slice(cursor, match.index));

    const newTab = href.startsWith("http");
    nodes.push(
      <Link
        key={`${keyPrefix}-${href}-${match.index}`}
        href={href}
        target={newTab ? "_blank" : undefined}
        rel={newTab ? "noopener noreferrer" : undefined}
        className="text-pesacheck-blue hover:underline"
      >
        {label}
      </Link>,
    );
    cursor = match.index + token.length;
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

/**
 * Renders body copy that may contain `**bold**` spans and `[label](href)`
 * links (links also work inside bold). Internal hrefs (starting with "/")
 * navigate client-side; http(s) links open in a new tab; mailto links open
 * in place.
 */
export function RichText({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  let cursor = 0;

  for (const match of text.matchAll(BOLD_PATTERN)) {
    const [token, inner] = match;
    if (match.index > cursor) {
      nodes.push(...renderLinks(text.slice(cursor, match.index), `t${cursor}`));
    }
    nodes.push(
      <strong key={`b${match.index}`} className="font-bold">
        {renderLinks(inner, `bl${match.index}`)}
      </strong>,
    );
    cursor = match.index + token.length;
  }

  if (cursor < text.length) {
    nodes.push(...renderLinks(text.slice(cursor), `t${cursor}`));
  }
  return <>{nodes}</>;
}
