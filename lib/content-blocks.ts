/**
 * Shared body-copy block model for the long-form About pages (Methodology,
 * Principles, Funding). A section's body is an ordered list of blocks so
 * paragraphs, bullet lists and inline images keep their source order.
 * Paragraph/list text may embed markdown-style links — `[label](href)` — and
 * `**bold**`, rendered by `components/ui/RichText`. Rendered by
 * `components/ui/ContentBlocks`.
 */
export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | {
      type: "img";
      src: string;
      alt: string;
      width: number;
      height: number;
      caption?: string;
    };
