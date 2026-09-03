<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Content & data layer

This started as a Figma-built UI with all copy hardcoded in `lib/*-content.ts`.
Content is migrating to live Superdesk data, served as GraphQL by Hasura.
Plan: `docs/migration-plan.md`. Progress tracker: `docs/track-a-tasks.md`.
Superdesk side (vocabularies, content profiles, content lists, and how a field
reaches the site): `docs/superdesk-setup.md`.

- **Data-access layer:** `lib/data/` (graphql-request client + queries + mappers).
  Server Components fetch by `await`-ing these functions — there is **no
  client-side query library**. Client components receive data as props from a
  server parent.
- **The seam (follow this when adding content):** pages own fetching and pass
  data down as props; `lib/*-content.ts` stays as the typed fallback. Pattern:
  `const x = (await getX().catch(() => null)) ?? fallback`. Map raw `swp_*`
  shapes to the existing UI types (`Story`, `Article`, `ContentDesk`) in
  `lib/data/map.ts` — keep components on those types, not raw backend shapes.
- **Env required:** copy `.env.example` → `.env.local`. `NEXT_PUBLIC_API_URL`
  and `NEXT_PUBLIC_TENANT_CODE` are required — `lib/data/client.ts` throws at
  module load without them, deliberately, because the alternative is every page
  quietly serving its static fallback, which looks like unfinished migration
  rather than a broken deploy. Every Hasura query MUST filter by `tenant_code`.
- **`NEXT_PUBLIC_*` is baked in at build time.** Next replaces these by textual
  substitution during `next build` — on the server too, not just in the browser
  bundle. So setting one in the hosting dashboard after a deploy changes
  nothing until a **rebuild**, and a value scoped to the wrong environment
  (Preview vs Production) yields a deploy that can never fetch. This is the
  first thing to check when a correctly-configured site still serves
  `lib/*-content.ts` fallbacks. Two consequences for code: reference them
  literally (`process.env.NEXT_PUBLIC_X` — a dynamic `process.env[name]` lookup
  is not inlined), and keep anything that must be changeable without a rebuild
  server-only, like `EDGE_PRESHARED_AUTH`.
- **Caching:** every `gql()` call declares cache tags (`lib/data/cache.ts`) so
  `/api/revalidate` can refresh the pages a Publisher webhook reports; pages also
  carry `revalidate = 300` as a backstop. Tag any query you add, and keep
  `articles` out of anything the root layout reads. Details:
  `docs/revalidation.md`.
- **Reference implementation** for queries/mappers is the sibling repo
  `../pesacheck-pwa-app-router` (production frontend against this same schema).
- The fact-check **verdict** is not a column: it's in `swp_article.metadata`
  (jsonb string) → `subject[]` where `scheme === "Debunk"`. See `lib/data/map.ts`.
