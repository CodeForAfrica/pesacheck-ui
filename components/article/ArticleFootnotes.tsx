export function ArticleFootnotes({ footnotes }: { footnotes: string[] }) {
  if (footnotes.length === 0) return null;

  return (
    <section className="bg-neutral-50">
      <div className="mx-auto w-full max-w-[1440px] px-5 py-12 sm:px-8 lg:px-[100px] lg:py-[60px]">
        <div className="lg:pl-[315px]">
          <div className="flex max-w-[610px] flex-col">
            {footnotes.map((text, i) => (
              <div key={text}>
                {i > 0 && (
                  <div className="my-5 h-px w-full rounded-full bg-neutral-200" />
                )}
                <p className="text-xs font-medium italic leading-[18px] text-neutral-700">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
