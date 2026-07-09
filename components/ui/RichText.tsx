import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Matches markdown-style links — `[label](href)` — embedded in content copy
 * (see `lib/methodology-content.ts` et al). Content stays as plain strings;
 * this is deliberately the only inline markup the content layer supports.
 */
const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;

/**
 * Renders body copy that may contain `[label](href)` links. Internal hrefs
 * (starting with "/") navigate client-side; http(s) links open in a new tab;
 * mailto links open in place.
 */
export function RichText({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  let cursor = 0;

  for (const match of text.matchAll(LINK_PATTERN)) {
    const [token, label, href] = match;
    if (match.index > cursor) nodes.push(text.slice(cursor, match.index));

    const newTab = href.startsWith("http");
    nodes.push(
      <Link
        key={`${href}-${match.index}`}
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
  return <>{nodes}</>;
}
