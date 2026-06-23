#!/usr/bin/env node

/**
 * scaffold-section.mjs — generate a section component stub that follows this
 * repo's conventions (Container + SectionHeading, Server Component by default).
 *
 * Usage:
 *   node scaffold-section.mjs --page home --name Spotlight
 *   node scaffold-section.mjs --page about --name Team --client   # 'use client'
 *   node scaffold-section.mjs --page home --name Hero --heading "Spotlight"
 *
 * Flags:
 *   --page <slug>      folder under components/ (required)
 *   --name <Name>      PascalCase component/file name (required)
 *   --client           emit a Client Component ('use client')
 *   --heading <text>   include a SectionHeading with this title
 *   --force            overwrite if the file already exists
 */

import { constants } from "node:fs";
import { access, mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

function parseArgs(argv) {
  const a = {};
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i];
    if (k === "--page") a.page = argv[++i];
    else if (k === "--name") a.name = argv[++i];
    else if (k === "--heading") a.heading = argv[++i];
    else if (k === "--client") a.client = true;
    else if (k === "--force") a.force = true;
  }
  return a;
}

function template({ name, client, heading }) {
  const lines = [];
  if (client) lines.push(`"use client";`, "");
  if (client) lines.push(`import { useState } from "react";`);
  lines.push(
    `import { Container${heading ? ", SectionHeading" : ""} } from "@/components/ui/SectionHeading";`,
  );
  lines.push("");
  lines.push(`export function ${name}() {`);
  if (client) lines.push(`  const [active, setActive] = useState(0);`);
  lines.push(`  return (`);
  lines.push(`    <section className="py-14 lg:py-20">`);
  lines.push(`      <Container>`);
  if (heading) lines.push(`        <SectionHeading title="${heading}" />`);
  lines.push(
    `        {/* TODO: translate the Figma section into responsive JSX + Tailwind tokens */}`,
  );
  lines.push(`      </Container>`);
  lines.push(`    </section>`);
  lines.push(`  );`);
  lines.push(`}`);
  lines.push("");
  return lines.join("\n");
}

async function exists(p) {
  try {
    await access(p, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const a = parseArgs(process.argv);
  if (!a.page || !a.name) {
    console.error("Required: --page <slug> --name <PascalCaseName>");
    process.exit(1);
  }
  if (!/^[A-Z]\w*$/.test(a.name)) {
    console.error(`--name must be PascalCase, got "${a.name}"`);
    process.exit(1);
  }
  const dir = resolve("components", a.page);
  const file = join(dir, `${a.name}.tsx`);
  if ((await exists(file)) && !a.force) {
    console.error(`Refusing to overwrite ${file} (pass --force).`);
    process.exit(1);
  }
  await mkdir(dir, { recursive: true });
  await writeFile(file, template(a));
  console.log(
    `Created components/${a.page}/${a.name}.tsx${a.client ? " (client)" : ""}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
