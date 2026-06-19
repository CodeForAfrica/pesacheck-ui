import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/article/ArticleBody";
import { ArticleHero } from "@/components/article/ArticleHero";
import { ArticleSidebar } from "@/components/article/ArticleSidebar";
import { RelatedStories } from "@/components/article/RelatedStories";
import { FactChecksContentDesks } from "@/components/fact-checks/FactChecksContentDesks";
import { FactChecksExplorer } from "@/components/fact-checks/FactChecksExplorer";
import { FactChecksHero } from "@/components/fact-checks/FactChecksHero";
import { ARTICLES, getArticleBySlug } from "@/lib/article-content";
import { CONTENT_DESKS, deskBySlug } from "@/lib/content-desks";

type Params = Promise<{ desk: string }>;

// Prerender all known content desks + all known article slugs.
export function generateStaticParams() {
	const deskParams = CONTENT_DESKS.map((desk) => ({ desk: desk.slug }));
	const articleParams = Object.keys(ARTICLES).map((slug) => ({ desk: slug }));
	return [...deskParams, ...articleParams];
}

export async function generateMetadata({
	params,
}: {
	params: Params;
}): Promise<Metadata> {
	const { desk: slug } = await params;

	const article = getArticleBySlug(slug);
	if (article) {
		return {
			title: `${article.title} — PesaCheck`,
			description: article.leadParagraphs[0],
		};
	}

	const desk = deskBySlug(slug);
	if (desk) {
		return {
			title: `${desk.name} Fact-Checks — PesaCheck`,
			description: `Browse PesaCheck's ${desk.name} fact-checks across Africa. Filter by region, language and topic to find the verifications that matter to you.`,
		};
	}

	return {};
}

export default async function ContentDeskOrArticlePage({
	params,
}: {
	params: Params;
}) {
	const { desk: slug } = await params;

	// Article slug takes precedence over desk slug.
	const article = getArticleBySlug(slug);
	if (article) {
		return (
			<>
				<ArticleHero article={article} />
				<div className="mx-auto w-full max-w-[1440px]">
					<div className="flex gap-5 px-5 pb-16 pt-16 sm:px-8 lg:pl-[100px] lg:pr-[100px]">
						<ArticleSidebar article={article} />
						<ArticleBody article={article} />
					</div>
				</div>
				<RelatedStories stories={article.relatedStories} />
			</>
		);
	}

	// Fall back to content desk listing.
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
