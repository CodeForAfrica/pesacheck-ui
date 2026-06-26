export function ArticleTag({ label }: { label: string }) {
  return (
    <a
      href={`/fact-checks?topic=${encodeURIComponent(label)}`}
      className="rounded-lg bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-200"
    >
      {label}
    </a>
  );
}
