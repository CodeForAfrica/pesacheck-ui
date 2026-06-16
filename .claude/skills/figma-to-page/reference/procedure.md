# Detailed procedure notes

## Asset extraction subagent (for large pages)
The per-section `get_design_context` dumps are large. To keep the main context
clean, delegate extraction to a `general-purpose` subagent. Give it the list of
section node ids + slugs and instruct it to, for each node:
1. Call `get_design_context(nodeId)` (clientFrameworks="react",
   clientLanguages="typescript,css").
2. Save the full reference code to `/tmp/figma-ref/<slug>.txt`.
3. Run `extract-assets.mjs --section <slug> --input /tmp/figma-ref/<slug>.txt`.
4. Return ONLY the merged manifest (paths + bytes + any failures) — not the code.

Tell it NOT to write components and NOT to call `get_screenshot` (saves tokens).
Shared asset hashes appear across sections; the extractor downloads each URL
once per run, so dedup happens automatically within a section. Across sections,
identical assets land under each section folder — acceptable, or post-process.

## Identifying sections in an absolutely-positioned frame
Most Figma frames are NOT auto-layout: the root frame has dozens of absolutely
positioned children. Use `parse-metadata.mjs` to list direct children sorted by
`y`. Group them into visual sections by y-position bands and by group names
(e.g. "Group 34738390", "Spotlight1 1"). Section headings are separate text
nodes ("Spotlight", "Trending Stories") that mark band boundaries.

Designs often contain **stacked duplicate variant layers** (e.g. two
"long-format6" at the same x/y representing different states). Do not reproduce
every overlapping layer — interpret the intended single layout and build it as a
clean responsive grid. The screenshot is the source of truth for what's visible.

## Translating layout
- Map the 1440px frame to `Container` (1240px content, 100px gutters).
- Convert `left/top` absolute coords into flex/grid order; convert fixed widths
  (e.g. `w-[295px]`) into responsive grid tracks.
- Preserve exact radii, gaps, font sizes/weights, and the verdict-badge /
  arrow-button overlays.
- Reproduce the design's text verbatim (including placeholder lorem) unless real
  copy is supplied; centralize it in `lib/<page>-content.ts`.

## Gotchas observed
- `get_metadata` frequently exceeds the token limit and is written to a file —
  parse the file, don't try to read it all into context.
- The Figma asset host is `http://localhost:3845`; it only works while the Figma
  desktop app + Dev Mode MCP are running.
- Node ids in URLs use `-` (`2866-1070`); MCP calls use `:` (`2866:1070`).
- `preview_screenshot` resets scroll to the top; to inspect lower sections set a
  tall viewport (`preview_resize` height) and screenshot once, or drive scroll
  via `preview_eval` transforms.
