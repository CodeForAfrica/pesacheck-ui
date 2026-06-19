import type { Article } from "@/lib/article-content";
import { ShareButtons } from "./ShareButtons";

export function ArticleSidebar({ article }: { article: Article }) {
	return (
		<aside className="hidden lg:flex lg:w-[295px] lg:shrink-0 lg:flex-col lg:gap-4 sticky top-[110px] self-start pt-2">
			<p className="text-sm font-semibold leading-5 text-neutral-900">
				You&apos;re reading
			</p>

			<p className="text-sm font-bold leading-5 text-neutral-900">
				{article.title}
			</p>

			{/* Short accent rule */}
			<div className="h-px w-[85px] rounded-full bg-neutral-400" />

			<ShareButtons
				title={article.title}
				labelColor="text-neutral-800"
				iconClassName="size-5"
			/>
		</aside>
	);
}
