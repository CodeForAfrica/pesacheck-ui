import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FactChecksHero } from "@/components/fact-checks/FactChecksHero";
import { FactChecksExplorer } from "@/components/fact-checks/FactChecksExplorer";
import { FactChecksContentDesks } from "@/components/fact-checks/FactChecksContentDesks";
import { CONTENT_DESKS, deskBySlug } from "@/lib/content-desks";

type Params = Promise<{ desk: string }>;

// Prerender a page for every known content desk; unknown slugs 404 at runtime.
export function generateStaticParams() {
  return CONTENT_DESKS.map((desk) => ({ desk: desk.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { desk: slug } = await params;
  const desk = deskBySlug(slug);
  if (!desk) return {};
  return {
    title: `${desk.name} Fact-Checks — PesaCheck`,
    description: `Browse PesaCheck's ${desk.name} fact-checks across Africa. Filter by region, language and topic to find the verifications that matter to you.`,
  };
}

export default async function ContentDeskPage({ params }: { params: Params }) {
  const { desk: slug } = await params;
  const desk = deskBySlug(slug);
  if (!desk) notFound();

  return (
    <>
      <FactChecksHero topic={desk.name} />
      <FactChecksExplorer />
      <FactChecksContentDesks activeSlug={desk.slug} />
    </>
  );
}
