import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/article/ArticleView";
import { PageView } from "@/components/pages/PageView";
import { getFactCheck } from "@/lib/data/article";
import { getPage } from "@/lib/data/pages";

type Params = Promise<{ slug: string[] }>;

/** `/about/principles` → `about/principles`, which is what a route's static
 *  prefix names once its leading slash is stripped. */
function pathOf(segments: string[]): string {
  return segments.join("/");
}

/**
 * What a path names: a Publisher page, else — for a single segment — a
 * fact-check, which lives at `/<slug>` so Ghost-era URLs keep resolving.
 *
 * A page wins a clash because an editor chose its URL; an article's slug is
 * derived from its headline.
 */
async function resolve(segments: string[]) {
  const page = await getPage(pathOf(segments)).catch(() => null);
  if (page) return { kind: "page", page } as const;
  if (segments.length !== 1) return null;
  const article = await getFactCheck(segments[0]);
  return article ? ({ kind: "article", article } as const) : null;
}

export const revalidate = 300;

/**
 * A fact-check, at `/<slug>` — see `resolve`. Or:
 *
 * A page defined entirely in Publisher: a route declares it exists and a
 * `Page — <name>` content list holds its sections. Adding one needs no deploy.
 *
 * This is the lowest-priority match in the app router, so every hand-built
 * route still wins. Only a path with no file behind it reaches here, which is
 * what makes new pages possible without putting existing ones at the mercy of
 * a CMS edit.
 *
 * It matches at any depth, so a page can live at `/about/principles` as
 * readily as `/knowledge` — the URL is whatever the Publisher route's static
 * prefix says, not something this file decides.
 *
 * Live-only: a route with no sections 404s rather than rendering an empty
 * shell, since there is no static fallback for a page nobody has designed.
 */
export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = await resolve(slug);
  if (!found) return {};

  if (found.kind === "article") {
    return {
      title: `${found.article.title} — PesaCheck`,
      description: found.article.leadParagraphs[0],
    };
  }

  const { page } = found;
  return {
    title: `${page.title} — PesaCheck`,
    description: page.description ?? (page.hero.subtitle || undefined),
  };
}

export default async function PublisherPage({ params }: { params: Params }) {
  const { slug } = await params;
  const found = await resolve(slug);
  if (!found) notFound();

  return found.kind === "article" ? (
    <ArticleView article={found.article} />
  ) : (
    <PageView page={found.page} />
  );
}
