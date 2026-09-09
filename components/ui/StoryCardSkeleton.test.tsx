import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  StoryCardSkeleton,
  StoryGridSkeleton,
} from "@/components/ui/StoryCardSkeleton";

describe("StoryGridSkeleton", () => {
  it("renders the requested number of placeholder cards", () => {
    const html = renderToStaticMarkup(<StoryGridSkeleton count={8} />);
    // Each card is one pulsing block; the grid should match the page size so
    // the layout does not jump when results replace it.
    expect(html.match(/animate-pulse/g)).toHaveLength(8);
  });

  it("hides placeholders from assistive tech", () => {
    // They convey nothing — a screen reader should hear the results, not a
    // description of grey rectangles.
    const html = renderToStaticMarkup(<StoryCardSkeleton />);
    expect(html).toContain('aria-hidden="true"');
  });

  it("keeps the card's image ratio so the grid does not reflow", () => {
    const html = renderToStaticMarkup(
      <StoryCardSkeleton imageClassName="aspect-[330/220]" />,
    );
    expect(html).toContain("aspect-[330/220]");
  });

  it("mirrors StoryCard's horizontal layout", () => {
    // The feature card puts text left and image right at 55% width. Stacking
    // the placeholder instead made it far taller than the card, so the pager
    // jumped when results landed. These classes are the mirror — keep them in
    // step with StoryCard.
    const html = renderToStaticMarkup(
      <StoryCardSkeleton horizontal imageClassName="aspect-[330/220]" />,
    );
    expect(html).toContain("flex-col sm:flex-row");
    expect(html).toContain("sm:w-[55%]");
    expect(html).toContain("flex-1");
  });

  it("stacks when not horizontal", () => {
    const html = renderToStaticMarkup(<StoryCardSkeleton />);
    expect(html).not.toContain("sm:flex-row");
    expect(html).toContain("w-full");
  });

  it("adds excerpt lines only when the real card would show them", () => {
    const plain = renderToStaticMarkup(<StoryCardSkeleton />);
    const withExcerpt = renderToStaticMarkup(<StoryCardSkeleton showExcerpt />);
    expect(withExcerpt.length).toBeGreaterThan(plain.length);
  });
});
