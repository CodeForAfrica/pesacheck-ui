import { permanentRedirect } from "next/navigation";

type Params = Promise<{ desk: string; slug: string }>;

/**
 * Articles live at `/<slug>`, the URL Ghost served them at. This route is
 * where they lived before that, and redirects so links already shared from it
 * keep working. The desk segment never decided anything: a fact-check sits on
 * a language route, not a desk, so the article is found by slug alone.
 */
export default async function DeskArticleRedirect({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  permanentRedirect(`/${slug}`);
}
