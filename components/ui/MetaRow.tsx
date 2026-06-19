import { Icon } from "./Icon";

/** Taxonomy row: Topic · Region · Language (text-xs, tiny 2px dot separators). */
export function TaxonomyRow({
	topic = "Topic",
	region = "Region",
	language = "Language",
}: {
	topic?: string;
	region?: string;
	language?: string;
}) {
	return (
		<div className="flex items-center gap-1 text-xs font-medium text-neutral-900">
			<span>{topic}</span>
			<Dot />
			<span>{region}</span>
			<Dot />
			<span>{language}</span>
		</div>
	);
}

/** Date / read-time row: calendar · clock (text-sm, 6px dot separator). */
export function DateRow({
	date = "Jul 28",
	readTime = "3 min",
}: {
	date?: string;
	readTime?: string;
}) {
	return (
		<div className="flex items-center gap-2 text-sm font-medium text-neutral-900">
			<span className="flex items-center gap-[5px]">
				<Icon name="calendar" size={20} />
				{date}
			</span>
			<span className="size-1.5 shrink-0 rounded-full bg-neutral-300" />
			<span className="flex items-center gap-[5px]">
				<Icon name="clock" size={20} />
				{readTime}
			</span>
		</div>
	);
}

function Dot() {
	return <span className="size-[2px] shrink-0 rounded-full bg-neutral-900" />;
}
