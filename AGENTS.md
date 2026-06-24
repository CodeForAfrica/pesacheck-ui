<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Content & data layer

This started as a Figma-built UI with all copy hardcoded in `lib/*-content.ts`.
Content is migrating to live Superdesk data, served as GraphQL by Hasura.
Plan: `docs/migration-plan.md`. Progress tracker: `docs/track-a-tasks.md`.

- **Data-access layer:** `lib/data/` (graphql-request client + queries + mappers).
  Server Components fetch by `await`-ing these functions — there is **no
  client-side query library**. Client components receive data as props from a
  server parent.
- **The seam (follow this when adding content):** pages own fetching and pass
  data down as props; `lib/*-content.ts` stays as the typed fallback. Pattern:
  `const x = (await getX().catch(() => null)) ?? fallback`. Map raw `swp_*`
  shapes to the existing UI types (`Story`, `Article`, `ContentDesk`) in
  `lib/data/map.ts` — keep components on those types, not raw backend shapes.
- **Env required:** copy `.env.example` → `.env.local`. Without
  `NEXT_PUBLIC_API_URL` / `NEXT_PUBLIC_TENANT_CODE` / `NEXT_PUBLIC_MEDIA_URL`,
  data functions throw and silently fall back to static — which looks like
  "fetching is broken." Every Hasura query MUST filter by `tenant_code`.
- **Reference implementation** for queries/mappers is the sibling repo
  `../pesacheck-pwa-app-router` (production frontend against this same schema).
- The fact-check **verdict** is not a column: it's in `swp_article.metadata`
  (jsonb string) → `subject[]` where `scheme === "Debunk"`. See `lib/data/map.ts`.
