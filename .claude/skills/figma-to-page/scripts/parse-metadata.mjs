#!/usr/bin/env node
/**
 * parse-metadata.mjs — list the direct children (sections) of a Figma node from
 * the XML returned by the Figma MCP `get_metadata` tool.
 *
 * get_metadata output begins with a line like "- 2866:1070: Home" then the XML.
 * When the result is too large it is saved to a file; pass that file here.
 *
 * Usage:
 *   node parse-metadata.mjs --input /path/to/get_metadata-result.txt
 *   node parse-metadata.mjs --input meta.txt --json
 *
 * Output: each direct child sorted by y-position with id, type, name, size.
 */

import { readFile } from "node:fs/promises";

function parseArgs(argv) {
  const a = {};
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--input") a.input = argv[++i];
    else if (argv[i] === "--json") a.json = true;
  }
  return a;
}

// The saved file may be a JSON array [{type,text}] or raw XML; handle both.
async function loadXml(file) {
  const raw = await readFile(file, "utf8");
  const trimmed = raw.trimStart();
  if (trimmed.startsWith("[")) {
    try {
      const arr = JSON.parse(raw);
      return arr.map((d) => d.text || "").join("");
    } catch {
      /* fall through */
    }
  }
  return raw;
}

// Walk to the end of the first top-level <frame ...> ... </frame> and return
// its direct children. Tolerant hand-parser (avoids an XML dep).
function directChildren(xml) {
  const start = xml.indexOf("<frame");
  if (start === -1) return [];
  // Find the matching close by depth-counting <frame ...> / </frame>.
  const tagRe = /<(\/?)frame\b[^>]*?(\/?)>/g;
  tagRe.lastIndex = start;
  let depth = 0;
  let rootEnd = -1;
  let m;
  while ((m = tagRe.exec(xml))) {
    if (m[1] === "/") depth--;
    else if (m[2] !== "/") depth++;
    if (depth === 0) {
      rootEnd = tagRe.lastIndex;
      break;
    }
  }
  const body = xml.slice(start, rootEnd === -1 ? undefined : rootEnd);
  const inner = body.slice(body.indexOf(">") + 1);

  // Scan top-level elements within the root frame.
  const children = [];
  const elRe = /<([a-zA-Z][\w-]*)\b([^>]*?)(\/?)>/g;
  let depthC = 0;
  let m2;
  while ((m2 = elRe.exec(inner))) {
    const [, tag, attrs, selfClose] = m2;
    const isClose = false;
    void isClose;
    if (depthC === 0) {
      const a = (n) => (attrs.match(new RegExp(`${n}="([^"]*)"`)) || [])[1];
      children.push({
        id: a("id"),
        type: tag,
        name: a("name") || "",
        x: Number(a("x") || 0),
        y: Number(a("y") || 0),
        width: a("width"),
        height: a("height"),
      });
    }
    if (selfClose !== "/") depthC++;
    // consume until matching close tag of this element
    if (selfClose !== "/") {
      const closeRe = new RegExp(`</${tag}>|<${tag}\\b[^>]*?(?<!/)>`, "g");
      closeRe.lastIndex = elRe.lastIndex;
      let d = 1;
      let c;
      while (d > 0 && (c = closeRe.exec(inner))) {
        if (c[0].startsWith("</")) d--;
        else d++;
        elRe.lastIndex = closeRe.lastIndex;
      }
      depthC--;
    }
  }
  return children;
}

async function main() {
  const a = parseArgs(process.argv);
  if (!a.input) {
    console.error("Required: --input <get_metadata result file>");
    process.exit(1);
  }
  const xml = await loadXml(a.input);
  const kids = directChildren(xml).sort((p, q) => p.y - q.y);
  if (a.json) {
    console.log(JSON.stringify(kids, null, 2));
    return;
  }
  for (const k of kids) {
    console.log(
      `y=${String(k.y).padStart(6)}  ${String(k.id).padStart(12)}  ${k.type.padEnd(16)} ${String(k.width)}x${String(k.height)}  ${k.name}`,
    );
  }
  console.log(`\n${kids.length} direct children.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
