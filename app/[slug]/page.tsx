import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageView } from "@/components/pages/PageView";
import { getPage } from "@/lib/data/pages";

type Params = Promise<{ slug: string }>;

export const revalidate = 300;

/**
 * A page defined entirely in Publisher: a route declares it exists and a
 * `Page — <name>` content list holds its sections. Adding one needs no deploy.
 *
 * This is the lowest-priority match in the app router, so every hand-built
 * route — `/knowledge`, `/tools`, `/about/*` — still wins. Only a slug with no
 * file behind it reaches here, which is what makes new pages possible without
 * putting existing ones at the mercy of a CMS edit.
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
  const page = await getPage(slug).catch(() => null);
  if (!page) return {};

  return {
    title: `${page.title} — PesaCheck`,
    description: page.description ?? (page.hero.subtitle || undefined),
  };
}

export default async function PublisherPage({ params }: { params: Params }) {
  const { slug } = await params;
  const page = await getPage(slug).catch(() => null);
  if (!page) notFound();

  return <PageView page={page} />;
}
