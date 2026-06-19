#!/usr/bin/env node
/**
 * extract-assets.mjs — deterministic Figma asset extractor.
 *
 * Reads the reference code returned by the Figma MCP `get_design_context`
 * (which embeds asset URLs like
 *   const imgLongFormat11 = "http://localhost:3845/assets/<hash>.png";
 * ), downloads each unique asset once, names files from the Figma variable
 * names, and prints a JSON manifest.
 *
 * Routing: `.svg` → public/icons/ ; everything else → public/images/<section>/
 *
 * Usage:
 *   node extract-assets.mjs --section hero --input /tmp/figma-ref/hero.txt
 *   cat hero.txt | node extract-assets.mjs --section hero
 *
 * Flags:
 *   --section <slug>   subfolder under public/images (required for rasters)
 *   --input <file>     read from file instead of stdin
 *   --public <dir>     public dir (default: ./public)
 *   --asset-host <url> override asset host (default: http://localhost:3845)
 *   --svg-as-image <names>  comma-separated svg base/var names to route to
 *                           public/images/<section>/ instead of public/icons/
 *                           (for logo/illustration SVGs)
 *   --dry-run          parse + report, do not download
 */

import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

function parseArgs(argv) {
  const a = { public: "public", assetHost: "http://localhost:3845" };
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i];
    if (k === "--section") a.section = argv[++i];
    else if (k === "--input") a.input = argv[++i];
    else if (k === "--public") a.public = argv[++i];
    else if (k === "--asset-host") a.assetHost = argv[++i];
    else if (k === "--svg-as-image")
      a.svgAsImage = (argv[++i] || "")
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
    else if (k === "--dry-run") a.dryRun = true;
  }
  return a;
}

function readStdin() {
  return new Promise((res) => {
    let data = "";
    if (process.stdin.isTTY) return res("");
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (c) => (data += c));
    process.stdin.on("end", () => res(data));
  });
}

// imgLongFormat11 -> long-format-11 ; img -> stripped leading "img"
function kebab(varName) {
  let s = varName.replace(/^img/, "");
  s = s
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2");
  s = s.replace(/([a-zA-Z])(\d)/g, "$1-$2");
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "asset"
  );
}

async function main() {
  const args = parseArgs(process.argv);
  const text = args.input
    ? await readFile(args.input, "utf8")
    : await readStdin();
  if (!text.trim()) {
    console.error(
      "No input. Pass --input <file> or pipe design-context text via stdin.",
    );
    process.exit(1);
  }

  const host = args.assetHost.replace(/\/$/, "");
  const hostRe = new RegExp(
    `${host.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/assets/[^"'\\s)]+`,
    "g",
  );

  // Map url -> first var name that referenced it (for a readable filename).
  const constRe =
    /const\s+(\w+)\s*=\s*["'](https?:\/\/[^"']+\/assets\/[^"']+)["']/g;
  const urlToVar = new Map();
  let m;
  while ((m = constRe.exec(text))) {
    if (!urlToVar.has(m[2])) urlToVar.set(m[2], m[1]);
  }
  // Also catch inline urls not bound to a const.
  for (const url of text.match(hostRe) || []) {
    if (!urlToVar.has(url)) urlToVar.set(url, null);
  }

  const urls = [...urlToVar.keys()];
  if (urls.length === 0) {
    console.error(`No ${host}/assets URLs found in input.`);
    process.exit(1);
  }

  const publicDir = resolve(args.public);
  const iconsDir = join(publicDir, "icons");
  const imagesDir = join(publicDir, "images", args.section || "misc");
  const seenNames = new Set();
  const manifest = {
    section: args.section || null,
    assetHost: host,
    assets: [],
  };

  const svgAsImage = new Set(args.svgAsImage || []);
  for (const url of urls) {
    const ext = (url.split(".").pop() || "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    const isSvg = ext === "svg";
    const varName = urlToVar.get(url);
    const base = varName
      ? kebab(varName)
      : url.split("/").pop().split(".")[0].slice(0, 12);
    // SVGs go to icons/ unless explicitly marked as image (logos/illustrations).
    const forceImage =
      isSvg &&
      (svgAsImage.has(base) ||
        (varName && svgAsImage.has(varName.toLowerCase())));
    const dir = isSvg && !forceImage ? iconsDir : imagesDir;
    let name = `${base}.${ext || "bin"}`;
    let n = 2;
    while (seenNames.has(join(dir, name)))
      name = `${base}-${n++}.${ext || "bin"}`;
    seenNames.add(join(dir, name));

    const dest = join(dir, name);
    const rel = dest.slice(publicDir.length).replace(/^\//, ""); // path used in <Image src=...>
    const entry = { var: urlToVar.get(url), url, file: `/${rel}`, bytes: 0 };

    if (!args.dryRun) {
      await mkdir(dir, { recursive: true });
      try {
        const r = await fetch(url);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const buf = Buffer.from(await r.arrayBuffer());
        await writeFile(dest, buf);
        const s = await stat(dest);
        entry.bytes = s.size;
        if (s.size === 0) entry.error = "0 bytes";
      } catch (e) {
        entry.error = String(e.message || e);
      }
    }
    manifest.assets.push(entry);
  }

  const failed = manifest.assets.filter((a) => a.error);
  manifest.summary = {
    total: manifest.assets.length,
    icons: manifest.assets.filter((a) => a.file.startsWith("/icons/")).length,
    images: manifest.assets.filter((a) => a.file.startsWith("/images/")).length,
    failed: failed.length,
  };
  console.log(JSON.stringify(manifest, null, 2));
  if (failed.length) process.exit(2);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
