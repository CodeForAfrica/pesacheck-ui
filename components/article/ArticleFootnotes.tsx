// Images keep the `width` the body gives them (a 200px logo, ~70px social
// icons): stretching them to the column is what made them dominate the band.
// They're centred in the column, along with the caption that follows each one.
// `multiply` lets the white backgrounds baked into some uploads take on the
// band's grey, without editing the images (colours on white stay as they are).
const FOOTNOTE_CLASS =
  "text-xs font-medium italic leading-[18px] text-neutral-700 [&_a]:underline [&_a]:text-pesacheck-blue [&_img]:mx-auto [&_img]:block [&_img]:mix-blend-multiply [&_img]:h-auto [&_img]:max-w-full [&_img+*]:mt-2 [&_img+*]:text-center";

export function ArticleFootnotes({ footnotes }: { footnotes: string[] }) {
  if (footnotes.length === 0) return null;

  return (
    <section className="bg-neutral-50">
      <div className="mx-auto w-full max-w-[1440px] px-5 py-12 sm:px-8 lg:px-[100px] lg:py-[60px]">
        <div className="lg:pl-[315px]">
          <div className="flex max-w-[610px] flex-col">
            {footnotes.map((html, i) => (
              <div key={html}>
                {i > 0 && <div className="my-1 h-px w-full" />}
                {/* Sanitized in renderArticleBody; static footnotes are plain text. */}
                <div
                  className={FOOTNOTE_CLASS}
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized in renderArticleBody
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
